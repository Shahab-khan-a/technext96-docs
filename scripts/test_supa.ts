import * as dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(__dirname, '../.env.local') });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
    console.log("Fetching docs...");
    try {
        const { data, error } = await supabase.from('docs').select('*').limit(1);
        console.log("Data:", data, "Error:", error);
    } catch (e) {
        console.error("Exception:", e);
    }
}

run();
