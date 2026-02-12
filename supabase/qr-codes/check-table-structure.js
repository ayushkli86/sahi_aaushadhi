const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://bshvpxzkezzxgfewbzax.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzaHZweHprZXp6eGdmZXdiemF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MTQyNTksImV4cCI6MjA4NjM5MDI1OX0.g7Pu4-fQyNC9AWawzyr9Fs7KHPUmWgP60QWKLfBkypE';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkStructure() {
  console.log('Checking table structure by trying minimal insert...\n');
  
  // Try with just product_id and name
  const test1 = {
    product_id: 'TEST-001',
    name: 'Test Medicine'
  };

  const { data, error } = await supabase
    .from('medicine')
    .insert([test1])
    .select();

  if (error) {
    console.log('Error with minimal fields:', error.message);
    console.log('Hint:', error.hint);
    console.log('Details:', error.details);
  } else {
    console.log('✅ Success! Table structure accepts:');
    console.log(JSON.stringify(data, null, 2));
    
    // Clean up
    await supabase.from('medicine').delete().eq('product_id', 'TEST-001');
  }
}

checkStructure();
