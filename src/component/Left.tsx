"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronRight, Briefcase, LayoutGrid, BookOpen } from "lucide-react";
import { supabase } from "@/lib/supabase";

import { groups as initialGroups } from "@/config/docs";
import type { Group, Section, Item } from "@/config/docs";

interface DynamicDoc {
  id: string;
  title: string;
  category?: string;
}

export default function Left({
  onItemClick,
}: {
  onItemClick?: () => void;
}) {
  const pathname = usePathname();
  const [openGroup, setOpenGroup] = useState<string | null>("Documentation");
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [dynamicDocs, setDynamicDocs] = useState<DynamicDoc[]>([]);
  const [navGroups, setNavGroups] = useState(initialGroups);

  useEffect(() => {
    const fetchDynamicDocs = async () => {
      try {
        // Fetch ALL documents to build the navigation
        const { data: docs, error } = await supabase
          .from('docs')
          .select('id, title, category')
          .order('created_at', { ascending: false }) as { data: DynamicDoc[] | null; error: unknown };

        if (error) throw error;
        
        const allDocs = docs || [];
        setDynamicDocs(allDocs);

        // Get unique categories from the docs
        const categories = Array.from(new Set(allDocs.map(d => d.category).filter((c): c is string => !!c)));

        // Build sections based on categories found in Supabase
        const dynamicSections: Section[] = categories.map(cat => ({
          title: cat,
          items: allDocs
            .filter(d => d.category === cat)
            .map(d => ({
              name: d.title,
              path: `/docs/${d.id}`
            }))
        }));

        // Update navigation to only show dynamic content
        setNavGroups([
          {
            title: "Documentation",
            icon: BookOpen,
            sections: dynamicSections
          }
        ]);
        
      } catch (err) {
        console.error("Error fetching dynamic docs for sidebar:", err instanceof Error ? err.message : JSON.stringify(err));
      }
    };

    fetchDynamicDocs();

    // Subscribe to changes
    const channel1 = supabase
      .channel('sidebar-docs-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'docs' }, () => {
        fetchDynamicDocs();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel1);
    };
  }, []);

  useEffect(() => {
    let foundGroup = null;
    let foundSection = null;

    for (const group of navGroups) {
      for (const section of group.sections) {
        if (section.items.some((item) => item.path === pathname)) {
          foundGroup = group.title;
          foundSection = section.title;
          break;
        }
      }
      if (foundGroup) break;
    }

    if (foundGroup) setOpenGroup(foundGroup);
    if (foundSection) setOpenSection(foundSection);

    // If it's a dynamic doc, open Service group
    if (pathname.startsWith('/docs/') && !navGroups.some(g => g.sections.some(s => s.items.some(i => i.path === pathname)))) {
      setOpenGroup("Service");
      setOpenSection("Published Docs");
    }
  }, [pathname]);

  return (
    <div className="w-full h-full overflow-y-auto bg-black border-r border-gray-800 flex flex-col pt-6 pb-20 custom-scrollbar">
      <div className="px-6 mb-6">
        <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-[2px] mb-4">
          Documentation Hub
        </h2>
      </div>

      <div className="flex-1 px-3 space-y-4">
        {navGroups.map((group) => {
          const isGroupOpen = openGroup === group.title;
          const Icon = group.icon;

          return (
            <div key={group.title} className="space-y-1">
              {/* Group Header Button */}
              <button
                onClick={() => setOpenGroup(isGroupOpen ? null : group.title)}
                className={`flex items-center gap-3 w-full px-4 py-3 text-left rounded-xl transition-all group border ${isGroupOpen
                  ? "text-amber-400 bg-amber-400/5 border-amber-400/20 shadow-[0_0_20px_rgba(251,191,36,0.05)]"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-900 border-transparent"
                  }`}
              >
                <Icon
                  size={18}
                  className={`${isGroupOpen ? "scale-110 text-amber-400" : "group-hover:scale-110"
                    } transition-transform`}
                />
                <span className="text-sm font-bold tracking-wide flex-1">{group.title}</span>
                <ChevronRight
                  size={14}
                  className={`transition-transform duration-300 ${isGroupOpen ? "rotate-90 text-amber-400" : "text-gray-600"
                    }`}
                />
              </button>

              {/* Nested Sections */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${isGroupOpen
                  ? "grid-rows-[1fr] opacity-100 mt-2"
                  : "grid-rows-[0fr] opacity-0"
                  }`}
              >
                <div className="overflow-hidden space-y-1 ml-4 border-l border-gray-800/50 pl-2">
                  {group.sections.map((section) => {
                    const isSectionOpen = openSection === section.title;

                    return (
                      <div key={section.title} className="space-y-1">
                        <button
                          onClick={() =>
                            setOpenSection(isSectionOpen ? null : section.title)
                          }
                          className={`flex items-center justify-between w-full px-3 py-2 text-left rounded-lg transition-all ${isSectionOpen
                            ? "text-white bg-gray-900/40"
                            : "text-gray-500 hover:text-gray-300 hover:bg-gray-900/20"
                            }`}
                        >
                          <span className="text-xs font-semibold">{section.title}</span>
                          <ChevronRight
                            size={12}
                            className={`transition-transform duration-300 ${isSectionOpen ? "rotate-90 text-amber-500/70" : "text-gray-700"
                              }`}
                          />
                        </button>

                        {/* Items */}
                        <div
                          className={`grid transition-all duration-300 ease-in-out ${isSectionOpen
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                            }`}
                        >
                          <div className="overflow-hidden ml-2 border-l border-gray-800/30 pl-3 space-y-0.5 my-1">
                            {section.items.map((item) => {
                              const isActive = pathname === item.path;
                              return (
                                <Link
                                  key={item.path}
                                  href={item.path}
                                  onClick={onItemClick}
                                  className={`block px-3 py-1.5 rounded-md text-[13px] transition-all ${isActive
                                    ? "text-amber-400 bg-amber-400/5 font-medium"
                                    : "text-gray-500 hover:text-gray-300"
                                    }`}
                                >
                                  {item.name}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
