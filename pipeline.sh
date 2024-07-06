#!/bin/bash

# Build and start the test environment
docker-compose -f docker-compose.test.yml up -d --build

# Run tests
docker-compose -f docker-compose.test.yml run api_test

# If tests pass, build and deploy production
if [ $? -eq 0 ]; then
    echo "Tests passed. Building production..."
    docker-compose -f docker-compose.test.yml down --remove-orphans
    docker-compose build
    docker-compose up -d
else
    echo "Tests failed. Deployment aborted."
    exit 1
fi
