import { exec } from 'child_process';

import app from './app';

(async (): Promise<void> => {
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
})().catch(app.log.error.bind(app.log));
