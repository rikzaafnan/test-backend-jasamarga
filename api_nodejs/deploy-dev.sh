#!/bin/bash

#fool's man CI/CD
pwd

echo "LOCAL: Build and save image"
docker build . -f docker/dev/Dockerfile -t image_api_nodejs
docker save -o image.tar image_api_nodejs

echo "DOCKER LOCAL: Stop and remove container api_nodejs & image image_api_nodejs"
docker container stop api_nodejs

# Use an unprivileged user.
docker container rm api_nodejs
docker image rm image_api_nodejs

echo "DOCKER LOCAL: Run api_nodejs image as image_api_nodejs"
docker load -i image.tar
docker run -d -p 4000:4000 --name api_nodejs -e enviro_file=dev.config.cjs image_api_nodejs
rm image.tar

echo "ok"
