import { useState, useEffect, useRef } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    // Fetch chat history on component mount
    useEffect(() => {
        fetchHistory();
    }, []);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchHistory = async () => {
        try {
            const response = await fetch(`${API_URL}/history`);
            const data = await response.json();
            setMessages(data);
        } catch (error) {
            console.error('Error fetching history:', error);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();

        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setLoading(true);

        // Optimistically add user message to UI
        const tempUserMsg = { role: 'user', content: userMessage, id: Date.now() };
        setMessages(prev => [...prev, tempUserMsg]);

        try {
            const response = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            });

            const data = await response.json();

            // Replace temp message with actual saved messages
            setMessages(prev => {
                const withoutTemp = prev.filter(msg => msg.id !== tempUserMsg.id);
                return [...withoutTemp, data.userMessage, data.aiMessage];
            });
        } catch (error) {
            console.error('Error sending message:', error);
            // Remove temp message on error
            setMessages(prev => prev.filter(msg => msg.id !== tempUserMsg.id));
            alert('Failed to send message. Please make sure the backend server is running.');
        } finally {
            setLoading(false);
        }
    };

    const clearChat = async () => {
        if (!window.confirm('Are you sure you want to clear all chat history? This cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/history`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setMessages([]);
            } else {
                alert('Failed to clear chat history.');
            }
        } catch (error) {
            console.error('Error clearing chat:', error);
            alert('Failed to clear chat history.');
        }
    };

    return (
        <div className="app">
            <div className="sidebar">
                <div className="sidebar-header">
                    <div className="logo">
                        <div className="logo-icon">🤖</div>
                        <span className="logo-text">AI Chat</span>
                    </div>
                </div>

                <div className="sidebar-content">
                    <div className="stats-card">
                        <div className="stat-item">
                            <span className="stat-label">Messages</span>
                            <span className="stat-value">{messages.length}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Model</span>
                            <span className="stat-value">Llama 3.3</span>
                        </div>
                    </div>
                </div>

                <div className="sidebar-footer">
                    {messages.length > 0 && (
                        <button className="clear-button" onClick={clearChat}>
                            <span className="button-icon">🗑️</span>
                            Clear History
                        </button>
                    )}
                </div>
            </div>

            <div className="main-content">
                <div className="chat-header">
                    <div className="header-info">
                        <h1>AI Assistant</h1>
                        <p className="status">
                            <span className="status-dot"></span>
                            Online • Powered by Groq
                        </p>
                    </div>
                </div>

                <div className="chat-container">
                    {messages.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">💬</div>
                            <h2>Start a Conversation</h2>
                            <p>Ask me anything! I'm here to help with questions, explanations, and friendly chat.</p>
                            <div className="suggestions">
                                <button className="suggestion-chip" onClick={() => setInput("What is artificial intelligence?")}>
                                    What is AI?
                                </button>
                                <button className="suggestion-chip" onClick={() => setInput("Explain React hooks")}>
                                    Explain React
                                </button>
                                <button className="suggestion-chip" onClick={() => setInput("Tell me a joke")}>
                                    Tell a joke
                                </button>
                            </div>
                        </div>
                    ) : (
                        messages.map((msg, index) => (
                            <div key={msg.id || index} className={`message-wrapper ${msg.role}`}>
                                <div className="message-avatar">
                                    {msg.role === 'user' ? '👤' : '🤖'}
                                </div>
                                <div className="message-content">
                                    <div className="message-header">
                                        <span className="message-author">
                                            {msg.role === 'user' ? 'You' : 'AI Assistant'}
                                        </span>
                                        {msg.timestamp && (
                                            <span className="message-time">
                                                {new Date(msg.timestamp).toLocaleTimeString()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="message-text">{msg.content}</div>
                                </div>
                            </div>
                        ))
                    )}

                    {loading && (
                        <div className="message-wrapper assistant">
                            <div className="message-avatar">🤖</div>
                            <div className="message-content">
                                <div className="message-header">
                                    <span className="message-author">AI Assistant</span>
                                </div>
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={chatEndRef} />
                </div>

                <div className="input-container">
                    <form className="input-form" onSubmit={sendMessage}>
                        <input
                            type="text"
                            className="message-input"
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            className="send-button"
                            disabled={loading || !input.trim()}
                        >
                            {loading ? (
                                <span className="button-icon">⏳</span>
                            ) : (
                                <span className="button-icon">➤</span>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default App;
