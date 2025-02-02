import { FastifyRequest } from 'fastify';
import { wsConnections } from '@services/ws-connection';

const handler = (connection: any, req: FastifyRequest): void => {
  const { chatId } = req.params as { chatId: string };

  const ws = connection.socket || connection;
  wsConnections.set(chatId, ws);
  ws.on('close', () => {
    wsConnections.delete(chatId);
  });

  ws.send(JSON.stringify({ message: 'WebSocket connection established', chatId }));
};

export default handler;
