import { readFileSync } from 'fs';
import { join } from 'path';
import postgres from 'postgres';

async function runMigration() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  try {
    // Create a connection to the database
    const sql = postgres(databaseUrl, {
      max: 1,
      timeout: 10,
    });

    // Read the migration file
    const migrationPath = join(process.cwd(), 'scripts', 'init-db.sql');
    const migrationSql = readFileSync(migrationPath, 'utf-8');

    console.log('Running migration...');
    
    // Split by semicolon and execute each statement
    const statements = migrationSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const statement of statements) {
      console.log(`Executing: ${statement.substring(0, 80)}...`);
      await sql.unsafe(statement);
    }

    await sql.end();
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();
