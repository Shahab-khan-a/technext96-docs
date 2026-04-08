"use client";

import { useState, useEffect, useRef } from "react";
import { searchDocs, SearchResult } from "@/lib/search";
import Link from "next/link";
import {
  Search, X, Loader2, FileText, Globe,
  LayoutGrid, Smartphone, ChevronDown,
  Zap, ArrowRight
} from "lucide-react";

const Navebar = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showDocsMenu, setShowDocsMenu] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const docsMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
      if (docsMenuRef.current && !docsMenuRef.current.contains(event.target as Node)) {
        setShowDocsMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        const results = await searchDocs(searchQuery);
        setSearchResults(results);
        setIsSearching(false);
        setShowResults(true);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const docCategories = [
    { title: "HTML & CSS", icon: Globe, path: "/docs/html", color: "text-blue-400", bg: "bg-blue-400/10" },
    { title: "JavaScript", icon: FileText, path: "/docs/javascript", color: "text-amber-400", bg: "bg-amber-400/10" },
    { title: "React", icon: LayoutGrid, path: "/docs/reactpage", color: "text-cyan-400", bg: "bg-cyan-400/10" },
    { title: "React Native", icon: Smartphone, path: "/docs/reactnative", color: "text-purple-400", bg: "bg-purple-400/10" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-400 mx-auto flex justify-between items-center p-4 px-4 sm:px-8">
        <div className="flex items-center gap-4 sm:gap-12">
          {/* Hamburger Menu (Mobile/Tablet) */}
          <button
            className="p-2 -ml-2 text-gray-400 hover:text-white lg:hidden"
            onClick={onMenuClick}
            aria-label="Toggle Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo Section */}
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-amber-400 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-black text-xl transition-transform group-hover:scale-110">
              S
            </div>
            <p className="text-xl font-bold text-white tracking-tight hidden xs:block">
              Dev<span className="text-amber-400">Doc</span>
            </p>
          </div>

          <nav className="hidden lg:flex items-center gap-4 relative" ref={docsMenuRef}>
            <button
              onClick={() => setShowDocsMenu(!showDocsMenu)}
              className={`px-5 py-2 text-sm font-semibold border rounded-lg transition-all flex items-center gap-2 ${showDocsMenu
                ? "bg-gray-900 border-amber-400 text-amber-400"
                : "border-gray-700 text-white hover:bg-gray-900"
                }`}
            >
              Docs
              <ChevronDown size={14} className={`transition-transform duration-300 ${showDocsMenu ? "rotate-180" : ""}`} />
            </button>

            {showDocsMenu && (
              <div className="absolute top-full left-0 mt-3 w-110 bg-gray-900/95 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-5 animate-in fade-in zoom-in-95 duration-200">
                <div className="grid grid-cols-2 gap-3">
                  {docCategories.map((cat, i) => (
                    <Link
                      key={i}
                      href={cat.path}
                      onClick={() => setShowDocsMenu(false)}
                      className="group flex flex-col p-4 rounded-xl border border-transparent hover:border-gray-700 hover:bg-white/5 transition-all"
                    >
                      <div className={`w-10 h-10 ${cat.bg} ${cat.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <cat.icon size={20} />
                      </div>
                      <p className="text-sm font-bold text-white mb-1">{cat.title}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">Explore Guides</p>
                    </Link>
                  ))}
                </div>
                <div className="mt-5 pt-5 border-t border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-400/10 flex items-center justify-center text-amber-400">
                      <Zap size={14} />
                    </div>
                    <p className="text-[10px] text-gray-500 font-medium tracking-tight">Access all our coding guides.</p>
                  </div>
                  <Link
                    href="/docs"
                    onClick={() => setShowDocsMenu(false)}
                    className="text-[11px] font-bold text-amber-400 hover:underline flex items-center gap-1"
                  >
                    View All <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4 sm:gap-8">
          <div className="relative group hidden md:block" ref={searchRef}>
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-amber-400">
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </div>
            <input
              placeholder="Search docs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
              className="bg-gray-900/50 border border-gray-800 focus:border-amber-400 w-64 pl-10 pr-4 py-2 rounded-xl text-sm text-gray-300 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-amber-400/30 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* Search Results Dropdown */}
            {showResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-60 max-h-96 overflow-y-auto custom-scrollbar">
                {searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map((result, index) => (
                      <Link
                        key={`${result.path}-${index}`}
                        href={result.path}
                        onClick={() => {
                          setShowResults(false);
                          setSearchQuery("");
                        }}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-gray-800/50 last:border-0"
                      >
                        <div className="mt-1">
                          {result.type === 'supabase' ? (
                            <Globe size={16} className="text-amber-400" />
                          ) : (
                            <FileText size={16} className="text-blue-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{result.title}</p>
                          {result.category && (
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">
                              {result.category}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-sm text-gray-500">No results found for "{searchQuery}"</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/learn"
              className="px-5 py-2 text-sm font-semibold border border-gray-700 text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              Learn
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navebar;
