import { ConfigService } from '../src/ConfigService';

describe('ConfigService Singleton Pattern', () => {
  beforeEach(() => {
    ConfigService.resetInstance();
  });

  test('getInstance should always return the exact same object instance', () => {
    const instance1 = ConfigService.getInstance();
    const instance2 = ConfigService.getInstance();

    expect(instance1).toBe(instance2);
  });

  test('should load correct configuration values from config.json', () => {
    const configService = ConfigService.getInstance();

    expect(configService.getApiKey()).toBeDefined();
    expect(Array.isArray(configService.getCategories())).toBe(true);
    expect(configService.getCategories().length).toBe(5);
    expect(typeof configService.getOutputFile()).toBe('string');
  });
});
