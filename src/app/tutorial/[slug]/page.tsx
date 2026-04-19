import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
    try {
        const { data: tutorials } = await supabase
            .from('tutorials')
            .select('slug')
            .eq('is_active', true) as { data: { slug: string }[] | null };

        if (!tutorials || tutorials.length === 0) return [];

        const allSlugs = tutorials.map((t) => t.slug).filter(Boolean);

        return allSlugs.map((slug) => ({
            slug: slug,
        }));
    } catch {
        return [];
    }
}

export const dynamicParams = true;

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function TutorialPage({ params }: PageProps) {
    const { slug } = await params;

    const { data: tutorial, error } = await supabase
        .from('tutorials')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single() as { data: { title: string; description: string; content: unknown } | null; error: unknown };

    if (error || !tutorial) {
        notFound();
    }

    const lessons = tutorial.content as Array<{
        lesson: string;
        content: string;
        codeExample?: string;
    }>;

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-black text-white min-h-screen">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-white">
                {tutorial.title}
            </h1>
            <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">
                {tutorial.description}
            </p>

            {lessons && lessons.map((lessonItem, index) => (
                <section key={index} className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 border-b border-gray-800 pb-2 text-white">
                        {lessonItem.lesson}
                    </h2>

                    <div className="space-y-4">
                        <div className="text-gray-300">
                            {lessonItem.content.split('\n').map((line, i) => (
                                <p key={i} className="mb-2">{line}</p>
                            ))}
                        </div>

                        {lessonItem.codeExample && (
                            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 overflow-x-auto">
                                <pre className="text-xs sm:text-sm text-gray-300">
                                    <code>{lessonItem.codeExample}</code>
                                </pre>
                            </div>
                        )}
                    </div>
                </section>
            ))}
        </div>
    );
}
