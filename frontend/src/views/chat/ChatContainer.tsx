import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, message } from "antd";
import styles from "./ChatContainer.module.css";
import { Message } from "@interfaces/Message";
import Chat from "@components/tchat/Chat";
import ChatInput from "@components/tchat/ChatInput";
import { v4 as uuidv4 } from "uuid";
import ApiFct from "@services/apiService";
import { APP_ROUTES } from "@config/appRoutes";

const suggestions = [
  "Quelles sont les causes du changement climatique ?",
  "Comment se forment les ouragans ?",
  "Quels sont les impacts du réchauffement climatique ?",
  "Comment prévenir les catastrophes naturelles ?",
];

const ChatContainer: React.FC = () => {
  const { chatId } = useParams<{ chatId?: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (chatId) {
      ApiFct.getMessages(chatId)
        .then((chat) => {
          setMessages(chat.chat.messages);
        })
        .catch((error) => {
          console.error(error);
          setMessages([]);
        });
    } else {
      setMessages([]);
    }
  }, []);

  useEffect(() => {
    if (!chatId) setMessages([]);
  }, [chatId]);

  const pollingResponse = async () => {
    let attempts = 30;
    const latestMessage = messages[messages.length - 1];
    let aiResponseContent: {
      chatId: string;
      createdAt: number;
      messages: Message[];
      updatedAt: number;
    } | null = null;

    console.log('p1', chatId);
    if (!chatId) return;
    while (attempts > 0) {
      const chat = await ApiFct.getMessages(chatId);
      const lastMessage = chat.chat.messages[chat.chat.messages.length - 1];

      console.log(lastMessage.timestamp, latestMessage.timestamp);
      if (lastMessage.timestamp !== latestMessage.timestamp) {
        aiResponseContent = chat.chat;
        break;
      }

      attempts--;
      await new Promise((resolve) => setTimeout(resolve, 1000 * 5));
    }

    if (attempts < 1) {
      message.error(
        "Le délai de réponse de l'IA a été dépassé. Veuillez réessayer."
      );
      navigate(APP_ROUTES.PUBLIC.HOME);
    }

    if (aiResponseContent && aiResponseContent.messages)
      setMessages(aiResponseContent.messages);
    setIsTyping(false);
  };

  const handleNewChat = async (message: string) => {
    const chatId = uuidv4();
    navigate(`/c/${chatId}`);
    await ApiFct.generateChat(chatId, message);
  };

  const handleNewMessage = async (chatId: string, message: string) => {
    await ApiFct.sendMessage(chatId, message);
  };

  const handleSendMessage = async (message: string) => {
    setIsTyping(true);

    if (!message.trim()) return;

    const userMessage: Message = {
      timestamp: Date.now(),
      role: "user",
      text: message,
    };
    setMessages((prev) => [...prev, userMessage]);

    if (!chatId) handleNewChat(message);
    else handleNewMessage(chatId, message);
    console.log('d1');
    await pollingResponse();
    console.log('d2');
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatMessages}>
        <Chat messages={messages} isTyping={isTyping} />
      </div>
      {!chatId && messages.length === 0 && (
        <div className={styles.suggestions}>
          {suggestions.map((question, index) => (
            <Button
              key={index}
              className={styles.suggestionButton}
              onClick={() => handleSendMessage(question)}
            >
              {question}
            </Button>
          ))}
        </div>
      )}
      <div className={styles.chatInput}>
        <ChatInput onSendMessage={handleSendMessage} isLoading={isTyping} />
      </div>
    </div>
  );
};

export default ChatContainer;
