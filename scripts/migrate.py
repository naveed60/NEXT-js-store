#!/usr/bin/env python3
import subprocess
import sys
import os

# Change to project directory
os.chdir('/vercel/share/v0-project')

# Run Prisma migration
print("Running Prisma database migration...")
result = subprocess.run(['npx', 'prisma', 'migrate', 'deploy'], capture_output=True, text=True)

print(result.stdout)
if result.stderr:
    print("STDERR:", result.stderr)

if result.returncode != 0:
    print(f"Migration failed with exit code {result.returncode}")
    sys.exit(result.returncode)
else:
    print("Migration completed successfully!")
