
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkRecentDoc() {
    const { data, error } = await supabase
        .from('docs')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1);
    
    if (error) console.error(error);
    else console.log(JSON.stringify(data, null, 2));
}

checkRecentDoc();
