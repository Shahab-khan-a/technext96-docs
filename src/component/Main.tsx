"use client";

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase, slugify } from '@/lib/supabase';
import DynamicDocViewer from './DynamicDocViewer';
import Learn from "@/docs/Learn";

interface Doc {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
}

interface MainProps {
  initialDoc?: Doc | null;
  slug?: string;
}

export const Main = ({ initialDoc = null, slug: initialSlug }: MainProps) => {
  const pathname = usePathname();
  const [dynamicDoc, setDynamicDoc] = useState<Doc | null>(initialDoc || null);
  const [isLoading, setIsLoading] = useState(!initialDoc);

  useEffect(() => {
    if (initialDoc) {
      setDynamicDoc(initialDoc);
      setIsLoading(false);
      return;
    }

    const fetchDynamicDoc = async () => {
      const pathParts = pathname.split('/');
      const isRoot = pathname === '/docs' || pathname === '/' || pathname === '';
      const currentSlug = isRoot ? 'getting-started' : slugify(decodeURIComponent(pathParts[2]));

      if (isRoot || (pathParts.length === 3 && pathParts[1] === 'docs')) {
        setIsLoading(true);
        try {
          const { data: allDocs } = await supabase
            .from('docs')
            .select('id, title') as { data: { id: string; title: string }[] | null };

          const matchedDoc = allDocs?.find(d => slugify(d.title) === currentSlug);

          if (matchedDoc) {
            const { data } = await supabase
              .from('docs')
              .select('*')
              .eq('id', matchedDoc.id)
              .maybeSingle();
            setDynamicDoc(data || null);
          } else if (!isRoot) {
            const { data: idData } = await supabase
              .from('docs')
              .select('*')
              .eq('id', decodeURIComponent(pathParts[2]))
              .maybeSingle();
            setDynamicDoc(idData || null);
          } else {
            setDynamicDoc(null);
          }
        } catch (err) {
          console.error("Error fetching doc:", err);
          setDynamicDoc(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        setDynamicDoc(null);
        setIsLoading(false);
      }
    };

    fetchDynamicDoc();
  }, [pathname, initialDoc]);

  if (dynamicDoc) {
    return (
      <div className='w-full'>
        <DynamicDocViewer doc={dynamicDoc} isLoading={isLoading} />
      </div>
    );
  }

  if (pathname === '/learn') {
    return <div className='w-full p-8'><Learn /></div>;
  }

  // Default Landing (no Getting Started doc yet)
  if (pathname === '/docs' || pathname === '/' || pathname === '') {
    return (
      <div style={{ background: "#0d1117" }} className="w-full p-12 text-center py-20 min-h-screen">
        <h1 className="text-4xl font-bold text-white mb-6">Welcome to Documentation</h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed mb-8">
          All documentation is dynamically managed. Create a document titled{' '}
          <strong className="text-white">&quot;Getting Started&quot;</strong> in your Admin Panel to replace this page.
        </p>
        <div className="flex justify-center">
          <div
            style={{ background: "#00d4ff", color: "#0d1117", boxShadow: "0 12px 30px rgba(0,212,255,0.25)" }}
            className="px-8 py-4 font-black rounded-2xl active:scale-95 transition-all"
          >
            Managed via Admin Panel
          </div>
        </div>
      </div>
    );
  }

  // Loading
  if (isLoading) {
    return (
      <div style={{ background: "#0d1117" }} className="w-full h-screen flex items-center justify-center">
        <div style={{ color: "#00d4ff" }} className="animate-pulse font-bold">Loading guide...</div>
      </div>
    );
  }

  // Not Found
  return (
    <div style={{ background: "#0d1117" }} className="w-full p-8 text-center py-20 min-h-screen">
      <h2 className="text-2xl font-bold text-white mb-4">Document Not Found</h2>
      <p className="text-slate-400">Please select a valid guide from the sidebar.</p>
    </div>
  );
};
