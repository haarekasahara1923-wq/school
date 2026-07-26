import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

// Load .env manually if process.env.DATABASE_URL is missing
if (!process.env.DATABASE_URL) {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const envConfig = fs.readFileSync(envPath, 'utf8');
      for (const line of envConfig.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...valueParts] = trimmed.split('=');
          const value = valueParts.join('=').trim();
          if (key.trim() && !process.env[key.trim()]) {
            process.env[key.trim()] = value;
          }
        }
      }
    }
  } catch (e) {}
}

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_D6iBLZmYUIw7@ep-proud-night-av4nrvj4-pooler.c-11.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require';
const sql = neon(connectionString);
const db = drizzle(sql, { schema });

async function seed() {
  console.log('Seeding initial data...');

  // Super Admin
  const passwordHash = await bcrypt.hash('Admin@123', 10);
  await db.insert(schema.users).values({
    name: 'Super Admin',
    email: 'admin@progressivesmartkids.in',
    username: 'admin',
    passwordHash,
    role: 'admin',
  }).onConflictDoUpdate({
    target: schema.users.username,
    set: { email: 'admin@progressivesmartkids.in', passwordHash, role: 'admin', isActive: true },
  });

  // Accountant
  const accHash = await bcrypt.hash('Accountant@123', 10);
  await db.insert(schema.users).values({
    name: 'School Accountant',
    email: 'accountant@progressivesmartkids.in',
    username: 'accountant',
    passwordHash: accHash,
    role: 'accountant',
  }).onConflictDoNothing();

  // Operations
  const opsHash = await bcrypt.hash('Operations@123', 10);
  await db.insert(schema.users).values({
    name: 'Operations Manager',
    email: 'operations@progressivesmartkids.in',
    username: 'operations',
    passwordHash: opsHash,
    role: 'operations',
  }).onConflictDoNothing();

  // About Content
  await db.insert(schema.aboutContent).values([
    {
      section: 'director',
      name: 'Director',
      designation: 'Director',
      message: 'Welcome to Progressive Smart Kids School. Our endeavor is to empower students with values and knowledge to succeed in life from Class 1st to 12th.',
      qualifications: 'Educational Leadership',
    },
    {
      section: 'principal',
      name: 'Principal',
      designation: 'Principal',
      message: 'At Progressive Smart Kids School, every child is unique. We nurture their talent and foster holistic growth in Prani Chhavani, Gwalior.',
      qualifications: 'M.Sc., M.Ed.',
    },
  ]).onConflictDoNothing();

  console.log('Seeding complete! Default credentials: admin / Admin@123');
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
