import fs from 'node:fs';
import path from 'node:path';
import { body, head } from './html';

export interface FileInfo {
  name: string;
  isDir: boolean;
  size: number;
  sizeStr: string;
  mtime: number;
  mtimeStr: string;
}

// Formats a byte count into a human-readable string.
function formatSize(bytes: number): string {
  if (bytes === 0) return '';
  const units = ['B', 'kB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`.replace(/\.00\s/, ' ');
}

// Generates a row based on a file from the directory
function generateRowHtml(file: FileInfo): string {
  const iconClass = file.isDir ? 'dir' : 'file';
  const href = file.isDir ? `${file.name}/` : file.name;
  const value = file.isDir ? `${file.name}/` : file.name;

  return (
`<tr data-is-dir="${file.isDir}">
  <td data-value="${value}"><a class="icon ${iconClass}" href="${href}">${value}</a></td>
  <td class="detailsColumn" data-value="${file.size}">${file.sizeStr}</td>
  <td class="detailsColumn" data-value="${file.mtime}">${file.mtimeStr}</td>
</tr>`);
}

// Generates the HTML content for a directory listing.
function generateHtml(dirPath: string, files: FileInfo[], relativePath: string): string {
  const title = `Index of ${relativePath || '/'}`;
  const parentPath = relativePath ? path.dirname(relativePath) : null;
  const parentLink = parentPath === '.' ? '/' : (parentPath ? `/${parentPath}/` : null);

  const rows = files.map(generateRowHtml).join('');

  return `
<!DOCTYPE html>
<html lang="en">
${head(title)}
${body(title, parentLink, rows)}
</html>`;
}

/**
 * Generates static HTML directory listings for a directory and its subdirectories.
 * 
 * @param baseDir - The directory to scan for files (relative to project root or absolute).
 * @param outputDir - The directory where the generated index.html files will be saved.
 */
export async function generateStaticListing(baseDir: string, outputDir: string): Promise<void> {
  const absoluteBaseDir = path.isAbsolute(baseDir) ? baseDir : path.resolve(process.cwd(), baseDir);
  const absoluteOutputDir = path.isAbsolute(outputDir) ? outputDir : path.resolve(process.cwd(), outputDir);

  if (!fs.existsSync(absoluteBaseDir)) {
    throw new Error(`Source directory not found: ${absoluteBaseDir}`);
  }

  const traverse = (currentDir: string, relativePath: string) => {
    const items = fs.readdirSync(currentDir);
    const filesInfo: FileInfo[] = [];

    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stats = fs.statSync(fullPath);
      const isDir = stats.isDirectory();

      filesInfo.push({
        name: item,
        isDir,
        size: isDir ? 0 : stats.size,
        sizeStr: isDir ? '' : formatSize(stats.size),
        mtime: stats.mtimeMs,
        mtimeStr: stats.mtime.toLocaleString(),
      });



      if (isDir) {
        traverse(fullPath, path.join(relativePath, item));
      } else {
        // Copy directory content
        const targetFilePath = path.join(absoluteOutputDir, relativePath, item);
        const targetFileDir = path.dirname(targetFilePath);
        if (!fs.existsSync(targetFileDir)) {
          fs.mkdirSync(targetFileDir, { recursive: true });
        }
        fs.copyFileSync(fullPath, targetFilePath);

      }
    }

    const html = generateHtml(currentDir, filesInfo.sort((a, b) => {
      if (a.isDir && !b.isDir) return -1;
      if (!a.isDir && b.isDir) return 1;
      return a.name.localeCompare(b.name);
    }), relativePath);
    const targetDir = path.join(absoluteOutputDir, relativePath);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const outputFilePath = path.join(targetDir, 'index.html');
    fs.writeFileSync(outputFilePath, html, 'utf8');
    console.log(`Generated: ${outputFilePath}`);
  };

  traverse(absoluteBaseDir, '');
}
