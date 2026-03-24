import { script, style } from "./static";

export const head = (title: string) => `<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  ${style}
</head>`;

export const body = (title: string, parentLink: string | null, rows: string) => `
<body>
  <h1 id="header">${title}</h1>

  ${parentLink ? `
  <div id="parentDirLinkBox">
    <a id="parentDirLink" class="icon up" href="${parentLink}">
      <span id="parentDirText">[parent directory]</span>
    </a>
  </div>` : ''}

  <table>
    <thead>
      <tr class="header" id="theader">
        <th onclick="sortTable(0)">Name</th>
        <th onclick="sortTable(1)" class="detailsColumn">Size</th>
        <th onclick="sortTable(2)" class="detailsColumn">Date Modified</th>
      </tr>
    </thead>
    <tbody id="tbody">
      ${rows}
    </tbody>
  </table>

 ${script}
</body>`;