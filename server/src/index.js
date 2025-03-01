import React, { useState } from 'react';
import axios from 'axios';
// import './Chatbot.css'; // Ensure you add some basic styles

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const handleSend = async () => {
        if (input.trim()) {
            const userMessage = { text: input, sender: 'user' };
            setMessages([...messages, userMessage]);
            setInput('');
            
            try {
                const response = await axios.post('https://api.gemini.com/v1/chat', {
                    model: 'gemini-pro',
                    messages: [...messages, userMessage]
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer YOUR_GEMINI_API_KEY`
                    }
                });

                const aiMessage = { text: response.data.message, sender: 'ai' };
                setMessages(prevMessages => [...prevMessages, aiMessage]);
            } catch (error) {
                console.error('Error fetching AI response:', error);
                setMessages(prevMessages => [...prevMessages, { text: 'Error fetching response', sender: 'ai' }]);
            }
        }
    };

    return (
        <div>
            <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? 'Close Chat' : 'Open Chat'}
            </button>
            
            {isOpen && (
                <div className="chatbot-popup">
                    <div className="chatbot-header">
                        <span>Chatbot</span>
                        <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
                    </div>
                    <div className="messages">
                        {messages.map((message, index) => (
                            <div key={index} className={`message ${message.sender}`}>
                                {message.text}
                            </div>
                        ))}
                    </div>
                    <div className="input-area">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                        />
                        <button onClick={handleSend}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
