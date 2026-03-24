#!/usr/bin/env node
import { generateStaticListing } from './index';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);

if (args.length < 1) {
  console.log('Usage: static-dir-list <source-dir> [output-dir] [-if <ignore-file>...]');
  process.exit(1);
}

let sourceDir = '';
let outputDir = '';
const ignoreFiles: string[] = [];
const ignoreList: string[] = [];

for (let i = 0; i < args.length; i++) {
  if (args[i] === '-if' || args[i] === '--ignore-file') {
    if (i + 1 < args.length) {
      ignoreFiles.push(args[++i]);
    }
  } else if (!sourceDir) {
    sourceDir = args[i];
  } else if (!outputDir) {
    outputDir = args[i];
  }
}

if (!sourceDir) {
  console.log('Usage: static-dir-list <source-dir> [output-dir] [-if <ignore-file>...]');
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
    ignoreList.push(...content.split(/\r?\n/).filter(line => line.trim() !== '' && !line.startsWith('#')));
  } else {
    console.warn(`Warning: Ignore file not found: ${absolutePath}`);
  }
}

generateStaticListing(sourceDir, outputDir, ignoreList.length > 0 ? ignoreList : undefined)
  .then(({ filesListed, dirsListed }) => {
    console.log(`Successfully generated ${filesListed} files and ${dirsListed} directories.`);
  })
  .catch((err) => {
    console.error('Error generating directory listings:', err);
    process.exit(1);
  });
