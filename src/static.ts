// Style and script content for HTML

export const style = `<style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 20px; color: #333; line-height: 1.5; background-color: #fff; }
    h1 { font-size: 1.5rem; border-bottom: 1px solid #eee; padding-bottom: 0.75rem; margin-bottom: 1.5rem; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 0.75rem; border-bottom: 1px solid #f0f0f0; }
    th { background: #fafafa; font-weight: 600; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; color: #666; cursor: pointer; user-select: none; position: relative; }
    th:hover { background: #f0f0f0; }
    th.sort-asc::after { content: ' ↑'; position: absolute; }
    th.sort-desc::after { content: ' ↓'; position: absolute; }
    .detailsColumn { text-align: right; color: #888; font-size: 0.875rem; font-variant-numeric: tabular-nums; }
    .icon { text-decoration: none; color: #2563eb; font-weight: 500; }
    .icon:hover { text-decoration: underline; color: #1d4ed8; }
    .dir::before { content: "📁 "; margin-right: 0.5rem; }
    .file::before { content: "📄 "; margin-right: 0.5rem; }
    .up::before { content: "⬆️ "; margin-right: 0.5rem; }
    #parentDirLinkBox { margin-bottom: 1rem; }
    
    @media (prefers-color-scheme: dark) {
      body { background-color: #121212; color: #e0e0e0; }
      h1 { border-bottom-color: #333; }
      th { background: #1e1e1e; color: #aaa; border-bottom-color: #333; }
      th:hover { background: #2a2a2a; }
      td { border-bottom-color: #222; }
      .detailsColumn { color: #999; }
      .icon { color: #60a5fa; }
      .icon:hover { color: #93c5fd; }
    }

    @media (max-width: 640px) {
      .detailsColumn { display: none; }
    }
  </style>`;

  export const script = ` <script>
    function sortTable(n) {
      const table = document.getElementById("tbody");
      const headers = document.querySelectorAll("th");
      let rows = Array.from(table.rows);
      let dir = headers[n].getAttribute("data-dir") === "asc" ? "desc" : "asc";
      
      // Reset headers
      headers.forEach(h => {
        h.classList.remove("sort-asc", "sort-desc");
        h.removeAttribute("data-dir");
      });
      
      headers[n].classList.add(dir === "asc" ? "sort-asc" : "sort-desc");
      headers[n].setAttribute("data-dir", dir);

      rows.sort((a, b) => {
        const aIsDir = a.getAttribute("data-is-dir") === "true";
        const bIsDir = b.getAttribute("data-is-dir") === "true";

        if (aIsDir && !bIsDir) return -1;
        if (!aIsDir && bIsDir) return 1;

        let x = a.cells[n].getAttribute("data-value");
        let y = b.cells[n].getAttribute("data-value");
        
        if (n > 0) { // Size or Date (numeric)
          x = parseFloat(x);
          y = parseFloat(y);
        } else { // Name (string)
          x = x.toLowerCase();
          y = y.toLowerCase();
        }

        if (x < y) return dir === "asc" ? -1 : 1;
        if (x > y) return dir === "asc" ? 1 : -1;
        return 0;
      });

      rows.forEach(row => table.appendChild(row));
    }
  </script>`;