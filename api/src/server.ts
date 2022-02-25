import app from './app';

(async (): Promise<void> => {
  await app.ready();
  await app.listen(app.config.PORT, app.config.HOST);

  const shutdown = () => void app.close();
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
})().catch(app.log.error.bind(app.log));
