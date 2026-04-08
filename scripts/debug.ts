import * as dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(__dirname, '../.env.local') });

import { createClient } from '@supabase/supabase-js';
import TurndownService from 'turndown';
import React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { JSDOM } from 'jsdom';

const dom = new JSDOM();
(global as any).document = dom.window.document;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

import JSDoc from '../src/docs/JavaScript';

const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced'
});

async function debug() {
    const htmlString = ReactDOMServer.renderToStaticMarkup(React.createElement(JSDoc));
    let markdownContent = turndownService.turndown(htmlString);
            
    markdownContent = markdownContent.replace(/\\_/g, '_');
    markdownContent = markdownContent.replace(/\\\[/g, '[');
    markdownContent = markdownContent.replace(/\\\]/g, ']');
    markdownContent = markdownContent.replace(/\\*/g, '*');

    console.log("MARKDOWN LENGTH:", markdownContent.length);

    const { data: existing, error: selError } = await supabase.from('docs').select('*').eq('title', 'JavaScript Advanced').maybeSingle();
    console.log("EXISTING:", existing?.id, existing?.title, "ERR:", selError);
    
    // Test simple insert vs update
    const { error: insertError } = await supabase.from('docs').insert([
        {
            title: 'TEST_JS_ADV',
            content: markdownContent,
            category: 'JavaScript',
            status: 'published'
        }
    ]);
    console.log("INSERT ERROR:", insertError);
}

debug().then(() => process.exit(0));
