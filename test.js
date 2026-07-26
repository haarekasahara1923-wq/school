const { neon } = require('@neondatabase/serverless');
const sql = neon('postgresql://neondb_owner:npg_D6iBLZmYUIw7@ep-proud-night-av4nrvj4.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require');

async function test() {
  try {
    const users = await sql`SELECT username, role FROM users`;
    console.log('Users:', users);
    
    const settings = await sql`SELECT * FROM settings`;
    console.log('Settings count:', settings.length);
    console.log('Settings:', settings);
    
    const about = await sql`SELECT section, name FROM about_content`;
    console.log('About count:', about.length);
  } catch (err) {
    console.error(err);
  }
}
test();
