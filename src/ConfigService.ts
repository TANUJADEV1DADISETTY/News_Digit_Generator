import * as fs from 'fs';
import * as path from 'path';
import { AppConfig } from './types';

export class ConfigService {
  private static instance: ConfigService | null = null;
  private config: AppConfig;

  private constructor(configPath?: string) {
    const filePath = configPath || path.resolve(process.cwd(), 'config.json');
    if (!fs.existsSync(filePath)) {
      throw new Error(`Configuration file not found at path: ${filePath}`);
    }
    const fileData = fs.readFileSync(filePath, 'utf-8');
    this.config = JSON.parse(fileData);
  }

  public static getInstance(configPath?: string): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService(configPath);
    }
    return ConfigService.instance;
  }

  /**
   * Helper method for testing purposes to reset the singleton instance.
   */
  public static resetInstance(): void {
    ConfigService.instance = null;
  }

  public getApiKey(): string {
    return this.config.apiKey;
  }

  public getCategories(): string[] {
    return this.config.categories;
  }

  public getOutputFile(): string {
    return this.config.outputFile;
  }

  public getConfig(): AppConfig {
    return { ...this.config };
  }
}
