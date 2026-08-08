/**
 * ⚡ Command Palette (Ctrl+K), Terminal Mode, and Resume Modal
 */

document.addEventListener('DOMContentLoaded', () => {
    initCommandPalette();
    initTerminalMode();
    initResumeModal();
    initStatCounters();
});

// --- 1. Command Palette ---
function initCommandPalette() {
    const palette = document.getElementById('commandPalette');
    const input = document.getElementById('paletteInput');
    const items = document.querySelectorAll('.palette-item');
    const openBtns = document.querySelectorAll('.open-palette-btn');
    const closeBtn = document.getElementById('closePaletteBtn');

    if (!palette || !input) return;

    function openPalette() {
        palette.classList.remove('hidden');
        palette.showModal();
        document.body.style.overflow = 'hidden';
        input.value = '';
        filterItems('');
        setTimeout(() => input.focus(), 50);
    }

    function closePalette() {
        palette.close();
        palette.classList.add('hidden');
        document.body.style.overflow = '';
    }

    openBtns.forEach(btn => btn.addEventListener('click', openPalette));
    closeBtn?.addEventListener('click', closePalette);

    // Global shortcut Ctrl+K or Cmd+K
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (palette.open) {
                closePalette();
            } else {
                openPalette();
            }
        }
    });

    palette.addEventListener('click', (e) => {
        if (e.target === palette) closePalette();
    });

    input.addEventListener('input', (e) => {
        filterItems(e.target.value.toLowerCase().trim());
    });

    function filterItems(query) {
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (!query || text.includes(query)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    items.forEach(item => {
        item.addEventListener('click', () => {
            const action = item.getAttribute('data-action');
            closePalette();
            executeAction(action);
        });
    });

    function executeAction(action) {
        if (!action) return;
        if (action.startsWith('#')) {
            const el = document.querySelector(action);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else if (action === 'terminal') {
            openTerminal();
        } else if (action === 'theme') {
            document.getElementById('theme-toggle')?.click();
        } else if (action === 'resume') {
            openResumeModal();
        } else if (action === 'ai-chat') {
            document.getElementById('ai-chat-toggle')?.click();
        }
    }
}

// --- 2. Interactive Terminal Mode ---
function initTerminalMode() {
    const modal = document.getElementById('terminalModal');
    const output = document.getElementById('terminalOutput');
    const input = document.getElementById('terminalInput');
    const closeBtn = document.getElementById('closeTerminalBtn');
    const openBtns = document.querySelectorAll('.open-terminal-btn');

    if (!modal || !input) return;

    window.openTerminal = function() {
        modal.classList.remove('hidden');
        modal.showModal();
        document.body.style.overflow = 'hidden';
        input.value = '';
        setTimeout(() => input.focus(), 50);
    };

    function closeTerminal() {
        modal.close();
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    openBtns.forEach(btn => btn.addEventListener('click', openTerminal));
    closeBtn?.addEventListener('click', closeTerminal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeTerminal();
    });

    const commands = {
        'help': `Available commands:
  • <span class="text-cyan-400">about</span>      - Brief biography & coding background
  • <span class="text-cyan-400">skills</span>     - Core technical stack
  • <span class="text-cyan-400">projects</span>   - List key projects & live links
  • <span class="text-cyan-400">philosophy</span> - Coding principles & mindset
  • <span class="text-cyan-400">contact</span>    - Direct contact details
  • <span class="text-cyan-400">resume</span>     - Open resume viewer modal
  • <span class="text-cyan-400">clear</span>      - Clear terminal screen
  • <span class="text-cyan-400">exit</span>       - Close terminal`,

        'about': `Muhammed Shahid | Full Stack Developer
Location: Kasaragod, Kerala, India
Education: Malik Deenar Islamic Academy (Hudawi Course) & Plus Two Commerce
Mission: Building high-performance, accessible, and mathematically precise web applications.`,

        'skills': `Frontend:  HTML5, CSS3, JavaScript (ES6+), Tailwind CSS, React
Backend:   Node.js, Express.js, REST APIs
Cloud/AI:  Cloudflare Workers, Vercel, Gemini AI API
Tools:     Git, GitHub, VS Code, Linux`,

        'projects': `1. Fara'id Inheritance Calculator (Live: https://fara-id.vercel.app)
2. Interactive Web Calculator (Live: https://e-calculator.mshahid3845.workers.dev)
3. Personal Portfolio (Live: https://personal-shahid-portfolio.vercel.app)
4. Tuhfa Football Association Dashboard (Live: https://tfa-2.mshahid3845.workers.dev)`,

        'philosophy': `1. Deterministic Math & Exact Fractions (0% Float Error)
2. Zero Dependency Bloat & High Performance
3. Purposeful Server-Side AI Engineering`,

        'contact': `Email: mshahid3845@gmail.com
GitHub: https://github.com/shahi845
LinkedIn: https://www.linkedin.com/in/muhammed-shahid-388434392/`,

        'resume': `Opening resume preview modal...`
    };

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = input.value.trim().toLowerCase();
            input.value = '';

            if (cmd === 'clear') {
                output.innerHTML = '<p class="text-slate-400">Terminal cleared. Type <span class="text-cyan-400 font-bold">help</span> for a list of available commands.</p>';
                return;
            }

            if (cmd === 'exit') {
                closeTerminal();
                return;
            }

            const p = document.createElement('div');
            p.className = 'mb-3';
            p.innerHTML = `<p class="text-brand-400 font-bold">&gt; ${escapeHtml(cmd)}</p>`;

            if (cmd === 'resume') {
                p.innerHTML += `<p class="text-slate-300 mt-1 whitespace-pre-line">${commands['resume']}</p>`;
                output.appendChild(p);
                closeTerminal();
                openResumeModal();
            } else if (commands[cmd]) {
                p.innerHTML += `<p class="text-slate-300 mt-1 whitespace-pre-line">${commands[cmd]}</p>`;
                output.appendChild(p);
            } else if (cmd) {
                p.innerHTML += `<p class="text-rose-400 mt-1">Command not recognized: '${escapeHtml(cmd)}'. Type <span class="text-cyan-400 font-bold">help</span> for available commands.</p>`;
                output.appendChild(p);
            }

            output.scrollTop = output.scrollHeight;
        }
    });

    function escapeHtml(str) {
        return str.replace(/[&<>"']/g, m => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
        })[m]);
    }
}

// --- 3. Resume Modal ---
function initResumeModal() {
    const modal = document.getElementById('resumeModal');
    const openBtns = document.querySelectorAll('.open-resume-btn');
    const closeBtn = document.getElementById('closeResumeBtn');

    if (!modal) return;

    window.openResumeModal = function() {
        modal.classList.remove('hidden');
        modal.showModal();
        document.body.style.overflow = 'hidden';
    };

    function closeResumeModal() {
        modal.close();
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    openBtns.forEach(btn => btn.addEventListener('click', openResumeModal));
    closeBtn?.addEventListener('click', closeResumeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeResumeModal();
    });
}

// --- 4. Stat Counter Animations ---
function initStatCounters() {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const endValue = parseInt(target.getAttribute('data-target') || '0', 10);
                const suffix = target.getAttribute('data-suffix') || '';
                let startValue = 0;
                const duration = 1500;
                const stepTime = 30;
                const steps = duration / stepTime;
                const increment = endValue / steps;

                const timer = setInterval(() => {
                    startValue += increment;
                    if (startValue >= endValue) {
                        target.textContent = endValue + suffix;
                        clearInterval(timer);
                    } else {
                        target.textContent = Math.floor(startValue) + suffix;
                    }
                }, stepTime);

                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}
