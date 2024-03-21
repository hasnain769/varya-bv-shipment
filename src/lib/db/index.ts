import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

// Enable connection caching
//neonConfig.fetchConnectionCache = true;

// Check if DRIZZLE_DATABASE_URL environment variable is set
const databaseUrl = process.env.NEXT_PUBLIC_DATABASE_URL ;
console.log(databaseUrl)
if (!databaseUrl) {
  throw new Error('Database connection string is missing. Please set DRIZZLE_DATABASE_URL environment variable.');
}

// Establish database connection
const sql = neon(databaseUrl);

// Create database instance using drizzle
export const db = drizzle(sql);
