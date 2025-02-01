import { FastifyInstance } from 'fastify';

import updateChat from './update-chat';
import createChat from './create-chat';

const Chat = async (app: FastifyInstance): Promise<void> => {
  app.register(createChat);
  app.register(updateChat);
};

export default Chat;
