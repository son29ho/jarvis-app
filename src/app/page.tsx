'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};dir

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'こんにちは！私はあなたのパーソナルアシスタント、ジャービスです。何かお手伝いできることはありますか？' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: 'assistant', content: 'エラーが発生しました。APIキーや接続を確認してください。' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col h-screen max-w-2xl mx-auto p-4 justify-between bg-slate-50">
      <header className="py-4 border-b text-center">
        <h1 className="text-xl font-bold text-slate-800">JARVIS Assistant</h1>
      </header>

      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {messages.map((m, index) => (
          <div key={index} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg text-sm ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-slate-800 border shadow-sm'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && <div className="text-sm text-slate-400 text-center">ジャービスが考えています...</div>}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2 pt-2 border-t">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ジャービスに話しかける..."
          className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
        <Button type="submit" disabled={loading}>送信</Button>
      </form>
    </main>
  );
}