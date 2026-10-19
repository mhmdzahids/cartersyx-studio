import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SRC_DIR = path.resolve(__dirname, '../src');

const BANNED_WORDS = [
  'seamless',
  'delve',
  'tapestry',
  'testament',
  'elevate',
  'leverage',
  'robust',
  'bespoke',
  'game-changer',
  'revolutionary',
];

const BANNED_WORDS_REGEX = new RegExp(`\\b(${BANNED_WORDS.join('|')})\\b`, 'i');

function collectFiles(dir, extensions = ['.ts', '.tsx', '.css']) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(collectFiles(fullPath, extensions));
    } else {
      const ext = path.extname(file).toLowerCase();
      if (extensions.includes(ext)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

function runCheck() {
  const files = collectFiles(SRC_DIR);
  const errors = [];
  const warnings = [];

  for (const filePath of files) {
    const relPath = path.relative(path.resolve(__dirname, '..'), filePath).replace(/\\/g, '/');
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split(/\r?\n/);
    const isComponent = relPath.startsWith('src/components/');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNum = i + 1;
      const prevLine = i > 0 ? lines[i - 1] : '';

      // Escape hatch check on line or line above
      const hasEscapeHatch =
        line.includes('design-ok:') ||
        prevLine.includes('design-ok:');

      if (hasEscapeHatch) {
        continue;
      }

      // Check 1: font-mono, font-serif, or unapproved font-family
      if (line.includes('font-mono') || line.includes('font-serif')) {
        errors.push({
          file: relPath,
          line: lineNum,
          rule: 'typography/no-unapproved-font',
          message: 'Found unapproved font utility (font-mono / font-serif). Only Geist Sans is allowed.',
        });
      }

      // Check font-family declaration in CSS
      if (relPath.endsWith('.css') && /font-family\s*:/i.test(line)) {
        if (!line.includes('Geist') && !line.includes('saans') && !line.includes('inherit')) {
          errors.push({
            file: relPath,
            line: lineNum,
            rule: 'typography/approved-font-family',
            message: 'CSS font-family must use Geist variable stack.',
          });
        }
      }

      // Check 2: uppercase combined with tracking-widest or tracking-wider
      if (
        line.includes('uppercase') &&
        (line.includes('tracking-widest') || line.includes('tracking-wider'))
      ) {
        errors.push({
          file: relPath,
          line: lineNum,
          rule: 'typography/no-uppercase-tracking',
          message: 'Found uppercase combined with wide tracking. Mobbin style uses sentence or title case only.',
        });
      }

      // Check 3: gradients
      const hasGradient =
        /bg-gradient-/i.test(line) ||
        /linear-gradient/i.test(line) ||
        /radial-gradient/i.test(line);

      if (hasGradient) {
        const isSafariMaskExempt = line.includes('allow-gradient: safari-mask');
        if (!isSafariMaskExempt) {
          errors.push({
            file: relPath,
            line: lineNum,
            rule: 'visual/no-gradients',
            message: 'Gradients are banned. Use flat tints only.',
          });
        }
      }

      // Check 4: shadows
      // Tailwind shadow class: shadow-sm, shadow-md, shadow-lg, shadow-xl, shadow-2xl, shadow-inner, shadow-[...]
      // CSS: box-shadow: ...
      const hasTailwindShadow = /\bshadow-(sm|md|lg|xl|2xl|inner|\[)/.test(line);
      const hasCssBoxShadow = /box-shadow\s*:/i.test(line);

      if (hasTailwindShadow || hasCssBoxShadow) {
        const isAllowedWindowShadow =
          line.includes('--shadow-window') || line.includes('box-shadow: none');
        if (!isAllowedWindowShadow) {
          errors.push({
            file: relPath,
            line: lineNum,
            rule: 'visual/no-shadows',
            message: 'Box shadows are banned (only --shadow-window on site window in light mode is permitted).',
          });
        }
      }

      // Check 5: blur / backdrop-blur
      if (
        line.includes('backdrop-blur') ||
        /filter\s*:\s*blur/i.test(line) ||
        /backdrop-filter\s*:\s*blur/i.test(line)
      ) {
        errors.push({
          file: relPath,
          line: lineNum,
          rule: 'visual/no-blur',
          message: 'Blur and backdrop-blur are banned. Maintain clean, crisp surfaces.',
        });
      }

      // Check 6: Banned marketing buzzwords
      // Ignore comment-only lines or check string literals / JSX text
      const trimmed = line.trim();
      const isCommentLine =
        trimmed.startsWith('//') ||
        trimmed.startsWith('/*') ||
        trimmed.startsWith('*') ||
        trimmed.startsWith('{/*');

      if (!isCommentLine) {
        const match = line.match(BANNED_WORDS_REGEX);
        if (match) {
          errors.push({
            file: relPath,
            line: lineNum,
            rule: 'copy/no-banned-buzzwords',
            message: `Found banned marketing buzzword "${match[0]}". Use plain, direct language.`,
          });
        }
      }

      // Warnings (exit 0): Raw hex colors in components (excluding comments)
      if (isComponent && !isCommentLine) {
        // Strip comments on the line if any
        const codeOnly = line.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/, '');
        const hexMatch = codeOnly.match(/#[0-9a-fA-F]{3,8}\b/);
        if (hexMatch) {
          warnings.push({
            file: relPath,
            line: lineNum,
            rule: 'tokens/prefer-tokens-over-hex',
            message: `Found raw hex color "${hexMatch[0]}". Prefer using design tokens in src/tokens.css.`,
          });
        }
      }

      // Warnings (exit 0): Raw pixel font-size or font-weight in inline styles
      if (isComponent && line.includes('style={{')) {
        if (/fontSize\s*:\s*['"]?\d+px/i.test(line) || /fontWeight\s*:\s*['"]?\d+/i.test(line)) {
          warnings.push({
            file: relPath,
            line: lineNum,
            rule: 'tokens/prefer-tokens-inline-style',
            message: 'Found inline font-size or font-weight. Use typography tokens or utility classes.',
          });
        }
      }
    }
  }

  // Report results
  console.log('='.repeat(60));
  console.log('  Cartesyx Studio Design System Check');
  console.log('='.repeat(60));
  console.log(`Scanned ${files.length} files in src/`);
  console.log(`Errors: ${errors.length}`);
  console.log(`Warnings: ${warnings.length}`);
  console.log('-'.repeat(60));

  if (warnings.length > 0) {
    console.log('\n[!] Warnings (advisory, exit 0):');
    for (const w of warnings) {
      console.log(`  ${w.file}:${w.line} [${w.rule}] - ${w.message}`);
    }
  }

  if (errors.length > 0) {
    console.error('\n[X] Violations found (exit 1):');
    for (const e of errors) {
      console.error(`  ${e.file}:${e.line} [${e.rule}] - ${e.message}`);
    }
    console.error('\nFix the violations above, or add `/* design-ok: <reason> */` if legitimate.\n');
    process.exit(1);
  }

  console.log('\n[PASS] All design rules passed cleanly with 0 errors.\n');
  process.exit(0);
}

runCheck();
