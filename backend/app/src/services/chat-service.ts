import { v4 as uuidv4 } from 'uuid';

interface Chat {
  chatId: string;
  messages: string[];
}

const chats: Record<string, Chat> = {};

export const createNewChat = (initialMessage: string): string => {
  const chatId = uuidv4();
  chats[chatId] = { chatId, messages: [initialMessage] };
  simulateResponse(chatId, initialMessage);
  return chatId;
};

export const appendToChat = (chatId: string, message: string): void => {
  if (!chats[chatId]) {
    throw new Error('Chat not found');
  }
  chats[chatId].messages.push(message);
  simulateResponse(chatId, message);
};

const simulateResponse = (chatId: string, message: string): void => {
  setTimeout(() => {
    const simulatedResponse = `Réponse simulée pour le message: ${message}`;
    console.log(`Chat ${chatId} – Réponse envoyée via websocket : ${simulatedResponse}`);
  }, 3000);
};
