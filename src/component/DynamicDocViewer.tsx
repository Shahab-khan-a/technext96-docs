"use client";

import { Loader2, Calendar, User, Clock, ArrowLeft, BookOpen } from "lucide-react";
import { parseDocContent } from "@/lib/docs-parser";

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
            <article className="space-y-6">
                {parseDocContent(doc.content).map((block, index) => {
                    if (block.type === 'title') {
                        const id = block.content.toLowerCase().replace(/\s+/g, '-');
                        return (
                            <h3 key={index} id={id} className="text-2xl font-bold text-white mt-10 mb-4 border-l-4 border-amber-400 pl-4 py-1 scroll-mt-24">
                                {block.content}
                            </h3>
                        );
                    }
                    if (block.type === 'code') {
                        return (
                            <div key={index} className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 overflow-x-auto my-6 shadow-inner ring-1 ring-white/5 font-mono text-sm leading-relaxed">
                                <pre className="text-gray-300">
                                    <code>{block.content}</code>
                                </pre>
                            </div>
                        );
                    }
                    return (
                        <p key={index} className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                            {block.content}
                        </p>
                    );
                })}
            </article>

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
