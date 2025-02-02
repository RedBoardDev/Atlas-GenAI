import { FastifyInstance } from 'fastify';

import { chatWsParams } from './schemas';
import handler from './handler';

export default async function chatWebsocketRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get(
    '/:chatId',
    {
      websocket: true,
      schema: chatWsParams,
    },
    handler,
  );
}
