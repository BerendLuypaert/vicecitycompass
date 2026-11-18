import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const htmlFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.html')) htmlFiles.push(full);
  }
}
walk(root);

const errors = [];
const seenTitles = new Map();
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const relative = path.relative(root, file).replaceAll('\\', '/');
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  const description = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)/i)?.[1];
  const canonical = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)/i)?.[1];
  const hasH1 = /<h1\b/i.test(html) || /data-guide=/i.test(html);
  if (!title) errors.push(`${relative}: missing title`);
  if (!description) errors.push(`${relative}: missing meta description`);
  if (!canonical || !canonical.startsWith('https://vicecitycompass.com/')) errors.push(`${relative}: invalid canonical`);
  if (!hasH1) errors.push(`${relative}: missing H1 or guide data fallback`);
  for (const match of html.matchAll(/<img\b([^>]*)>/gi)) {
    if (!/\balt\s*=/i.test(match[1])) errors.push(`${relative}: image missing alt`);
  }
  if (/<meta\s+name=["']robots["'][^>]*noindex/i.test(html)) errors.push(`${relative}: accidental noindex`);
  if (title) {
    const previous = seenTitles.get(title);
    if (previous) errors.push(`${relative}: duplicate title with ${previous}`);
    else seenTitles.set(title, relative);
  }
}

const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
for (const loc of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  const url = new URL(loc[1]);
  const local = url.pathname === '/' ? 'index.html' : url.pathname.replace(/^\//, '');
  if (!fs.existsSync(path.join(root, local))) errors.push(`sitemap points to missing file: ${local}`);
}
if (!fs.existsSync(path.join(root, 'robots.txt'))) errors.push('robots.txt missing');
if (!fs.readFileSync(path.join(root, 'robots.txt'), 'utf8').includes('Sitemap: https://vicecitycompass.com/sitemap.xml')) errors.push('robots.txt missing sitemap reference');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`SEO audit passed: ${htmlFiles.length} HTML pages, ${seenTitles.size} unique titles, sitemap and robots.txt valid.`);
