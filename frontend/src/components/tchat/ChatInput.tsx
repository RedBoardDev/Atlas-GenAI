import React, { useState, useRef, useEffect } from "react";
import Icon from "@icon";
import styles from "./ChatInput.module.css";
import { Spin, message as antdMessage } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useQuestion } from "../../context/QuestionContext";

const ChatInput: React.FC = () => {
  const { selectedQuestion } = useQuestion();
  const [message, setMessage] = useState<string>(selectedQuestion); // Initialiser avec la question sélectionnée
  const [isLoading, setIsLoading] = useState<boolean>(false); // Ajout d'un état de chargement
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Met à jour le champ de texte avec la question sélectionnée
    setMessage(selectedQuestion);
  }, [selectedQuestion]);

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

  // Fonction pour envoyer le message au backend
  const handleSend = async () => {
    if (!message.trim()) return;

    setIsLoading(true); // Activer le chargement
    try {
      const response = await fetch("https://ton-backend.com/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi du message");
      }

      const data = await response.json();
      console.log("Réponse du backend:", data);

      // Optionnel : Afficher une notification de succès avec Ant Design
      antdMessage.success("Message envoyé avec succès !");
    } catch (error) {
      console.error("Erreur:", error);
      antdMessage.error("Impossible d'envoyer le message.");
    } finally {
      setIsLoading(false); // Désactiver le chargement
      setMessage(""); // Réinitialiser le champ de texte
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
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
    </div>
  );
};

export default ChatInput;
