import { Store } from '@fastify/session';

import { prisma } from '~/prisma';

type SessionData = Parameters<typeof Store['set']>[1];

export async function destroy(id: string): Promise<void> {
  await prisma.session.delete({ where: { id } });
}

/**
 * @return ${Promise<SessionData | undefined>} The session store is typed to not return undefined but that makes no sense.
 */
export async function get(id: string): Promise<SessionData> {
  const session = await prisma.session.findUnique({ where: { id } });
  if (session == null) {
    return undefined as unknown as SessionData;
  }
  const data = JSON.parse(session.data) as SessionData;
  const expires =
    typeof data.cookie.expires === 'string'
      ? new Date(data.cookie.expires)
      : data.cookie.expires;
  if (expires && expires.getTime() <= Date.now()) {
    await destroy(id);
    return undefined as unknown as SessionData;
  }
  return data;
}

export async function set(id: string, data: SessionData): Promise<void> {
  const serialData = JSON.stringify(data);
  await prisma.session.upsert({
    create: { id, data: serialData },
    update: { id, data: serialData },
    where: { id },
  });
}
