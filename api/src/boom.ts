import { badRequest, boomify, isBoom } from '@hapi/boom';
import plugin from 'fastify-plugin';

export default plugin(async (app) => {
  app
    .setErrorHandler((error, request, reply) => {
      const boom = isBoom(error) ? error : boomify(error, { statusCode: 500 });
      if (boom.isServer) {
        app.log.error(error);
      }
      reply
        .code(boom.output.statusCode)
        .type('application/json')
        .headers(boom.output.headers)
        .send(boom.output.payload);
    })
    .setSchemaErrorFormatter((validationErrors) =>
      badRequest(validationErrors.map(({ message }) => message).join(', ')),
    );
});
