import { Article } from './types';

export class HTMLBuilder {
  private contentParts: string[] = [];

  constructor() {
    this.contentParts.push(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Daily News Digest</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-gradient: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
      --card-bg: rgba(30, 41, 59, 0.7);
      --card-border: rgba(255, 255, 255, 0.1);
      --text-primary: #f8fafc;
      --text-secondary: #94a3b8;
      --accent-color: #6366f1;
      --accent-hover: #818cf8;
      --category-badge: #312e81;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--bg-gradient);
      color: var(--text-primary);
      min-height: 100vh;
      padding: 2.5rem 1.5rem;
      line-height: 1.6;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
    }

    header {
      text-align: center;
      margin-bottom: 3rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--card-border);
    }

    h1 {
      font-size: 2.75rem;
      font-weight: 700;
      background: linear-gradient(90deg, #818cf8, #c084fc, #38bdf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.5rem;
      letter-spacing: -0.02em;
    }

    .subtitle {
      color: var(--text-secondary);
      font-size: 1.1rem;
    }

    section {
      background: var(--card-bg);
      backdrop-filter: blur(12px);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 1.75rem 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
      transition: transform 0.2s ease, border-color 0.2s ease;
    }

    section:hover {
      border-color: rgba(99, 102, 241, 0.4);
      transform: translateY(-2px);
    }

    h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #e2e8f0;
      margin-bottom: 1.25rem;
      text-transform: capitalize;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    h2::before {
      content: '';
      display: inline-block;
      width: 8px;
      height: 24px;
      background: var(--accent-color);
      border-radius: 4px;
    }

    ul {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    li {
      background: rgba(15, 23, 42, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.05);
      padding: 1rem 1.25rem;
      border-radius: 10px;
      transition: background 0.2s ease, padding-left 0.2s ease;
    }

    li:hover {
      background: rgba(49, 46, 129, 0.3);
      padding-left: 1.5rem;
    }

    li a {
      color: #f1f5f9;
      text-decoration: none;
      font-weight: 500;
      font-size: 1.05rem;
      display: block;
      transition: color 0.2s ease;
    }

    li a:hover {
      color: var(--accent-hover);
    }

    .article-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin-top: 0.35rem;
    }

    .source-tag {
      background: rgba(99, 102, 241, 0.2);
      color: #a5b4fc;
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
      font-weight: 500;
    }

    footer {
      text-align: center;
      color: var(--text-secondary);
      font-size: 0.9rem;
      margin-top: 3rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--card-border);
    }
  </style>
</head>
<body>
  <div class="container">`);
  }

  public addHeader(title: string): HTMLBuilder {
    this.contentParts.push(`
    <header>
      <h1>${title}</h1>
      <p class="subtitle">Automated Daily Summary • Generated on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </header>`);
    return this;
  }

  public addSection(category: string, articles: Article[]): HTMLBuilder {
    let sectionHtml = `
    <section>
      <h2>${category}</h2>
      <ul>`;

    if (articles.length === 0) {
      sectionHtml += `
        <li><span>No articles available for this category.</span></li>`;
    } else {
      for (const article of articles) {
        sectionHtml += `
        <li>
          <a href="${article.url}" target="_blank" rel="noopener noreferrer">${article.title}</a>
          <div class="article-meta">
            <span class="source-tag">${article.source}</span>
          </div>
        </li>`;
      }
    }

    sectionHtml += `
      </ul>
    </section>`;

    this.contentParts.push(sectionHtml);
    return this;
  }

  public addFooter(text?: string): HTMLBuilder {
    const footerText = text || `Generated automatically by News Digest Builder on ${new Date().toISOString()}`;
    this.contentParts.push(`
    <footer>
      <p>${footerText}</p>
    </footer>
  </div>
</body>
</html>`);
    return this;
  }

  public build(): string {
    return this.contentParts.join('');
  }
}
