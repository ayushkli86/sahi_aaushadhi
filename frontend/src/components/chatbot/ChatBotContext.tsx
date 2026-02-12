import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ChatBotContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  triggerMessage: (message: string) => void;
}

const ChatBotContext = createContext<ChatBotContextType | undefined>(undefined);

export const useChatBot = () => {
  const context = useContext(ChatBotContext);
  if (!context) {
    throw new Error('useChatBot must be used within a ChatBotProvider');
  }
  return context;
};

interface ChatBotProviderProps {
  children: ReactNode;
}

export const ChatBotProvider: React.FC<ChatBotProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  const triggerMessage = (message: string) => {
    setPendingMessage(message);
    setIsOpen(true);
  };

  return (
    <ChatBotContext.Provider
      value={{
        isOpen,
        setIsOpen,
        unreadCount,
        setUnreadCount,
        triggerMessage,
      }}
    >
      {children}
    </ChatBotContext.Provider>
  );
};