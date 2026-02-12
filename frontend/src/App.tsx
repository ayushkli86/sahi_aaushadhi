import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChatBotProvider } from "@/components/chatbot";
import MedicineChatBot from "@/components/chatbot/MedicineChatBot";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Verify from "./pages/Verify";
import Dashboard from "./pages/Dashboard";
import DDAView from "./pages/DDAView";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ChatBotProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/regulator" element={<DDAView />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <MedicineChatBot />
        </BrowserRouter>
      </ChatBotProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
