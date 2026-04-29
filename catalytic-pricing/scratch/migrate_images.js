const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const PROJECT_REF = 'bposfzsrpfxsuzpsuwgy';
const TOKEN = 'sbp_cd5fc69e419818ab2a791cb6029c1451c5fa847e';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwb3NmenNycGZ4c3V6cHN1d2d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MTAyNTcsImV4cCI6MjA5Mjk4NjI1N30.JAcd5H3dXEIH-TFbprzhWUhir6nAkRKSd05NfnP7prw';

async function migrateImages() {
    console.log('🖼️ Starting Image Migration to Supabase Storage...');
    
    const supabase = createClient(`https://${PROJECT_REF}.supabase.co`, ANON_KEY);

    try {
        // 1. Create bucket via Management API (since anon/service role might not have permission)
        console.log('📦 Ensuring bucket "catalyser-images" exists...');
        await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/storage/buckets`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: 'catalyser-images',
                name: 'catalyser-images',
                public: true
            })
        });

        // 2. Get all catalysers
        const { data: catalysers, error: fetchError } = await supabase.from('catalysers').select('*');
        if (fetchError) throw fetchError;

        for (const cat of catalysers) {
            if (!cat.images || cat.images.length === 0) continue;
            
            console.log(`📸 Processing images for: ${cat.model_number}`);
            const updatedImages = [];

            for (const localPath of cat.images) {
                // If it's already a URL, skip
                if (localPath.startsWith('http')) {
                    updatedImages.push(localPath);
                    continue;
                }

                const fileName = path.basename(localPath);
                const fullLocalPath = path.join(process.cwd(), 'public', localPath);

                if (fs.existsSync(fullLocalPath)) {
                    const fileBuffer = fs.readFileSync(fullLocalPath);
                    const { data, error: uploadError } = await supabase.storage
                        .from('catalyser-images')
                        .upload(`uploads/${fileName}`, fileBuffer, {
                            upsert: true,
                            contentType: 'image/jpeg' // or dynamic based on extension
                        });

                    if (uploadError) {
                        console.error(`   ❌ Failed to upload ${fileName}:`, uploadError.message);
                        updatedImages.push(localPath); // keep local if failed
                    } else {
                        const { data: { publicUrl } } = supabase.storage
                            .from('catalyser-images')
                            .getPublicUrl(`uploads/${fileName}`);
                        updatedImages.push(publicUrl);
                        console.log(`   ✅ Uploaded: ${fileName}`);
                    }
                } else {
                    console.warn(`   ⚠️ File not found locally: ${localPath}`);
                    updatedImages.push(localPath);
                }
            }

            // Update database
            await supabase.from('catalysers').update({ images: updatedImages }).eq('id', cat.id);
        }

        console.log('🎉 Image migration complete!');
    } catch (err) {
        console.error('❌ Error during image migration:', err.message);
    }
}

migrateImages();
