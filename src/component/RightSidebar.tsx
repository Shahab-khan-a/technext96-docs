"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { docsConfig } from "@/config/docs";
import { supabase, slugify } from "@/lib/supabase";

interface NavItem {
    name: string;
    href: string;
}

interface DocConfig {
    title: string;
    sections: NavItem[];
}

export default function RightSidebar({ onItemClick }: { onItemClick?: () => void }) {
    const pathname = usePathname();
    const [activeId, setActiveId] = useState<string>("");
    const [dynamicConfig, setDynamicConfig] = useState<DocConfig | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const staticConfig = docsConfig[pathname];

    useEffect(() => {
        setDynamicConfig(null);
        setActiveId("");

        const fetchDynamicNav = async () => {
            const pathParts = pathname.split('/');

            if (pathParts.length === 3 && pathParts[1] === 'docs' && !staticConfig) {
                const docId = decodeURIComponent(pathParts[2]);
                setIsLoading(true);
                try {
                    const { data } = await supabase
                        .from('docs')
                        .select('title, content')
                        .eq('id', docId)
                        .maybeSingle() as { data: { title: string; content: string } | null };

                    if (data && data.content) {
                        setDynamicConfig({ title: data.title, sections: [] });

                        const buildSections = (attempt = 0) => {
                            setTimeout(() => {
                                const article = document.querySelector('.ql-editor-view');
                                if (!article && attempt < 10) return buildSections(attempt + 1);
                                if (!article) return;

                                const headings = Array.from(article.querySelectorAll('h2, h3'));
                                if (headings.length === 0 && attempt < 10) return buildSections(attempt + 1);

                                const usedIds = new Set<string>();
                                const sections = headings.map(h => {
                                    const heading = h as HTMLElement;
                                    const text = heading.textContent?.trim() || '';
                                    let baseId = slugify(text);
                                    let finalId = baseId;
                                    let counter = 1;
                                    while (usedIds.has(finalId)) { finalId = `${baseId}-${counter++}`; }
                                    usedIds.add(finalId);
                                    return { name: text, href: `#${finalId}` };
                                }).filter(s => s.name && s.href !== '#');

                                setDynamicConfig({ title: data.title, sections });
                            }, 200);
                        };
                        buildSections();
                    } else {
                        setDynamicConfig(null);
                    }
                } catch (err) {
                    console.error("Error fetching dynamic doc for sidebar:", err);
                    setDynamicConfig(null);
                } finally {
                    setIsLoading(false);
                }
            } else if (pathname === '/docs' || pathname === '/service') {
                setIsLoading(true);
                try {
                    const { data } = await supabase
                        .from('docs')
                        .select('id, title')
                        .order('created_at', { ascending: false }) as { data: { id: string; title: string }[] | null };

                    if (data) {
                        setDynamicConfig({
                            title: "On This Page",
                            sections: data.map(doc => ({ name: doc.title, href: `#doc-${doc.id}` }))
                        });
                    }
                } catch (err) {
                    console.error("Error fetching doc list for sidebar:", err);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setDynamicConfig(null);
            }
        };

        fetchDynamicNav();
    }, [pathname, staticConfig]);

    const currentConfig = dynamicConfig || staticConfig || (docsConfig && docsConfig["/docs/GettingStarted"]) || { title: "Documentation", sections: [] };
    const navItems = (currentConfig && currentConfig.sections) ? currentConfig.sections : [];

    useEffect(() => {
        if (!navItems || navItems.length === 0) return;

        let observer: IntersectionObserver | null = null;
        let retryCount = 0;
        const maxRetries = 10;
        const visibleElements = new Set<string>();

        const connectObserver = () => {
            const observerOptions = { root: null, rootMargin: "-80px 0px -70% 0px", threshold: 0 };

            const handleIntersect = (entries: IntersectionObserverEntry[]) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) { visibleElements.add(entry.target.id); }
                    else { visibleElements.delete(entry.target.id); }
                });

                if (visibleElements.size > 0) {
                    const sorted = Array.from(visibleElements)
                        .map(id => ({ id, rect: document.getElementById(id)?.getBoundingClientRect() }))
                        .filter(item => item.rect)
                        .sort((a, b) => (a.rect?.top || 0) - (b.rect?.top || 0));

                    if (sorted.length > 0) setActiveId(sorted[0].id);
                }
            };

            if (observer) observer.disconnect();
            observer = new IntersectionObserver(handleIntersect, observerOptions);

            let observedCount = 0;
            navItems.forEach((item) => {
                const element = document.getElementById(item.href.substring(1));
                if (element) { observer?.observe(element); observedCount++; }
            });

            if (observedCount < navItems.length && retryCount < maxRetries) {
                retryCount++;
                setTimeout(connectObserver, 500);
            }
        };

        connectObserver();
        return () => { observer?.disconnect(); };
    }, [pathname, navItems]);

    return (
        <div
            style={{ background: "#0d1117", borderLeft: "1px solid #1e2a3a" }}
            className="w-full h-full p-6 flex flex-col"
        >
            <div className="mb-8">
                <h2 style={{ color: "#64748b", letterSpacing: "0.15em" }} className="text-xs font-semibold uppercase mb-6 px-3">
                    {isLoading ? "Loading..." : (currentConfig.title === "Getting Started" ? "On This Page" : currentConfig.title)}
                </h2>
                <nav className="space-y-1">
                    {navItems.map((item, index) => {
                        const targetId = item.href.substring(1);
                        const isActive = activeId === targetId;
                        return (
                            <a
                                key={`${item.href}-${index}`}
                                href={item.href}
                                onClick={(e) => {
                                    setActiveId(targetId);
                                    if (onItemClick) onItemClick();
                                    const element = document.getElementById(targetId);
                                    if (element) {
                                        e.preventDefault();
                                        element.scrollIntoView({ behavior: 'smooth' });
                                        window.history.pushState(null, '', item.href);
                                    }
                                }}
                                style={isActive
                                    ? {
                                        color: "#00d4ff",
                                        background: "rgba(0,212,255,0.06)",
                                        boxShadow: "inset 0 0 0 1px rgba(0,212,255,0.15)"
                                      }
                                    : { color: "#64748b" }}
                                className="group flex items-center px-4 py-2.5 text-sm transition-all duration-200 rounded-xl active:scale-[0.97] hover:text-white hover:bg-white/5"
                            >
                                <span
                                    style={isActive
                                        ? { background: "#00d4ff", boxShadow: "0 0 8px rgba(0,212,255,0.6)" }
                                        : { background: "#1e2a3a" }}
                                    className={`w-2 h-2 rounded-full mr-3 transition-all duration-500 ${isActive ? "scale-100" : "scale-50 group-hover:scale-75 group-hover:!bg-slate-500"}`}
                                />
                                <span className="truncate">{item.name}</span>
                            </a>
                        );
                    })}
                    {!isLoading && navItems.length === 0 && (
                        <p style={{ color: "#334155" }} className="px-3 text-xs italic">No navigation items found.</p>
                    )}
                </nav>
            </div>

            <div style={{ borderTop: "1px solid #1e2a3a" }} className="mt-auto pt-8">
                <div
                    style={{
                        background: "linear-gradient(135deg, rgba(0,212,255,0.06), transparent)",
                        border: "1px solid rgba(0,212,255,0.1)"
                    }}
                    className="p-4 rounded-2xl"
                >
                    <p style={{ color: "rgba(0,212,255,0.5)" }} className="text-xs leading-relaxed font-medium">
                        Need help? Check our community forums or contact support.
                    </p>
                </div>
            </div>
        </div>
    );
}
