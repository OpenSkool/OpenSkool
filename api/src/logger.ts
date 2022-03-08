import pino from 'pino';

export default pino({
  level: process.env.NODE_ENV === 'test' ? 'error' : 'info',
  prettyPrint: process.env.NODE_ENV !== 'production',
});
