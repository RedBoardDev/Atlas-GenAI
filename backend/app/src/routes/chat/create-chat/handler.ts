import { FastifyReply, FastifyRequest } from 'fastify';
import { createNewChat } from '@services/chat-service';
import { HttpStatusCode } from '@enums/http-status-enums';

import { TBody } from './schemas';

const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const { chatId, prompt } = req.body as TBody;

  await createNewChat(chatId, 'user', prompt);

  return res.status(HttpStatusCode.created).send({ chatId, prompt });

};

export default handler;
