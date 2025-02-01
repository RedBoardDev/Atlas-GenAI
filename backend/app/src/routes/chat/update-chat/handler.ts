import { FastifyReply, FastifyRequest } from 'fastify';
import { appendToChat } from '@services/chat-service';
import { HttpStatusCode } from '@enums/http-status-enums';

import { TBody } from './schemas';

const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const { chatId, prompt } = req.body as TBody;

  appendToChat(chatId, prompt);

  return res.status(HttpStatusCode.ok).send({ chatId});
};

export default handler;
