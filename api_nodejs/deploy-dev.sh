#!/bin/bash

#fool's man CI/CD
pwd

echo "LOCAL: Build and save image"
docker build . -f docker/dev/Dockerfile --build-arg enviro=development -t api_command_center
docker save -o image.tar api_command_center

echo "DOCKER LOCAL: Stop and remove container api_command_center & image api_command_center"
docker container stop api_command_center

# Use an unprivileged user.
#USER appuser:appuser
docker container rm api_command_center
docker image rm api_command_center

echo "DOCKER LOCAL: Run api_command_center image as api_command_center"
docker load -i image.tar
docker run -d -p 4000:4000 --name api_command_center -e enviro_file=dev.config.cjs api_command_center
rm image.tar

echo "ok"
