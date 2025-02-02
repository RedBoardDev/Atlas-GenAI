/* eslint-disable @typescript-eslint/explicit-function-return-type */
// handler.js
import { Context } from 'aws-lambda';
import awsLambdaFastify from '@fastify/aws-lambda';

import { ffy, setupServer } from './app/src/index.js';

// Configure l'application Fastify pour AWS Lambda
const proxy = awsLambdaFastify(ffy);

// Initialise le serveur avant de gérer les requêtes
const init = async () => {
  await setupServer();
  await ffy.ready();
};

// Initialise le serveur une seule fois
let initialized = false;
export const handler = async (event: unknown, context: Context) => {
  if (!initialized) {
    await init();
    initialized = true;
  }
  return proxy(event, context);
};