import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import './MedicineChatBot.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface VerificationResult {
  status: string;
  confidence: string;
  medicine?: any;
  message: string;
  warnings?: string[];
  checks?: any;
}

const MedicineChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I can help you verify medicines and answer questions about pharmaceutical safety. How can I assist you today?',
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const simulateTyping = async (duration: number = 1000) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, duration));
    setIsTyping(false);
  };

  const verifyMedicine = async (productId: string): Promise<VerificationResult | null> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: productId.toUpperCase() })
      });
      return await response.json();
    } catch (error) {
      console.error('Verification error:', error);
      return null;
    }
  };

  const formatVerificationResult = (result: VerificationResult): string => {
    const statusEmojis = {
      'AUTHENTIC': '✅',
      'COUNTERFEIT': '🚨',
      'NOT_FOUND': '🚨',
      'EXPIRED': '⏰',
      'SUSPICIOUS': '⚠️'
    };

    const emoji = statusEmojis[result.status as keyof typeof statusEmojis] || '❓';
    
    let response = `${emoji} ${result.status.toUpperCase()}\n\n`;
    
    if (result.medicine) {
      response += `Product: ${result.medicine.name}\n`;
      response += `Manufacturer: ${result.medicine.manufacturer}\n`;
      response += `Batch: ${result.medicine.batch_number}\n`;
      if (result.medicine.expiry_date) {
        response += `Expires: ${new Date(result.medicine.expiry_date).toLocaleDateString()}\n`;
      }
      response += `\n`;
    }
    
    response += `Confidence: ${result.confidence}\n`;
    response += `Status: ${result.message}\n`;
    
    if (result.warnings && result.warnings.length > 0) {
      response += `\nWarnings:\n`;
      result.warnings.forEach(warning => {
        response += `• ${warning}\n`;
      });
    }
    
    if (result.checks) {
      response += `\nVerification Checks:\n`;
      response += `• Database: ${result.checks.databaseFound ? '✅' : '❌'}\n`;
      response += `• Blockchain: ${result.checks.blockchainVerified ? '✅' : '❌'}\n`;
      response += `• Not Expired: ${result.checks.notExpired ? '✅' : '❌'}\n`;
    }

    // Add safety recommendations
    if (result.status === 'COUNTERFEIT' || result.status === 'NOT_FOUND') {
      response += `\n🚨 SAFETY ALERT:\n`;
      response += `• Do NOT consume this medicine\n`;
      response += `• Report to authorities immediately\n`;
      response += `• Contact the pharmacy where purchased\n`;
    } else if (result.status === 'EXPIRED') {
      response += `\n⚠️ ACTION REQUIRED:\n`;
      response += `• Do NOT consume expired medicine\n`;
      response += `• Dispose of safely at pharmacy\n`;
    } else if (result.status === 'AUTHENTIC') {
      response += `\n✅ Safe to Use:\n`;
      response += `• This medicine is verified authentic\n`;
      response += `• Follow prescribed dosage instructions\n`;
    }
    
    return response;
  };

  const getBotResponse = async (userMessage: string): Promise<string> => {
    const message = userMessage.toLowerCase();
    
    // Extract product ID patterns
    const productIdMatch = message.match(/med-[a-z0-9]+/i) || 
                          message.match(/[a-z]+-[a-z0-9]+/i) ||
                          message.match(/[a-z0-9]{6,}/i);
    
    // Medicine verification
    if (message.includes('verify') || message.includes('check') || productIdMatch) {
      if (productIdMatch) {
        const productId = productIdMatch[0].toUpperCase();
        const result = await verifyMedicine(productId);
        
        if (result) {
          return formatVerificationResult(result);
        } else {
          return `❌ Verification Error\n\nI couldn't verify "${productId}" right now. Please try again later or use our main verification page.`;
        }
      } else {
        return `🔍 Medicine Verification\n\nTo verify a medicine, please provide the product ID (e.g., MED-AUTH001) or scan the QR code.\n\nExample: "Verify MED-AUTH001"`;
      }
    }

    // How it works
    if (message.includes('how') && (message.includes('work') || message.includes('system'))) {
      return `🔧 How MediChain Works\n\n1. Medicine Registration: Manufacturers register products on blockchain\n2. QR Generation: Each medicine gets unique digital fingerprint\n3. Verification Process: Scan QR or enter product ID\n4. Multi-layer Check: Database → Blockchain → Expiry validation\n5. Real-time Results: Instant authenticity confirmation\n\nOur system uses blockchain technology to ensure medicine authenticity.`;
    }

    // Security features
    if (message.includes('security') || message.includes('safe') || message.includes('blockchain')) {
      return `🛡️ Security Features\n\n• Blockchain Technology: Immutable medicine records\n• QR Code Security: One-time use, tamper-proof\n• Multi-layer Verification: Database + Blockchain + Expiry\n• Real-time Validation: Instant authenticity checks\n• Privacy Protection: No personal data on blockchain\n\nYour safety is our priority!`;
    }

    // Report counterfeit
    if (message.includes('report') || message.includes('counterfeit') || message.includes('fake')) {
      return `🚨 Report Counterfeit Medicine\n\nIf you found a counterfeit medicine:\n\n1. STOP using it immediately\n2. Take photos of packaging and product\n3. Note purchase location and date\n4. Report to local drug authority\n5. Contact the manufacturer\n\nEmergency: If consumed, seek medical attention immediately!`;
    }

    // General help
    if (message.includes('help') || message.includes('support')) {
      return `💡 How I Can Help\n\n• Verify medicines by product ID\n• Explain how our system works\n• Provide security information\n• Guide you through reporting counterfeit products\n• Answer questions about medicine safety\n\nTry: "Verify MED-AUTH001" or "How does it work?"`;
    }

    // Greeting responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return `👋 Hello! I'm your MediChain assistant. I can help you verify medicines and ensure your safety.\n\nWhat can I help you with today?\n\n• Type a product ID to verify\n• Ask "How does it work?"\n• Say "Help" for more options`;
    }

    // Default response
    return `🤔 I'm here to help with medicine verification and safety!\n\nI can help you with:\n• Medicine verification - "Verify MED-AUTH001"\n• System information - "How does it work?"\n• Security details - "Is it secure?"\n• Report issues - "Report counterfeit"\n\nWhat would you like to know?`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    
    // Add user message
    addMessage(userMessage, 'user');
    
    // Simulate bot typing
    await simulateTyping(800);
    
    // Get and add bot response
    const botResponse = await getBotResponse(userMessage);
    addMessage(botResponse, 'bot');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div id="chatbot-btn" onClick={toggleChat}>
        <img src="/icon.png" alt="Medicine Chatbot" />
      </div>

      {/* Chatbot Box */}
      {isOpen && (
        <div id="chatbot-box">
          <div id="chat-header">
            <span id="close-btn" onClick={closeChat}>✖</span>
          </div>

          <div id="chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={message.sender === 'user' ? 'user-msg' : 'bot-msg'}
              >
                {message.text.split('\n').map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    {index < message.text.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            ))}

            {isTyping && (
              <div className="bot-msg">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div id="chat-input">
            <input
              type="text"
              id="user-input"
              placeholder="Ask about medicine..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button id="send-btn" onClick={handleSendMessage}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MedicineChatBot;