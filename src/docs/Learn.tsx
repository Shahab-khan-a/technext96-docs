"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Video, Code, Terminal, Zap, Layers, Globe, Smartphone, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";

interface Lesson {
    lesson: string;
    content: string;
    codeExample?: string;
}

interface Tutorial {
    id: string;
    title: string;
    slug: string;
    description: string;
    category: string;
    icon: string;
    content: Lesson[];
    order_index: number;
    is_active: boolean;
    is_featured: boolean;
}

const tracks = [
    {
        title: "Web Development",
        icon: Globe,
        color: "text-blue-400",
        bg: "bg-blue-400/10",
        courses: 12,
        modules: 45,
        description: "Master HTML5, CSS3, JavaScript and modern frameworks like React and Next.js."
    },
    {
        title: "Mobile Development",
        icon: Smartphone,
        color: "text-amber-400",
        bg: "bg-amber-400/10",
        courses: 8,
        modules: 32,
        description: "Build cross-platform mobile apps using React Native and Flutter."
    },
    {
        title: "Backend & Systems",
        icon: Terminal,
        color: "text-green-400",
        bg: "bg-green-400/10",
        courses: 10,
        modules: 38,
        description: "Learn server-side programming, databases, and system architecture."
    },
    {
        title: "UI/UX Design",
        icon: Layers,
        color: "text-purple-400",
        bg: "bg-purple-400/10",
        courses: 6,
        modules: 24,
        description: "Fundamentals of design, color theory, typography, and prototyping."
    }
];

export default function Learn() {
    const [tutorials, setTutorials] = useState<Tutorial[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchTutorials();
    }, []);

    const fetchTutorials = async () => {
        try {
            const { data, error } = await supabase
                .from('tutorials')
                .select('*')
                .eq('is_active', true)
                .order('order_index', { ascending: true });

            if (error) throw error;
            setTutorials(data || []);
        } catch (error) {
            console.error('Error fetching tutorials:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            javascript: 'text-yellow-400 bg-yellow-400/10',
            react: 'text-blue-400 bg-blue-400/10',
            html: 'text-orange-400 bg-orange-400/10',
            css: 'text-purple-400 bg-purple-400/10',
            python: 'text-green-400 bg-green-400/10',
            typescript: 'text-blue-400 bg-blue-400/10'
        };
        return colors[category] || 'text-gray-400 bg-gray-400/10';
    };

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-8 bg-black text-white min-h-screen">
            <header className="mb-16 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[10px] font-bold uppercase tracking-widest">
                    <Zap size={12} /> Accelerated Learning
                </div>
                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
                    Level Up Your <span className="text-amber-400">Skills</span>
                </h1>
                <p className="text-gray-400 max-w-2xl text-lg">
                    Dive into our curated learning tracks designed to take you from beginner to professional.
                </p>
            </header>

            {/* Tutorials from Database */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="animate-spin text-amber-400" size={32} />
                </div>
            ) : tutorials.length > 0 ? (
                <section className="mb-20">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold">Tutorials</h2>
                        <span className="text-amber-400 text-sm font-bold">{tutorials.length} available</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tutorials.map((tutorial) => (
                            <Link
                                key={tutorial.id}
                                href={`/tutorial/${tutorial.slug}`}
                                className="group p-6 bg-gray-900/40 border border-gray-800 rounded-3xl hover:border-white/20 transition-all duration-500 cursor-pointer block"
                            >
                                <div className={`w-12 h-12 ${getCategoryColor(tutorial.category)} rounded-xl flex items-center justify-center mb-4`}>
                                    <Code size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-2 group-hover:text-amber-400 transition-colors">
                                    {tutorial.title}
                                </h3>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                    {tutorial.description}
                                </p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>{tutorial.content?.length || 0} lessons</span>
                                    <span className={`px-2 py-1 rounded-full ${getCategoryColor(tutorial.category)}`}>
                                        {tutorial.category}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                {tracks.map((track, index) => {
                    const Icon = track.icon;
                    return (
                        <div
                            key={index}
                            className="group p-8 bg-gray-900/40 border border-gray-800 rounded-3xl hover:border-white/20 transition-all duration-500 relative overflow-hidden"
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 ${track.bg} blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700`} />

                            <div className="relative space-y-6">
                                <div className={`w-14 h-14 ${track.bg} ${track.color} rounded-2xl flex items-center justify-center`}>
                                    <Icon size={28} />
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold">{track.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        {track.description}
                                    </p>
                                </div>

                                <div className="flex gap-6 text-xs font-bold text-gray-500 uppercase tracking-widest pt-4">
                                    <span>{track.courses} Courses</span>
                                    <span>{track.modules} Modules</span>
                                </div>

                                <button className="w-full py-4 bg-white/5 border border-white/10 rounded-xl font-bold group-hover:bg-white group-hover:text-black transition-all duration-300">
                                    Select Track
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <section className="space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Featured Resources</h2>
                    <button className="text-amber-400 text-sm font-bold hover:underline">View All</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { title: "React Roadmap 2026", type: "Roadmap", icon: BookOpen },
                        { title: "Zero to Deploy", type: "Video Course", icon: Video },
                        { title: "Clean Code Guide", type: "Article", icon: Code }
                    ].map((resource, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-gray-900/40 border border-gray-800 rounded-2xl hover:bg-gray-800/60 cursor-pointer transition-colors">
                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-amber-400">
                                <resource.icon size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-amber-400/60 font-bold uppercase tracking-widest">{resource.type}</p>
                                <h4 className="font-bold text-gray-200">{resource.title}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
