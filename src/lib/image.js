export function getImageUrl(supabaseUrl) {
  if (!supabaseUrl) return '';
  if (!supabaseUrl.startsWith('http')) return supabaseUrl;
  
  // Check if it's a Supabase URL
  if (supabaseUrl.includes('.supabase.co/storage/v1/object/public/catalyser-images/')) {
    const parts = supabaseUrl.split('/catalyser-images/');
    if (parts.length > 1) {
      const path = parts[1];
      return `/api/image?path=${encodeURIComponent(path)}`;
    }
  }
  return supabaseUrl;
}
