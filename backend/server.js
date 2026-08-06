import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import fetch from "node-fetch";

import xss from "xss";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 🤖 Gemini AI Client initialization (lazy)
let aiClient = null;
function getAIClient() {
    if (!aiClient) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return null;
        aiClient = new GoogleGenAI({
            apiKey: apiKey,
            httpOptions: {
                headers: {
                    'User-Agent': 'aistudio-build'
                }
            }
        });
    }
    return aiClient;
}

const SYSTEM_INSTRUCTION = `You are Shahid AI, an enthusiastic, friendly, and smart portfolio AI assistant representing Muhammed Shahid, a Junior Web Developer and student from Kasaragod, Kerala, India.

Your goal is to answer questions from visitors about Muhammed Shahid's skills, projects, background, education, and contact details with concise, polite, and well-formatted answers (using Markdown bolding or lists when helpful).

Here is Muhammed Shahid's full background:
- **Name**: Muhammed Shahid
- **Title**: Junior Web Developer & Student
- **Location**: Kasaragod, Kerala, India
- **Education**: 
  - Malik Deenar Islamic Academy (Hudawi Course, affiliated with Darul Huda Islamic University)
  - Plus Two Commerce
- **Languages Spoken**: English, Malayalam, Arabic, Urdu, Hindi
- **Core Technical Skills**:
  - Strongest: HTML5, CSS3, JavaScript (ES6+), Tailwind CSS, Responsive Web Design, Git & GitHub
  - Working Knowledge: Node.js, Express.js, REST APIs, AI API Integration
  - Currently Learning: React, Next.js, Cloud Databases, Cybersecurity
- **Featured Projects**:
  1. **Fara'id Inheritance Calculator**: Multi-madhhab educational inheritance calculator built with pure JavaScript. Handles exact fraction math, fixed shares, residuary rules, heir blocking, Awl & Radd rules, and automated test cases. (Live: https://fara-id.vercel.app | GitHub: https://github.com/shahi845/inheritance)
  2. **Web Calculator**: Expression-parsing browser calculator supporting correct operator precedence, keyboard controls, and decimal edge cases. (Live: https://e-calculator.mshahid3845.workers.dev/ | GitHub: https://github.com/shahi845/calculator)
  3. **Personal Portfolio**: Glassmorphic, dark-mode portfolio built with Node.js/Express, Tailwind CSS, dynamic GitHub API integration, and email backend. (Live: https://shahidportfolio.mshahid3845.workers.dev/ | GitHub: https://github.com/shahi845/personal-portfolio)
  4. **Tuhfa Football Association (TFA) Dashboard**: Responsive tournament dashboard displaying standings, match fixtures, player statistics, and top scorers. (Live: https://tfa-2.mshahid3845.workers.dev | GitHub: https://github.com/shahi845/2tfa)
- **Contact Details**:
  - Email: mshahid3845@gmail.com
  - GitHub: https://github.com/shahi845
  - LinkedIn: https://www.linkedin.com/in/muhammed-shahid-388434392/
  - Instagram: https://www.instagram.com/_shahid_4

Instructions:
- Keep responses friendly, professional, brief, and helpful.
- If asked about contacting Shahid, provide his email (mshahid3845@gmail.com) and LinkedIn link.
- Use markdown formatting like **bold text** or bullet points for readability.
- If a question is off-topic, politely redirect the user back to Shahid's portfolio or web development topics.`;

// 🔐 Middleware
const allowedOrigins = (process.env.FRONTEND_ORIGINS || "https://shahidportfolio.mshahid3845.workers.dev,http://localhost:5500,http://localhost:3000")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

app.use(cors({
    origin(origin, cb) {
        if (!origin) return cb(null, true);
        if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") return cb(null, true);
        return cb(null, true); // Allow requests in preview environment
    },
    credentials: true
}));
app.use(express.json({ limit: "32kb" }));

// 🛡️ Security headers (disable CSP so CDN fonts/scripts work)
app.use(helmet({ contentSecurityPolicy: false }));

// 🐢 Rate limiting (50 requests per 15 minutes)
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50
}));

app.get("/api/health", (_req, res) => res.json({ ok: true }));

// 📧 Mailing Route
app.post("/api/contact", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body ?? {};

        if (!name || !email || !message) {
            return res.status(400).json({ error: "Name, email, and message are required" });
        }

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log("Contact form submission received:", { name, email, subject, message });
            return res.status(200).json({ success: "Message received! (Demo mode - set EMAIL_USER and EMAIL_PASS to send real emails)" });
        }

        const cleanName = xss(name);
        const cleanEmail = xss(email);
        const cleanSubject = xss(subject || "No Subject");
        const cleanMessage = xss(message);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            replyTo: cleanEmail,
            subject: `Portfolio Contact: ${cleanSubject}`,
            text: `Name: ${cleanName}\nEmail: ${cleanEmail}\n\nMessage:\n${cleanMessage}`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: "Message sent successfully!" });

    } catch (err) {
        console.error("Mailing Error:", err);
        res.status(500).json({ error: "Failed to send message" });
    }
});

// 🤖 Chatbot API Route
app.post("/api/chat", async (req, res) => {
    try {
        const { message, history } = req.body ?? {};
        if (!message || typeof message !== "string" || !message.trim()) {
            return res.status(400).json({ error: "Message is required" });
        }

        const cleanMessage = xss(message.trim());
        const ai = getAIClient();

        if (ai) {
            // Build conversation history if provided
            const contents = [];
            if (Array.isArray(history)) {
                for (const item of history.slice(-6)) { // keep last 6 messages
                    if (item.role && item.content) {
                        contents.push({
                            role: item.role === "user" ? "user" : "model",
                            parts: [{ text: xss(item.content) }]
                        });
                    }
                }
            }
            contents.push({
                role: "user",
                parts: [{ text: cleanMessage }]
            });

            const response = await ai.models.generateContent({
                model: "gemini-3.6-flash",
                contents: contents,
                config: {
                    systemInstruction: SYSTEM_INSTRUCTION,
                    temperature: 0.7,
                }
            });

            const reply = response.text || "I'm sorry, I couldn't generate a response right now.";
            return res.json({ reply });
        } else {
            // Intelligent fallback when GEMINI_API_KEY is not configured
            const lower = cleanMessage.toLowerCase();
            let reply = "";

            if (lower.includes("project") || lower.includes("work") || lower.includes("build") || lower.includes("faraid") || lower.includes("inheritance")) {
                reply = "Muhammed Shahid has built several key projects including:\n\n" +
                    "1. **Fara'id Calculator**: A multi-madhhab Islamic inheritance calculator handling exact fraction math, residuary rules, Awl & Radd.\n" +
                    "2. **Web Calculator**: Browser calculator with operator precedence and keyboard navigation.\n" +
                    "3. **Tuhfa Football Association**: Live tournament standings and fixtures dashboard.\n" +
                    "4. **Personal Portfolio**: Glassmorphic website with Node.js and Tailwind CSS.\n\n" +
                    "Check out the **Projects** section for live links and code!";
            } else if (lower.includes("skill") || lower.includes("stack") || lower.includes("tech") || lower.includes("language")) {
                reply = "Shahid's key skills include:\n\n" +
                    "- **Core**: HTML5, CSS3, JavaScript, Tailwind CSS, Responsive Design, Git/GitHub\n" +
                    "- **Working Knowledge**: Node.js, Express, REST APIs, AI Integration\n" +
                    "- **Currently Learning**: React, Next.js, Cloud Databases & Cybersecurity";
            } else if (lower.includes("contact") || lower.includes("email") || lower.includes("hire") || lower.includes("reach") || lower.includes("linkedin")) {
                reply = "You can reach Muhammed Shahid via:\n\n" +
                    "- **Email**: mshahid3845@gmail.com\n" +
                    "- **LinkedIn**: [linkedin.com/in/muhammed-shahid-388434392](https://www.linkedin.com/in/muhammed-shahid-388434392/)\n" +
                    "- **GitHub**: [github.com/shahi845](https://github.com/shahi845)";
            } else if (lower.includes("about") || lower.includes("who") || lower.includes("education") || lower.includes("background")) {
                reply = "Muhammed Shahid is a Junior Web Developer and student at Malik Deenar Islamic Academy (Hudawi course) in Kasaragod, Kerala, India. He builds practical JavaScript applications!";
            } else {
                reply = "Hello! I am **Shahid AI**, Muhammed Shahid's portfolio assistant. Feel free to ask me about Shahid's **projects**, **technical skills**, **education**, or how to **contact** him!";
            }

            return res.json({ reply });
        }
    } catch (err) {
        console.error("Chat API Error:", err);
        return res.status(500).json({ error: "Failed to process chat message. Please try again." });
    }
});

// 📁 Serve frontend static files
app.use(express.static(path.join(__dirname, "../frontend")));

// 🔀 Catch-all route to serve index.html for client-side routing
app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// 🚀 Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend server running on http://0.0.0.0:${PORT}`);
});
