import { FastifyInstance } from 'fastify';

import { headers, params, querystring, response } from './schemas';
import handler from './handler';


const updateChat = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'PUT',
    url: '',
    schema: {
      tags: ['Chat'],
      description: 'Update a chat',
      headers,
      params,
      querystring,
      response,
    },
    handler,
  });
};

export default updateChat;
