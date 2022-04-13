import { preHandlerAsyncHookHandler } from 'fastify';

export const authHook: preHandlerAsyncHookHandler = async (
  request,
): Promise<void> => {
  request.log.info({
    requestMethod: request.method,
    requestUrl: request.url,
    session: request.session.sessionId,
    sessionCodeVerifier: request.session.codeVerifier ?? null,
    sessionTokenSet: request.session.tokenSet ?? null,
  });
};
