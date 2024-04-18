import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { config } from 'dotenv';

config();


const databaseUrl = process.env.NEXT_PUBLIC_DATABASE_URL ;

if (!databaseUrl) {
  throw new Error('Database connection string is missing. Please set DRIZZLE_DATABASE_URL environment variable.');
}


const sql = neon(databaseUrl);

// Create database instance using drizzle
export const db = drizzle(sql);
