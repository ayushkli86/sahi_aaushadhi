import { ReactNode } from 'react';
import Navbar from './Navbar';
import MedicineChatBot from './chatbot/MedicineChatBot';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <>
      <Navbar />
      {children}
      <MedicineChatBot />
    </>
  );
};

export default AppLayout;
