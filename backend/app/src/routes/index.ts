import { FastifyInstance } from 'fastify';

import Health from './health';
import Chat from './chat';

export async function router(app: FastifyInstance): Promise<void> {
  app.register(Health, { prefix: '/health' });
  app.register(Chat, { prefix: '/chat' });
}
