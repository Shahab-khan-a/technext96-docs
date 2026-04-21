"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronRight, BookOpen } from "lucide-react";
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
        const { data: docs, error } = await supabase
          .from('docs')
          .select('id, title, category')
          .order('created_at', { ascending: false }) as { data: DynamicDoc[] | null; error: unknown };

        if (error) throw error;

        const allDocs = docs || [];
        setDynamicDocs(allDocs);

        const categories = Array.from(new Set(allDocs.map(d => d.category).filter((c): c is string => !!c)));

        const dynamicSections: Section[] = categories.map(cat => ({
          title: cat,
          items: allDocs
            .filter(d => d.category === cat)
            .map(d => ({
              name: d.title,
              path: `/docs/${d.id}`
            }))
        }));

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

    if (pathname.startsWith('/docs/') && !navGroups.some(g => g.sections.some(s => s.items.some(i => i.path === pathname)))) {
      setOpenGroup("Documentation");
    }
  }, [pathname, navGroups]);

  return (
    <div
      style={{ background: "#0d1117", borderRight: "1px solid #1e2a3a" }}
      className="w-full h-full overflow-y-auto flex flex-col pt-6 pb-20 custom-scrollbar"
    >
      <div className="px-6 mb-6">
        <h2 style={{ color: "#64748b", letterSpacing: "2px" }} className="text-[10px] font-bold uppercase mb-4">
          Documentation Hub
        </h2>
      </div>

      <div className="flex-1 px-3 space-y-4">
        {navGroups.map((group) => {
          const isGroupOpen = openGroup === group.title;
          const Icon = group.icon;

          return (
            <div key={group.title} className="space-y-1">
              <button
                onClick={() => setOpenGroup(isGroupOpen ? null : group.title)}
                style={isGroupOpen
                  ? { color: "#00d4ff", background: "rgba(0,212,255,0.06)", borderColor: "rgba(0,212,255,0.2)" }
                  : { color: "#64748b", borderColor: "transparent" }}
                className="flex items-center gap-3 w-full px-4 py-3 text-left rounded-xl transition-all group border hover:text-slate-200 hover:bg-white/5"
              >
                <Icon
                  size={18}
                  className={`${isGroupOpen ? "scale-110" : "group-hover:scale-110"} transition-transform`}
                />
                <span className="text-sm font-bold tracking-wide flex-1">{group.title}</span>
                <ChevronRight
                  size={14}
                  style={{ color: isGroupOpen ? "#00d4ff" : "#334155" }}
                  className={`transition-transform duration-300 ${isGroupOpen ? "rotate-90" : ""}`}
                />
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${isGroupOpen
                  ? "grid-rows-[1fr] opacity-100 mt-2"
                  : "grid-rows-[0fr] opacity-0"
                  }`}
              >
                <div style={{ borderLeft: "1px solid #1e2a3a" }} className="overflow-hidden space-y-1 ml-4 pl-2">
                  {group.sections.map((section) => {
                    const isSectionOpen = openSection === section.title;

                    return (
                      <div key={section.title} className="space-y-1">
                        <button
                          onClick={() => setOpenSection(isSectionOpen ? null : section.title)}
                          style={isSectionOpen
                            ? { color: "#e2e8f0", background: "rgba(255,255,255,0.04)" }
                            : { color: "#475569" }}
                          className="flex items-center justify-between w-full px-3 py-2 text-left rounded-lg transition-all hover:text-slate-300 hover:bg-white/5"
                        >
                          <span className="text-xs font-semibold">{section.title}</span>
                          <ChevronRight
                            size={12}
                            style={{ color: isSectionOpen ? "rgba(0,212,255,0.6)" : "#334155" }}
                            className={`transition-transform duration-300 ${isSectionOpen ? "rotate-90" : ""}`}
                          />
                        </button>

                        <div
                          className={`grid transition-all duration-300 ease-in-out ${isSectionOpen
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                            }`}
                        >
                          <div style={{ borderLeft: "1px solid rgba(30,42,58,0.5)" }} className="overflow-hidden ml-2 pl-3 space-y-0.5 my-1">
                            {section.items.map((item) => {
                              const isActive = pathname === item.path;
                              return (
                                <Link
                                  key={item.path}
                                  href={item.path}
                                  onClick={onItemClick}
                                  style={isActive
                                    ? { color: "#00d4ff", background: "rgba(0,212,255,0.06)" }
                                    : { color: "#475569" }}
                                  className="block px-3 py-1.5 rounded-md text-[13px] transition-all hover:text-slate-300"
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
