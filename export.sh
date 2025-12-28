#!/bin/bash

echo "🏗️  Building custom images..."
docker build -t local/project-app:latest -f Dockerfile .
docker build -t local/project-garage:latest -f Dockerfile.garage .
docker build -t local/project-init:latest -f Dockerfile.init .
docker build -t local/project-migration:latest -f Dockerfile.migration .

echo "💾 Saving images to files..."

docker save -o image-garage.tar local/project-garage:latest
echo "   -> image-garage.tar created"

docker save -o image-init.tar local/project-init:latest
echo "   -> image-init.tar created"

docker save -o image-app.tar local/project-app:latest
echo "   -> image-app.tar created"

docker save -o image-migration.tar local/project-migration:latest
echo "   -> image-migration.tar created"

echo "✅ Ready to move!"