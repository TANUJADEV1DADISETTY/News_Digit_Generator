import { deduplicateArticles, normalizeUrl } from '../src/deduplication';
import { Article } from '../src/types';

describe('Article Deduplication Logic', () => {
  test('normalizeUrl should standardize URLs to canonical form', () => {
    expect(normalizeUrl('http://example.com')).toBe('example.com');
    expect(normalizeUrl('https://www.example.com/')).toBe('example.com');
    expect(normalizeUrl('HTTP://WWW.EXAMPLE.COM/tech/')).toBe('example.com/tech');
  });

  test('deduplicateArticles should filter out articles with matching normalized URLs', () => {
    const sampleArticles: Article[] = [
      {
        title: 'Article 1 - Version A',
        url: 'http://a.com',
        source: 'Source A',
        category: 'technology'
      },
      {
        title: 'Article 1 - Version B',
        url: 'https://www.a.com/',
        source: 'Source B',
        category: 'technology'
      },
      {
        title: 'Article 2',
        url: 'https://b.org/news',
        source: 'Source C',
        category: 'business'
      },
      {
        title: 'Article 2 - Duplicate',
        url: 'http://www.b.org/news/',
        source: 'Source D',
        category: 'business'
      }
    ];

    const uniqueArticles = deduplicateArticles(sampleArticles);

    expect(uniqueArticles).toHaveLength(2);
    expect(uniqueArticles[0].title).toBe('Article 1 - Version A');
    expect(uniqueArticles[1].title).toBe('Article 2');
  });
});
