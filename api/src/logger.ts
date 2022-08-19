import prettifier from '@mgcrea/pino-pretty-compact';
import pino from 'pino';

export default pino({
  level: process.env.NODE_ENV === 'test' ? 'error' : 'info',
  prettifier,
});
