import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { text: input, sender: 'user' }];
        setMessages(newMessages);
        setInput('');

        try {
            const response = await axios.post('http://localhost:5000/api/chat', { message: input });
            setMessages([...newMessages, { text: response.data.reply, sender: 'bot' }]);
        } catch (error) {
            setMessages([...newMessages, { text: "Error: Failed to get AI response", sender: 'bot' }]);
        }
    };

    return (
        <div className="chatbot-container">
            {/* Chat Button */}
            <button className="chatbot-button" onClick={() => setIsOpen(true)}>
                Open Chat
            </button>

            {/* Chat Popup */}
            {isOpen && (
                <div className="chatbot-popup">
                    <div className="chatbot-header">
                        <h3>Chatbot</h3>
                        <button className="close-button" onClick={() => setIsOpen(false)}>X</button>
                    </div>
                    <div className="messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}
                    </div>
                    <div className="input-area">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask something..."
                        />
                        <button onClick={handleSend}>Send</button>
                    </div>
                </div>
            )}

            {/* Styles */}
            <style jsx>{`
                .chatbot-button {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    padding: 10px 15px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                }

                .chatbot-popup {
                    position: fixed;
                    bottom: 50px;
                    right: 20px;
                    width: 300px;
                    background: white;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                    display: flex;
                    flex-direction: column;
                }

                .chatbot-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #007bff;
                    color: white;
                    padding: 10px;
                    border-top-left-radius: 10px;
                    border-top-right-radius: 10px;
                }

                .messages {
                    max-height: 300px;
                    overflow-y: auto;
                    padding: 10px;
                    flex-grow: 1;
                }

                .message {
                    padding: 8px;
                    margin: 5px 0;
                    border-radius: 5px;
                }

                .user {
                    background: #007bff;
                    color: white;
                    text-align: right;
                }

                .bot {
                    background: #f1f1f1;
                    color: black;
                    text-align: left;
                }

                .input-area {
                    display: flex;
                    padding: 10px;
                    border-top: 1px solid #ccc;
                }

                .input-area input {
                    flex-grow: 1;
                    padding: 8px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    margin-right: 5px;
                }

                .close-button {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 18px;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
};

export default Chatbot;