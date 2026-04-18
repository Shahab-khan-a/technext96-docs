"use client";

import { Loader2, Calendar, User, Clock, ArrowLeft, BookOpen } from "lucide-react";
import { useEffect } from "react";
import { slugify } from "@/lib/supabase";

interface Doc {
    id: string;
    title: string;
    content: string;
    category: string;
    created_at: string;
}

interface DynamicDocViewerProps {
    doc: Doc;
    isLoading?: boolean;
}

export default function DynamicDocViewer({ doc, isLoading }: DynamicDocViewerProps) {
    useEffect(() => {
        if (!isLoading && doc && doc.content) {
            // Small delay to ensure DOM is fully rendered
            const timer = setTimeout(() => {
                const article = document.querySelector('.ql-editor-view');
                if (article) {
                    const headings = article.querySelectorAll('h2, h3');
                    const usedIds = new Set<string>();
                    
                    headings.forEach(h => {
                        const text = h.textContent?.trim() || '';
                        if (text) {
                            let baseId = slugify(text);
                            let finalId = baseId;
                            let counter = 1;
                            
                            // Handle duplicate IDs
                            while (usedIds.has(finalId)) {
                                finalId = `${baseId}-${counter}`;
                                counter++;
                            }
                            
                            usedIds.add(finalId);
                            h.id = finalId;
                        }
                    });
                }
            }, 100);
            
            return () => clearTimeout(timer);
        }
    }, [isLoading, doc, doc?.content]);

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-black text-white min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-gray-400">
                    <Loader2 size={36} className="animate-spin text-amber-400" />
                    <p className="text-sm font-medium">Loading document...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-black text-white min-h-screen animate-in fade-in duration-700">
            {/* Header / Meta */}
            <header className="mb-12 space-y-6">
                <div className="flex items-center gap-3">
                    <span className="inline-block px-3 py-1 rounded-md text-xs font-bold bg-gray-900 border border-gray-800 text-amber-400 uppercase tracking-wider">
                        {doc.category}
                    </span>
                </div>

                <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
                    {doc.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-gray-500 pt-4 border-t border-gray-800">
                    <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-amber-400/60" />
                        <span className="text-sm font-medium">
                            {new Date(doc.created_at).toLocaleDateString("en-US", {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <User size={16} className="text-amber-400/60" />
                        <span className="text-sm font-medium">Admin</span>
                    </div>
                </div>
            </header>

            {/* Content Section */}
            <article 
                className="prose prose-invert max-w-none text-gray-300 leading-relaxed text-lg space-y-4 ql-editor-view"
                dangerouslySetInnerHTML={{ __html: doc.content }}
            />

            {/* Premium Documentation Styling */}
            <style>{`
                .ql-editor-view h2 {
                    color: white !important;
                    margin-top: 3rem !important;
                    margin-bottom: 1.25rem !important;
                    font-weight: 800 !important;
                    font-size: 2.25rem !important;
                    letter-spacing: -0.02em !important;
                    line-height: 1.3 !important;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    padding-bottom: 0.75rem;
                }
                
                .ql-editor-view h3 {
                    color: #f4f4f5 !important;
                    margin-top: 2rem !important;
                    margin-bottom: 1rem !important;
                    font-weight: 700 !important;
                    font-size: 1.5rem !important;
                }

                .ql-editor-view p {
                    font-size: 1.15rem !important;
                    line-height: 1.8 !important;
                    margin-bottom: 1.5rem !important;
                    color: #d4d4d8 !important;
                }

                /* Inline code (backtick tags like <div>, <img />) */
                .ql-editor-view p code,
                .ql-editor-view li code {
                    background-color: #1e1e21 !important;
                    color: #fbbf24 !important;
                    border: 1px solid rgba(255,255,255,0.08) !important;
                    border-radius: 6px !important;
                    padding: 2px 8px !important;
                    font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
                    font-size: 0.9em !important;
                    display: inline !important;
                }

                /* Code Block Styling */
                .ql-editor-view pre,
                .ql-editor-view .ql-syntax,
                .ql-editor-view code {
                    background-color: #121214 !important;
                    color: #ecfeff !important;
                    border: 1px solid rgba(255, 255, 255, 0.08) !important;
                    border-radius: 14px !important;
                    padding: 24px !important;
                    font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
                    font-size: 0.95rem !important;
                    line-height: 1.7 !important;
                    margin: 2rem 0 !important;
                    overflow-x: auto;
                    box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
                    display: block;
                }

                .ql-editor-view img {
                    border-radius: 1.5rem;
                    margin: 3rem 0;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .ql-editor-view blockquote {
                    border-left: 4px solid #fbbf24 !important;
                    padding-left: 1.5rem !important;
                    margin: 2rem 0 !important;
                    color: #a1a1aa !important;
                    font-style: italic !important;
                    background: rgba(251, 191, 36, 0.03);
                    padding: 1rem 1.5rem;
                    border-radius: 0 12px 12px 0;
                }
            `}</style>

            {/* Footer Navigation */}
            <footer className="mt-16 pt-8 border-t border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-4 text-gray-500">
                    <BookOpen size={20} />
                    <span className="text-sm font-medium">Documentation Repository</span>
                </div>
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="p-3 rounded-xl bg-gray-900 hover:bg-gray-800 text-white transition-all border border-gray-800 group"
                >
                    <ArrowLeft size={20} className="rotate-90 group-hover:-translate-y-1 transition-transform" />
                </button>
            </footer>
        </div>
    );
}
