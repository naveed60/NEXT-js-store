import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';

async function setup() {
  try {
    console.log('Step 1: Generating Prisma Client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    console.log('\nStep 2: Running database push...');
    execSync('npx prisma db push --skip-generate', { stdio: 'inherit' });
    
    console.log('\nStep 3: Seeding database with sample data...');
    const prisma = new PrismaClient();
    
    // Create sample products
    const products = await Promise.all([
      prisma.product.create({
        data: {
          name: 'Laptop',
          description: 'High-performance laptop',
          price: 999.99,
          image: '/images/laptop.jpg',
        },
      }),
      prisma.product.create({
        data: {
          name: 'Mouse',
          description: 'Wireless mouse',
          price: 29.99,
          image: '/images/mouse.jpg',
        },
      }),
      prisma.product.create({
        data: {
          name: 'Keyboard',
          description: 'Mechanical keyboard',
          price: 149.99,
          image: '/images/keyboard.jpg',
        },
      }),
    ]);
    
    console.log(`Created ${products.length} sample products`);
    
    await prisma.$disconnect();
    console.log('\nDatabase setup completed successfully!');
  } catch (error) {
    console.error('Setup failed:', error.message);
    process.exit(1);
  }
}

setup();
