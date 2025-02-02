import { Message } from "@interfaces/Message";
import API_URL from "@utils/ApiURL.json";

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_URL.API_URL}${endpoint}`, options);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `API error ${response.status} ${response.statusText}: ${errorText}`
    );
  }
  return response.json() as Promise<T>;
}

const ApiFct = {
  generateChat: async (
    chatId: string,
    prompt: string
  ): Promise<{ chatId: string; prompt: string }> =>
    request<{ chatId: string; prompt: string }>("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId, prompt }),
    }),

  sendMessage: async (chatId: string, message: string): Promise<Message> =>
    request<Message>(`/chat/${chatId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: message }),
    }),

  getMessages: async (
    chatId: string
  ): Promise<{
    chatId: string;
    chat: {
      chatId: string;
      createdAt: number;
      messages: Message[];
      updatedAt: number;
    };
  }> => {
    const data = await request<{
      chatId: string;
      chat: {
        chatId: string;
        createdAt: number;
        messages: Message[];
        updatedAt: number;
      };
    }>(`/chat/${chatId}`);
    return data;
  },
};

export default ApiFct;
