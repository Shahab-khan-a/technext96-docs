import { LayoutGrid } from "lucide-react";

export type Item = {
    name: string;
    path: string;
};

export type Section = {
    title: string;
    items: Item[];
};

export type Group = {
    title: string;
    icon: any;
    sections: Section[];
};

// All documentation is now fetched dynamically from Supabase.
// This file is kept only for the base structure.
export const groups: Group[] = [
    {
        title: "Documentation",
        icon: LayoutGrid,
        sections: []
    }
];

export const docsConfig: Record<string, { title: string; sections: { name: string; href: string }[] }> = {};
