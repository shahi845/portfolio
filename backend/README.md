# Portfolio Backend API (Express.js + Gemini 3.6 Flash)

This directory contains the production Node.js Express backend API powering Muhammed Shahid's portfolio assistant and contact services.

## 🛠️ Architecture Overview

- **Frontend**: Hosted on Vercel (`https://personal-shahid-portfolio.vercel.app`)
- **Backend**: Hosted on Render (`https://shahid-portfolio-api.onrender.com`)
- **AI SDK**: `@google/genai` (`gemini-3.6-flash`)
- **Security**: Strict CORS origin checking, `helmet` security headers, `express-rate-limit`, and HTML sanitization via `xss`

---

## 📡 API Endpoints

### 1. `POST /api/chat`
Server-side proxy for the Gemini 3.6 Flash portfolio chatbot.
- **Request Body**: `{ "messages": [ { "role": "user", "content": "Tell me about Shahid" } ] }`
- **Response**: `{ "reply": "..." }`
- **Security**: Keeps `GEMINI_API_KEY` hidden server-side; enforces prompt injection guardrails.

### 2. `POST /api/contact`
Processes contact form submissions and dispatches emails via Nodemailer (Gmail SMTP).
- **Request Body**: `{ "name": "Alice", "email": "alice@example.com", "subject": "Inquiry", "message": "Hello!" }`
- **Response**: `{ "success": true, "message": "Email sent successfully" }`

### 3. `GET /api/health`
Health check endpoint used by uptime monitors and Render services.
- **Response**: `{ "status": "ok", "timestamp": "..." }`

---

## ⚙️ Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
# Gemini AI Key
GEMINI_API_KEY=your_gemini_api_key

# Email Credentials (Nodemailer)
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_TO=mshahid3845@gmail.com

# CORS Configuration (Comma-separated)
FRONTEND_ORIGINS=https://personal-shahid-portfolio.vercel.app,http://localhost:5500,http://localhost:3000
```

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm start
```

The server will start at `http://localhost:3000`.

