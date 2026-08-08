# Muhammed Shahid — Full Stack Portfolio

![Node.js](https://img.shields.io/badge/Node.js-18.x-green?style=flat-square&logo=node.js)
![Express](https://img.shields.io/badge/Express-4.x-blue?style=flat-square&logo=express)
![Gemini AI](https://img.shields.io/badge/Gemini%20AI-3.6%20Flash-purple?style=flat-square&logo=google)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-emerald?style=flat-square)

> **Full Stack Developer building AI-powered applications.** High-performance web applications, deterministic mathematical engines, edge deployments, and server-side AI integrations.

---

## 🌐 Live Demos

- **Production Portfolio**: [personal-shahid-portfolio.vercel.app](https://personal-shahid-portfolio.vercel.app/)
- **Fara'id Inheritance Engine**: [fara-id.vercel.app](https://fara-id.vercel.app/)
- **Precision Web Calculator**: [e-calculator.mshahid3845.workers.dev](https://e-calculator.mshahid3845.workers.dev/)
- **TFA Football Dashboard**: [tfa-2.mshahid3845.workers.dev](https://tfa-2.mshahid3845.workers.dev/)

---

## ✨ Core Features

- **🎨 Glassmorphic Dark Design System**: Hand-crafted aurora ambient glow gradients, smooth micro-interactions, WCAG AA contrast compliance, and full light/dark mode persistence.
- **🤖 Server-Side Gemini AI Assistant (`Shahid AI`)**: Embedded floating chat widget powered by Google's `@google/genai` SDK with strict data boundaries, prompt injection protection, and rate limiting.
- **⌨️ Command Palette (`Ctrl+K` / `Cmd+K`)**: Keyboard-driven navigation dialog allowing rapid access to projects, skills, contact forms, and modal views.
- **💻 Interactive Retro CLI Terminal**: Embedded terminal emulator enabling visitors to execute terminal commands (`help`, `about`, `skills`, `projects`, `philosophy`, `contact`, `resume`).
- **📖 Comprehensive Case Study System**: Full-page interactive case studies detailing problem statements, technical goals, system architecture flowcharts, Lighthouse metrics, and lessons learned.
- **📧 Dual-Engine Contact Handler**: Express backend route supporting direct SMTP transmission via Nodemailer, with automated FormSubmit API fallback and mailto links.

---

## 🏗️ System Architecture

All third-party credentials (including `GEMINI_API_KEY`) are kept strictly server-side inside the Node.js / Express backend to prevent exposure to client-side browsers.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          BROWSER CLIENT (SPA)                          │
│                                                                        │
│   ┌─────────────────────┐  ┌────────────────────┐  ┌───────────────┐   │
│   │ Command Palette     │  │ Interactive CLI    │  │ Case Studies  │   │
│   └─────────────────────┘  └────────────────────┘  └───────────────┘   │
│                                       │                                │
│                                       ▼                                │
│                          ┌────────────────────────┐                    │
│                          │  Shahid AI Chat Widget │                    │
│                          └────────────────────────┘                    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP POST /api/chat
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        NODE.JS / EXPRESS BACKEND                       │
│                                                                        │
│   ┌──────────────────┐    ┌─────────────────────┐    ┌─────────────┐   │
│   │ Helmet Security  │───►│ CORS Allowlist      │───►│ Rate Limit  │   │
│   │ Headers          │    │ Policy Validation   │    │ (15/15min)  │   │
│   └──────────────────┘    └─────────────────────┘    └─────────────┘   │
│                                      │                                 │
│                                      ▼                                 │
│                   ┌──────────────────────────────────────┐             │
│                   │ XSS Sanitization & 500-Char Cap      │             │
│                   └──────────────────────────────────────┘             │
│                                      │                                 │
│                                      ▼                                 │
│                   ┌──────────────────────────────────────┐             │
│                   │ Gemini 3.6 Flash SDK                 │             │
│                   │ (System Instructions & Guardrails)   │             │
│                   └──────────────────────────────────────┘             │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Server-to-Server TLS Request
                                    ▼
                        ┌────────────────────────┐
                        │   Google Gemini API    │
                        └────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
- **Languages & Frameworks**: HTML5, CSS3, ES6+ JavaScript, Tailwind CSS (v3 CDN / JIT compilation)
- **Icons & Typography**: Font Awesome 6, Outfit Sans, Fira Code Mono
- **Animations & Interactivity**: Custom CSS Keyframes, IntersectionObserver, ResizeObserver

### Backend
- **Runtime**: Node.js (v18+)
- **Server Framework**: Express.js
- **Security & Middleware**: `helmet`, `cors`, `express-rate-limit`, `xss`, `nodemailer`, `node-fetch`
- **AI SDK**: `@google/genai` (`Gemini 3.6 Flash`)

### Hosting & DevOps
- **Hosting**: Vercel & Cloudflare Workers
- **Containers**: Cloud Run compatible containerization

---

## 📂 Project Structure

```
.
├── backend/
│   ├── server.js               # Node.js / Express entry point (APIs, CORS, AI, Rate Limiter)
│   └── package.json            # Backend dependencies
├── frontend/
│   ├── assets/                 # Favicons, project screenshots, and media
│   ├── css/
│   │   └── main.css            # Custom CSS animations & Tailwind utilities
│   ├── js/
│   │   ├── portfolioData.js    # Single source of truth for portfolio profile & data
│   │   ├── navigation.js       # Navbar, ScrollSpy, mobile menu, typewriter effect
│   │   ├── projects.js         # Project filtering & case study modal renderer
│   │   ├── palette.js          # Command palette (Ctrl+K), CLI terminal, resume modal
│   │   ├── chatbot.js          # Floating Gemini AI assistant widget
│   │   └── contact.js          # Contact form validation & backend submission
│   ├── index.html              # Main application single-page layout
│   ├── resume.html             # Printable HTML resume
│   ├── robots.txt              # Search engine crawler instructions
│   └── sitemap.xml             # XML sitemap configuration
├── .env.example                # Template for environment variables
├── metadata.json               # Platform metadata configuration
├── package.json                # Root build & dev scripts
└── README.md                   # Repository documentation
```

---

## 🚀 Local Development Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/shahi845/personal-portfolio.git
   cd personal-portfolio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the project root by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Fill in your API keys:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   EMAIL_USER=your_gmail_address@gmail.com
   EMAIL_PASS=your_gmail_app_password
   EMAIL_TO=mshahid3845@gmail.com
   FRONTEND_ORIGINS=https://personal-shahid-portfolio.vercel.app,http://localhost:5500,http://localhost:3000
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 🔐 API Endpoints & Security Controls

### `POST /api/chat`
- **Rate Limit**: Stricter **15 requests per 15 minutes** per IP (`express-rate-limit`).
- **Validation**:
  - Max prompt length capped at 500 characters.
  - HTML & script input sanitized via `xss`.
- **System Guardrails**: System instructions enforce strict role boundaries preventing prompt injection, secret leaks, or off-topic responses.

### `POST /api/contact`
- **Rate Limit**: **50 requests per 15 minutes** per IP.
- **Validation**: Required fields (`name`, `email`, `message`), XSS sanitized.
- **Transmission**: Attempts Nodemailer SMTP first, automatically falls back to FormSubmit API or mailto fallback URL.

### `GET /api/health`
- Returns status `{ ok: true }` for health checks and uptime monitors.

### Security Highlights
- **CORS Allowlist**: Strict origin checking in production rejecting unlisted origins.
- **Server-Side API Keys**: Zero client-side key leakage; all Gemini API calls route through `/api/chat`.
- **Helmet Headers**: Content Security headers enabled with safe defaults for CDN font/icon loading.

---

## 📜 License

This project is open-source under the [MIT License](LICENSE).

---

Developed with 💻 & ☕ by **Muhammed Shahid** ([@shahi845](https://github.com/shahi845))
