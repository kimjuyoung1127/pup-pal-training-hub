import { createClient } from '@supabase/supabase-js';

// Provided credentials
const supabaseUrl = 'https://aqfforpyaqdjzcgjxcir.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZmZvcnB5YXFkanpjZ2p4Y2lyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTg4ODIyNiwiZXhwIjoyMDY1NDY0MjI2fQ.QEPO6r9dXAklhKgKeuNGw3Kg0vK1VDm0y7CEKbfRJrw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fetchTableSchema(tableName: string) {
  // Use a direct SQL query via rpc. This is a common way to run raw SQL.
  const { data, error } = await supabase.rpc('query', {
    sql: `
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = '${tableName}';
    `
  });

  if (error) {
    console.error(`Error fetching schema for table "${tableName}":`, error.message);
    return null;
  }
  return data;
}

async function main() {
  console.log('--- Fetching schema for "breeds" table ---');
  const breedsSchema = await fetchTableSchema('breeds');
  if (breedsSchema) {
    console.log(JSON.stringify(breedsSchema, null, 2));
  } else {
    console.log('Could not retrieve schema for "breeds".');
  }

  console.log('\n--- Fetching schema for "breed_details" table ---');
  const breedDetailsSchema = await fetchTableSchema('breed_details');
  if (breedDetailsSchema) {
    console.log(JSON.stringify(breedDetailsSchema, null, 2));
  } else {
    console.log('Could not retrieve schema for "breed_details".');
  }
}

main();
