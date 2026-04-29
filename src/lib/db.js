import { supabase } from './supabase';

export async function readData(table) {
  if (table === 'settings') {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('id', 'main')
      .single();
    
    if (error) {
      console.error('Error reading settings:', error);
      return null;
    }
    return data.value;
  }

  const { data, error } = await supabase
    .from(table)
    .select('*');
  
  if (error) {
    console.error(`Error reading ${table}:`, error);
    return [];
  }

  // Map Supabase column names back to JSON expected names if necessary
  if (table === 'users') {
    return data.map(u => ({
      id: u.id,
      email: u.email,
      passwordHash: u.password_hash,
      role: u.role,
      active: u.active
    }));
  }

  if (table === 'catalysers') {
    return data.map(c => ({
      id: c.id,
      modelNumber: c.model_number,
      brandName: c.brand_name,
      description: c.description,
      images: c.images,
      weightGram: c.weight_gram,
      moisture: c.moisture,
      ptPpm: c.pt_ppm,
      pdPpm: c.pd_ppm,
      rhPpm: c.rh_ppm
    }));
  }

  return data;
}

export async function writeData(table, data) {
  // Note: In Supabase we don't usually write the whole array.
  // This helper is kept for compatibility but server actions will be updated to use direct Supabase calls.
  console.warn(`writeData called for ${table}. This should be replaced with direct Supabase operations.`);
  
  if (table === 'settings') {
    const { error } = await supabase
      .from('settings')
      .upsert({ id: 'main', value: data });
    return !error;
  }
  
  return false;
}
