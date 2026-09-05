export interface AppConfig {
  apiKey: string;
  categories: string[];
  outputFile: string;
}

export interface Article {
  title: string;
  url: string;
  source: string;
  category?: string;
  description?: string;
  publishedAt?: string;
}
