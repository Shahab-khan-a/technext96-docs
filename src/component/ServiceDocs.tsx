"use client";

import { Loader2 } from "lucide-react";

interface Doc {
    id: string;
    title: string;
    content: string;
    category: string;
    created_at: string;
}

interface ServiceDocsProps {
    docs: Doc[];
    isLoading: boolean;
}

export default function ServiceDocs({ docs, isLoading }: ServiceDocsProps) {
    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-black text-white min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-gray-400">
                    <Loader2 size={36} className="animate-spin text-amber-400" />
                    <p className="text-sm font-medium">Fetching documents from Supabase...</p>
                </div>
            </div>
        );
    }

    if (docs.length === 0) {
        return (
            <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-black text-white min-h-screen">
                <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
                    Service — Published Documents
                </h1>
                <p className="text-gray-400 mb-8 text-sm sm:text-base">
                    No documents have been published yet. Add some from the admin panel.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-black text-white min-h-screen">
            {/* Page Title */}
            <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
                Service — Published Documents
            </h1>
            <p className="text-gray-400 mb-8 text-sm sm:text-base">
                All service documents fetched live from Supabase. Each entry below represents a published
                documentation item stored in your database.
            </p>

            {/* One section per document */}
            {docs.map((doc, index) => (
                <section key={doc.id} id={`doc-${doc.id}`} className="mb-12 scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-4 border-b border-gray-800 pb-2 text-white">
                        {index + 1}. {doc.title}
                    </h2>

                    {/* Category badge */}
                    {doc.category && (
                        <div className="mb-4">
                            <span className="inline-block px-3 py-1 rounded-md text-xs font-bold bg-gray-900 border border-gray-800 text-amber-400 uppercase tracking-wider">
                                {doc.category}
                            </span>
                        </div>
                    )}

                    {/* Content */}
                    {doc.content && (
                        <div 
                            className="prose prose-invert max-w-none text-gray-300 leading-relaxed space-y-4 mb-6"
                            dangerouslySetInnerHTML={{ __html: doc.content }}
                        />
                    )}

                    {/* Date */}
                    <p className="text-gray-600 text-xs mt-2">
                        Published:{" "}
                        {new Date(doc.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>
                </section>
            ))}
        </div>
    );
}
