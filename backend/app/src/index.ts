import path from 'node:path';

import fastify from 'fastify';
import dotenv from 'dotenv';
import ajvFormats from 'ajv-formats';
import Ajv from 'ajv';
import { router as apiRoutes } from '@routes/index';
import catchFinallyHandler from '@middlewares/catch-finally-handler';
import ApiError from '@libs/error-management/api-error';
import { ErrorsEnum } from '@enums/errors-enums';
import { setupRateLimit } from '@config/rate-limit';
import { setupHelmet } from '@config/helmet';
import { setupDecorators } from '@config/decorators/setupDecorators';
import { setupCors } from '@config/cors';

dotenv.config({ path: path.resolve(__dirname, '../env/.env') });

export const ffy = fastify({ logger: true });

export const setupServer = async (): Promise<void> => {
  // decorators
  setupDecorators(ffy);

  // plugins
  setupHelmet(ffy);
  setupCors(ffy);
  setupRateLimit(ffy);

  // swagger
  // setupSwagger(ffy);

  // routes
  ffy.register(apiRoutes);

  // handle errors
  ffy.setNotFoundHandler(async (_request, _reply) => {
    throw new ApiError('Route not found', 404, ErrorsEnum.ressourceNotFound);
  });

  ffy.setErrorHandler(catchFinallyHandler);

  ffy.setValidatorCompiler(({ schema }) => {
    const ajv = new Ajv({ coerceTypes: false, strict: true });
    ajvFormats(ajv);
    return ajv.compile(schema);
  });
};

export default ffy;
