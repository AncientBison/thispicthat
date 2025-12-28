#!/bin/bash

echo "📦 Loading images from files..."

docker load -i image-garage.tar
echo "   -> image-garage.tar loaded"

docker load -i image-init.tar
echo "   -> image-init.tar loaded"

docker load -i image-app.tar
echo "   -> image-app.tar loaded"

docker load -i image-migration.tar
echo "   -> image-migration.tar loaded"

echo "✅ Images imported successfully!"