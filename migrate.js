const { neon } = require('@neondatabase/serverless');
const sql = neon('postgresql://neondb_owner:npg_D6iBLZmYUIw7@ep-proud-night-av4nrvj4.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require');

async function migrate() {
  try {
    console.log('Creating about_section type...');
    await sql`
      DO $$ BEGIN
        CREATE TYPE about_section AS ENUM ('director', 'principal');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    console.log('Creating settings table...');
    await sql`
      CREATE TABLE IF NOT EXISTS settings (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        key varchar(100) NOT NULL UNIQUE,
        value text,
        description text,
        created_at timestamp NOT NULL DEFAULT now(),
        updated_at timestamp NOT NULL DEFAULT now()
      )
    `;

    console.log('Creating about_content table...');
    await sql`
      CREATE TABLE IF NOT EXISTS about_content (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        section about_section NOT NULL UNIQUE,
        name varchar(255) NOT NULL,
        designation varchar(255) NOT NULL,
        photo_url text,
        photo_public_id text,
        message text NOT NULL,
        qualifications text,
        created_at timestamp NOT NULL DEFAULT now(),
        updated_at timestamp NOT NULL DEFAULT now()
      )
    `;

    console.log('Tables created successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrate();
