import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setup() {
  try {
    console.log('Creating tables...');

    // Create User table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "User" (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Product table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Product" (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        image VARCHAR(255),
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create CartItem table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "CartItem" (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES "User"(id),
        "productId" INTEGER REFERENCES "Product"(id),
        quantity INTEGER NOT NULL DEFAULT 1,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Order table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Order" (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES "User"(id),
        total DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create OrderItem table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "OrderItem" (
        id SERIAL PRIMARY KEY,
        "orderId" INTEGER REFERENCES "Order"(id),
        "productId" INTEGER REFERENCES "Product"(id),
        quantity INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL
      )
    `);

    console.log('✓ Database tables created successfully!');
    
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setup();
