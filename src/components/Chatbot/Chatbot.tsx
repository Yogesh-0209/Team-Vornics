import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2,
  RotateCcw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Paperclip,
  Mic,
  MicOff
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  typing?: boolean;
  suggestions?: string[];
}

interface ChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Chatbot({ isOpen, onToggle }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your SoF Assistant. I can help you with document processing, maritime terminology, and answer questions about laytime calculations. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
      suggestions: [
        "How do I upload a document?",
        "What file formats are supported?",
        "Explain laytime calculations",
        "Show processing status"
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const generateBotResponse = async (userMessage: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const message = userMessage.toLowerCase();

    // Maritime and SoF specific responses
    if (message.includes('upload') || message.includes('file')) {
      return "To upload a document:\n\n1. Click the 'Upload' tab in the sidebar\n2. Drag & drop your PDF or Word file\n3. Or click 'browse' to select files\n4. Supported formats: PDF, DOC, DOCX (max 10MB)\n5. Click 'Process Files' to start extraction\n\nThe system will automatically extract maritime events like anchoring, loading, discharge, and departure times.";
    }

    if (message.includes('format') || message.includes('support')) {
      return "Supported file formats:\n\n📄 **PDF** (.pdf) - Most common SoF format\n📝 **Word Documents** (.docx, .doc)\n\n**File Requirements:**\n• Maximum size: 10MB per file\n• Template agnostic - works with any SoF layout\n• Multiple files can be processed simultaneously\n\n**Best Results:**\n• Clear, readable text\n• Structured format with dates and times\n• Standard maritime terminology";
    }

    if (message.includes('laytime') || message.includes('calculation')) {
      return "**Laytime Calculations:**\n\nLaytime is the time allowed for loading/discharging cargo. Our system automatically:\n\n⏱️ **Extracts Events:**\n• Anchoring times\n• Berth arrival/departure\n• Cargo operations start/end\n• Weather delays\n\n📊 **Calculates:**\n• Total laytime used\n• Demurrage/despatch\n• Waiting time\n• Operational efficiency\n\n💡 **Tip:** Ensure your SoF documents include clear timestamps for accurate calculations.";
    }

    if (message.includes('status') || message.includes('processing')) {
      return "To check processing status:\n\n1. **Processing Tab** - View active jobs\n2. **Real-time Updates** - Progress bars show completion\n3. **Notifications** - Get alerts when processing completes\n\n**Status Types:**\n🟡 Processing - Document being analyzed\n🟢 Completed - Ready for download\n🔴 Failed - Check error details\n\nProcessing typically takes 30 seconds to 2 minutes depending on document complexity.";
    }

    if (message.includes('event') || message.includes('extract')) {
      return "**Maritime Events We Extract:**\n\n⚓ **Anchoring** - Vessel at anchor\n🚢 **Arrival** - Port entry\n🏗️ **Berthing** - Alongside operations\n📦 **Loading** - Cargo loading operations\n📤 **Discharge** - Cargo discharge operations\n🔄 **Shifting** - Berth changes\n⛽ **Bunkers** - Fuel operations\n🌊 **Weather** - Delays due to conditions\n🚪 **Departure** - Port exit\n\nEach event includes start/end times, duration, and location details.";
    }

    if (message.includes('error') || message.includes('problem') || message.includes('issue')) {
      return "**Common Issues & Solutions:**\n\n❌ **Upload Failed:**\n• Check file size (max 10MB)\n• Ensure supported format (PDF/Word)\n• Try refreshing the page\n\n❌ **Processing Failed:**\n• Document may be corrupted\n• Text might not be readable\n• Try a different file format\n\n❌ **No Events Found:**\n• Document may lack clear timestamps\n• Check if it's a valid SoF document\n• Ensure text is not image-based\n\n💡 Need more help? Contact our support team!";
    }

    if (message.includes('download') || message.includes('export')) {
      return "**Download Options:**\n\n📊 **JSON Format:**\n• Complete structured data\n• Includes vessel & port info\n• Event details with timestamps\n• Perfect for API integration\n\n📈 **CSV Format:**\n• Spreadsheet-friendly\n• Event timeline data\n• Easy to analyze in Excel\n• Great for reporting\n\n**How to Download:**\n1. Go to 'Results' tab\n2. Select your processed file\n3. Click 'Download JSON' or 'Download CSV'\n4. Files save to your Downloads folder";
    }

    if (message.includes('help') || message.includes('support')) {
      return "**I'm here to help! 🤝**\n\nI can assist with:\n\n📋 **Document Processing**\n• Upload procedures\n• File format questions\n• Processing status\n\n⚓ **Maritime Knowledge**\n• Laytime calculations\n• SoF terminology\n• Port operations\n\n🔧 **Technical Support**\n• Troubleshooting\n• Feature explanations\n• Best practices\n\n💬 **Just ask me anything!** I'm trained on maritime operations and this platform's features.";
    }

    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      const greetings = [
        "Hello! Ready to help with your maritime document processing needs! 🚢",
        "Hi there! I'm your SoF processing assistant. What can I help you with today?",
        "Hey! Welcome to SoF Extractor. How can I make your maritime operations smoother?",
        "Greetings! I'm here to help with document processing and maritime questions. Fire away!"
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }

    if (message.includes('thank') || message.includes('thanks')) {
      return "You're very welcome! 😊 I'm always here to help with your maritime document processing needs. Feel free to ask if you have any other questions!";
    }

    // Default responses for unmatched queries
    const defaultResponses = [
      "I understand you're asking about maritime operations. Could you be more specific? I can help with document processing, laytime calculations, or SoF terminology.",
      "That's an interesting question! I specialize in SoF document processing and maritime operations. Could you rephrase your question or ask about:\n\n• Document upload procedures\n• File processing status\n• Maritime event extraction\n• Laytime calculations",
      "I'm here to help with SoF Extractor features and maritime knowledge. Try asking about:\n\n• 'How do I upload documents?'\n• 'What events can you extract?'\n• 'Explain laytime calculations'\n• 'Show me processing status'",
      "I'd love to help! I'm specialized in maritime document processing. For the best assistance, try asking about:\n\n📄 Document processing\n⚓ Maritime operations\n📊 Data extraction\n🔧 Platform features"
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const botResponse = await generateBotResponse(inputText);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment, or contact our support team if the issue persists.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
    inputRef.current?.focus();
  };

  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Message copied to clipboard');
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        text: "Chat cleared! I'm still here to help with your SoF processing questions. What would you like to know?",
        sender: 'bot',
        timestamp: new Date(),
        suggestions: [
          "How do I upload a document?",
          "What file formats are supported?",
          "Explain laytime calculations",
          "Show processing status"
        ]
      }
    ]);
    toast.success('Chat history cleared');
  };

  const startVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        toast.error('Voice recognition failed. Please try again.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      toast.error('Voice recognition not supported in this browser');
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center z-50 hover:scale-110"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
        </span>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 transition-all duration-300 ${
      isMinimized ? 'h-16' : 'h-[600px]'
    }`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">SoF Assistant</h3>
            <p className="text-xs text-blue-100">Maritime AI Helper</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={clearChat}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            title="Clear chat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onToggle}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 h-96 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className={`flex items-start gap-2 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {message.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</div>
                      
                      {message.sender === 'bot' && (
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
                          <button
                            onClick={() => copyMessage(message.text)}
                            className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-700"
                            title="Copy message"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <button
                            className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-green-600"
                            title="Helpful"
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </button>
                          <button
                            className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-red-600"
                            title="Not helpful"
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Suggestions */}
                  {message.suggestions && (
                    <div className="mt-3 space-y-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="block w-full text-left px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-400 mt-1 px-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about SoF processing..."
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  disabled={isTyping}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  <button
                    onClick={startVoiceRecognition}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isListening 
                        ? 'bg-red-100 text-red-600' 
                        : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
                    }`}
                    title="Voice input"
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>Press Enter to send</span>
              <span>Powered by Maritime AI</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
