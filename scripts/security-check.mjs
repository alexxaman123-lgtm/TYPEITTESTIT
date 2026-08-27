import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const forbidden = [
  [/\beval\s*\(/, "eval()"],
  [/new\s+Function\s*\(/, "new Function()"],
  [/document\.cookie\s*=/, "document.cookie assignment"],
  [/innerHTML\s*=/, "innerHTML assignment"],
  [/outerHTML\s*=/, "outerHTML assignment"],
];

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (["node_modules", "dist", ".git"].includes(name)) continue;
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) out.push(...walk(path));
    else if (/\.(tsx?|jsx?|html|css)$/.test(name)) out.push(path);
  }
  return out;
}

const files = walk("src").concat(["index.html", "vercel.json"]);
const failures = [];
for (const file of files) {
  const text = readFileSync(file, "utf8");
  for (const [pattern, label] of forbidden) {
    if (pattern.test(text)) failures.push(`${file}: found ${label}`);
  }
}
const vercel = JSON.parse(readFileSync("vercel.json", "utf8"));
const headerNames = new Set(vercel.headers?.flatMap((h) => h.headers?.map((x) => x.key) ?? []) ?? []);
for (const required of ["Content-Security-Policy","X-Content-Type-Options","Referrer-Policy","Permissions-Policy","X-Frame-Options","Strict-Transport-Security","X-Permitted-Cross-Domain-Policies","Origin-Agent-Cluster"]) {
  if (!headerNames.has(required)) failures.push(`vercel.json: missing ${required}`);
}
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Security checks passed for ${files.length} source/config files.`);
