export type BlockType = 'text' | 'code' | 'title';

export interface DocBlock {
    type: BlockType;
    content: string;
}

/**
 * Parses a combined documentation content string into individual blocks.
 * Recognizes "## " for titles and "```" for code blocks.
 */
export function parseDocContent(content: string): DocBlock[] {
    if (!content) return [];

    const blocks: DocBlock[] = [];
    const lines = content.split('\n');
    let currentTextBlockLines: string[] = [];
    let isInCodeBlock = false;
    let currentCodeBlockLines: string[] = [];

    const flushTextBlock = () => {
        if (currentTextBlockLines.length > 0) {
            const trimmed = currentTextBlockLines.join('\n').trim();
            if (trimmed) {
                blocks.push({
                    type: 'text',
                    content: trimmed
                });
            }
            currentTextBlockLines = [];
        }
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Code Block Toggle
        if (line.trim().startsWith('```')) {
            if (isInCodeBlock) {
                // Terminate code block
                blocks.push({
                    type: 'code',
                    content: currentCodeBlockLines.join('\n').trim()
                });
                currentCodeBlockLines = [];
                isInCodeBlock = false;
            } else {
                // Start code block (flush pending text first)
                flushTextBlock();
                isInCodeBlock = true;
            }
            continue;
        }

        if (isInCodeBlock) {
            currentCodeBlockLines.push(line);
            continue;
        }

        // Title Handling
        if (line.startsWith('## ')) {
            flushTextBlock();
            blocks.push({
                type: 'title',
                content: line.replace('## ', '').trim()
            });
            continue;
        }

        // Standard Text Handling
        if (line.trim() === '') {
            if (currentTextBlockLines.length > 0) {
                currentTextBlockLines.push(line);
            }
            continue;
        }

        currentTextBlockLines.push(line);
    }

    // Capture any trailing text
    flushTextBlock();

    return blocks;
}
