"use client";

import React, { useState } from "react";
import { Send, Star, MessageSquare, ThumbsUp, CheckCircle } from "lucide-react";

export default function Feedback() {
    const [submitted, setSubmitted] = useState(false);
    const [rating, setRating] = useState(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="max-w-4xl mx-auto p-8 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in zoom-in duration-500">
                <div className="w-20 h-20 bg-amber-400 rounded-full flex items-center justify-center text-black">
                    <CheckCircle size={40} />
                </div>
                <h2 className="text-3xl font-bold">Thank You!</h2>
                <p className="text-gray-400 max-w-md">
                    Your feedback has been received. We appreciate you taking the time to help us improve DevDoc.
                </p>
                <button
                    onClick={() => setSubmitted(false)}
                    className="text-amber-400 font-bold hover:underline"
                >
                    Send another response
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-black text-white min-h-screen">
            <header className="mb-12 space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight">
                    Help Us <span className="text-amber-400">Improve</span>
                </h1>
                <p className="text-gray-400 text-lg">
                    We value your feedback. Tell us what you think about the documentation, features, or any bugs you've encountered.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="p-6 bg-gray-900/40 border border-gray-800 rounded-2xl space-y-3">
                    <ThumbsUp className="text-amber-400" size={24} />
                    <h3 className="font-bold">General Feedback</h3>
                    <p className="text-xs text-gray-500">Share your overall experience with our platform.</p>
                </div>
                <div className="p-6 bg-gray-900/40 border border-gray-800 rounded-2xl space-y-3">
                    <MessageSquare className="text-blue-400" size={24} />
                    <h3 className="font-bold">Feature Request</h3>
                    <p className="text-xs text-gray-500">Suggest new features you'd like to see implemented.</p>
                </div>
                <div className="p-6 bg-gray-900/40 border border-gray-800 rounded-2xl space-y-3">
                    <Star className="text-purple-400" size={24} />
                    <h3 className="font-bold">Bug Report</h3>
                    <p className="text-xs text-gray-500">Report errors or inconsistencies in the system.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-gray-900/20 border border-gray-800 p-8 rounded-3xl space-y-8 backdrop-blur-sm">
                <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-300 block">How would you rate your experience?</label>
                    <div className="flex gap-4">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => setRating(s)}
                                className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${rating >= s
                                        ? "bg-amber-400/20 border-amber-400 text-amber-400 scale-110"
                                        : "bg-gray-900 border-gray-800 text-gray-600 hover:border-gray-600"
                                    }`}
                            >
                                <Star size={20} fill={rating >= s ? "currentColor" : "none"} />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300">Name</label>
                        <input
                            required
                            placeholder="Your name"
                            className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300">Email</label>
                        <input
                            required
                            type="email"
                            placeholder="your@email.com"
                            className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-300">Message</label>
                    <textarea
                        required
                        rows={5}
                        placeholder="Tell us what's on your mind..."
                        className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-all resize-none"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-amber-400 text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(251,191,36,0.2)]"
                >
                    Submit Feedback <Send size={18} />
                </button>
            </form>
        </div>
    );
}
