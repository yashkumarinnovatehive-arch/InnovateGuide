const fs = require('fs');
const path = require('path');

function replaceInFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            replaceInFiles(filePath);
        } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
            let content = fs.readFileSync(filePath, 'utf-8');
            let updated = false;

            // Since Input, Textarea, and Select components now have 'bg-[var(--color-input-bg)]'
            // We want to remove the 'bg-[var(--color-bg0)]/60' completely from the passed className overrides.
            // If we replace it with empty string, the base component's background takes effect.
            
            // Wait, what if it's used on a div like TabsList? 
            // In ProjectDetailPage: `<TabsList className="... bg-[var(--color-bg0)]/60 ...">`
            // If we replace it with `bg-[var(--color-input-bg)]`, it works well for inputs and tabs!
            
            if (content.includes('bg-[var(--color-bg0)]/60')) {
                content = content.replace(/bg-\[var\(--color-bg0\)\]\/60/g, 'bg-[var(--color-input-bg)]');
                updated = true;
            }
            if (content.includes('bg-[var(--color-bg0)]/40')) {
                content = content.replace(/bg-\[var\(--color-bg0\)\]\/40/g, 'bg-[var(--color-input-bg)]');
                updated = true;
            }
            // Let's also remove border overrides to let components use their own border.
            // Actually, just replacing the invalid bg class is enough to fix the white background issue.

            if (updated) {
                fs.writeFileSync(filePath, content, 'utf-8');
                console.log('Updated', filePath);
            }
        }
    }
}

replaceInFiles('./src');
