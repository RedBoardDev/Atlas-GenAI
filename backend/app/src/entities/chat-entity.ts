import { FromSchema } from 'json-schema-to-ts';

export const createChatSchema = {
  type: 'object',
  properties: {
    chatId: { type: 'string' },
    prompt: { type: 'string' },
  },
  required: ['chatId', 'prompt'],
  additionalProperties: false,
} as const;

export type CreateChatData = FromSchema<typeof createChatSchema>;

export const updateChatSchema = {
  type: 'object',
  properties: { prompt: { type: 'string' } },
  required: ['prompt'],

  additionalProperties: false,
} as const;

export type UpdateChatData = FromSchema<typeof updateChatSchema>;
