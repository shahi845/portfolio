// --- Theme Logic ---
const themeToggleBtn = document.getElementById('theme-toggle');
const rootTheme = document.documentElement;

if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    rootTheme.classList.add('dark');
} else {
    rootTheme.classList.remove('dark');
}

themeToggleBtn?.addEventListener('click', () => { 
    rootTheme.classList.toggle('dark'); 
    if (rootTheme.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});

// --- Navigation & ScrollSpy ---
const nav = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const progressBar = document.getElementById('scroll-progress-bar');

function updateScrollProgress() {
    if (!progressBar) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, scrollPercentage))}%`;
}

window.addEventListener('scroll', () => {
    // Update top progress bar
    updateScrollProgress();

    // Navbar styling
    if (window.scrollY > 50) {
        nav?.classList.add('shadow-lg', 'bg-slate-900/90', 'dark:bg-slate-950/90', 'backdrop-blur-md'); 
        nav?.classList.remove('glass');
    } else {
        nav?.classList.remove('shadow-lg', 'bg-slate-900/90', 'dark:bg-slate-950/90', 'backdrop-blur-md'); 
        nav?.classList.add('glass');
    }

    // ScrollSpy
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= (sectionTop - 250)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('text-brand-400', 'font-bold');
        if (current && link.getAttribute('href').includes(current)) {
            link.classList.add('text-brand-400', 'font-bold');
            link.classList.remove('text-slate-400');
        } else {
            link.classList.add('text-slate-400');
        }
    });
}, { passive: true });

window.addEventListener('resize', updateScrollProgress, { passive: true });
document.addEventListener('DOMContentLoaded', updateScrollProgress);
updateScrollProgress();

// --- Mobile Menu ---
const mobileMenuButton = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const dropdownLinks = document.querySelectorAll(".dropdown-links .nav-link");

mobileMenuButton?.addEventListener("click", () => {
    const isHidden = mobileMenu.classList.toggle("hidden");
    mobileMenuButton.setAttribute("aria-expanded", String(!isHidden));
});

dropdownLinks.forEach(link => {
    link.addEventListener("click", () => {
        mobileMenu?.classList.add("hidden");
        mobileMenuButton?.setAttribute("aria-expanded", "false");
    });
});

// --- Typewriter Effect ---
const titles = [
    "Full Stack Web Developer",
    "Cloudflare & Vercel Applications",
    "AI Integration Specialist",
    "Islamic Mathematics Algorithmist"
];
const typewriterElement = document.getElementById('typewriter');
let titleIdx = 0;
let charIdx = 0;
let isDeleting = false;

function loopTypeWriter() {
    if (!typewriterElement) return;
    const currentTitle = titles[titleIdx];

    if (isDeleting) {
        typewriterElement.textContent = currentTitle.substring(0, charIdx - 1);
        charIdx--;
    } else {
        typewriterElement.textContent = currentTitle.substring(0, charIdx + 1);
        charIdx++;
    }

    let delay = isDeleting ? 40 : 80;

    if (!isDeleting && charIdx === currentTitle.length) {
        delay = 2000;
        isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        titleIdx = (titleIdx + 1) % titles.length;
        delay = 400;
    }

    setTimeout(loopTypeWriter, delay);
}
setTimeout(loopTypeWriter, 500);

// --- Mouse Light Pointer Effect ---
const cursorGlow = document.createElement('div');
cursorGlow.className = 'fixed w-[400px] h-[400px] rounded-full pointer-events-none z-0 transition-opacity duration-500 opacity-0 md:opacity-20 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 blur-[90px] -translate-x-1/2 -translate-y-1/2';
document.body.appendChild(cursorGlow);

window.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = `${e.clientX}px`;
    cursorGlow.style.top = `${e.clientY}px`;
    cursorGlow.style.opacity = '0.25';
}, { passive: true });

// --- Particles Background ---
function createParticles() {
    const container = document.getElementById('particles-js');
    if(!container) return;
    for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.style.cssText = `position:absolute; width:${Math.random() * 4 + 2}px; height:${Math.random() * 4 + 2}px; background:rgba(59,130,246,0.3); border-radius:50%; top:${Math.random() * 100}%; left:${Math.random() * 100}%; opacity:${Math.random() * 0.2 + 0.1}; animation:float ${Math.random() * 25 + 30}s linear infinite;`;
        container.appendChild(p);
    }
}
createParticles();
document.head.appendChild(Object.assign(document.createElement("style"), { innerText: "@keyframes float { 0% { transform: translateY(0) translateX(0); } 50% { transform: translateY(-80px) translateX(40px); } 100% { transform: translateY(0) translateX(0); } }" }));

// --- Live Time Clock Indicator ---
function updateLiveClock() {
    const clockEl = document.getElementById('live-clock');
    if (!clockEl) return;
    const now = new Date();
    // India Standard Time (IST - Kasaragod)
    const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    clockEl.textContent = `${now.toLocaleTimeString('en-US', options)} IST`;
}
setInterval(updateLiveClock, 1000);
updateLiveClock();
