import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://aqfforpyaqdjzcgjxcir.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZmZvcnB5YXFkanpjZ2p4Y2lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4ODgyMjYsZXhwIjoyMDY1NDY0MjI2fQ.JMqxdpbKEO4h9pghUimd20A3REpwxiSThPZ0GjhcmFk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
