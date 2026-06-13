import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  
  if (!path) {
    return new NextResponse('Path parameter is required', { status: 400 });
  }
  
  try {
    const { data, error } = await supabase.storage
      .from('catalyser-images')
      .download(path);
      
    if (error || !data) {
      console.error('Error downloading image:', error);
      return new NextResponse('Image not found', { status: 404 });
    }
    
    const response = new NextResponse(data);
    response.headers.set('Content-Type', data.type || 'image/jpeg');
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    return response;
  } catch (err) {
    console.error('Image proxy handler error:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
