import { FromSchema } from 'json-schema-to-ts';

export const chatWsParams = {
  params: {
    type: 'object',
    properties: { chatId: { type: 'string' } },
    required: ['chatId'],
  },
  additionalProperties: false,
};

export type TChatWsParams = FromSchema<typeof chatWsParams>;
