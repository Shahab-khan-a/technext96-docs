import { Main } from "@/component/Main";
import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";

export async function generateStaticParams() {
    try {
        const { data: docs } = await supabase.from('docs').select('id');
        const { data: tutorials } = await supabase
            .from('tutorials')
            .select('slug')
            .eq('is_active', true);

        const tutorialSlugs = tutorials ? tutorials.map((t) => t.slug) : [];
        const docIds = docs ? docs.map((doc) => String(doc.id)) : [];
        const allSlugs = [...docIds, ...tutorialSlugs].filter(Boolean);

        if (allSlugs.length === 0) return [{ slug: 'placeholder' }];

        return allSlugs.map((slug) => ({ slug: slug }));
    } catch {
        return [{ slug: 'placeholder' }];
    }
}

export const dynamicParams = false;

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

    const { data: tutorial } = await supabase
        .from('tutorials')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

    // If tutorial exists, redirect to tutorial page
    if (tutorial) {
        redirect(`/tutorial/${slug}`);
    }

    // Fetch the document on the server side
    let doc: Doc | null = null;
    try {
        const { data } = await supabase
            .from('docs')
            .select('*')
            .eq('id', slug)
            .maybeSingle();
        
        doc = data;
    } catch (err) {
        console.error("Error fetching doc:", err);
    }

    // Pass the doc data to Main component
    return <Main initialDoc={doc} slug={slug} />;
}
