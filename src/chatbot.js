import React, { useState } from 'react';
import axios from 'axios';
import './Chatbot.css';

const GEMINI_API_KEY = 'AIzaSyAW44yUO8fMlx2gFSjHyjYhBoS1qnVBmQ0';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const handleSend = async () => {
        if (input.trim()) {
            const userMessage = { text: input, sender: 'user' };
            setMessages(prevMessages => [...prevMessages, userMessage]);
            setInput('');
    
            try {
                const response = await axios.post(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
                    {
                        contents: [{ parts: [{ text: input }] }]
                    },
                    { headers: { 'Content-Type': 'application/json' } }
                );
    
                console.log('API Response:', response.data);
    
                // ✅ Extract AI response correctly
                const aiResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI';
                
                const aiMessage = { text: aiResponse, sender: 'ai' };
                setMessages(prevMessages => [...prevMessages, aiMessage]);
    
            } catch (error) {
                console.error('Error fetching AI response:', error.response?.data || error.message);
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