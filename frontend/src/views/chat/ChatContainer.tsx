import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./ChatContainer.module.css";
import { Message } from "@interfaces/Message";
import Chat from "@components/tchat/Chat";
import ChatInput from "@components/tchat/ChatInput";
import { v4 as uuidv4 } from "uuid";

const simulateCreateChat = async (): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const uuid = uuidv4();
      resolve(uuid);
    }, 500);
  });
};

const simulateAIResponse = async (): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Ceci est une réponse générée automatiquement.");
    }, 1500);
  });
};

const ChatContainer: React.FC = () => {
  const { chatId } = useParams<{ chatId?: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!chatId) {
      setMessages([]);
    }
  }, [chatId]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    let currentChatId = chatId;
    if (!currentChatId) {
      currentChatId = await simulateCreateChat();
      navigate(`/c/${currentChatId}`);
    }

    const userMessage: Message = {
      id: messages.length + 1,
      sender: 'user',
      content: message,
    };
    setMessages((prev) => [...prev, userMessage]);

    setIsTyping(true);
    const aiResponseContent = await simulateAIResponse();
    const aiResponse: Message = {
      id: messages.length + 2,
      sender: 'ai',
      content: aiResponseContent,
    };
    setMessages((prev) => [...prev, aiResponse]);
    setIsTyping(false);
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatMessages}>
        <Chat messages={messages} isTyping={isTyping} />
      </div>
      <div className={styles.chatInput}>
        <ChatInput onSendMessage={handleSendMessage} isLoading={isTyping} />
      </div>
    </div>
  );
};

export default ChatContainer;
