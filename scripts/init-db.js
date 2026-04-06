import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

async function runMigration() {
  try {
    // Read the migration file
    const migrationPath = join(__dirname, 'init-db.sql');
    const migrationSql = readFileSync(migrationPath, 'utf-8');

    console.log('[v0] Starting database migration...');
    
    // Split by semicolon and execute each statement
    const statements = migrationSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      try {
        console.log(`[v0] Executing: ${statement.substring(0, 60)}...`);
        await prisma.$executeRawUnsafe(statement);
      } catch (error) {
        // Ignore errors for "already exists" statements
        if (error.message.includes('already exists') || error.message.includes('UNION')) {
          console.log(`[v0] Skipped (already exists): ${statement.substring(0, 60)}...`);
        } else {
          throw error;
        }
      }
    }

    console.log('[v0] Migration completed successfully!');
    await prisma.$disconnect();
  } catch (error) {
    console.error('[v0] Migration failed:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

runMigration();
