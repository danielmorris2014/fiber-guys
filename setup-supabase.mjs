import { createClient } from '@supabase/supabase-js';
import postgres from 'postgres';

const SUPABASE_URL = 'https://ncgfzmpxcijatmyfergd.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jZ2Z6bXB4Y2lqYXRteWZlcmdkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ5NzE1MCwiZXhwIjoyMDg3MDczMTUwfQ.7W0dhhTscZBdaikYNKihEVLMKmaEKNBCWhSDSpyvvgc';
const REF = 'ncgfzmpxcijatmyfergd';

// Accept DB password as command line argument
const DB_PASSWORD = process.argv[2];

if (!DB_PASSWORD) {
  console.log('Usage: node setup-supabase.mjs <database-password>');
  console.log('');
  console.log('You can find your database password in the Supabase Dashboard:');
  console.log('  Project Settings > Database > Connection string');
  console.log('');
  console.log('Or if you prefer, run this SQL manually in the Dashboard SQL Editor:');
  console.log('  https://supabase.com/dashboard/project/' + REF + '/sql/new');
  console.log('');
  console.log('--- SQL TO RUN ---');
  console.log(`
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  service_needed text NOT NULL,
  estimated_footage text DEFAULT ''::text,
  target_date text DEFAULT ''::text,
  notes text DEFAULT ''::text,
  file_urls jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No public access" ON public.leads FOR ALL USING (false);
  `);
  console.log('--- END SQL ---');
  console.log('');
  console.log('The lead-files storage bucket has already been created successfully.');
  process.exit(1);
}

async function main() {
  // Connect to database
  console.log('Connecting to database...');
  const sql = postgres(`postgresql://postgres:${DB_PASSWORD}@db.${REF}.supabase.co:5432/postgres`, {
    connect_timeout: 10,
    idle_timeout: 5,
    max: 1,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await sql`SELECT 1 as test`;
    console.log('Connected!\n');
  } catch (e) {
    console.error('Connection failed:', e.message);
    console.log('\nMake sure the database password is correct.');
    console.log('Find it at: Project Settings > Database > Connection string');
    process.exit(1);
  }

  // Step 1: Create leads table
  console.log('=== Step 1: Creating leads table ===');
  await sql.unsafe(`
    CREATE TABLE IF NOT EXISTS public.leads (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      company_name text NOT NULL,
      contact_name text NOT NULL,
      email text NOT NULL,
      phone text NOT NULL,
      service_needed text NOT NULL,
      estimated_footage text DEFAULT ''::text,
      target_date text DEFAULT ''::text,
      notes text DEFAULT ''::text,
      file_urls jsonb DEFAULT '[]'::jsonb,
      created_at timestamptz DEFAULT now()
    );
  `);
  console.log('Table created successfully!');

  // Step 2: Enable RLS
  console.log('\n=== Step 2: Enabling Row Level Security ===');
  await sql.unsafe(`ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;`);
  console.log('RLS enabled!');

  // Step 3: Create RLS policy (deny public access, service_role bypasses RLS)
  console.log('\n=== Step 3: Creating RLS policy ===');
  await sql.unsafe(`
    DO $$ BEGIN
      CREATE POLICY "No public access" ON public.leads FOR ALL USING (false);
    EXCEPTION WHEN duplicate_object THEN
      RAISE NOTICE 'Policy already exists';
    END $$;
  `);
  console.log('RLS policy set (no public access, service_role bypasses)!');

  // Step 4: Grant permissions
  console.log('\n=== Step 4: Granting permissions ===');
  await sql.unsafe(`GRANT ALL ON public.leads TO service_role;`);
  console.log('Permissions granted!');

  // Step 5: Verify
  console.log('\n=== Step 5: Verifying table structure ===');
  const cols = await sql`
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_name = 'leads' AND table_schema = 'public'
    ORDER BY ordinal_position;
  `;
  console.log('leads table columns:');
  cols.forEach(c => {
    const nullable = c.is_nullable === 'NO' ? 'NOT NULL' : 'nullable';
    const def = c.column_default ? `DEFAULT ${c.column_default}` : '';
    console.log(`  ${c.column_name.padEnd(20)} ${c.data_type.padEnd(30)} ${nullable.padEnd(10)} ${def}`);
  });

  // Step 6: Verify storage bucket
  console.log('\n=== Step 6: Verifying storage bucket ===');
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
  const { data: buckets } = await supabase.storage.listBuckets();
  const leadBucket = buckets?.find(b => b.name === 'lead-files');
  if (leadBucket) {
    console.log(`Bucket "lead-files" exists (public: ${leadBucket.public})`);
  } else {
    console.log('Creating lead-files bucket...');
    const { data, error } = await supabase.storage.createBucket('lead-files', {
      public: true,
      fileSizeLimit: 52428800,
    });
    if (error) console.error('Bucket error:', error);
    else console.log('Bucket created:', data);
  }

  // Test insert + delete
  console.log('\n=== Step 7: Testing insert/delete ===');
  const testResult = await sql`
    INSERT INTO public.leads (company_name, contact_name, email, phone, service_needed)
    VALUES ('Test Corp', 'Test User', 'test@test.com', '555-0000', 'Jetting')
    RETURNING id;
  `;
  console.log('Test insert OK, id:', testResult[0].id);
  await sql`DELETE FROM public.leads WHERE id = ${testResult[0].id}`;
  console.log('Test row cleaned up.');

  await sql.end();
  console.log('\n=== ALL DONE ===');
  console.log('leads table: READY');
  console.log('lead-files bucket: READY');
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
