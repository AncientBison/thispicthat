#!/bin/sh

# Configuration
GARAGE_HOST="http://garage:3903"
TOKEN="Bearer 6024ec17028148b32e650055416550c602055648584820650575306351540660"
BUCKET_NAME="app-images"
KEY_NAME="app-key"
SECRETS_FILE="/secrets/s3.env"

# Helper function
api_request() {
  curl -s -H "Authorization: $TOKEN" "$@"
}

# --- 1. WAIT FOR GARAGE ---
echo "⏳ Init: Waiting for Garage API..."
# Loop until we get a 200 OK from the status endpoint
until [ "$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: $TOKEN" "$GARAGE_HOST/v2/GetClusterStatus")" -eq 200 ]; do
  sleep 1
done
echo "✅ Init: Garage is Online."

# --- 2. CONFIGURE LAYOUT ---
echo "🔍 Init: Checking Layout Status..."
STATUS=$(api_request "$GARAGE_HOST/v2/GetClusterStatus")
LAYOUT_VERSION=$(echo "$STATUS" | jq -r '.layoutVersion')

if [ "$LAYOUT_VERSION" -gt 0 ]; then
  echo "✅ Init: Layout already configured (Version $LAYOUT_VERSION)."
else
  # Retrieve the Node ID of the running node
  NODE_ID=$(echo "$STATUS" | jq -r '.nodes[] | select(.isUp == true) | .id' | head -n 1)
  echo "🔧 Init: Configuring new layout for Node $NODE_ID (Single Node Mode)..."

  # Step A: Stage the layout changes
  # We set the role for this node AND force zoneRedundancy to 1 (critical for single node)
  UPDATE_RESPONSE=$(curl -s -X POST -H "Authorization: $TOKEN" -H "Content-Type: application/json" \
    -d "{
          \"roles\": [{
            \"id\": \"$NODE_ID\", 
            \"zone\": \"us-east-1\", 
            \"capacity\": 1000000000, 
            \"tags\": []
          }],
          \"parameters\": {
            \"zoneRedundancy\": {
              \"atLeast\": 1
            }
          }
        }" \
    "$GARAGE_HOST/v2/UpdateClusterLayout")

  if echo "$UPDATE_RESPONSE" | grep -q "stagedRoleChanges"; then
    echo "   ✅ Staged changes accepted."
  else
    echo "   ❌ Layout Update Failed:"
    echo "$UPDATE_RESPONSE"
    exit 1
  fi

  # Step B: Apply the layout changes
  # We calculate the next version number (Current + 1)
  NEXT_VER=$((LAYOUT_VERSION + 1))
  
  echo "🚀 Init: Applying Layout Version $NEXT_VER..."
  APPLY_RESPONSE=$(curl -s -X POST -H "Authorization: $TOKEN" -H "Content-Type: application/json" \
    -d "{\"version\": $NEXT_VER}" \
    "$GARAGE_HOST/v2/ApplyClusterLayout")
  
  # Wait for the changes to propagate
  echo "⏳ Init: Waiting for layout to apply..."
  sleep 5
fi

# --- 3. CREATE BUCKET ---
echo "📦 Init: Checking Bucket..."
# Check if bucket exists
BUCKET_CHECK=$(api_request "$GARAGE_HOST/v2/GetBucketInfo?globalAlias=$BUCKET_NAME")

if echo "$BUCKET_CHECK" | grep -q "\"id\""; then
   echo "✅ Init: Bucket '$BUCKET_NAME' exists."
else
   echo "📦 Init: Creating bucket '$BUCKET_NAME'..."
   # Create bucket loop (handles momentary "layout not ready" errors)
   while true; do
      CREATE_RES=$(curl -s -X POST -H "Authorization: $TOKEN" -H "Content-Type: application/json" \
         -d "{\"globalAlias\": \"$BUCKET_NAME\"}" \
         "$GARAGE_HOST/v2/CreateBucket")
      
      if echo "$CREATE_RES" | grep -q "\"id\""; then
         break
      else
         echo "   ... waiting for sync (Response: $CREATE_RES)"
         sleep 2
      fi
   done
fi

# --- 4. CREATE/RETRIEVE KEYS ---
echo "🔑 Init: Fetching credentials..."

# List keys to check if our key already exists
LIST_KEYS=$(api_request "$GARAGE_HOST/v2/ListKeys")
KEY_ID=$(echo "$LIST_KEYS" | jq -r ".[] | select(.name == \"$KEY_NAME\") | .id")

if [ -z "$KEY_ID" ]; then
  echo "   Creating new key..."
  KEY_INFO=$(curl -s -X POST -H "Authorization: $TOKEN" -H "Content-Type: application/json" \
    -d "{\"name\": \"$KEY_NAME\"}" \
    "$GARAGE_HOST/v2/CreateKey")
else
  echo "   Key exists, retrieving secrets..."
  # CRITICAL: We must pass &showSecretKey=true to get the secret back
  KEY_INFO=$(api_request "$GARAGE_HOST/v2/GetKeyInfo?id=$KEY_ID&showSecretKey=true")
fi

ACCESS_KEY=$(echo "$KEY_INFO" | jq -r .accessKeyId)
SECRET_KEY=$(echo "$KEY_INFO" | jq -r .secretAccessKey)

# --- 5. PERMISSIONS ---
# We need the Bucket ID to grant permissions
BUCKET_ID=$(api_request "$GARAGE_HOST/v2/GetBucketInfo?globalAlias=$BUCKET_NAME" | jq -r .id)

echo "🔐 Init: Setting permissions..."
curl -s -X POST -H "Authorization: $TOKEN" -H "Content-Type: application/json" \
    -d "{
      \"bucketId\": \"$BUCKET_ID\",
      \"accessKeyId\": \"$ACCESS_KEY\",
      \"permissions\": {
        \"read\": true,
        \"write\": true,
        \"owner\": true
      }
    }" \
    "$GARAGE_HOST/v2/AllowBucketKey" > /dev/null

echo "🔓 Init: Permissions granted."

# --- 6. EXPORT ENV FILE ---
echo "💾 Init: Writing secrets to $SECRETS_FILE"
cat <<EOF > $SECRETS_FILE
S3_ACCESS_KEY_ID=$ACCESS_KEY
S3_SECRET_ACCESS_KEY=$SECRET_KEY
S3_BUCKET=$BUCKET_NAME
S3_ENDPOINT=http://garage:3900
S3_REGION=garage
S3_FORCE_PATH_STYLE=true
EOF

echo "🚀 Init: DONE."