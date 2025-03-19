#!/bin/bash

# Wait for MongoDB to be ready
echo "Waiting for MongoDB to be ready..."
sleep 5

# Run database seed
echo "Running database seed..."
npm run seed

# Start the application
echo "Starting the application..."
npm start