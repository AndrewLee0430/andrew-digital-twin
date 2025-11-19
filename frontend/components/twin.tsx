'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function Twin() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput(''); setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/chat`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content, session_id: sessionId || undefined }),
      });
      if (!res.ok) throw new Error('Failed to send message');
      const data = await res.json();
      if (!sessionId) setSessionId(data.session_id);
      setMessages(prev => [...prev, { id: (Date.now()+1).toString(), role: 'assistant', content: data.response, timestamp: new Date() }]);
    } catch {
      setMessages(prev => [...prev, { id: (Date.now()+2).toString(), role: 'assistant', content: 'Sorry, I encountered an error. Please try again.', timestamp: new Date() }]);
    } finally { setIsLoading(false); }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header：保留亮色，並增加內距讓不顯擠 */}
      <div className="bg-gradient-to-r from-sky-500 to-cyan-600 text-white px-5 py-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Bot className="w-6 h-6" />
          AI Digital Twin
        </h2>
      </div>

      {/* Messages：min-h-0 讓 flex 容器內部高度正確，避免整頁滾動 */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <Bot className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>Hello! I&apos;m your Digital Twin.</p>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {message.role === 'assistant' && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-sky-600 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              </div>
            )}

            <div className={`max-w-[70%] rounded-xl p-3 ${message.role === 'user' ? 'bg-sky-600 text-white' : 'bg-white border border-gray-200 text-gray-800'}`}>
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-sky-100' : 'text-gray-500'}`}>
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>

            {message.role === 'user' && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-sky-600 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input：保持在卡片底部（不需捲到頁面底部），高度不會被訊息撐走 */}
      <div className="border-t border-gray-200 p-3 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message…"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent text-gray-800"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
