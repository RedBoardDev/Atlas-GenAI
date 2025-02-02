import { FastifyInstance } from 'fastify';

import updateChat from './update-chat';
import listChat from './list-chat';
import createChat from './create-chat';

const Chat = async (app: FastifyInstance): Promise<void> => {
  app.register(createChat);
  app.register(updateChat);
  app.register(listChat);
};

export default Chat;
