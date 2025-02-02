import { FastifyReply, FastifyRequest } from 'fastify';
import { getChat } from '@services/chat-service';
import { HttpStatusCode } from '@enums/http-status-enums';

const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const { chatId } = req.params as { chatId: string };

  const chat = await getChat(chatId);

  return res.status(HttpStatusCode.ok).send({ chatId, chat });
};

export default handler;
