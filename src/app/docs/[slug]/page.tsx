import { Main } from "@/component/Main";
import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

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
