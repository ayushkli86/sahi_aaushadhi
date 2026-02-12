const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://bshvpxzkezzxgfewbzax.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzaHZweHprZXp6eGdmZXdiemF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MTQyNTksImV4cCI6MjA4NjM5MDI1OX0.g7Pu4-fQyNC9AWawzyr9Fs7KHPUmWgP60QWKLfBkypE';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function testConnection() {
  console.log('Testing Supabase connection...\n');
  
  // List all tables
  const { data, error } = await supabase
    .from('medicine')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Success! Found medicine table');
    console.log('Sample data:', data);
    console.log('Record count:', data.length);
  }
}

testConnection();
