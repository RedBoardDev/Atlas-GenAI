import React, { useEffect, useRef } from 'react';
import styles from './Chat.module.css';
import { Message } from '@interfaces/Message';

interface ChatProps {
  messages: Message[];
  isTyping: boolean;
}

const Chat: React.FC<ChatProps> = ({ messages, isTyping }) => {
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isTyping]);

  return (
    <div className={styles.chat}>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`${styles.message} ${
            message.sender === "user" ? styles.userMessage : styles.aiMessage
          }`}
        >
          {message.content}
        </div>
      ))}
      {isTyping && <div className={styles.typingIndicator}>Typing...</div>}
      <div ref={chatRef} />
    </div>
  );
};

export default Chat;
