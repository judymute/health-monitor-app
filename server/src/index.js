import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 初始化 Gemini API（Google PaLM 2）
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/chat', async (req, res) => {
    try {
        if (!req.body.message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // 选择 Gemini Pro 1.5 模型
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const result = await model.generateContent(req.body.message);
        const response = result.response.text(); // 获取 AI 生成的文本

        res.json({ reply: response || "AI did not respond" });
    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ error: 'AI response failed' });
    }
});

app.listen(3000, () => console.log('Server running on port 5000'));
