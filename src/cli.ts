#!/usr/bin/env node
import { generateStaticListing } from './index';
import path from 'node:path';

const args = process.argv.slice(2);

if (args.length < 1) {
  console.log('Usage: static-dir-list <source-dir> [output-dir]');
  process.exit(1);
}

const sourceDir = args[0];
const outputDir = args[1] || sourceDir;

generateStaticListing(sourceDir, outputDir)
  .then(() => {
    console.log('Successfully generated directory listings.');
  })
  .catch((err) => {
    console.error('Error generating directory listings:', err);
    process.exit(1);
  });
