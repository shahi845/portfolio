// --- Project & Stack Filtering ---
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

function filterProjects(filterValue) {
    // Update active filter button state
    filterBtns.forEach(b => {
        const val = b.getAttribute('data-filter');
        if (val === filterValue) {
            b.classList.add('active', 'text-brand-500', 'border-brand-500', 'shadow-[0_0_12px_rgba(59,130,246,0.3)]');
            b.classList.remove('text-slate-500');
        } else {
            b.classList.remove('active', 'text-brand-500', 'border-brand-500', 'shadow-[0_0_12px_rgba(59,130,246,0.3)]');
            b.classList.add('text-slate-500');
        }
    });

    // Show/hide cards matching category OR technology tag
    projectCards.forEach(card => {
        const tags = (card.getAttribute('data-tags') || '').toLowerCase();
        if (filterValue === 'all' || card.classList.contains(filterValue) || tags.includes(filterValue.toLowerCase())) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filterValue = btn.getAttribute('data-filter');
        filterProjects(filterValue);
    });
});

// Allow tech badge clicks across the page to filter projects
document.addEventListener('click', (e) => {
    const techTag = e.target.closest('.interactive-tech-tag');
    if (techTag) {
        const tech = techTag.getAttribute('data-tech');
        if (tech) {
            filterProjects(tech);
            const projectsSection = document.getElementById('projects');
            if (projectsSection) {
                projectsSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
});

// --- Case Study Modal ---
const caseStudyData = {
    'faraid': {
        title: "Fara'id Inheritance Calculator Engine",
        subtitle: "Multi-madhhab Islamic inheritance fraction & distribution algorithm",
        problem: "Classical Islamic inheritance jurisprudence involves intricate fraction calculations, heir blocking rules (Hajb), residuary distribution (Asabah), and proportional adjustments (Awl & Radd). Most online calculators struggle with multi-madhhab differences and fail edge-case tests.",
        goals: "Design an accurate, testable JavaScript engine capable of processing shares across Shafi'i, Hanafi, Maliki, and Hanbali madhhabs with zero floating-point rounding errors.",
        architecture: "Utilizes a rule-based Pipeline Pattern in pure ES6 JavaScript. Shares are computed strictly using rational fractions (numerator/denominator) before converting to percentages, preventing precision loss.",
        diagram: `[ User Heir Inputs ]
        │
        ▼
[ Input Validation ] ──► Check Relatives & Count
        │
        ▼
[ Primary Share Rules ] ──► Fixed Fractional Shares (1/2, 1/4, 1/8, 2/3, 1/3, 1/6)
        │
        ▼
[ Hajb / Blocking Engine ] ──► Exclude Barred Relatives
        │
        ▼
[ Asabah & Awl/Radd ] ──► Proportional Denominator Balancing
        │
        ▼
[ Exact Rational Fractions ] ──► Client Display & PDF-Lib Report Generation`,
        metrics: [
            { label: "Calculation Accuracy", value: "100% (0% Float Rounding Error)" },
            { label: "Unit Test Cases Passed", value: "30+ Jurisprudential Edge Cases" },
            { label: "Lighthouse Performance", value: "98/100" },
            { label: "Client Execution Latency", value: "< 5ms Instant Compute" }
        ],
        challenges: "Translating classical Arabic jurisprudential treatises into strict algorithmic logic, handling edge cases like Umariyyatan (Gharrawain), and rendering clean, shareable PDF reports with PDF-Lib.",
        solution: "Built an engine with automated unit tests for over 30 test cases, custom fraction math utilities, heir input validation, and instantaneous share breakdown UI.",
        lessons: "Mastered exact fraction math in JS, pipeline architecture patterns, and domain-driven algorithmic design.",
        stack: ['JavaScript (ES6)', 'Cloudflare Workers', 'Vercel', 'Exact Fractions', 'PDF-Lib', 'Tailwind CSS'],
        live: 'https://fara-id.vercel.app',
        code: 'https://github.com/shahi845/inheritance-calculator'
    },
    'calculator': {
        title: "Interactive Precision Web Calculator",
        subtitle: "Expression parsing browser calculator with operator precedence",
        problem: "Basic web calculators calculate results sequentially without observing mathematical operator precedence (BODMAS/PEMDAS), leading to incorrect evaluations for multi-operator expressions.",
        goals: "Construct a clean, responsive browser calculator with real-time expression parsing, full keyboard navigation, and edge-case handling.",
        architecture: "Vanilla JavaScript using an expression tokenization and stack parsing approach. DOM state handlers trigger smooth UI updates on keystroke or click.",
        diagram: `[ Raw Button / Key Input ]
        │
        ▼
[ Expression Tokenizer ] ──► Group Numbers, Decimals & Operators
        │
        ▼
[ Shunting-Yard Stack Parser ] ──► Enforce Operator Precedence (BODMAS)
        │
        ▼
[ Evaluator Engine ] ──► Safely Evaluate Expression Tree
        │
        ▼
[ DOM Display Handler ] ──► Render Formatted Output & Memory Stack`,
        metrics: [
            { label: "Lighthouse Score", value: "99/100 Mobile & Desktop" },
            { label: "Keyboard Accessibility", value: "WCAG AA Keyboard Navigation" },
            { label: "Bundle Size", value: "< 15 KB (Zero Dependencies)" },
            { label: "Edge Delivery Speed", value: "< 30ms Cloudflare Workers TTFB" }
        ],
        challenges: "Handling decimal edge cases, preventing double operators, and ensuring responsive touch controls for mobile screen sizes.",
        solution: "Delivered a lightweight web app deployed on Cloudflare Workers with full keyboard shortcut bindings and high contrast visual feedback.",
        lessons: "Deepened understanding of stack data structures, event listeners, keyboard navigation accessibility, and edge computing deployment.",
        stack: ['JavaScript', 'HTML5', 'CSS3', 'Cloudflare Workers', 'Stack Parser'],
        live: 'https://e-calculator.mshahid3845.workers.dev/',
        code: 'https://github.com/shahi845/calculator'
    },
    'portfolio': {
        title: "Full Stack Personal Portfolio",
        subtitle: "Glassmorphic website with AI Assistant & Node.js backend",
        problem: "Standard template portfolios often feel generic and lack interactive proof of technical competence, AI integration, or server-side communication.",
        goals: "Build a modern, lightning-fast portfolio featuring glassmorphic design, Gemini AI chat assistant, command palette (Ctrl+K), retro CLI terminal, and Node.js contact backend.",
        architecture: "Client built with HTML5, CSS3 aurora mesh, and Tailwind CSS; Node.js Express server acting as API proxy for Gemini AI and email delivery.",
        diagram: `[ Browser Client UI ]
   ├──► [ Command Palette / CLI ] ──► Quick Nav & Terminal
   └──► [ AI Chatbot Widget ]
              │ (POST /api/chat)
              ▼
    [ Node.js / Express Server ]
              │ (Server-Side Key Protection)
              ▼
    [ Gemini 2.5 Flash SDK ] ──► Streamed AI Context Response`,
        metrics: [
            { label: "Lighthouse Performance", value: "98/100" },
            { label: "Security", value: "100% Server-Side API Key Proxying" },
            { label: "Interactive Tools", value: "Command Palette + CLI Terminal + AI Chat" },
            { label: "Mobile Responsiveness", value: "Fully Responsive Layout" }
        ],
        challenges: "Maintaining WCAG contrast ratios with dark glassmorphism, disabling HMR artifacts, and implementing smooth non-blocking micro-animations.",
        solution: "Created an interactive web portfolio with live GitHub API stats, command search palette, AI chat assistant, and responsive layout.",
        lessons: "Enhanced full-stack Node.js development, REST API design, rate-limiting, and AI prompt engineering.",
        stack: ['Node.js', 'Express', 'Gemini AI API', 'Tailwind CSS', 'JavaScript', 'Cloudflare'],
        live: 'https://shahidportfolio.mshahid3845.workers.dev/',
        code: 'https://github.com/shahi845/personal-portfolio'
    },
    'tfa': {
        title: "Tuhfa Football Association Dashboard",
        subtitle: "Real-time league standings, fixtures, and player analytics platform",
        problem: "Local sports associations struggle with outdated static schedules and delayed match results for players and fans.",
        goals: "Develop a mobile-first sports tournament dashboard displaying live league tables, match results, top goal scorers, and player statistics.",
        architecture: "Single Page Application using dynamic JavaScript rendering arrays into clean, sorted HTML table structures.",
        diagram: `[ Match & Player Dataset ]
        │
        ▼
[ Auto-Sorting Algorithm ] ──► Compute Points, GD, Head-to-Head
        │
        ▼
[ Table View Renderer ] ──► Mobile Responsive Horizontal Scroll
        │
        ▼
[ Search & Filter Handler ] ──► Instant Player & Fixture Lookup`,
        metrics: [
            { label: "Sorting Latency", value: "< 2ms Client Array Sorting" },
            { label: "Page Load Time", value: "< 0.4 Seconds" },
            { label: "Mobile Viewport", value: "Optimized Touch & Table Scroll" },
            { label: "Uptime", value: "99.9% Deployed on Cloudflare" }
        ],
        challenges: "Designing dense tabular data layouts that remain legible on mobile screens without overflow issues.",
        solution: "Implemented auto-sorting standings tables with tie-breaker logic (goal difference, head-to-head) and quick player search.",
        lessons: "Mastered data sorting algorithms, responsive CSS grid/table layouts, and user-centric data presentation.",
        stack: ['JavaScript', 'HTML5', 'Tailwind CSS', 'Cloudflare Workers', 'Data Sorting'],
        live: 'https://tfa-2.mshahid3845.workers.dev',
        code: 'https://github.com/shahi845/2tfa'
    }
};

const modal = document.getElementById('caseStudyModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const openModalBtns = document.querySelectorAll('.open-modal-btn');

openModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const projectId = btn.getAttribute('data-project');
        const data = caseStudyData[projectId];
        if (data) {
            document.getElementById('modalTitle').textContent = data.title;
            const subtitleEl = document.getElementById('modalSubtitle');
            if (subtitleEl) subtitleEl.textContent = data.subtitle;

            document.getElementById('modalProblem').textContent = data.problem;
            document.getElementById('modalGoals').textContent = data.goals;
            document.getElementById('modalArchitecture').textContent = data.architecture;
            document.getElementById('modalChallenges').textContent = data.challenges;
            document.getElementById('modalSolution').textContent = data.solution;
            document.getElementById('modalLessons').textContent = data.lessons;

            const diagramEl = document.getElementById('modalDiagram');
            if (diagramEl) {
                diagramEl.textContent = data.diagram || 'Client UI ──► Server / Engine ──► Response';
            }

            const metricsContainer = document.getElementById('modalMetrics');
            if (metricsContainer) {
                metricsContainer.innerHTML = (data.metrics || []).map(m => `
                    <div class="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                        <span class="text-slate-400 font-medium">${m.label}:</span>
                        <span class="font-bold font-mono text-emerald-400 text-right">${m.value}</span>
                    </div>
                `).join('');
            }
            
            const stackContainer = document.getElementById('modalStack');
            stackContainer.innerHTML = data.stack.map(tech => `
                <button type="button" class="interactive-tech-tag px-3 py-1 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/20 rounded-lg text-xs font-mono font-bold transition cursor-pointer" data-tech="${tech}">
                    ${tech}
                </button>
            `).join('');
            
            document.getElementById('modalLiveLink').href = data.live;
            document.getElementById('modalCodeLink').href = data.code;
            
            modal.showModal();
            document.body.style.overflow = 'hidden';
        }
    });
});

closeModalBtn?.addEventListener('click', () => {
    modal.close();
    document.body.style.overflow = '';
});

modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.close();
        document.body.style.overflow = '';
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.open) {
        modal.close();
        document.body.style.overflow = '';
    }
});

// --- GitHub Repos Fetch ---
async function fetchGitHubRepos() {
    const container = document.getElementById("github-repos");
    if (!container) return;
    
    container.innerHTML = Array(3).fill('<div class="h-36 rounded-2xl skeleton"></div>').join('');
    try {
        const res = await fetch("https://api.github.com/users/shahi845/repos?sort=updated&per_page=6");
        if (res.ok) {
            const repos = await res.json();
            container.innerHTML = "";
            repos.forEach(repo => {
                container.innerHTML += `
                <div class="glass glass-card p-5 rounded-2xl flex flex-col h-full border border-slate-200/40 dark:border-slate-800 hover:border-brand-500/40 transition" data-aos="fade-up">
                    <div class="flex items-center justify-between mb-2">
                        <h4 class="font-bold text-base text-slate-900 dark:text-white truncate flex items-center">
                            <i class="fab fa-github text-brand-400 mr-2"></i> ${repo.name}
                        </h4>
                        <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                            ${repo.language || 'Code'}
                        </span>
                    </div>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mb-4 flex-1 line-clamp-2 leading-relaxed">
                        ${repo.description || "Open source project repository by Muhammed Shahid."}
                    </p>
                    <div class="flex items-center justify-between pt-3 border-t border-slate-200/40 dark:border-slate-800 text-xs font-mono text-slate-400">
                        <span class="flex items-center gap-1"><i class="far fa-star text-amber-400"></i> ${repo.stargazers_count}</span>
                        <span class="flex items-center gap-1"><i class="fas fa-code-branch text-blue-400"></i> ${repo.forks_count}</span>
                        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="text-brand-400 font-bold hover:underline flex items-center gap-1">
                            Repo <i class="fas fa-arrow-right text-[10px]"></i>
                        </a>
                    </div>
                </div>`;
            });
        }
    } catch (err) { 
        container.innerHTML = `<p class="text-slate-400 text-sm col-span-3">View all repositories directly on <a href="https://github.com/shahi845" target="_blank" class="text-brand-400 underline">GitHub @shahi845</a>.</p>`; 
    }
}
fetchGitHubRepos();
