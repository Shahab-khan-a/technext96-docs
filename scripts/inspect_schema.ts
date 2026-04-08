import * as dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(__dirname, '../.env.local') });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspectSchema() {
    console.log("Inspecting 'docs' table structure...");
    
    // We can't always query information_schema directly with the anon key, 
    // but we can try to get a sample record and see the types
    const { data, error } = await supabase.from('docs').select('*').limit(1);
    
    if (error) {
        console.error("Error fetching data:", error);
        return;
    }

    if (data && data.length > 0) {
        console.log("Column keys found:", Object.keys(data[0]));
        for (const key of Object.keys(data[0])) {
            console.log(`Column '${key}': Type is ${typeof data[0][key]}`);
        }
    } else {
        console.log("No data found in 'docs' table to inspect.");
    }
}

inspectSchema().then(() => process.exit(0));
