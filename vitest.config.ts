import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
      exclude: ['src/**/*.browser.{test,spec}.{js,ts}', 'node_modules'],
      setupFiles: './src/test/setup.ts',
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'json'],
        reportsDirectory: './coverage',
        exclude: [
          'node_modules/',
          'src/test/',
          '**/*.d.ts',
          '**/*.config.{js,ts}',
          '**/types/**',
        ],
      },
    },
  })
)
