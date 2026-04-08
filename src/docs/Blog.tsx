"use client";

import React from "react";
import { Calendar, User, ArrowRight, MessageSquare, Heart } from "lucide-react";

const blogPosts = [
    {
        id: 1,
        title: "The Future of Web Development in 2026",
        excerpt: "Exploring the latest trends in AI-driven coding, edge computing, and the evolution of React...",
        author: "Admin",
        date: "March 12, 2026",
        category: "Technology",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
        likes: 124,
        comments: 18,
    },
    {
        id: 2,
        title: "Mastering TypeScript for Large Scale Apps",
        excerpt: "Advanced patterns and best practices for building robust, maintainable applications with TypeScript...",
        author: "Admin",
        date: "March 10, 2026",
        category: "Coding",
        image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=800&q=80",
        likes: 89,
        comments: 12,
    },
    {
        id: 3,
        title: "Design Systems: Consistency at Scale",
        excerpt: "How to build and maintain a design system that empowers your team to ship faster and better...",
        author: "Admin",
        date: "March 08, 2026",
        category: "Design",
        image: "https://images.unsplash.com/photo-1586717791821-3f44a563cc4c?auto=format&fit=crop&w=800&q=80",
        likes: 56,
        comments: 7,
    }
];

export default function Blog() {
    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-8 bg-black text-white min-h-screen">
            <header className="mb-16 text-center space-y-4">
                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
                    Our <span className="text-amber-400">Blog</span>
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                    Insights, tutorials, and updates from the DevDoc team. Stay ahead with the latest in tech.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post) => (
                    <article
                        key={post.id}
                        className="group relative bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden hover:border-amber-400/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(251,191,36,0.1)]"
                    >
                        {/* Image Placeholder replacement */}
                        <div className="h-48 w-full bg-gray-800 overflow-hidden relative">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute top-4 left-4 bg-amber-400 text-black text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                                {post.category}
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                    <Calendar size={12} /> {post.date}
                                </span>
                                <span className="flex items-center gap-1">
                                    <User size={12} /> {post.author}
                                </span>
                            </div>

                            <h2 className="text-xl font-bold group-hover:text-amber-400 transition-colors">
                                {post.title}
                            </h2>

                            <p className="text-gray-400 text-sm line-clamp-3">
                                {post.excerpt}
                            </p>

                            <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
                                <div className="flex items-center gap-4 text-gray-500 text-xs font-medium">
                                    <span className="flex items-center gap-1 group-hover:text-white transition-colors">
                                        <Heart size={14} className="text-gray-600 group-hover:text-red-500" /> {post.likes}
                                    </span>
                                    <span className="flex items-center gap-1 group-hover:text-white transition-colors">
                                        <MessageSquare size={14} className="text-gray-600 group-hover:text-amber-400" /> {post.comments}
                                    </span>
                                </div>
                                <button className="text-amber-400 font-bold text-xs flex items-center gap-1 hover:translate-x-1 transition-transform">
                                    Read More <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            <div className="mt-20 p-12 bg-linear-to-r from-amber-400/10 via-transparent to-transparent rounded-3xl border border-amber-400/10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Subscribe to our newsletter</h2>
                    <p className="text-gray-400">Get the latest posts delivered straight to your inbox.</p>
                </div>
                <div className="flex w-full md:w-auto gap-3">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="bg-black/50 border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 flex-1 md:w-64"
                    />
                    <button className="bg-amber-400 text-black px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-transform active:scale-95">
                        Join Now
                    </button>
                </div>
            </div>
        </div>
    );
}
