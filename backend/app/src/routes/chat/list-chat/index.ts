import { FastifyInstance } from 'fastify';

import { headers, params, querystring, response } from './schemas';
import handler from './handler';

const listChat = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'GET',
    url: '/:chatId',
    schema: {
      tags: ['Chat'],
      description: 'List chat from chatId',
      headers,
      params,
      querystring,
      response,
    },
    handler,
  });
};

export default listChat;
