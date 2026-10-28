// Writes static HTML for each route after `vite build`, so the homepage and the
// case study have real content and their own metadata without running JS.
// Run via `npm run build`.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const { render, routes } = await import(pathToFileURL(path.join(root, "dist-ssr", "entry-server.js")).href);
const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");

const escapeAttr = (value) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");

const setTag = (html, pattern, replacement) => {
  if (!pattern.test(html)) throw new Error(`prerender: tag not found in template: ${pattern}`);
  return html.replace(pattern, replacement);
};

const applyMeta = (html, meta) => {
  const t = escapeAttr(meta.title);
  const d = escapeAttr(meta.description);
  let out = html;
  out = setTag(out, /<title>[^<]*<\/title>/, `<title>${t}</title>`);
  out = setTag(out, /<meta\s+name="description"[^>]*>/, `<meta name="description" content="${d}" />`);
  out = setTag(out, /<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${meta.canonical}" />`);
  out = setTag(out, /<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${meta.canonical}" />`);
  out = setTag(out, /<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${t}" />`);
  out = setTag(out, /<meta\s+property="og:description"[^>]*>/, `<meta property="og:description" content="${d}" />`);
  out = setTag(out, /<meta property="og:image" [^>]*>/, `<meta property="og:image" content="${meta.image}" />`);
  out = setTag(out, /<meta property="og:image:alt"[^>]*>/, `<meta property="og:image:alt" content="${escapeAttr(meta.imageAlt)}" />`);
  out = setTag(out, /<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${t}" />`);
  out = setTag(out, /<meta\s+name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${d}" />`);
  out = setTag(out, /<meta name="twitter:image" [^>]*>/, `<meta name="twitter:image" content="${meta.image}" />`);
  out = setTag(out, /<meta name="twitter:image:alt"[^>]*>/, `<meta name="twitter:image:alt" content="${escapeAttr(meta.imageAlt)}" />`);
  return out;
};

for (const meta of Object.values(routes)) {
  let html = applyMeta(template, meta);
  html = setTag(html, /<div id="root"><\/div>/, `<div id="root">${render(meta.path)}</div>`);
  if (meta.path !== "/") {
    // The homepage hero preload is not useful on other pages.
    html = html.replace(/\s*<link rel="preload" as="image" href="\/work\/chess-truck-home-desktop.webp"[^>]*>/, "");
  }
  const file = meta.path === "/" ? path.join(dist, "index.html") : path.join(dist, meta.path, "index.html");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  console.log(`prerendered ${meta.path} -> ${path.relative(root, file)}`);
}
