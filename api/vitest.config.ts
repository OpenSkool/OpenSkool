import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    deps: { inline: ['nexus-prisma'] },
    setupFiles: ['test/setup.ts'],
    threads: false,
  },
});
