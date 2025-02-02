import { FastifyInstance } from 'fastify';
import fastifyWebsocket from '@fastify/websocket';

export const setupWebsockets = (ffy: FastifyInstance): void => {
  ffy.register(fastifyWebsocket);
};
