#!/bin/bash

# Run Prisma migrations
echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Migration complete!"
