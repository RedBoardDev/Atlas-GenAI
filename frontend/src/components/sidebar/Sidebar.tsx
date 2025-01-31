import React from "react";
import styles from "./Sidebar.module.css";
import Icon from "@icon";
import ChatContainer from "@views/chat/ChatContainer";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "@config/appRoutes";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleNewChat = () => {
    navigate(APP_ROUTES.PUBLIC.HOME);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.logo}>DeepAtlas</div>
        <button className={styles.chatButton} onClick={handleNewChat}>
          <Icon name="plusBubble" size={20} className={styles.chatIcon} />
          New chat
        </button>
      </div>

      <div className={styles.contentWrapper}>
        <ChatContainer />
      </div>
    </div>
  );
};

export default Sidebar;
