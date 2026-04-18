import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Custom fetch with retry logic to handle ERR_QUIC_PROTOCOL_ERROR and other transient network issues
const fetchWithRetry = async (url: string | URL | Request, options?: RequestInit | undefined, retries = 3): Promise<Response> => {
    try {
        const response = await fetch(url, options);
        return response;
    } catch (err) {
        if (retries > 0) {
            console.warn(`Supabase fetch failed, retrying... (${retries} retries left):`, err);
            // Add a small delay before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
            return fetchWithRetry(url, options, retries - 1);
        }
        throw err;
    }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
        fetch: fetchWithRetry,
    },
});

export const slugify = (text: string) => 
    text.toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
