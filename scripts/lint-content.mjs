#!/usr/bin/env node
/**
 * lint-content.mjs
 * Fails the build when brand content breaks the hard editorial rules
 * (CONTENT_BRIEF.md section 6 and DevBrief section 7).
 *
 * Checks every markdown file under the content collections for:
 *   - em dashes
 *   - double hyphens used as punctuation (prose only; code spans and
 *     fenced code are exempt so CLI flags like --html do not trip it)
 *   - the retired term "Water Doc"
 *   - "BarrierFlow" (firewall: must not appear in this brand's content)
 *   - placeholder markers (TODO, FIXME, lorem ipsum, coming soon)
 *
 * Usage:
 *   node scripts/lint-content.mjs
 *   LINT_DIRS=path/a,path/b node scripts/lint-content.mjs   (override dirs, used by tests)
 *
 * Exit code 0 = clean, 1 = violations found.
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const DEFAULT_DIRS = [
  'src/content/newsletter',
  'src/content/episodes',
  'src/content/vlog', // optional; skipped if it does not exist
];
const CONTENT_DIRS = process.env.LINT_DIRS ? process.env.LINT_DIRS.split(',') : DEFAULT_DIRS;
const EXTS = new Set(['.md', '.mdx']);

// Rules checked on every line, including frontmatter and code.
const ALWAYS = [
  { id: 'em-dash', re: /—/, msg: 'em dash is not allowed; use a comma, colon, or full stop' },
  { id: 'water-doc', re: /\bwater[ -]?doc\b/i, msg: '"Water Doc" is a retired brand term; do not use it' },
  { id: 'barrierflow', re: /barrierflow/i, msg: "BarrierFlow must not appear in this brand's content (firewall)" },
  { id: 'placeholder', re: /\b(todo|fixme|lorem ipsum|coming soon)\b/i, msg: 'placeholder text must not ship' },
];

// Rules checked on prose only (fenced code and inline code stripped first).
const PROSE = [
  { id: 'double-hyphen', re: /(?<!-)--(?!-)/, msg: 'double hyphen used as punctuation; use a comma, colon, or full stop' },
];

function listFiles(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...listFiles(p));
    else if (EXTS.has(extname(name))) out.push(p);
  }
  return out;
}

// Replace inline `code` spans with spaces so prose rules do not scan them.
const stripInline = (line) => line.replace(/`[^`]*`/g, (m) => ' '.repeat(m.length));

let violations = 0;
function report(file, lineNo, rule, line) {
  violations++;
  console.error(`  x ${file}:${lineNo}  [${rule.id}] ${rule.msg}`);
  console.error(`      ${line.trim()}`);
}

const files = CONTENT_DIRS.flatMap(listFiles);
for (const file of files) {
  const lines = readFileSync(file, 'utf8').split(/\r?\n/);
  let inFence = false;
  let inComment = false;
  lines.forEach((line, i) => {
    const lineNo = i + 1;
    for (const rule of ALWAYS) if (rule.re.test(line)) report(file, lineNo, rule, line);

    if (/^\s*```/.test(line)) { inFence = !inFence; return; }
    if (inFence) return;

    // Strip inline code, then HTML comments (authoring notes, not prose), so
    // prose rules do not trip on `<!--` / `-->` delimiters. Multiline-aware.
    let prose = stripInline(line);
    if (inComment) {
      const end = prose.indexOf('-->');
      if (end === -1) return;
      prose = prose.slice(end + 3);
      inComment = false;
    }
    prose = prose.replace(/<!--[\s\S]*?-->/g, ' ');
    const open = prose.indexOf('<!--');
    if (open !== -1) { inComment = true; prose = prose.slice(0, open); }

    for (const rule of PROSE) if (rule.re.test(prose)) report(file, lineNo, rule, line);
  });
}

if (violations > 0) {
  console.error(`\nContent lint FAILED: ${violations} violation(s) across ${files.length} file(s). Fix before build.`);
  process.exit(1);
}
console.log(`Content lint passed: ${files.length} file(s) checked, 0 violations.`);
