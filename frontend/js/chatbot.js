/**
 * 🤖 Shahid AI Chatbot Component
 * Portfolio virtual assistant powered by Gemini API with LocalStorage persistence
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Create and inject Chatbot UI DOM elements
    createChatbotUI();

    // 2. State Management
    let messageHistory = [];
    let isWaitingForResponse = false;
    const STORAGE_KEY = "shahid_ai_chat_history";

    // DOM Elements
    const toggleBtn = document.getElementById("ai-chat-toggle");
    const chatPanel = document.getElementById("ai-chat-panel");
    const closeBtn = document.getElementById("ai-chat-close");
    const clearBtn = document.getElementById("ai-chat-clear");
    const messageInput = document.getElementById("ai-chat-input");
    const sendBtn = document.getElementById("ai-chat-send");
    const messagesContainer = document.getElementById("ai-chat-messages");
    const unreadBadge = document.getElementById("ai-unread-badge");
    const suggestionsBox = document.getElementById("ai-chat-suggestions");

    let isOpened = false;

    // Load persisted chat history on initialization
    loadHistoryFromStorage();

    // 3. Event Listeners
    toggleBtn.addEventListener("click", toggleChat);
    closeBtn.addEventListener("click", hideChat);
    clearBtn.addEventListener("click", clearChat);
    sendBtn.addEventListener("click", handleSendMessage);

    messageInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });

    // Handle suggestion chips
    if (suggestionsBox) {
        suggestionsBox.addEventListener("click", (e) => {
            const chip = e.target.closest(".suggestion-chip");
            if (chip && !isWaitingForResponse) {
                const prompt = chip.getAttribute("data-prompt");
                if (prompt) {
                    messageInput.value = prompt;
                    handleSendMessage();
                }
            }
        });
    }

    // Toggle Chat Panel
    function toggleChat() {
        if (isOpened) {
            hideChat();
        } else {
            showChat();
        }
    }

    function showChat() {
        isOpened = true;
        chatPanel.classList.remove("scale-95", "opacity-0", "pointer-events-none");
        chatPanel.classList.add("scale-100", "opacity-100", "pointer-events-auto");
        if (unreadBadge) unreadBadge.classList.add("hidden");
        messageInput.focus();
    }

    function hideChat() {
        isOpened = false;
        chatPanel.classList.remove("scale-100", "opacity-100", "pointer-events-auto");
        chatPanel.classList.add("scale-95", "opacity-0", "pointer-events-none");
    }

    function clearChat() {
        messageHistory = [];
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (e) {
            console.error("Failed to clear localStorage:", e);
        }
        messagesContainer.innerHTML = "";
        
        if (suggestionsBox) {
            suggestionsBox.style.display = "flex";
        }
        
        // Re-inject initial bot welcome message
        appendBotMessage(
            "Hi there! 👋 I'm **Shahid AI**, Muhammed Shahid's virtual assistant. Ask me anything about Shahid's projects, skills, education, or background!",
            getCurrentTimeStr(),
            true
        );
    }

    function saveHistoryToStorage() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(messageHistory));
        } catch (e) {
            console.error("Failed to save chat history to localStorage:", e);
        }
    }

    function loadHistoryFromStorage() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    messageHistory = parsed;
                    messagesContainer.innerHTML = "";

                    if (suggestionsBox) {
                        suggestionsBox.style.display = "none";
                    }

                    parsed.forEach((msg) => {
                        const time = msg.timestamp || getCurrentTimeStr();
                        if (msg.role === "user") {
                            appendUserMessage(msg.content, time, false);
                        } else {
                            appendBotMessage(msg.content, time, false);
                        }
                    });
                }
            }
        } catch (e) {
            console.error("Failed to load chat history from localStorage:", e);
        }
    }

    // 4. Message Handling
    async function handleSendMessage() {
        const text = messageInput.value.trim();
        if (!text || isWaitingForResponse) return;

        // Clear input
        messageInput.value = "";
        
        // Hide suggestion chips on first message
        if (suggestionsBox) {
            suggestionsBox.style.display = "none";
        }

        const nowTime = getCurrentTimeStr();

        // Render user message & save
        appendUserMessage(text, nowTime, false);
        messageHistory.push({ role: "user", content: text, timestamp: nowTime });
        saveHistoryToStorage();

        // Show typing indicator
        isWaitingForResponse = true;
        sendBtn.disabled = true;
        sendBtn.classList.add("opacity-50");
        const typingEl = appendTypingIndicator();

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: text,
                    history: messageHistory.slice(-6)
                })
            });

            const data = await res.json();
            typingEl.remove();

            const replyTime = getCurrentTimeStr();
            if (res.ok && data.reply) {
                appendBotMessage(data.reply, replyTime, false);
                messageHistory.push({ role: "assistant", content: data.reply, timestamp: replyTime });
                saveHistoryToStorage();
            } else {
                const errorMsg = data.error || "Sorry, I ran into an issue answering that. Please try again!";
                appendBotMessage(errorMsg, replyTime, false);
                messageHistory.push({ role: "assistant", content: errorMsg, timestamp: replyTime });
                saveHistoryToStorage();
            }
        } catch (err) {
            console.error("Chat Error:", err);
            typingEl.remove();
            const errText = "Connection error. Please check your network and try again.";
            appendBotMessage(errText, getCurrentTimeStr(), false);
            messageHistory.push({ role: "assistant", content: errText, timestamp: getCurrentTimeStr() });
            saveHistoryToStorage();
        } finally {
            isWaitingForResponse = false;
            sendBtn.disabled = false;
            sendBtn.classList.remove("opacity-50");
            scrollToBottom();
        }
    }

    // Render User Bubble
    function appendUserMessage(text, timeStr = getCurrentTimeStr()) {
        const wrapper = document.createElement("div");
        wrapper.className = "flex justify-end mb-4 animate-fade-in";
        wrapper.innerHTML = `
            <div class="max-w-[85%]">
                <div class="bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-md text-sm font-medium leading-relaxed break-words">
                    ${escapeHTML(text)}
                </div>
                <div class="text-[10px] text-slate-400 dark:text-slate-500 text-right mt-1 font-mono">${timeStr}</div>
            </div>
        `;
        messagesContainer.appendChild(wrapper);
        scrollToBottom();
    }

    // Render Bot Bubble with Markdown parsing
    function appendBotMessage(text, timeStr = getCurrentTimeStr(), isInitial = false) {
        const wrapper = document.createElement("div");
        wrapper.className = "flex items-start gap-2.5 mb-4 animate-fade-in";
        
        const parsedHTML = parseSimpleMarkdown(text);

        wrapper.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm border border-white/20">
                <i class="fas fa-robot"></i>
            </div>
            <div class="max-w-[85%]">
                <div class="glass bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 text-slate-900 dark:text-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-md text-sm leading-relaxed break-words">
                    ${parsedHTML}
                </div>
                <div class="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-mono">${timeStr}</div>
            </div>
        `;

        // If welcome message, append suggestion chips inside bot container
        if (isInitial && suggestionsBox) {
            wrapper.querySelector('.max-w-\\[85\\%\\]').appendChild(suggestionsBox);
        }

        messagesContainer.appendChild(wrapper);
        scrollToBottom();
    }

    // Typing Indicator
    function appendTypingIndicator() {
        const wrapper = document.createElement("div");
        wrapper.className = "flex items-start gap-2.5 mb-4 animate-fade-in";
        wrapper.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm border border-white/20">
                <i class="fas fa-robot"></i>
            </div>
            <div class="glass bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl rounded-tl-sm px-4 py-3 shadow-md flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-brand-500 animate-bounce"></span>
                <span class="w-2 h-2 rounded-full bg-brand-400 animate-bounce [animation-delay:0.2s]"></span>
                <span class="w-2 h-2 rounded-full bg-accent-400 animate-bounce [animation-delay:0.4s]"></span>
            </div>
        `;
        messagesContainer.appendChild(wrapper);
        scrollToBottom();
        return wrapper;
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function getCurrentTimeStr() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function escapeHTML(str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Markdown Helper Function
    function parseSimpleMarkdown(markdown) {
        let html = escapeHTML(markdown);

        // Bold: **text**
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Italic: *text*
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        // Code: `code`
        html = html.replace(/`(.*?)`/g, '<code class="bg-slate-200 dark:bg-slate-700/80 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>');
        
        // Links: [text](url)
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-brand-500 hover:underline font-semibold">$1 <i class="fas fa-external-link-alt text-[10px]"></i></a>');
        
        // Unordered List Items: - item or * item
        const lines = html.split('\n');
        let inList = false;
        let resultLines = [];

        for (let line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                if (!inList) {
                    inList = true;
                    resultLines.push('<ul class="list-disc list-inside space-y-1 my-1">');
                }
                resultLines.push(`<li>${trimmed.substring(2)}</li>`);
            } else if (/^\d+\.\s/.test(trimmed)) {
                if (!inList) {
                    inList = true;
                    resultLines.push('<ol class="list-decimal list-inside space-y-1 my-1">');
                }
                const content = trimmed.replace(/^\d+\.\s/, '');
                resultLines.push(`<li>${content}</li>`);
            } else {
                if (inList) {
                    inList = false;
                    resultLines.push('</ul>');
                }
                resultLines.push(line);
            }
        }
        if (inList) {
            resultLines.push('</ul>');
        }

        return resultLines.join('<br>').replace(/<br><ul/g, '<ul').replace(/<\/ul><br>/g, '</ul>');
    }

    // Create Chatbot Interface DOM
    function createChatbotUI() {
        const container = document.createElement("div");
        container.id = "ai-chatbot-root";
        container.innerHTML = `
            <!-- Floating Toggle Button -->
            <button id="ai-chat-toggle" type="button" aria-label="Open AI Assistant"
                class="fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-slate-900/90 dark:bg-slate-950/90 text-white shadow-[0_0_25px_rgba(59,130,246,0.5)] border border-brand-500/40 hover:border-brand-400 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group backdrop-blur-xl">
                <div class="relative w-8 h-8 flex items-center justify-center">
                    <i class="fas fa-robot text-xl text-brand-400 group-hover:rotate-12 transition-transform"></i>
                    <span id="ai-unread-badge" class="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></span>
                    <span class="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900"></span>
                </div>
                <span class="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-bold text-xs text-brand-400 ml-0 group-hover:ml-2.5">
                    Ask Shahid AI
                </span>
            </button>

            <!-- Chat Panel Modal -->
            <div id="ai-chat-panel" class="fixed bottom-20 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-96 h-[520px] max-h-[80vh] z-50 glass bg-slate-900/95 dark:bg-slate-950/95 border border-slate-200/30 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 transform scale-95 opacity-0 pointer-events-none backdrop-blur-2xl">
                
                <!-- Chat Header -->
                <div class="px-5 py-4 border-b border-slate-200/20 dark:border-slate-800 flex items-center justify-between bg-slate-800/40 dark:bg-slate-900/60">
                    <div class="flex items-center gap-3">
                        <div class="relative">
                            <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-accent-500 flex items-center justify-center text-white text-lg font-bold shadow-md">
                                <i class="fas fa-robot"></i>
                            </div>
                            <span class="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900"></span>
                        </div>
                        <div>
                            <h3 class="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-1.5 leading-tight">
                                Shahid AI
                            </h3>
                            <p class="text-[11px] text-slate-400 flex items-center gap-1">
                                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online & Ready to help
                            </p>
                        </div>
                    </div>
                    <div class="flex items-center gap-1">
                        <button id="ai-chat-clear" type="button" title="Clear chat history" class="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition">
                            <i class="fas fa-trash-alt text-xs"></i>
                        </button>
                        <button id="ai-chat-close" type="button" title="Close chat" class="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition">
                            <i class="fas fa-times text-sm"></i>
                        </button>
                    </div>
                </div>

                <!-- Chat Messages Body -->
                <div id="ai-chat-messages" class="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar">
                    <!-- Default Initial Message -->
                    <div class="flex items-start gap-2.5 mb-2">
                        <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm border border-white/20">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="max-w-[85%]">
                            <div class="glass bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 text-slate-900 dark:text-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-md text-sm leading-relaxed">
                                Hi there! 👋 I'm <strong>Shahid AI</strong>, Muhammed Shahid's virtual assistant. Ask me anything about Shahid's <strong>projects</strong>, <strong>skills</strong>, <strong>education</strong>, or how to <strong>contact</strong> him!
                            </div>
                            
                            <!-- Suggestion Chips -->
                            <div id="ai-chat-suggestions" class="mt-3 flex flex-wrap gap-1.5">
                                <button type="button" class="suggestion-chip text-xs bg-slate-800/70 hover:bg-brand-500/20 text-slate-300 hover:text-brand-300 border border-slate-700/80 hover:border-brand-500/40 px-3 py-1.5 rounded-xl transition text-left font-medium" data-prompt="Show top projects">
                                    🚀 Top Projects
                                </button>
                                <button type="button" class="suggestion-chip text-xs bg-slate-800/70 hover:bg-brand-500/20 text-slate-300 hover:text-brand-300 border border-slate-700/80 hover:border-brand-500/40 px-3 py-1.5 rounded-xl transition text-left font-medium" data-prompt="What is the Fara'id calculator?">
                                    🧮 Fara'id Calculator
                                </button>
                                <button type="button" class="suggestion-chip text-xs bg-slate-800/70 hover:bg-brand-500/20 text-slate-300 hover:text-brand-300 border border-slate-700/80 hover:border-brand-500/40 px-3 py-1.5 rounded-xl transition text-left font-medium" data-prompt="What are Shahid's tech skills?">
                                    💻 Technical Skills
                                </button>
                                <button type="button" class="suggestion-chip text-xs bg-slate-800/70 hover:bg-brand-500/20 text-slate-300 hover:text-brand-300 border border-slate-700/80 hover:border-brand-500/40 px-3 py-1.5 rounded-xl transition text-left font-medium" data-prompt="How can I contact Shahid?">
                                    ✉️ Contact Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Chat Footer Input -->
                <div class="p-3 border-t border-slate-200/20 dark:border-slate-800 bg-slate-900/90">
                    <div class="flex items-center gap-2 bg-slate-800/80 dark:bg-slate-900/80 border border-slate-700/80 rounded-2xl px-3 py-1.5 focus-within:border-brand-500 transition">
                        <input id="ai-chat-input" type="text" placeholder="Ask about Shahid..."
                            class="w-full bg-transparent text-sm text-slate-100 placeholder-slate-400 outline-none py-1.5 px-1 font-sans">
                        <button id="ai-chat-send" type="button" aria-label="Send message"
                            class="p-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-blue-600 text-white hover:opacity-90 active:scale-95 transition shrink-0 shadow-md">
                            <i class="fas fa-paper-plane text-xs"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(container);
    }
});
