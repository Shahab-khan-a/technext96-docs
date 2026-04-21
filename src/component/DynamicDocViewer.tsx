"use client";

import { Loader2, Calendar, User, BookOpen, ArrowLeft } from "lucide-react";
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
                            while (usedIds.has(finalId)) { finalId = `${baseId}-${counter}`; counter++; }
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
            <div style={{ background: "#0d1117" }} className="max-w-4xl mx-auto p-4 sm:p-6 text-white min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-slate-400">
                    <Loader2 size={36} style={{ color: "#00d4ff" }} className="animate-spin" />
                    <p className="text-sm font-medium">Loading document...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: "#0d1117" }} className="max-w-4xl mx-auto p-4 sm:p-6 text-white min-h-screen animate-in fade-in duration-700">
            {/* Header / Meta */}
            <header className="mb-12 space-y-6">
                <div className="flex items-center gap-3">
                    <span
                        style={{
                            background: "rgba(0,212,255,0.08)",
                            border: "1px solid rgba(0,212,255,0.2)",
                            color: "#00d4ff"
                        }}
                        className="inline-block px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider"
                    >
                        {doc.category}
                    </span>
                </div>

                <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
                    {doc.title}
                </h1>

                <div style={{ borderTop: "1px solid #1e2a3a" }} className="flex flex-wrap items-center gap-6 text-slate-500 pt-4">
                    <div className="flex items-center gap-2">
                        <Calendar size={16} style={{ color: "rgba(0,212,255,0.5)" }} />
                        <span className="text-sm font-medium">
                            {new Date(doc.created_at).toLocaleDateString("en-US", {
                                year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <User size={16} style={{ color: "rgba(0,212,255,0.5)" }} />
                        <span className="text-sm font-medium">Admin</span>
                    </div>
                </div>
            </header>

            {/* Content */}
            <article
                className="prose prose-invert max-w-none text-slate-300 leading-relaxed text-lg space-y-4 ql-editor-view"
                dangerouslySetInnerHTML={{ __html: doc.content }}
            />

            {/* TechNext Doc Styles — LOCKED */}
            <style>{`
                .ql-editor-view h2 {
                    color: white !important;
                    margin-top: 3rem !important;
                    margin-bottom: 1.25rem !important;
                    font-weight: 800 !important;
                    font-size: 2.25rem !important;
                    letter-spacing: -0.02em !important;
                    line-height: 1.3 !important;
                    border-bottom: 1px solid #1e2a3a;
                    padding-bottom: 0.75rem;
                }

                .ql-editor-view h3 {
                    color: #e2e8f0 !important;
                    margin-top: 2rem !important;
                    margin-bottom: 1rem !important;
                    font-weight: 700 !important;
                    font-size: 1.5rem !important;
                }

                .ql-editor-view p {
                    font-size: 1.1rem !important;
                    line-height: 1.85 !important;
                    margin-bottom: 1.5rem !important;
                    color: #94a3b8 !important;
                }

                /* Inline code */
                .ql-editor-view p code,
                .ql-editor-view li code {
                    background-color: #111827 !important;
                    color: #00d4ff !important;
                    border: 1px solid #1e2a3a !important;
                    border-radius: 6px !important;
                    padding: 2px 8px !important;
                    font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
                    font-size: 0.9em !important;
                    display: inline !important;
                }

                /* Code Block */
                .ql-editor-view pre,
                .ql-editor-view .ql-syntax,
                .ql-editor-view code {
                    background-color: #0a0f1a !important;
                    color: #e2e8f0 !important;
                    border: 1px solid #1e2a3a !important;
                    border-radius: 14px !important;
                    padding: 24px !important;
                    font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
                    font-size: 0.92rem !important;
                    line-height: 1.7 !important;
                    margin: 2rem 0 !important;
                    overflow-x: auto;
                    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
                    display: block;
                }

                .ql-editor-view img {
                    border-radius: 1.5rem;
                    margin: 3rem 0;
                    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.6);
                    border: 1px solid #1e2a3a;
                }

                .ql-editor-view blockquote {
                    border-left: 4px solid #00d4ff !important;
                    padding: 1rem 1.5rem !important;
                    margin: 2rem 0 !important;
                    color: #64748b !important;
                    font-style: italic !important;
                    background: rgba(0, 212, 255, 0.03);
                    border-radius: 0 12px 12px 0;
                }

                .ql-editor-view a {
                    color: #00d4ff !important;
                    text-decoration: underline;
                    text-underline-offset: 3px;
                }

                .ql-editor-view ul, .ql-editor-view ol {
                    color: #94a3b8;
                    padding-left: 1.5rem;
                    margin-bottom: 1.5rem;
                }

                .ql-editor-view li {
                    margin-bottom: 0.5rem;
                    line-height: 1.75;
                }
            `}</style>

            {/* Footer */}
            <footer style={{ borderTop: "1px solid #1e2a3a" }} className="mt-16 pt-8 flex items-center justify-between">
                <div className="flex items-center gap-4 text-slate-500">
                    <BookOpen size={20} />
                    <span className="text-sm font-medium">Documentation Repository</span>
                </div>
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    style={{ background: "#111827", border: "1px solid #1e2a3a" }}
                    className="p-3 rounded-xl hover:border-[#00d4ff] text-white transition-all group"
                >
                    <ArrowLeft size={20} className="rotate-90 group-hover:-translate-y-1 transition-transform" />
                </button>
            </footer>
        </div>
    );
}
