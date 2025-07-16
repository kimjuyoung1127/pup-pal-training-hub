import { createClient } from '@supabase/supabase-js';

// Woofpedia 프로젝트의 환경 변수
const supabaseUrl = 'https://dtngxzrtxhhlnjogvxxe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0bmd4enJ0eGhobG5qb2d2eHhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNzQ4NTAsImV4cCI6MjA2Nzk1MDg1MH0.YakjtmYe0JvXmHWbznrCj9zfuG9Br-rKkfBzfUEQTYQ';

// Woofpedia 전용 Supabase 클라이언트 생성
export const woofpediaClient = createClient(supabaseUrl, supabaseAnonKey);
