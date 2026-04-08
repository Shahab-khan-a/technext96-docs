
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

async function testSelectAfterUpdate() {
    const { data: initialData } = await supabase.from('docs').select('id').limit(1).single();
    if (initialData) {
        console.log(`Testing select() after update for id: ${initialData.id}`);
        const { data, error } = await supabase
            .from('docs')
            .update({ status: 'published' })
            .eq('id', initialData.id)
            .select();
            
        if (error) {
            console.error("Update+Select error:", error);
        } else {
            console.log("Success! Data returned:", data);
        }
    }
}

testSelectAfterUpdate();
