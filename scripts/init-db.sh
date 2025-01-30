#!/bin/bash

# Create database if it doesn't exist
createdb budaful_door_designs_dev || true

# Run migrations
npx sequelize-cli db:migrate

# Run seeders
npx sequelize-cli db:seed:all
