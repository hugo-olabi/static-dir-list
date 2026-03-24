# static-dir-list

A Node.js library and CLI tool that generates static HTML directory listings for a given folder. It recursively scans directories and creates `index.html` files for easy browsing without requiring any server-side logic.

## Live Demo

You can see an example of the generated output here:

https://hugo-olabi.github.io/static-dir-list/

## Features

* Recursive directory traversal
* Static HTML output (no JavaScript required in the browser)
* Supports custom output directory
* Ignore files support (similar to `.gitignore`)
* Configurable root path for generated links
* Simple CLI and programmatic API

## Installation

```bash
npm install static-dir-list
```

## Usage

### CLI

Basic usage:

```bash
npx static-dir-list <source-dir> [output-dir]
```

* `<source-dir>`: Directory to scan and generate listings from (required)
* `[output-dir]`: Directory where the HTML files will be written (defaults to `source-dir`)

### Options

#### Ignore files

You can provide one or more ignore files:

```bash
npx static-dir-list ./public/files -if .gitignore -if .staticignore
```

or

```bash
npx static-dir-list ./public/files --ignore-file .gitignore
```

Each ignore file should contain patterns (one per line). Empty lines and lines starting with `#` are ignored.

#### Root path

Set a custom root path for generated links:

```bash
npx static-dir-list ./public/files -root /files/
```

This is useful when your files are served from a subpath.

### Examples

Generate listings in-place:

```bash
npx static-dir-list ./public/files
```

Generate listings into a separate directory:

```bash
npx static-dir-list ./public/files ./dist/files
```

Use ignore file and custom root:

```bash
npx static-dir-list ./public/files ./dist/files -if .gitignore -root /files/
```

## Library Usage

You can also use it programmatically:

```ts
import { generateStaticListing } from 'static-dir-list';

await generateStaticListing(
  './public/files',     // source directory
  './dist/files',       // output directory
  ['node_modules'],     // optional ignore list
  '/files/'             // optional root path
);
```

### API

```ts
generateStaticListing(
  sourceDir: string,
  outputDir: string,
  ignoreList?: string[],
  rootLocation?: string
): Promise<{ filesListed: number; dirsListed: number }>
```

## Behavior

* Generates an `index.html` file inside each directory
* Preserves directory structure in the output directory
* If no ignore list is provided, all files are included
* Ignore patterns are applied before traversal

## License

MIT
