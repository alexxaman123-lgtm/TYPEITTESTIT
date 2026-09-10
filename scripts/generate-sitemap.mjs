import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pagesRoot = path.join(projectRoot, "src", "pages");
const outputPath = path.join(projectRoot, "public", "sitemap.xml");
const siteUrl = "https://typeittestit.com";

async function collectAstroPages(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectAstroPages(absolutePath));
    else if (entry.isFile() && entry.name.endsWith(".astro")) files.push(absolutePath);
  }

  return files;
}

function routeFromFile(filePath) {
  const relative = path.relative(pagesRoot, filePath).split(path.sep).join("/");
  if (relative.includes("[") || relative.includes("]")) return null;

  const withoutExtension = relative.slice(0, -".astro".length);
  const routePath = withoutExtension.endsWith("/index")
    ? withoutExtension.slice(0, -"index".length)
    : withoutExtension === "index"
      ? ""
      : `${withoutExtension}/`;

  const route = `/${routePath}`.replace(/\/+/g, "/");
  // Account pages are personalized and explicitly noindex in SiteLayout.
  if (route.split("/").includes("account")) return null;
  return route;
}

const pageFiles = await collectAstroPages(pagesRoot);
const routes = [...new Set(pageFiles.map(routeFromFile).filter(Boolean))]
  .sort((a, b) => a === "/" ? -1 : b === "/" ? 1 : a.localeCompare(b));

const urls = routes
  .map((route) => `  <url><loc>${siteUrl}${route}</loc></url>`)
  .join("\n");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

await writeFile(outputPath, sitemap, "utf8");
console.log(`Generated sitemap with ${routes.length} public routes.`);
