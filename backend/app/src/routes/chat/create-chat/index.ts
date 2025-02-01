import { FastifyInstance } from 'fastify';

import { headers, params, querystring, response } from './schemas';
import handler from './handler';


const createChat = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'POST',
    url: '',
    schema: {
      tags: ['Chat'],
      description: 'Create a chat',
      headers,
      params,
      querystring,
      response,
    },
    handler,
  });
};

export default createChat;
