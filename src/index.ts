import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from './ConfigService';
import { fetchNewsForCategory } from './ApiClient';
import { deduplicateArticles } from './deduplication';
import { HTMLBuilder } from './HTMLBuilder';
import { Article } from './types';

export async function runDigestGenerator(): Promise<string> {
  console.log('🚀 Starting Automated News Digest Generator...');

  // 1. Load configuration via Singleton
  const configService = ConfigService.getInstance();
  const categories = configService.getCategories();
  const outputFile = configService.getOutputFile();

  console.log(`📋 Loaded configuration. Categories count: ${categories.length}, Output: ${outputFile}`);

  // 2. Fetch news articles across all categories
  const allArticles: Article[] = [];
  for (const category of categories) {
    console.log(`📡 Fetching articles for category: ${category}...`);
    try {
      const articles = await fetchNewsForCategory(category);
      console.log(`   Found ${articles.length} articles in '${category}'`);
      allArticles.push(...articles);
    } catch (err) {
      console.error(`❌ Error fetching category '${category}':`, err);
    }
  }

  // 3. Deduplicate articles by normalized URL
  console.log(`🔍 Total articles fetched before deduplication: ${allArticles.length}`);
  const uniqueArticles = deduplicateArticles(allArticles);
  console.log(`✨ Total unique articles after deduplication: ${uniqueArticles.length}`);

  // 4. Organize unique articles back into categories
  const articlesByCategory = new Map<string, Article[]>();
  for (const category of categories) {
    articlesByCategory.set(category, []);
  }

  for (const article of uniqueArticles) {
    const catKey = (article.category || categories[0]).toLowerCase();
    const matchedCategory = categories.find(c => c.toLowerCase() === catKey) || categories[0];
    const list = articlesByCategory.get(matchedCategory) || [];
    list.push(article);
    articlesByCategory.set(matchedCategory, list);
  }

  // 5. Build HTML output using Builder Pattern
  console.log('🛠️ Constructing HTML Digest using Builder pattern...');
  const builder = new HTMLBuilder();
  builder.addHeader('Automated Daily News Digest');

  for (const category of categories) {
    const catArticles = articlesByCategory.get(category) || [];
    builder.addSection(category, catArticles);
  }

  builder.addFooter();
  const finalHtml = builder.build();

  // 6. Write HTML to output file
  const fullOutputPath = path.resolve(process.cwd(), outputFile);
  const outputDir = path.dirname(fullOutputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(fullOutputPath, finalHtml, 'utf-8');
  console.log(`✅ Digest generated successfully at: ${fullOutputPath}`);

  return fullOutputPath;
}

// Execute if run directly from command line
if (require.main === module) {
  runDigestGenerator().catch((err) => {
    console.error('Fatal error during digest generation:', err);
    process.exit(1);
  });
}
