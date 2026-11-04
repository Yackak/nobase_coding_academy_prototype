import { readFile, writeFile, rm } from 'node:fs/promises';
import { render } from '../.ssr/entry-server.js';
const html = await readFile('dist/index.html', 'utf8');
if (!html.includes('<!--app-html-->')) throw new Error('Prerender placeholder missing');
await writeFile('dist/index.html', html.replace('<!--app-html-->', render()));
await rm('.ssr', { recursive: true, force: true });
console.log('Pre-rendered complete Korean content for GitHub Pages.');
