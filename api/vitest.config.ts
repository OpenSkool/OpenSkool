import isCI from 'is-ci';
import ms from 'ms';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: isCI ? ms('15s') : ms('5s'),
    setupFiles: ['test/setup.ts'],
    threads: false,
  },
});
