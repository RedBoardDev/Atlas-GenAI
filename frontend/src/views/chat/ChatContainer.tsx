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
import { useMap } from "@contexts/MapContext";
import L, { Point } from "leaflet";
import addCustomPolygonToMap from "@utils/customPolygon";
import { addMarkers } from "@utils/plugins";

const suggestions = [
  "Quelles sont les causes du changement climatique ?",
  "Comment se forment les ouragans ?",
  "Quels sont les impacts du réchauffement climatique ?",
  "Comment prévenir les catastrophes naturelles ?",
];

const fktext = `Pour Nice, les données historiques indiquent que le risque d’inondation est élevé, avec une moyenne de 2 à 3 inondations majeures par décennie. En croisant ces informations avec la Base Permanente des Équipements et l’estimation financière des infrastructures publiques, il est estimé que les dégâts potentiels pourraient atteindre jusqu’à 15 millions d’euros en cas d’inondation majeure.

Infrastructures publiques de Nice à risque :
Hôtel de Ville de Nice
Situé en centre-ville et identifié comme se trouvant dans une zone à risque d'inondation

Centre Hospitalier Universitaire (CHU) de Nice
Exposition : En tant qu'établissement essentiel de santé, sa localisation dans ou à proximité de zones vulnérables le rend particulièrement sensible aux inondations, avec des conséquences potentiellement lourdes sur la capacité de soins d'urgence.

Établissements scolaires et culturels
Exposition : Certains établissements (lycées, collèges, centres culturels ou bibliothèques) situés dans des quartiers identifiés par nos données de zones inondables pourraient également être fortement impactés en cas d'inondation majeure`;

const ChatContainer: React.FC = () => {
  const { chatId } = useParams<{ chatId?: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const { map } = useMap();
  ``;

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

    console.log("p1", chatId);
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

  const fakePollingResponse = async () => {
    const delay = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;
    await new Promise((resolve) => setTimeout(resolve, delay));

    const aiMessage: Message = {
      timestamp: Date.now(),
      role: "IA",
      text: fktext,
    };

    setMessages((prev) => [...prev, aiMessage]);

    if (map) {
      map.flyTo([43.70986662878266, 7.255555676898211], 13);
      addCustomPolygonToMap(map);

      const points: any[] = [
        { coords: [43.72982343, 7.25163968], name: "GROUPE SCOLAIRE THERESE ROMEO" },
        { coords: [43.72367764, 7.25665558], name: "GROUPE SCOLAIRE CIMIEZ" },
        { coords: [43.70159482, 7.28144122], name: "GROUPE SCOLAIRE OLIVIERS" },
        { coords: [43.72549008, 7.2463817], name: "GROUPE SCOLAIRE MADONETTE TERRON" },
        { coords: [43.69563527, 7.25213762], name: "GROUPE SCOLAIRE LES ACACIAS" },
        { coords: [43.71061158, 7.2803736], name: "GROUPE SCOLAIRE SAINT CHARLES" },
        { coords: [43.71884905, 7.28149991], name: "GROUPE SCOLAIRE COL DE VILLEFRANCHE" },
        { coords: [43.67261498, 7.2033366], name: "MATERNELLE CHATEAU" },
        { coords: [43.69111227, 7.29846214], name: "MATERNELLE CORNICHE FLEURIE" },
        { coords: [43.67997549, 7.22029995], name: "MATERNELLE PIERRE MERLE" },
        { coords: [43.67940011, 7.22550189], name: "MATERNELLE SAINT ANTOINE DE GINESTIERE" },
        { coords: [43.73245015, 7.24824052], name: "MATERNELLE ANNEXE IUFM" },
        { coords: [43.71486792, 7.28380342], name: "MATERNELLE VON DER WIES" },
        { coords: [43.70323777, 7.22699537], name: "MATERNELLE SAINT EXUPERY" },
        { coords: [43.6855425, 7.23335487], name: "MATERNELLE PESSICART" },
        { coords: [43.71778068, 7.29516579], name: "MATERNELLE SAINT SYLVESTRE" },
        { coords: [43.69107638, 7.20133092], name: "MATERNELLE GAIRAUTINE" },
      ];

      addMarkers(map, points);
    }
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

    // await pollingResponse();
    await fakePollingResponse();
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
