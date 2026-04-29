const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const PROJECT_REF = 'bposfzsrpfxsuzpsuwgy';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwb3NmenNycGZ4c3V6cHN1d2d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MTAyNTcsImV4cCI6MjA5Mjk4NjI1N30.JAcd5H3dXEIH-TFbprzhWUhir6nAkRKSd05NfnP7prw';
const supabase = createClient(`https://${PROJECT_REF}.supabase.co`, ANON_KEY);

async function runMigration() {
    console.log('🚀 Migrating data to Supabase...');

    try {
        const users = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/users.json'), 'utf8'));
        const settings = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/settings.json'), 'utf8'));
        const catalysers = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/catalysers.json'), 'utf8'));

        console.log('👥 Migrating Users...');
        const { error: userError } = await supabase.from('users').upsert(users.map(u => ({
            id: u.id,
            email: u.email,
            password_hash: u.passwordHash,
            role: u.role,
            active: u.active !== false
        })));
        if (userError) throw userError;

        console.log('⚙️ Migrating Settings...');
        const { error: settingsError } = await supabase.from('settings').upsert({
            id: 'main',
            value: settings
        });
        if (settingsError) throw settingsError;

        console.log('💎 Migrating Catalysers...');
        for (const cat of catalysers) {
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

        console.log('🎉 Migration Successful!');
    } catch (err) {
        console.error('❌ Error:', err.message);
    }
}

runMigration();
