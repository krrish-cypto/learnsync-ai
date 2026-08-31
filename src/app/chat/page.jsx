'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Plus, MessageSquare, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useSession } from 'next-auth/react';

export default function ChatAssistant() {
  const { data: session, status } = useSession();
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [messages]);

  useEffect(() => {
    const fetchChats = async () => {
      if (status === 'loading' || !session?.user?.id) return;
      
      const res = await fetch(`/api/chats?userId=${session.user.id}`);
      const data = await res.json();
      if (data.chats && data.chats.length > 0) {
        setChats(data.chats);
        loadChat(data.chats[0].id);
      } else {
        createNewChat();
      }
    };
    fetchChats();
  }, [status, session]);

  const createNewChat = async () => {
    if (!session?.user?.id) return;
    const res = await fetch('/api/chats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: session.user.id, title: 'New Chat' })
    });
    const data = await res.json();
    if (data.chatId) {
      setChats(prev => [{id: data.chatId, title: 'New Chat'}, ...prev]);
      loadChat(data.chatId);
    }
  };

  const loadChat = async (chatId) => {
    setActiveChatId(chatId);
    setLoading(true); 
    const res = await fetch(`/api/chat?chatId=${chatId}`);
    const data = await res.json();
    if (data.messages) {
      setMessages(data.messages);
      
      if (data.messages.length > 0 && data.messages[data.messages.length - 1].role === 'user') {
        // AI response is missing (previous request likely aborted when switching pages). Retry!
        triggerAiResponse(chatId, data.messages);
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const triggerAiResponse = async (chatId, currentMessages) => {
    try {
      const userId = session?.user?.id;
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: currentMessages, userId, chatId, isRetry: true })
      });
      const data = await res.json();
      
      if (data.reply) {
        // Refetch to ensure clean state
        const refreshRes = await fetch(`/api/chat?chatId=${chatId}`);
        const refreshData = await refreshRes.json();
        if (refreshData.messages) {
          setMessages(prev => refreshData.messages);
        }
      } else if (data.error) {
        setMessages(prev => [...prev, { role: 'ai', content: `Error: ${data.error}. Please try again later.` }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'ai', content: "Failed to resume chat." }]);
    } finally {
      setLoading(false);
    }
  };

  const deleteChat = async (e, chatId) => {
    e.stopPropagation();
    await fetch(`/api/chats?chatId=${chatId}`, { method: 'DELETE' });
    setChats(prev => prev.filter(c => c.id !== chatId));
    if (activeChatId === chatId) {
      setActiveChatId(null);
      setMessages([]);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading || !activeChatId) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const userId = session?.user?.id;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, userId, chatId: activeChatId })
      });
      const data = await res.json();
      
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
        
        // Refresh chat list to update title if it was a new chat
        const chatRes = await fetch(`/api/chats?userId=${userId}`);
        const chatData = await chatRes.json();
        if (chatData.chats) setChats(chatData.chats);
      } else if (data.error) {
        setMessages(prev => [...prev, { role: 'ai', content: `Error: ${data.error}. We may have hit an API rate limit.` }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: "I encountered an error connecting to the AI. Please check your API key." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-col gap-6" style={{ height: '100%', display: 'flex' }}>
      <header>
        <h1>AI Learning <span className="gradient-text">Assistant</span></h1>
        <p>Chat with your AI mentor to adjust your goals and get explanations.</p>
      </header>

      <div className="glass-panel flex" style={{ flex: 1, padding: 0, overflow: 'hidden' }}>
        {/* Sidebar */}
        <div style={{ width: '260px', borderRight: '1px solid var(--surface-border)', background: 'var(--surface)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem 1rem' }}>
            <button onClick={createNewChat} className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <Plus size={18} /> New Chat
            </button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 1rem 1rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {chats.map(chat => (
              <div 
                key={chat.id} 
                onClick={() => loadChat(chat.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem',
                  background: activeChatId === chat.id ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                  color: activeChatId === chat.id ? 'var(--primary)' : 'var(--text-muted)',
                  borderRadius: '8px', cursor: 'pointer', textAlign: 'left',
                  width: '100%', transition: 'all 0.2s', position: 'relative'
                }}
              >
                <MessageSquare size={16} style={{ flexShrink: 0 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{chat.title}</span>
                <button 
                  onClick={(e) => deleteChat(e, chat.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                  title="Delete Chat"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                {msg.role === 'ai' && (
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Bot size={20} color="white" />
                  </div>
                )}
                
                <div style={{ 
                  background: msg.role === 'user' ? 'var(--primary)' : 'var(--surface)', 
                  padding: '1rem 1.5rem', 
                  borderRadius: '16px',
                  borderTopRightRadius: msg.role === 'user' ? '4px' : '16px',
                  borderTopLeftRadius: msg.role === 'ai' ? '4px' : '16px',
                  color: msg.role === 'user' ? 'white' : 'var(--foreground)',
                  border: msg.role === 'ai' ? '1px solid var(--surface-border)' : 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }} className="chat-message-markdown">
                  {msg.role === 'ai' ? (
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </div>

                {msg.role === 'user' && (
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--surface)', border: '1px solid var(--surface-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <User size={20} color="var(--text-muted)" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', maxWidth: '80%' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bot size={20} color="white" />
                </div>
                <div style={{ 
                  background: 'var(--surface)', 
                  padding: '0.5rem 1rem', 
                  borderRadius: '16px',
                  borderTopLeftRadius: '4px',
                  border: '1px solid var(--surface-border)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <div className="typing-indicator">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ padding: '1.5rem', borderTop: '1px solid var(--surface-border)', background: 'var(--secondary)' }}>
            <form onSubmit={handleSend} className="flex gap-4">
              <input 
                type="text" 
                className="input-field" 
                placeholder="Ask your AI mentor something..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ flex: 1, background: 'var(--surface)' }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '0 1.5rem' }} disabled={loading}>
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
