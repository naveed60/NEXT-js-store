import { spawn } from 'child_process';

console.log('[Migration] Starting Prisma migration...');

const migration = spawn('npx', ['prisma', 'migrate', 'deploy'], {
  cwd: process.cwd(),
  stdio: 'inherit',
});

migration.on('close', (code) => {
  if (code === 0) {
    console.log('[Migration] ✓ Migration completed successfully');
    process.exit(0);
  } else {
    console.error('[Migration] ✗ Migration failed with code', code);
    process.exit(1);
  }
});
