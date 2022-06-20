import pino from 'pino';

export default pino({
  level: process.env.NODE_ENV === 'test' ? 'error' : 'info',
  transport:
    process.env.NODE_ENV === 'development'
      ? {
          pipeline: [
            {
              target: 'pino-pretty',
              options: {
                colorize: true,
                ignore: 'hostname,pid',
                levelFirst: true,
                translateTime: 'HH:MM:ss',
              },
            },
          ],
        }
      : undefined,
});
