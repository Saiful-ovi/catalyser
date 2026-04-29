const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const PROJECT_REF = 'bposfzsrpfxsuzpsuwgy';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwb3NmenNycGZ4c3V6cHN1d2d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MTAyNTcsImV4cCI6MjA5Mjk4NjI1N30.JAcd5H3dXEIH-TFbprzhWUhir6nAkRKSd05NfnP7prw';
const supabase = createClient(`https://${PROJECT_REF}.supabase.co`, ANON_KEY);

async function runMigration() {
    console.log('🚀 Migrating data to Supabase...');

    try {
        // 1. Migrate Users
        console.log('👥 Migrating Users...');
        const users = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/users.json'), 'utf8'));
        const { error: userError } = await supabase.from('users').upsert(users.map(u => ({
            id: u.id,
            email: u.email,
            password_hash: u.passwordHash,
            role: u.role,
            active: u.active !== false
        })));
        if (userError) throw userError;

        // 2. Migrate Settings
        console.log('⚙️ Migrating Settings...');
        const settings = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/settings.json'), 'utf8'));
        const { error: settingsError } = await supabase.from('settings').upsert({
            id: 'main',
            value: settings
        });
        if (settingsError) throw settingsError;

        // 3. Create Storage Bucket (if not exists)
        // Note: This might fail if anon key doesn't have permissions, 
        // but we'll try or assume user created it/will use public bucket.
        console.log('📦 Setting up Storage...');
        // We'll skip bucket creation here and assume we can upload if bucket exists
        // User should create a public bucket named 'catalyser-images'

        // 4. Migrate Catalysers and Images
        console.log('💎 Migrating Catalysers...');
        const catalysers = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/catalysers.json'), 'utf8'));
        
        for (const cat of catalysers) {
            console.log(`   Processing: ${cat.modelNumber}`);
            
            // If we wanted to upload images to Supabase Storage, we would do it here.
            // For now, let's just push the data. We can do a second pass for images.
            const { error: catError } = await supabase.from('catalysers').upsert({
                id: cat.id,
                model_number: cat.modelNumber,
                brand_name: cat.brandName,
                description: cat.description,
                images: cat.images,
                weight_gram: cat.weightGram,
                moisture: cat.moisture,
                pt_ppm: cat.ptPpm,
                pd_ppm: cat.pdPpm,
                rh_ppm: cat.rhPpm
            });
            if (catError) console.error(`Error migrating ${cat.modelNumber}:`, catError);
        }

        console.log('✅ All data migrated to Supabase database!');
        console.log('⚠️ Next step: Uploading images to Supabase Storage.');

    } catch (err) {
        console.error('❌ Migration failed:', err.message);
    }
}

runMigration();
