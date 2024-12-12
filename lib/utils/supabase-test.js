import { supabase } from '../supabase';

export async function testDatabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .limit(1);
    if (error) throw error;
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

export async function testTableQueries() {
  const tables = [
    'departments',
    'teachers',
    'subjects',
    'classes',
    'students',
    'attendance',
  ];
  const results = {};

  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) throw error;
      results[table] = {
        success: true,
        message: `✅ ${table} table query successful`,
      };
    } catch (error) {
      results[table] = {
        success: false,
        message: `❌ ${table} table query failed: ${error.message}`,
      };
    }
  }

  return results;
}
