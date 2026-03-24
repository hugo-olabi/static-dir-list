# static-dir-list

A Node.js library and CLI tool that generates static HTML directory listings for a specified directory.

## Features

- **Recursive Traversal:** Automatically scans the specified directory and all its subdirectories.
- **Static Generation:** Generates pure HTML files (`index.html`) for each folder, meaning no client-side JavaScript is required to view the lists.
- **Customizable UI:** Clean, responsive design using standard HTML tables and CSS.

## Installation

```bash
npm install static-dir-list
```

## Usage

### CLI

You can use it in your `package.json` scripts:

```json
{
  "scripts": {
    "build-list": "static-dir-list ./public/files"
  }
}
```

Or run it directly with `npx`:

```bash
npx static-dir-list <source-dir> [output-dir]
```

### Library

```typescript
import { generateStaticListing } from 'static-dir-list';

await generateStaticListing('./public/files', './dist/files');
```

## License

MIT
# static-dir-list
