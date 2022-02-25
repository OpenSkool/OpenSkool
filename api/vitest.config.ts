import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['test/setup.ts'],
    deps: { inline: ['nexus-prisma'] },
    threads: false,
  },
});
