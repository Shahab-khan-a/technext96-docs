
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function cleanupData() {
    try {
        console.log("Fetching all docs...");
        const { data: docs, error } = await supabase.from('docs').select('id, title, content');
        
        if (error) {
            console.error("Supabase error:", error);
            return;
        }

        if (!docs) {
            console.log("No docs found.");
            return;
        }

        console.log(`Found ${docs.length} docs. Checking for corruption...`);
        let fixCount = 0;
        for (const doc of docs) {
            if (!doc.content) continue;
            
            // Check for the star-per-character pattern
            // Example: "*#* *R*e*a*c*t*"
            // If the number of stars is > 40% of the total length, it's probably corrupted
            const stars = (doc.content.match(/\*/g) || []).length;
            if (stars > doc.content.length * 0.4 && doc.content.includes('*')) {
                console.log(`Fixing corrupted doc: "${doc.title}" (ID: ${doc.id})`);
                
                let fixedContent = doc.content.replace(/\*/g, '');
                
                // If it was a title like *#* It's now #. 
                // We want to make sure it's valid markdown.
                
                const { error: updateError } = await supabase
                    .from('docs')
                    .update({ content: fixedContent })
                    .eq('id', doc.id);
                    
                if (updateError) {
                    console.error(`Failed to fix "${doc.title}":`, updateError.message);
                } else {
                    fixCount++;
                }
            }
        }
        console.log(`Cleanup completed. Fixed ${fixCount} docs.`);
    } catch (e) {
        console.error("Global script error:", e);
    }
}

cleanupData();
