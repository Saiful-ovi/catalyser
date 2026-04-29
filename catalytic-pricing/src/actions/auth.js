'use server';

import { supabase } from '@/lib/supabase';
import { encrypt } from '@/lib/auth';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

export async function login(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  
  if (error || !user) {
    return { error: 'Invalid credentials' };
  }

  // Block inactive employees
  if (user.role === 'employee' && user.active === false) {
    return { error: 'Your account has been deactivated. Contact admin.' };
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    return { error: 'Invalid credentials' };
  }

  const session = { id: user.id, role: user.role, email: user.email };
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const sessionValue = await encrypt({ ...session, expires });

  const c = await cookies();
  c.set('session', sessionValue, { expires, httpOnly: true });

  if (user.role === 'admin') {
    redirect('/admin');
  } else {
    redirect('/employee');
  }
}

export async function logout() {
  const c = await cookies();
  c.delete('session');
  redirect('/login');
}
