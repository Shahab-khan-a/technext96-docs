import { createClient } from '@supabase/supabase-js';

// These are NEXT_PUBLIC_ so they are inlined at build time.
// We do NOT throw at module level — a missing var during build
// just means the client won't be initialised until runtime.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

let supabaseInstance: ReturnType<typeof createClient> | null = null;

const getSupabase = () => {
    if (!supabaseInstance) {
        if (!supabaseUrl || !supabaseAnonKey) {
            // Return a dummy that will fail gracefully at query time
            // (callers already have try/catch around every query)
            console.warn('[Supabase] Missing env vars — client not initialised.');
        }

        // Custom fetch with retry logic
        const fetchWithRetry = async (
            url: string | URL | Request,
            options?: RequestInit,
            retries = 3
        ): Promise<Response> => {
            try {
                return await fetch(url, options);
            } catch (err) {
                if (retries > 0) {
                    console.warn(`[Supabase] Fetch failed, retrying… (${retries} left):`, err);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    return fetchWithRetry(url, options, retries - 1);
                }
                throw err;
            }
        };

        supabaseInstance = createClient(
            supabaseUrl || 'https://placeholder.supabase.co',
            supabaseAnonKey || 'placeholder-key',
            { global: { fetch: fetchWithRetry } }
        );
    }
    return supabaseInstance;
};

export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
    get: (_target, prop) => {
        return getSupabase()[prop as keyof ReturnType<typeof createClient>];
    },
});

export const slugify = (text: string) =>
    text.toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
