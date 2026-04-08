import * as dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(__dirname, '../.env.local') });

import { createClient } from '@supabase/supabase-js';
import TurndownService from 'turndown';
import React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { JSDOM } from 'jsdom';

// Setup basic JSDOM window for Turndown
const dom = new JSDOM();
(global as any).document = dom.window.document;

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase variables in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

import HTMLDoc from '../src/docs/HTML';
import CSSDoc from '../src/docs/CSS';
import JSDoc from '../src/docs/JavaScript';
import JSBasicsDoc from '../src/docs/JavaScriptBasics';
import ReactBasicsDoc from '../src/docs/ReactBasics';
import ReactAdvancedDoc from '../src/docs/ReactAdvanced';
import ReactNativeBasicsDoc from '../src/docs/ReactNativeBasics';
import ReactNativeDoc from '../src/docs/ReactNative';

const docsToMigrate = [
    { component: HTMLDoc, title: 'HTML', category: 'HTML' },
    { component: CSSDoc, title: 'CSS', category: 'CSS' },
    { component: JSBasicsDoc, title: 'JavaScript Basics', category: 'JavaScript' },
    { component: JSDoc, title: 'JavaScript Advanced', category: 'JavaScript' },
    { component: ReactBasicsDoc, title: 'React Basics', category: 'React' },
    { component: ReactAdvancedDoc, title: 'React Advanced', category: 'React' },
    { component: ReactNativeBasicsDoc, title: 'React Native Basics', category: 'React Native' },
    { component: ReactNativeDoc, title: 'React Native Advanced', category: 'React Native' }
];

const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced'
});

async function migrate() {
    for (const doc of docsToMigrate) {
        console.log(`Migrating ${doc.title}...`);
        try {
            const htmlString = ReactDOMServer.renderToStaticMarkup(React.createElement(doc.component));
            let markdownContent = turndownService.turndown(htmlString);
            
            // Basic cleanup of markdown artifact parsing
            markdownContent = markdownContent.replace(/\\_/g, '_');
            markdownContent = markdownContent.replace(/\\\[/g, '[');
            markdownContent = markdownContent.replace(/\\\]/g, ']');
            markdownContent = markdownContent.replace(/\\\*/g, '*');
            markdownContent = markdownContent.replace(/\0/g, ''); // Fix invalid json error

            // Find existing doc
            const { data: existing } = await supabase.from('docs').select('id').eq('title', doc.title).maybeSingle();

            if (existing) {
                 const { error } = await supabase.from('docs').update({
                    content: markdownContent,
                    category: doc.category,
                 }).eq('id', existing.id);
                 if (error) {
                    console.error(`Failed to update ${doc.title}:`, error.message);
                 } else {
                    console.log(`Successfully updated ${doc.title}.`);
                 }
            } else {
                const { error } = await supabase.from('docs').insert([
                    {
                        title: doc.title,
                        content: markdownContent,
                        category: doc.category,
                        status: 'published'
                    }
                ]);

                if (error) {
                    console.error(`Failed to insert ${doc.title}:`, error.message);
                } else {
                    console.log(`Successfully migrated ${doc.title}.`);
                }
            }
        } catch (e) {
            console.error(`Error processing ${doc.title}:`, e);
        }
    }
}

migrate();
