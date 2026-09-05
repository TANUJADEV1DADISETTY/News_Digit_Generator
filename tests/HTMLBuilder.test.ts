import { HTMLBuilder } from '../src/HTMLBuilder';
import { Article } from '../src/types';

describe('HTMLBuilder Builder Pattern', () => {
  test('should incrementally build HTML document with header, sections, and tags', () => {
    const builder = new HTMLBuilder();

    const sampleArticles: Article[] = [
      {
        title: 'Quantum Computing Breakdown',
        url: 'https://tech.example.com/quantum',
        source: 'Tech News',
        category: 'technology'
      }
    ];

    builder.addHeader('Daily News Digest');
    builder.addSection('technology', sampleArticles);
    builder.addFooter();

    const htmlOutput = builder.build();

    expect(htmlOutput).toContain('<h1>Daily News Digest</h1>');
    expect(htmlOutput).toContain('<h2>technology</h2>');
    expect(htmlOutput).toContain('<ul>');
    expect(htmlOutput).toContain('<li>');
    expect(htmlOutput).toContain('<a href="https://tech.example.com/quantum"');
    expect(htmlOutput).toContain('Quantum Computing Breakdown</a>');
    expect(htmlOutput).toContain('</body>');
    expect(htmlOutput).toContain('</html>');
  });

  test('should render empty category section cleanly when no articles provided', () => {
    const builder = new HTMLBuilder();
    builder.addSection('sports', []);
    const output = builder.build();

    expect(output).toContain('<h2>sports</h2>');
    expect(output).toContain('<ul>');
    expect(output).toContain('No articles available');
  });
});
