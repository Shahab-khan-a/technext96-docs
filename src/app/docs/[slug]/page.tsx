import { Main } from "@/component/Main";
import { supabase, slugify } from "@/lib/supabase";
import { redirect } from "next/navigation";

export async function generateStaticParams() {
    // Fetch all document IDs or titles (slugs) from Supabase
    const { data: docs } = await supabase.from('docs').select('id, title');

    // Fetch tutorials from tutorials table
    const { data: tutorials } = await supabase
        .from('tutorials')
        .select('slug')
        .eq('is_active', true);

    // Convert tutorials to slugs
    const tutorialSlugs = tutorials ? tutorials.map((t) => t.slug) : [];

    const dynamicSlugs = docs ? docs.map((doc) => doc.title ? slugify(doc.title) : String(doc.id)) : [];

    const allSlugs = [...dynamicSlugs, ...tutorialSlugs].filter(Boolean);

    return allSlugs.map((slug) => ({
        slug: slug,
    }));
}

export const dynamicParams = false;

interface PageProps {
    params: Promise<{ slug: string }>;
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

    // Otherwise, show the static content via Main component
    return <Main />;
}
