import axios from 'axios';
import { ConfigService } from './ConfigService';
import { Article } from './types';

/**
 * Fetches news articles for a given category.
 * Integrates with GNews / NewsAPI REST endpoints. Fallbacks to mock sample data if network or API key is unconfigured.
 */
export async function fetchNewsForCategory(category: string): Promise<Article[]> {
  const config = ConfigService.getInstance();
  const apiKey = config.getApiKey();

  // If apiKey is invalid/placeholder or request fails, handle error or fallback
  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE' || apiKey === 'demo_key_or_sample') {
    return getFallbackArticles(category);
  }

  try {
    // Attempting real GNews / NewsAPI HTTP fetch
    const response = await axios.get(`https://gnews.io/api/v4/top-headlines`, {
      params: {
        category: category.toLowerCase(),
        lang: 'en',
        apikey: apiKey
      },
      timeout: 5000
    });

    if (response.data && Array.isArray(response.data.articles)) {
      return response.data.articles.map((item: any) => ({
        title: item.title || 'Untitled Article',
        url: item.url || '#',
        source: item.source?.name || 'Unknown Source',
        category: category
      }));
    }
  } catch (error) {
    console.warn(`[ApiClient] Network request for category '${category}' failed or timed out. Falling back to structured articles.`);
    return getFallbackArticles(category);
  }

  return getFallbackArticles(category);
}

/**
 * Provides clean fallback sample articles for offline / demo environments.
 */
function getFallbackArticles(category: string): Article[] {
  const catLower = category.toLowerCase();
  const baseArticles: Record<string, Article[]> = {
    technology: [
      { title: 'Breakthroughs in Quantum Computing Architecture', url: 'https://techcrunch.com', source: 'TechCrunch', category: 'technology' },
      { title: 'The Evolution of AI Code Generators in Software Engineering', url: 'https://news.ycombinator.com', source: 'Hacker News', category: 'technology' },
      { title: 'Next-Gen Web Frameworks: What to Expect Next', url: 'https://arstechnica.com', source: 'Ars Technica', category: 'technology' }
    ],
    business: [
      { title: 'Global Market Dynamics: Q3 Economic Insights', url: 'https://www.bloomberg.com', source: 'Bloomberg', category: 'business' },
      { title: 'Sustainable Tech Investments Reach Record Highs', url: 'https://www.ft.com', source: 'Financial Times', category: 'business' },
      { title: 'Venture Capital Trends Shaping Startup Ecosystems', url: 'https://www.wsj.com', source: 'Wall Street Journal', category: 'business' }
    ],
    science: [
      { title: 'James Webb Telescope Discovers Exoplanet Atmosphere Details', url: 'https://www.nature.com', source: 'Nature', category: 'science' },
      { title: 'CRISPR Gene Editing Breakthrough Shows Promise in Trials', url: 'https://www.scientificamerican.com', source: 'Scientific American', category: 'science' },
      { title: 'Renewable Energy Storage Solutions via Liquid Batteries', url: 'https://www.space.com', source: 'Space.com', category: 'science' }
    ],
    health: [
      { title: 'New Personalized Medicine Protocol Receives FDA Clearance', url: 'https://www.who.int', source: 'World Health Organization', category: 'health' },
      { title: 'Sleep Science: How Circadian Rhythms Impact Cognitive Longevity', url: 'https://www.medicalnewstoday.com', source: 'Medical News Today', category: 'health' },
      { title: 'Advancements in Non-Invasive Glucose Monitoring Devices', url: 'https://www.nih.gov', source: 'National Institutes of Health', category: 'health' }
    ],
    sports: [
      { title: 'World Athletics Championship Breaks Multiple World Records', url: 'https://www.espn.com', source: 'ESPN', category: 'sports' },
      { title: 'Global Football Tournament Prepares for Next Championship', url: 'https://www.bbc.com/sport', source: 'BBC Sport', category: 'sports' },
      { title: 'Tactical Analysis: Data Analytics Redefining Modern Basketball', url: 'https://www.skysports.com', source: 'Sky Sports', category: 'sports' }
    ]
  };

  return baseArticles[catLower] || [
    { title: `Top Headline in ${category}`, url: `https://news.google.com`, source: 'Google News', category }
  ];
}
