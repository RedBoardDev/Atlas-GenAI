import React, { createContext, useContext, useState, ReactNode } from "react";

// Définition du type pour le contexte
interface QuestionContextType {
  selectedQuestion: string;
  setSelectedQuestion: (question: string) => void;
}

// Création du contexte
const QuestionContext = createContext<QuestionContextType | undefined>(undefined);

// Provider pour stocker et partager l'état
export const QuestionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");

  return (
    <QuestionContext.Provider value={{ selectedQuestion, setSelectedQuestion }}>
      {children}
    </QuestionContext.Provider>
  );
};

// Hook pour accéder au contexte
export const useQuestion = () => {
  const context = useContext(QuestionContext);
  if (!context) {
    throw new Error("useQuestion doit être utilisé dans un QuestionProvider");
  }
  return context;
};
