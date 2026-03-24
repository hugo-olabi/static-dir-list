#!/usr/bin/env node
import { generateStaticListing } from './index';
import fs from 'node:fs';
import path from 'node:path';

const color = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
};

function printHelp() {
  console.log(`
${color.bold}static-dir-list${color.reset}

Generate static HTML directory listings for a folder.

${color.bold}Usage:${color.reset}
  static-dir-list <source-dir> [output-dir] [options]

${color.bold}Arguments:${color.reset}
  <source-dir>        Directory to scan (required)
  [output-dir]        Directory to write output (default: source-dir)

${color.bold}Options:${color.reset}
  -if, --ignore-file <file>   Path to ignore file (can be used multiple times)
  -root <path>                Root path for generated links (default: /)
  -h, --help                  Show this help message
  -v, --version               Show CLI version

${color.bold}Examples:${color.reset}
  static-dir-list ./public/files
  static-dir-list ./public/files ./dist/files
  static-dir-list ./public/files -if .gitignore
  static-dir-list ./public/files ./dist -if .gitignore -root /files/

${color.bold}Notes:${color.reset}
  - Ignore files use one pattern per line
  - Empty lines and lines starting with "#" are ignored
  - Multiple ignore files are merged
`);
}

function printVersion() {
  const pkgPath = path.resolve(process.cwd(), 'package.json');
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    console.log(`static-dir-list v${pkg.version}`);
  } catch {
    console.log('static-dir-list (version unknown)');
  }
}

const args = process.argv.slice(2);

// Help / version flags
if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
  printHelp();
  process.exit(0);
}

if (args.includes('-v') || args.includes('--version')) {
  printVersion();
  process.exit(0);
}

let sourceDir = '';
let outputDir = '';
let rootLocation = '/';

const ignoreFiles: string[] = [];
const ignoreList: string[] = [];

// Parse args
for (let i = 0; i < args.length; i++) {
  if (args[i] === '-if' || args[i] === '--ignore-file') {
    if (i + 1 < args.length) {
      ignoreFiles.push(args[++i]);
    }
  } else if (args[i] === '-root') {
    if (i + 1 < args.length) {
      rootLocation = args[++i];
    }
  } else if (!sourceDir) {
    sourceDir = args[i];
  } else if (!outputDir) {
    outputDir = args[i];
  }
}

// Validate
if (!sourceDir) {
  console.error(`${color.red}Error:${color.reset} Missing <source-dir>\n`);
  printHelp();
  process.exit(1);
}

if (!outputDir) {
  outputDir = sourceDir;
}

// Read ignore files
for (const file of ignoreFiles) {
  const absolutePath = path.resolve(process.cwd(), file);
  if (fs.existsSync(absolutePath)) {
    const content = fs.readFileSync(absolutePath, 'utf8');
    ignoreList.push(
      ...content
        .split(/\r?\n/)
        .filter(line => line.trim() !== '' && !line.startsWith('#'))
    );
  } else {
    console.warn(
      `${color.yellow}Warning:${color.reset} Ignore file not found: ${absolutePath}`
    );
  }
}

// Run
generateStaticListing(
  sourceDir,
  outputDir,
  ignoreList.length > 0 ? ignoreList : undefined,
  rootLocation
)
  .then(({ filesListed, dirsListed }) => {
    console.log(
      `${color.green}Done:${color.reset} Generated ${color.cyan}${filesListed}${color.reset} files and ${color.cyan}${dirsListed}${color.reset} directories.`
    );
  })
  .catch((err) => {
    console.error(`${color.red}Error:${color.reset} Failed to generate listings`);
    console.error(err);
    process.exit(1);
  });