import { createClient } from '@supabase/supabase-js';

let supabaseInstance: ReturnType<typeof createClient> | null = null;

const getSupabase = () => {
    if (!supabaseInstance) {
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            throw new Error('Missing Supabase environment variables');
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        // Custom fetch with retry logic
        const fetchWithRetry = async (url: string | URL | Request, options?: RequestInit, retries = 3): Promise<Response> => {
            try {
                return await fetch(url, options);
            } catch (err) {
                if (retries > 0) {
                    console.warn(`Supabase fetch failed, retrying... (${retries} retries left):`, err);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    return fetchWithRetry(url, options, retries - 1);
                }
                throw err;
            }
        };

        supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
            global: {
                fetch: fetchWithRetry,
            },
        });
    }
    return supabaseInstance;
};

export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
    get: (target, prop) => {
        return getSupabase()[prop as keyof ReturnType<typeof createClient>];
    },
});

export const slugify = (text: string) => 
    text.toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
