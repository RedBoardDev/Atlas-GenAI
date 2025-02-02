import React from "react";
import styles from "./Sidebar.module.css";
import Icon from "@icon";
import ChatContainer from "@views/chat/ChatContainer";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "@config/appRoutes";
import { Button } from "antd";
import { useQuestion } from "../../context/QuestionContext"; // ✅ Import du contexte pour gérer la sélection

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedQuestion } = useQuestion(); // ✅ Permet de stocker la question sélectionnée

  const handleNewChat = () => {
    setSelectedQuestion(""); // ✅ Réinitialise la question sélectionnée
    navigate(APP_ROUTES.PUBLIC.HOME);
  };

  // ✅ Liste des 4 questions affichées sous "New Chat"
  const questions = [
    "Quelles sont les causes du changement climatique ?",
    "Comment se forment les ouragans ?",
    "Quels sont les impacts du réchauffement climatique ?",
    "Comment prévenir les catastrophes naturelles ?",
  ];

  return (
    <div className={styles.sidebar}>
      {/* ✅ HEADER avec LOGO et BOUTON "NEW CHAT" */}
      <div className={styles.header}>
        <div className={styles.logo}>DeepAtlas</div>
        <button className={styles.chatButton} onClick={handleNewChat}>
          <Icon name="plusBubble" size={20} className={styles.chatIcon} />
          New chat
        </button>
      </div>

      {/* ✅ AJOUT DES QUESTIONS SOUS "NEW CHAT" */}
      <div className={styles.questionsGrid}>
        {questions.map((question, index) => (
          <Button
            key={index}
            type="default"
            className={styles.questionButton}
            onClick={() => setSelectedQuestion(question)}
            block
          >
            {question}
          </Button>
        ))}
      </div>

      {/* ✅ CHAMP DE CHAT (TEXTFIELD) AU-DESSOUS DES QUESTIONS */}
      <div className={styles.contentWrapper}>
        <ChatContainer />
      </div>
    </div>
  );
};

export default Sidebar;
