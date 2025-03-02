import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { sendMessageToOllama } from '../services/api';
import { ChatMessage } from '../types';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant powered by Ollama. How can I help you today?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await sendMessageToOllama(input);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting response from Ollama:', error);
      
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your request. Please try again later.',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold flex items-center">
          <Bot className="mr-2 h-5 w-5 text-blue-600" />
          Ollama Chat
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-gray-100 text-gray-800 rounded-tl-none'
              }`}
            >
              <div className="flex items-center mb-1">
                {message.role === 'user' ? (
                  <>
                    <span className="font-medium">You</span>
                    <User className="ml-1 h-4 w-4" />
                  </>
                ) : (
                  <>
                    <Bot className="mr-1 h-4 w-4 text-blue-600" />
                    <span className="font-medium">Ollama</span>
                  </>
                )}
              </div>
              <p className="whitespace-pre-wrap">{message.content}</p>
              <span className="text-xs opacity-70 block text-right mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3 rounded-tl-none flex items-center">
              <Loader2 className="h-5 w-5 text-blue-600 animate-spin mr-2" />
              <span>Ollama is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="p-4 border-t flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded-r-lg px-4 py-2 flex items-center hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <span className="mr-1">Send</span>
              <Send className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;