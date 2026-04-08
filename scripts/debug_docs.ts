
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugSchema() {
    const { data, error } = await supabase.from('docs').select('*').limit(1);
    if (error) {
        console.error("Select error:", error);
        return;
    }
    if (data && data[0]) {
        console.log("Columns in 'docs' table:", Object.keys(data[0]));
        
        const docId = data[0].id;
        console.log(`Attempting update on doc id: ${docId}`);
        const { error: updateError } = await supabase
            .from('docs')
            .update({ title: data[0].title })
            .eq('id', docId);
            
        if (updateError) {
            console.error("Update error detail:", updateError);
        } else {
            console.log("Update check passed.");
        }
    } else {
        console.log("No data found in docs table.");
    }
}

debugSchema();
