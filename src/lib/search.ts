import { groups, Item } from "@/config/docs";
import { supabase } from "./supabase";

export interface SearchResult {
    title: string;
    path: string;
    type: 'local' | 'supabase';
    category?: string;
}

export async function searchDocs(query: string): Promise<SearchResult[]> {
    if (!query.trim()) return [];

    const normalizedQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    // Search local groups
    groups.forEach(group => {
        group.sections.forEach(section => {
            section.items.forEach(item => {
                if (
                    item.name.toLowerCase().includes(normalizedQuery) ||
                    section.title.toLowerCase().includes(normalizedQuery) ||
                    group.title.toLowerCase().includes(normalizedQuery)
                ) {
                    results.push({
                        title: item.name,
                        path: item.path,
                        type: 'local',
                        category: section.title
                    });
                }
            });
        });
    });

    // Search Supabase
    try {
        const { data, error } = await supabase
            .from("docs")
            .select("id, title, category")
            .or(`title.ilike.%${query}%,content.ilike.%${query}%,category.ilike.%${query}%`)
            .limit(5) as { data: { id: string; title: string; category: string }[] | null; error: unknown };

        if (!error && data) {
            data.forEach(doc => {
                results.push({
                    title: doc.title,
                    path: `/docs/ServiceDocs#doc-${doc.id}`,
                    type: 'supabase',
                    category: doc.category
                });
            });
        }
    } catch (err) {
        console.error("Search error:", err);
    }

    return results;
}
