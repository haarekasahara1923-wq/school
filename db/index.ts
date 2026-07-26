import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Prevent Next.js from aggressively caching database queries
neonConfig.fetchConnectionCache = true;
neonConfig.fetchOptions = { cache: 'no-store' };

const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || 'postgresql://placeholder:placeholder@localhost:5432/placeholder';
const sql = neon(connectionString);

export const db = drizzle(sql, { schema });
