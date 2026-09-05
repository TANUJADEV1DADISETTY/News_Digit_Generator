import * as fs from 'fs';
import * as path from 'path';
import { runDigestGenerator } from '../src/index';
import { fetchNewsForCategory } from '../src/ApiClient';
import { ConfigService } from '../src/ConfigService';

// Mock the API client module to avoid network requests during tests
jest.mock('../src/ApiClient');

const mockedFetchNews = fetchNewsForCategory as jest.MockedFunction<typeof fetchNewsForCategory>;

describe('Main Application Pipeline Integration with Mocks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    ConfigService.resetInstance();
  });

  test('runDigestGenerator should execute complete pipeline using mocked API client data', async () => {
    // Provide static mock data per category with valid accessible URLs
    mockedFetchNews.mockImplementation(async (category: string) => {
      return [
        {
          title: `Headline for ${category}`,
          url: `https://news.ycombinator.com?cat=${category}`,
          source: 'Hacker News',
          category
        },
        {
          title: `Duplicate Headline for ${category}`,
          url: `https://news.ycombinator.com?cat=${category}`, // Should deduplicate
          source: 'Hacker News',
          category
        }
      ];
    });

    const outputPath = await runDigestGenerator();

    // Verify API client was called for each category
    expect(mockedFetchNews).toHaveBeenCalledTimes(5);

    // Verify generated HTML file exists
    expect(fs.existsSync(outputPath)).toBe(true);

    const fileContent = fs.readFileSync(outputPath, 'utf-8');
    expect(fileContent).toContain('<h1>Automated Daily News Digest</h1>');
    expect(fileContent).toContain('<h2>technology</h2>');
    expect(fileContent).toContain('<h2>business</h2>');
    expect(fileContent).toContain('<h2>science</h2>');
    expect(fileContent).toContain('<h2>health</h2>');
    expect(fileContent).toContain('<h2>sports</h2>');
    expect(fileContent).toContain('href="https://news.ycombinator.com?cat=technology"');
  });
});
