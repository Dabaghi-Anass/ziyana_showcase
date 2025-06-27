import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../api/api';
import './FloatingChatbot.css';
type ChatMessage = {
  role: 'user' | 'bot';
  content: string;
};

type ResponseType = {
  success: boolean;
  data: {
    user_message: string;
    bot_response: string;
    timestamp: string;
  };
};
export const FloatingChatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const botReply: ResponseType = (await sendChatMessage({
        message: userMessage.content,
      })) as ResponseType;
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          content: botReply.data.bot_response,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: 'Sorry, something went wrong.' },
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') sendMessage();
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className='fixed bottom-6 right-6 z-50 text-sm font-sans'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='bg-blue-600 text-white px-4 py-2 rounded-full shadow-md'
      >
        {isOpen ? 'Close Chat' : 'Chat with us'}
      </button>

      {isOpen && (
        <div className='mt-2 w-80 h-96 bg-white rounded-lg shadow-lg flex flex-col border border-gray-300'>
          <div className='flex-1 p-3 overflow-y-auto space-y-2'>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-md ${
                  msg.role === 'user'
                    ? 'bg-blue-100 self-end text-right'
                    : 'bg-gray-100 self-start text-left'
                }`}
              >
                {msg.content}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className='p-2 border-t border-gray-300 flex'>
            <input
              className='flex-1 p-2 border rounded-md text-sm'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Type your message...'
            />
            <button
              onClick={sendMessage}
              className='ml-2 px-3 py-2 bg-blue-600 text-white rounded-md'
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
