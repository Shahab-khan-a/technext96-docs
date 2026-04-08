
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testUpdate() {
    // Get the first doc
    const { data: doc } = await supabase.from('docs').select('id, title').limit(1).single();
    if (!doc) {
        console.log('No docs found to test with.');
        return;
    }
    
    console.log(`Testing update on doc: ${doc.title} (${doc.id})`);
    
    const { error } = await supabase
        .from('docs')
        .update({ title: doc.title + ' (Updated Test)' })
        .eq('id', doc.id);
    
    if (error) {
        console.error('Update failed:', error.message);
    } else {
        console.log('Update successful! (Reverting now...)');
        await supabase.from('docs').update({ title: doc.title }).eq('id', doc.id);
    }
}

testUpdate();
