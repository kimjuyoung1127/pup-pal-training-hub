
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// .env.local 파일의 경로를 설정합니다.
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// --- CONFIGURATION ---
const SOURCE_URL = 'https://dtngxzrtxhhlnjogvxxe.supabase.co';
const SOURCE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0bmd4enJ0eGhobG5qb2d2eHhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNzQ4NTAsImV4cCI6MjA2Nzk1MDg1MH0.YakjtmYe0JvXmHWbznrCj9zfuG9Br-rKkfBzfUEQTYQ';

const DESTINATION_URL = process.env.VITE_SUPABASE_URL;
const DESTINATION_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZmZvcnB5YXFkanpjZ2p4Y2lyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTg4ODIyNiwiZXhwIjoyMDY1NDY0MjI2fQ.QEPO6r9dXAklhKgKeuNGw3Kg0vK1VDm0y7CEKbfRJrw';

if (!DESTINATION_URL || !DESTINATION_SERVICE_KEY) {
  console.error('Destination Supabase URL or Service Key is missing. Check your .env.local file.');
  process.exit(1);
}

// --- CLIENTS ---
const sourceClient = createClient(SOURCE_URL, SOURCE_ANON_KEY);
const destinationClient = createClient(DESTINATION_URL, DESTINATION_SERVICE_KEY);

// --- DATA MIGRATION ---
async function migrateTable(tableName, fromClient, toClient, primaryKey) {
  console.log(`Fetching data from ${tableName}...`);
  const { data, error } = await fromClient.from(tableName).select('*');

  if (error) {
    console.error(`Error fetching from ${tableName}:`, error);
    return;
  }

  if (!data || data.length === 0) {
    console.log(`No data found in ${tableName}. Skipping.`);
    return;
  }

  console.log(`Fetched ${data.length} rows. Inserting into destination...`);

  const { error: insertError } = await toClient.from(tableName).upsert(data, {
    onConflict: primaryKey,
  });

  if (insertError) {
    console.error(`Error inserting into ${tableName}:`, insertError);
  } else {
    console.log(`Successfully migrated ${tableName}.`);
  }
}

async function main() {
  console.log('Starting data migration for breed_details only...');

  // breed_details 테이블만 다시 이전하여 누락된 컬럼 데이터를 채웁니다.
  await migrateTable('breed_details', sourceClient, destinationClient, 'breed_id');

  console.log('Data migration finished.');
}

main().catch(console.error);
