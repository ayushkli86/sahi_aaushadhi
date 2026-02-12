const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://bshvpxzkezzxgfewbzax.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzaHZweHprZXp6eGdmZXdiemF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MTQyNTksImV4cCI6MjA4NjM5MDI1OX0.g7Pu4-fQyNC9AWawzyr9Fs7KHPUmWgP60QWKLfBkypE';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkSchema() {
  console.log('Testing insert with one medicine...\n');
  
  const testMedicine = {
    product_id: 'MED-AUTH200000',
    name: 'Paracetamol 500mg',
    manufacturer: 'Nepal Pharma Ltd'
  };

  const { data, error } = await supabase
    .from('medicine')
    .insert([testMedicine])
    .select();

  if (error) {
    console.error('❌ Error:', error);
  } else {
    console.log('✅ Success! Inserted test medicine');
    console.log('Data:', data);
  }
}

checkSchema();
