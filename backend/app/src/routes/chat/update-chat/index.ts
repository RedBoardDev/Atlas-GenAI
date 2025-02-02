import { FastifyInstance } from 'fastify';

import { headers, body, params, querystring, response } from './schemas';
import handler from './handler';

const updateChat = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'PUT',
    url: '/:chatId',
    schema: {
      tags: ['Chat'],
      description: 'Update a chat',
      headers,
      body,
      params,
      querystring,
      response,
    },
    handler,
  });
};

export default updateChat;
