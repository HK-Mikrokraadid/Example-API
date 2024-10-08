#!/bin/bash

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | xargs)
else
    echo ".env file not found"
    exit 1
fi

# Set your GitHub Container Registry details
IMAGE_NAME="ghcr.io/${GITHUB_USERNAME}/${REPO_NAME}/prod"

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# Authenticate with GitHub Container Registry
echo $GITHUB_PAT | docker login ghcr.io -u $GITHUB_USERNAME --password-stdin

if [ $? -ne 0 ]; then
    log_message "Failed to authenticate with GitHub Container Registry"
    exit 1
fi

# Pull the latest image
log_message "Pulling latest image..."
docker pull $IMAGE_NAME:latest

if [ $? -ne 0 ]; then
    log_message "Failed to pull latest image"
    exit 1
fi

# Check if there's a new image
CURRENT_IMAGE_ID=$(docker inspect --format='{{.Id}}' $IMAGE_NAME:latest 2>/dev/null)
RUNNING_IMAGE_ID=$(docker inspect --format='{{.Image}}' example-api-api 2>/dev/null)

if [ "$CURRENT_IMAGE_ID" != "$RUNNING_IMAGE_ID" ]; then
    log_message "New image detected. Updating container..."

    # Stop the current containers
    docker compose down

    # Start new containers with the updated image
    docker compose up -d

    if [ $? -eq 0 ]; then
        log_message "Containers updated successfully"
    else
        log_message "Failed to start new containers"
        exit 1
    fi
else
    log_message "No new image available. Current containers are up-to-date."
fi

# Clean up old images
docker image prune -f

log_message "Deployment script completed"