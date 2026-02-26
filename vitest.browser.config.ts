import { defineConfig, mergeConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      include: ['src/**/*.browser.{test,spec}.{js,ts,jsx,tsx}'],
      browser: {
        enabled: true,
        provider: playwright(),
        // https://vitest.dev/config/browser/playwright
        instances: [
          { browser: 'chromium' },
        ],
      },
    },
  })
)
