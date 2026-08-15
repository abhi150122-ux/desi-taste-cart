function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderErrorPage(details?: unknown): string {
  const summary =
    details == null
      ? "No runtime details were captured. Check the server logs for the original stack trace."
      : String(details);

  const safeSummary = escapeHtml(summary);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Server error</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      :root { color-scheme: light; }
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 52rem; width: 100%; text-align: left; padding: 2rem; background: #fff; border: 1px solid #e5e7eb; border-radius: 1rem; box-shadow: 0 10px 30px rgba(17, 17, 17, 0.05); }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1rem; }
      .error { white-space: pre-wrap; word-break: break-word; background: #111827; color: #f9fafb; padding: 1rem; border-radius: 0.75rem; font-size: 0.8rem; overflow-x: auto; margin: 1rem 0 1.25rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: flex-start; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. The original server error is shown below so it can be fixed.</p>
      <div class="error">${safeSummary}</div>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}
