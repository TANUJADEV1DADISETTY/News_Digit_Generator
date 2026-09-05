import { Article } from './types';

/**
 * Normalizes a URL string to canonical form for duplicate detection.
 * Rules:
 * 1. Convert to lowercase
 * 2. Remove http:// and https:// prefixes
 * 3. Remove www. prefix
 * 4. Remove trailing slashes (/)
 */
export function normalizeUrl(url: string): string {
  if (!url) return '';
  let normalized = url.trim().toLowerCase();
  normalized = normalized.replace(/^https?:\/\//i, '');
  normalized = normalized.replace(/^www\./i, '');
  normalized = normalized.replace(/\/+$/, '');
  return normalized;
}

/**
 * Removes duplicate articles based on normalized URLs.
 */
export function deduplicateArticles(articles: Article[]): Article[] {
  const seenUrls = new Set<string>();
  const uniqueArticles: Article[] = [];

  for (const article of articles) {
    const normalized = normalizeUrl(article.url);
    if (!seenUrls.has(normalized)) {
      seenUrls.add(normalized);
      uniqueArticles.push(article);
    }
  }

  return uniqueArticles;
}
