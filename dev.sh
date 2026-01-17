#!/bin/bash

export MSYS_NO_PATHCONV=1

# Parse arguments
VERBOSE=false
if [[ "$1" == "-v" || "$1" == "--verbose" ]]; then
  VERBOSE=true
fi

COMPOSE_FILE="docker-compose.dev.yml"
TARGET_BUCKET="app-images"

redirect_output() {
  if [ "$VERBOSE" = true ]; then
    cat
  else
    cat > /dev/null 2>&1
  fi
}

[ "$VERBOSE" = true ] && echo "🧹 Cleaning up previous containers..."
docker compose -f $COMPOSE_FILE down -v --remove-orphans 2>&1 | redirect_output

echo "🚀 Starting development environment..."

docker compose -f $COMPOSE_FILE up -d 2>&1 | redirect_output

[ "$VERBOSE" = true ] && echo "⏳ Waiting for Postgres..."
until docker compose -f $COMPOSE_FILE exec -T postgres pg_isready -U user 2>&1 | redirect_output; do
  sleep 1
done

[ "$VERBOSE" = true ] && echo "⏳ Waiting for Garage..."
until curl -s http://localhost:3900 > /dev/null || curl -s http://localhost:3900 2>&1 | grep -q "403"; do
  sleep 1
done

[ "$VERBOSE" = true ] && echo "🔧 Configuring Garage layout..."
NODE_ID=$(docker compose -f $COMPOSE_FILE exec -T garage /garage node id | tr -d '\r' | cut -d '@' -f 1)

if [ -z "$NODE_ID" ]; then
  echo "❌ Error: Could not extract Node ID. Dumping status:"
  docker compose -f $COMPOSE_FILE exec -T garage /garage status
  exit 1
fi

[ "$VERBOSE" = true ] && echo "📍 Node ID: $NODE_ID"

docker compose -f $COMPOSE_FILE exec -T garage /garage layout assign -z us-east-1 -c 1G "$NODE_ID" 2>&1 | redirect_output
docker compose -f $COMPOSE_FILE exec -T garage /garage layout apply --version 1 2>&1 | redirect_output

[ "$VERBOSE" = true ] && echo "🔑 Creating access keys and bucket..."
KEY_INFO=$(docker compose -f $COMPOSE_FILE exec -T garage /garage key create dev-key)
ACCESS_KEY=$(echo "$KEY_INFO" | grep "Key ID" | awk '{print $3}' | tr -d '\r')
SECRET_KEY=$(echo "$KEY_INFO" | grep "Secret key" | awk '{print $3}' | tr -d '\r')

[ "$VERBOSE" = true ] && echo "📦 Creating bucket: $TARGET_BUCKET"

docker compose -f $COMPOSE_FILE exec -T garage /garage bucket create "$TARGET_BUCKET" 2>&1 | redirect_output
docker compose -f $COMPOSE_FILE exec -T garage /garage bucket allow "$TARGET_BUCKET" --read --write --key dev-key 2>&1 | redirect_output

[ "$VERBOSE" = true ] && echo "🌍 Setting environment variables..."
export S3_ENDPOINT="http://127.0.0.1:3900"
export S3_REGION="garage"
export S3_BUCKET="$TARGET_BUCKET"
export S3_ACCESS_KEY_ID="$ACCESS_KEY"
export S3_SECRET_ACCESS_KEY="$SECRET_KEY"
export S3_FORCE_PATH_STYLE="true"

echo "🛠️  Running npm setup..."

npm run setup && echo "🚀 Setup success! Starting dev..." && npm run dev || echo "❌ Setup failed."