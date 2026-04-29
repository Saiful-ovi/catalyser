'use server';

import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

async function checkAdmin() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    throw new Error('Unauthorized');
  }
}

// Settings
export async function getSettings() {
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('id', 'main')
    .single();
  
  if (error) return null;
  return data.value;
}

export async function updateSettings(newSettings) {
  await checkAdmin();
  const { error } = await supabase
    .from('settings')
    .upsert({ id: 'main', value: newSettings });
  
  if (error) return { error: error.message };
  revalidatePath('/admin');
  revalidatePath('/employee');
  return { success: true };
}

export async function updateMarketRates(rates) {
  await checkAdmin();
  const current = await getSettings();
  const updated = {
    ...current,
    metals: {
      pt: { ...current.metals.pt, usdPerOunce: rates.pt },
      pd: { ...current.metals.pd, usdPerOunce: rates.pd },
      rh: { ...current.metals.rh, usdPerOunce: rates.rh },
    }
  };
  
  const { error } = await supabase
    .from('settings')
    .upsert({ id: 'main', value: updated });

  if (error) return { error: error.message };
  revalidatePath('/admin');
  revalidatePath('/employee');
  return { success: true };
}

// Catalysers Helper for Image Upload
async function uploadToSupabase(file) {
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
  const filePath = `uploads/${fileName}`;

  const { data, error } = await supabase.storage
    .from('catalyser-images')
    .upload(filePath, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('catalyser-images')
    .getPublicUrl(filePath);

  return publicUrl;
}

// Catalysers
export async function getCatalysers() {
  const { data, error } = await supabase
    .from('catalysers')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) return [];
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

export async function addCatalyser(formData) {
  await checkAdmin();
  
  const images = [];
  const imageFiles = formData.getAll('images');
  
  for (const file of imageFiles) {
    if (file && file.size > 0) {
      try {
        const url = await uploadToSupabase(file);
        images.push(url);
      } catch (err) {
        console.error('Upload failed:', err);
      }
    }
  }

  const weightKg = parseFloat(formData.get('weightKg'));
  const moisturePercent = parseFloat(formData.get('moisturePercent'));

  const { error } = await supabase.from('catalysers').insert({
    id: Date.now().toString(),
    model_number: formData.get('modelNumber'),
    brand_name: formData.get('brandName'),
    description: formData.get('description') || '',
    images: images,
    weight_gram: weightKg * 1000,
    moisture: moisturePercent / 100,
    pt_ppm: parseFloat(formData.get('ptPpm')),
    pd_ppm: parseFloat(formData.get('pdPpm')),
    rh_ppm: parseFloat(formData.get('rhPpm')),
  });

  if (error) return { error: error.message };
  revalidatePath('/admin');
  revalidatePath('/admin/catalysers');
  revalidatePath('/employee');
  return { success: true };
}

export async function updateCatalyser(id, formData) {
  await checkAdmin();
  
  const { data: existing } = await supabase.from('catalysers').select('images').eq('id', id).single();
  if (!existing) return { error: 'Not found' };

  const newImages = [];
  const imageFiles = formData.getAll('images');
  
  if (imageFiles && imageFiles.length > 0 && imageFiles[0].size > 0) {
    for (const file of imageFiles) {
      if (file.size > 0) {
        try {
          const url = await uploadToSupabase(file);
          newImages.push(url);
        } catch (err) {
          console.error('Upload failed:', err);
        }
      }
    }
  }

  const weightKg = parseFloat(formData.get('weightKg'));
  const moisturePercent = parseFloat(formData.get('moisturePercent'));

  const { error } = await supabase.from('catalysers').update({
    model_number: formData.get('modelNumber'),
    brand_name: formData.get('brandName'),
    description: formData.get('description') || '',
    images: newImages.length > 0 ? newImages : existing.images,
    weight_gram: weightKg * 1000,
    moisture: moisturePercent / 100,
    pt_ppm: parseFloat(formData.get('ptPpm')),
    pd_ppm: parseFloat(formData.get('pdPpm')),
    rh_ppm: parseFloat(formData.get('rhPpm')),
  }).eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/admin');
  revalidatePath('/admin/catalysers');
  revalidatePath('/employee');
  return { success: true };
}

export async function deleteCatalyser(id) {
  await checkAdmin();
  const { error } = await supabase.from('catalysers').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin');
  revalidatePath('/employee');
  return { success: true };
}

// Users
export async function getUsers() {
  await checkAdmin();
  const { data, error } = await supabase.from('users').select('*');
  if (error) return [];
  return data.map(u => ({
    id: u.id,
    email: u.email,
    passwordHash: u.password_hash,
    role: u.role,
    active: u.active
  }));
}

export async function createEmployee(prevState, formData) {
  await checkAdmin();
  const email = formData.get('email');
  const password = formData.get('password');
  
  const passwordHash = await bcrypt.hash(password, 10);
  const { error } = await supabase.from('users').insert({
    id: Date.now().toString(),
    email,
    password_hash: passwordHash,
    role: 'employee',
    active: true
  });

  if (error) return { error: error.message };
  revalidatePath('/admin/employees');
  return { success: true };
}

export async function toggleEmployeeStatus(id) {
  await checkAdmin();
  const { data: user } = await supabase.from('users').select('active').eq('id', id).single();
  if (!user) return { error: 'User not found' };
  
  const newStatus = !user.active;
  const { error } = await supabase.from('users').update({ active: newStatus }).eq('id', id);
  
  if (error) return { error: error.message };
  revalidatePath('/admin/employees');
  return { success: true, active: newStatus };
}

export async function changeEmployeePassword(id, newPassword) {
  await checkAdmin();
  if (!newPassword || newPassword.length < 4) {
    return { error: 'Password must be at least 4 characters' };
  }
  
  const passwordHash = await bcrypt.hash(newPassword, 10);
  const { error } = await supabase.from('users').update({ password_hash: passwordHash }).eq('id', id);
  
  if (error) return { error: error.message };
  revalidatePath('/admin/employees');
  return { success: true };
}

export async function deleteEmployee(id) {
  await checkAdmin();
  const { data: user } = await supabase.from('users').select('role').eq('id', id).single();
  if (!user) return { error: 'User not found' };
  if (user.role === 'admin') return { error: 'Cannot delete admin accounts' };
  
  const { error } = await supabase.from('users').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/employees');
  return { success: true };
}

// Admin Credentials
export async function changeAdminEmail(currentPassword, newEmail) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return { error: 'Unauthorized' };

  const { data: admin } = await supabase.from('users').select('password_hash').eq('id', session.id).single();
  if (!admin) return { error: 'Admin not found' };

  const match = await bcrypt.compare(currentPassword, admin.password_hash);
  if (!match) return { error: 'Current password is incorrect' };

  const { error } = await supabase.from('users').update({ email: newEmail }).eq('id', session.id);
  if (error) return { error: error.message };
  
  revalidatePath('/admin');
  return { success: true };
}

export async function changeAdminPassword(currentPassword, newPassword) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return { error: 'Unauthorized' };

  if (!newPassword || newPassword.length < 4) {
    return { error: 'New password must be at least 4 characters' };
  }

  const { data: admin } = await supabase.from('users').select('password_hash').eq('id', session.id).single();
  if (!admin) return { error: 'Admin not found' };

  const match = await bcrypt.compare(currentPassword, admin.password_hash);
  if (!match) return { error: 'Current password is incorrect' };

  const passwordHash = await bcrypt.hash(newPassword, 10);
  const { error } = await supabase.from('users').update({ password_hash: passwordHash }).eq('id', session.id);
  
  if (error) return { error: error.message };
  revalidatePath('/admin');
  return { success: true };
}
