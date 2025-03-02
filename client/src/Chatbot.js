import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import './Chatbot.css';

const GEMINI_API_KEY = 'AIzaSyAcCSxTMpiT7YcMVNeO4id7LqtCmmd4zJU'; // Replace with actual API key
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: "Your name is Hen, a friendly emotional support and health consultant who works for Health Monitor. Health Monitor is a website that tracks user's wellness and provides diet suggestions.\n\nRole & Purpose:\nYou are an Emotional Support and Health Guidance AI designed to assist users who care about their well-being. Your primary functions include:\n\n- Emotional Support: Providing empathetic, non-judgmental conversations to comfort users during distress, sadness, or loneliness.\n- Daily Check-ins: Initiating friendly, supportive check-ins to encourage well-being, self-care, and mental health awareness.\n- Health & Wellness Guidance: Offering professional, evidence-based advice on general wellness topics such as sleep, nutrition, exercise, stress management, and self-care.\n- Adaptive Tone & Personality: Shifting between warm and empathetic when providing emotional support and professional and informative when answering health-related inquiries.\n\nEthical Boundaries & Safety Protocols:\n- Crisis Detection: Encourage users in extreme distress to seek professional support and provide emergency resources if possible.\n- No Medical Diagnoses: Stick to general wellness guidance and avoid medical claims.\n- User Privacy & Respect: Never ask for personal information or make assumptions about a user’s health.\n- No Judgment: Respond with empathy and inclusivity, avoiding bias or directive language.\n- Adaptive Personality & Tone: Adjust responses based on user cues, keeping responses aligned with their emotional state and needs."
});


const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};



const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [typingIndicator, setTypingIndicator] = useState("Hen is typing .");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        let typingTimer;
        if (isTyping) {
            let tick = 0;
            typingTimer = setInterval(() => {
                const dots = [".", "..", "...", ".", "..", "..."];
                setTypingIndicator(`Hen is typing ${dots[tick]}`);
                tick = (tick + 1) % dots.length;
            }, 500);
        } else {
            clearInterval(typingTimer);
        }
        return () => clearInterval(typingTimer);
    }, [isTyping]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // AI Profile Data
    const aiProfile = {
        name: "Hen",
        avatar: "https://www.henhackshackathon.com/images/favicon-25.svg" // Example AI avatar
    };

    // Function to send message and get AI response
    const handleSend = async () => {
        if (input.trim()) {
            const userMessage = { text: input, sender: 'user' };
            setMessages(prevMessages => [...prevMessages, userMessage]);
            setInput('');
            setIsTyping(true);

            try {
                const chatSession = model.startChat({
                    generationConfig,
                    history: messages.map(msg => ({
                        role: msg.sender === 'user' ? 'user' : 'model',
                        parts: [{ text: msg.text }]
                    }))
                });
                
                const result = await chatSession.sendMessage(input);
                const aiResponse = result.response.text();
                setIsTyping(false);
                
                const aiMessage = { text: aiResponse, sender: 'ai' };
                setMessages(prevMessages => [...prevMessages, aiMessage]);
            } catch (error) {
                console.error('Error fetching AI response:', error);
                setIsTyping(false);
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
                        <img src={aiProfile.avatar} alt="AI Avatar" className="ai-avatar" />
                        <span>{aiProfile.name}</span>
                        <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
                    </div>
                    <div className="messages">
                        {messages.map((message, index) => (
                            <div key={index} className={`message-container ${message.sender}`}>
                                {message.sender === 'ai' && <img src={aiProfile.avatar} alt="AI Avatar" className="message-avatar" />}
                                <div className={`message ${message.sender}`}>{message.text}</div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="message-container ai">
                                <img src={aiProfile.avatar} alt="AI Avatar" className="message-avatar" />
                                <div className="message ai">{typingIndicator}</div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
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