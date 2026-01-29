import fs from 'fs';
import path from 'path';

const i18nPath = 'g:/my projects/vero-egypt-elegance-main/veroegyptclean/src/lib/i18n.ts';

// Simple parser to extract resources from i18n.ts
const i18nContent = fs.readFileSync(i18nPath, 'utf8');

// Use regex to find the start of resources
const enStartMatch = i18nContent.match(/en: \{/);
const arStartMatch = i18nContent.match(/ar: \{/);

function getNestedKeys(obj, prefix = '') {
    let keys = [];
    for (const key in obj) {
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            keys = keys.concat(getNestedKeys(obj[key], prefix + key + '.'));
        } else {
            keys.push(prefix + key);
        }
    }
    return keys;
}

// Since I can't easily parse the TS object without a proper evaluator, 
// I'll use a simpler approach: finding all strings that look like keys.
// But better yet, I'll just look for t('...') in the codebase and see if they are in the file.

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (['node_modules', '.git', 'dist', 'build'].includes(f)) return;
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

const keysUsed = new Set();
walkDir('g:/my projects/vero-egypt-elegance-main/veroegyptclean/src', (filePath) => {
    if (!['.tsx', '.ts'].includes(path.extname(filePath))) return;
    const content = fs.readFileSync(filePath, 'utf8');
    // Match t('key') or t("key") or t(`key`)
    const matches = content.matchAll(/t\(['"`]([a-zA-Z0-9._-]+)['"`](?:,.*)?\)/g);
    for (const match of matches) {
        keysUsed.add(match[1]);
    }
    // Also match dynamic keys like t(`faq.items.${item}.q`)
    // These are harder to catch with regex.
});

console.log('--- Keys Used in Code ---');
const sortedKeys = Array.from(keysUsed).sort();
sortedKeys.forEach(k => {
    // Check if key exists in i18nContent as a quoted property or key
    const keyExists = i18nContent.includes(` ${k.split('.').pop()}: `) || i18nContent.includes(`'${k.split('.').pop()}': `);
    // This is a loose check but better than nothing.
    if (!keyExists) {
        console.log(`MISSING? ${k}`);
    }
});
