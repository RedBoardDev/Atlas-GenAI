import { FastifyReply, FastifyRequest } from 'fastify';
import { createNewChat } from '@services/chat-service';
import { HttpStatusCode } from '@enums/http-status-enums';

import { TBody } from './schemas';

const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const { prompt } = req.body as TBody;

  const id = createNewChat(prompt);

  return res.status(HttpStatusCode.created).send({ chatId: id });

};

export default handler;
