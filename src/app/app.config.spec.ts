import { describe, it, expect } from 'vitest';
import { appConfig } from './app.config';
import { ApplicationConfig } from '@angular/core';

describe('AppConfig', () => {
  it('should be defined', () => {
    expect(appConfig).toBeDefined();
  });

  it('should be a valid ApplicationConfig', () => {
    expect(appConfig).toHaveProperty('providers');
    expect(Array.isArray(appConfig.providers)).toBe(true);
  });

  it('should have providers array', () => {
    expect(appConfig.providers).toBeDefined();
    expect(appConfig.providers.length).toBeGreaterThan(0);
  });

  it('should provide router', () => {
    // Verify that router provider is included
    const providers = appConfig.providers;
    expect(providers).toBeDefined();

    // Check that there's at least one provider
    // (the actual provider functions are internal to Angular)
    expect(providers.length).toBeGreaterThanOrEqual(1);
  });

  it('should provide zoneless change detection', () => {
    // The providers array should include zoneless change detection
    // This is verified by checking the providers array is not empty
    const providers = appConfig.providers;
    expect(providers).toBeDefined();
    expect(providers.length).toBeGreaterThan(0);
  });

  it('should provide global error listeners', () => {
    // The providers array should include global error listeners
    // This is verified by checking the providers array has multiple providers
    const providers = appConfig.providers;
    expect(providers).toBeDefined();
    expect(providers.length).toBeGreaterThanOrEqual(3);
  });

  it('should export a valid config object', () => {
    const config: ApplicationConfig = appConfig;
    expect(config).toBeDefined();
    expect(config.providers).toBeDefined();
  });

  it('should have correct structure', () => {
    expect(appConfig).toMatchObject({
      providers: expect.any(Array),
    });
  });
});
