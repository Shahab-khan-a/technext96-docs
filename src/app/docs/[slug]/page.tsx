import { Main } from "@/component/Main";
import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";

// Always server-render, never statically pre-generate
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export function generateStaticParams() {
    return [];
}

interface PageProps {
    params: Promise<{ slug: string }>;
}

interface Doc {
    id: string;
    title: string;
    content: string;
    category: string;
    created_at: string;
}

export default async function DocPage({ params }: PageProps) {
    const { slug } = await params;

    // --- Tutorial redirect check (guarded) ---
    try {
        const { data: tutorial } = await supabase
            .from('tutorials')
            .select('slug')
            .eq('slug', slug)
            .eq('is_active', true)
            .maybeSingle();

        if (tutorial) {
            redirect(`/tutorial/${slug}`);
        }
    } catch {
        // Network unavailable during SSR — skip redirect check, continue to render doc
    }

    // --- Fetch document (guarded) ---
    let doc: Doc | null = null;
    try {
        const { data } = await supabase
            .from('docs')
            .select('*')
            .eq('id', slug)
            .maybeSingle();

        doc = data;
    } catch {
        // Network unavailable during SSR — client will handle fetch
    }

    return <Main initialDoc={doc} slug={slug} />;
}
