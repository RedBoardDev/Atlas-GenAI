import DynamoService from '@services/dynamo-service';
import {
  PutCommandInput,
  UpdateCommandInput,
  GetCommandInput,
  ScanCommandInput,
  ScanCommandOutput,
} from '@aws-sdk/lib-dynamodb';

const TABLE_NAME = process.env.CHATS_TABLE || 'Chats';

export interface ChatMessage {
  role: string;
  text: string;
  timestamp: number;
}

export interface Chat {
  chatId: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export const createNewChat = async (chatId: string, role: 'user' | 'IA', initialMessage: string): Promise<string> => {
  const now = Date.now();
  const item: Chat = {
    chatId,
    messages: [
      {
        role,
        text: initialMessage,
        timestamp: now,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };

  const params: PutCommandInput = {
    TableName: TABLE_NAME,
    Item: item,
  };

  await DynamoService.create(params);
  simulateResponse(chatId, initialMessage);
  return chatId;
};

export const appendToChat = async (chatId: string, message: string): Promise<void> => {
  const now = Date.now();
  const params: UpdateCommandInput = {
    TableName: TABLE_NAME,
    Key: { chatId },
    UpdateExpression: 'SET messages = list_append(if_not_exists(messages, :empty), :newMsg), updatedAt = :now',
    ExpressionAttributeValues: {
      ':newMsg': [
        {
          role: 'user',
          text: message,
          timestamp: now,
        },
      ],
      ':empty': [],
      ':now': now,
    },
    ReturnValues: 'UPDATED_NEW',
  };

  await DynamoService.update(params);
  simulateResponse(chatId, message);
};

const simulateResponse = (chatId: string, message: string): void => {
  const delay = Math.floor(Math.random() * (20000 - 5000 + 1)) + 5000;

  setTimeout(async () => {
    const simulatedResponse = `Réponse simulée pour le message: ${message}`;
    const now = Date.now();

    const updateParams: UpdateCommandInput = {
      TableName: TABLE_NAME,
      Key: { chatId },
      UpdateExpression: 'SET messages = list_append(messages, :iaMsg), updatedAt = :now',
      ExpressionAttributeValues: {
        ':iaMsg': [
          {
            role: 'IA',
            text: simulatedResponse,
            timestamp: now,
          },
        ],
        ':now': now,
      },
      ReturnValues: 'UPDATED_NEW',
    };

    await DynamoService.update(updateParams);
  }, delay);
};

export const getChat = async (chatId: string): Promise<Chat | undefined> => {
  const params: GetCommandInput = {
    TableName: TABLE_NAME,
    Key: { chatId },
  };
  const result = await DynamoService.get(params);
  return result.Item as Chat | undefined;
};

export const listChats = async (): Promise<Chat[]> => {
  const params: ScanCommandInput = { TableName: TABLE_NAME };
  const result: ScanCommandOutput = await DynamoService.scan(params);
  return (result.Items as Chat[]) || [];
};
