import React, { useState, useRef, useEffect } from "react";
import Icon from "@icon";
import styles from "./ChatInput.module.css";
import { Button, Modal, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        300
      )}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const handleSend = () => {
    // onSendMessage(message);
    // setMessage("");
    // if (textareaRef.current) {
    //   textareaRef.current.style.height = "auto";
    // }
    setIsModalVisible(true)
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.chatInput}>
      <textarea
        ref={textareaRef}
        placeholder="Écrivez votre message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        className={styles.input}
        rows={1}
      />
      <button
        className={styles.sendButton}
        disabled={!message.trim() || isLoading}
        // disabled
        onClick={handleSend}
      >
        {isLoading ? (
          <Spin
            indicator={<LoadingOutlined spin />}
            size="default"
            className={styles.loadingIcon}
          />
        ) : (
          <Icon
            name="arrowUp"
            size={20}
            className={
              message.trim() ? styles.sendIconActive : styles.sendIconDisabled
            }
          />
        )}
      </button>
      <Modal
        title="Fonctionnalité désactivée"
        visible={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button
            key="ok"
            type="primary"
            onClick={() => setIsModalVisible(false)}
          >
            OK
          </Button>,
        ]}
      >
        <p>
          Cette fonctionnalité est désactivée pour des fins de démonstration.
        </p>
      </Modal>
    </div>
  );
};

export default ChatInput;
