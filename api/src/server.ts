import { exec } from 'node:child_process';

import app from '~/app';

try {
  await app.ready();
  await app.listen(app.config.PORT, app.config.HOST);

  if (app.config.NODE_ENV === 'development') {
    exec('yarn run codegen', (error) => {
      if (error) {
        app.log.error(error);
      }
    });
  }

  const shutdown = () => void app.close();
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
} catch (error) {
  app.log.error(error as Error);
  process.exitCode = 1;
}
