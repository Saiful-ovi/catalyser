const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Constants
const PROJECT_REF = 'bposfzsrpfxsuzpsuwgy';
const TOKEN = 'sbp_cd5fc69e419818ab2a791cb6029c1451c5fa847e';

async function migrate() {
    console.log('🚀 Starting Migration to Supabase...');

    // Since we can't easily run raw SQL via the JS client without a custom function,
    // we will use the Supabase Management API via fetch to execute SQL.
    
    const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'employee',
      active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS catalysers (
      id TEXT PRIMARY KEY,
      model_number TEXT NOT NULL,
      brand_name TEXT NOT NULL,
      description TEXT,
      images JSONB DEFAULT '[]'::jsonB,
      weight_gram NUMERIC NOT NULL,
      moisture NUMERIC NOT NULL,
      pt_ppm NUMERIC NOT NULL,
      pd_ppm NUMERIC NOT NULL,
      rh_ppm NUMERIC NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      id TEXT PRIMARY KEY,
      value JSONB NOT NULL
    );

    ALTER TABLE users DISABLE ROW LEVEL SECURITY;
    ALTER TABLE catalysers DISABLE ROW LEVEL SECURITY;
    ALTER TABLE settings DISABLE ROW LEVEL SECURITY;
    `;

    try {
        console.log('📦 Creating Tables...');
        const response = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: sql })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Failed to create tables: ${JSON.stringify(error)}`);
        }
        console.log('✅ Tables created successfully!');

        // Now migrate data using the Supabase Client
        const supabaseUrl = `https://${PROJECT_REF}.supabase.co`;
        // We use the anon key for data insertion since RLS is disabled
        const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwb3NmenNycGZ4c3V6cHN1d2d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MTAyNTcsImV4cCI6MjA5Mjk4NjI1N30.JAcd5H3dXEIH-TFbprzhWUhir6nAkRKSd05NfnP7prw';
        const supabase = createClient(supabaseUrl, anonKey);

        // Migrate Users
        console.log('👥 Migrating Users...');
        const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf8'));
        for (const user of users) {
            const { error } = await supabase.from('users').upsert({
                id: user.id,
                email: user.email,
                password_hash: user.passwordHash,
                role: user.role,
                active: user.active !== false
            });
            if (error) console.error(`Error migrating user ${user.email}:`, error);
        }

        // Migrate Settings
        console.log('⚙️ Migrating Settings...');
        const settings = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/settings.json'), 'utf8'));
        const { error: settingsError } = await supabase.from('settings').upsert({
            id: 'main',
            value: settings
        });
        if (settingsError) console.error('Error migrating settings:', settingsError);

        // Migrate Catalysers
        console.log('💎 Migrating Catalysers...');
        const catalysers = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/catalysers.json'), 'utf8'));
        for (const cat of catalysers) {
            const { error } = await supabase.from('catalysers').upsert({
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
            if (error) console.error(`Error migrating catalyser ${cat.modelNumber}:`, error);
        }

        console.log('🎉 Migration Complete!');
    } catch (err) {
        console.error('❌ Migration Failed:', err.message);
    }
}

migrate();
