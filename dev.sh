#!/bin/bash

export MSYS_NO_PATHCONV=1

COMPOSE_FILE="docker-compose.dev.yml"
TARGET_BUCKET="app-images"

# 1. Cleanup & Start
docker compose -f $COMPOSE_FILE down -v --remove-orphans > /dev/null 2>&1
docker compose -f $COMPOSE_FILE up -d > /dev/null 2>&1

# 2. Wait for Postgres
until docker compose -f $COMPOSE_FILE exec -T postgres pg_isready -U user > /dev/null 2>&1; do
  sleep 1
done

# 3. Wait for Garage
until curl -s http://localhost:3900 > /dev/null || curl -s http://localhost:3900 2>&1 | grep -q "403"; do
  sleep 1
done

# 4. Configure Layout
NODE_ID=$(docker compose -f $COMPOSE_FILE exec -T garage /garage node id | tr -d '\r' | cut -d '@' -f 1)

if [ -z "$NODE_ID" ]; then
  echo "❌ Error: Could not extract Node ID. Dumping status:"
  docker compose -f $COMPOSE_FILE exec -T garage /garage status
  exit 1
fi

docker compose -f $COMPOSE_FILE exec -T garage /garage layout assign -z us-east-1 -c 1G "$NODE_ID" > /dev/null
docker compose -f $COMPOSE_FILE exec -T garage /garage layout apply --version 1 > /dev/null

# 5. Create Keys & Bucket
KEY_INFO=$(docker compose -f $COMPOSE_FILE exec -T garage /garage key create dev-key)
ACCESS_KEY=$(echo "$KEY_INFO" | grep "Key ID" | awk '{print $3}' | tr -d '\r')
SECRET_KEY=$(echo "$KEY_INFO" | grep "Secret key" | awk '{print $3}' | tr -d '\r')

docker compose -f $COMPOSE_FILE exec -T garage /garage bucket create "$TARGET_BUCKET" > /dev/null
docker compose -f $COMPOSE_FILE exec -T garage /garage bucket allow "$TARGET_BUCKET" --read --write --key dev-key > /dev/null

# 6. Export Variables
export S3_ENDPOINT="http://127.0.0.1:3900"
export S3_REGION="garage"
export S3_BUCKET="$TARGET_BUCKET"
export S3_ACCESS_KEY_ID="$ACCESS_KEY"
export S3_SECRET_ACCESS_KEY="$SECRET_KEY"
export S3_FORCE_PATH_STYLE="true"

# 7. Run Scripts
echo "🛠️  Running npm setup..."

npm run setup && echo "🚀 Setup success! Starting dev..." && npm run dev || echo "❌ Setup failed."