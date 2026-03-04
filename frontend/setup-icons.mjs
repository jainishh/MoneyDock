// One-time setup: node setup-icons.mjs
// Creates public/icons/ with PWA icons from tablogo.png

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const srcLogo = path.join(__dirname, 'src', 'assets', 'logo', 'tablogo.png');
const iconsDir = path.join(__dirname, 'public', 'icons');

if (!fs.existsSync(srcLogo)) {
    console.error('ERROR: tablogo.png not found at', srcLogo);
    process.exit(1);
}

if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
    console.log('Created', iconsDir);
}

const targets = [
    'icon-192x192.png',
    'icon-512x512.png',
    'apple-touch-icon.png',
];

for (const file of targets) {
    const dest = path.join(iconsDir, file);
    fs.copyFileSync(srcLogo, dest);
    console.log('Copied ->', dest);
}

console.log('\nDone! All PWA icons created.');
console.log('Now run: npm run build && npm run preview');
