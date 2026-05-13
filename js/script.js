// === LANG TOGGLE ===
let currentLang = 'en';

function setLang(lang) {
    currentLang = lang;
    // Update all elements with data-en / data-id
    document.querySelectorAll('[data-en], [data-id]').forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (!text) return;
        // Preserve inner HTML for elements that use <em> etc.
        if (text.includes('<')) {
        el.innerHTML = text;
        } else {
        el.textContent = text;
        }
    });

    // Update placeholders that use data-placeholder-en / data-placeholder-id
    document.querySelectorAll('[data-placeholder-en], [data-placeholder-id]').forEach(el => {
        const ph = el.getAttribute(`data-placeholder-${lang}`);
        if (ph) el.placeholder = ph;
    });

    // Update active state on all toggle buttons
    ['btn-id', 'btn-en', 'btn-id-m', 'btn-en-m'].forEach(id => {
        const btn = document.getElementById(id);
        if (!btn) return;
        const btnLang = id.includes('-en') ? 'en' : 'id';
        btn.classList.toggle('active', btnLang === lang);
    });
};


// === NAVBAR SCROLL EFFECT ===
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        navbar.classList.add('bg-white/95', 'backdrop-blur', 'shadow-sm');
    } else {
        navbar.classList.remove('bg-white/95', 'backdrop-blur', 'shadow-sm');
    }
});


// === SCROLL PROGRES BAR ===
const progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    if (progressBar) progressBar.style.width = progress + '%';
});


// === HAMBURGER MOBILE MENU ===
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
document.querySelectorAll('.mobile-link').forEach(l =>
    l.addEventListener('click', () => mobileMenu.classList.remove('open'))
);


// === BACK TO TOP ===
const backTop = document.getElementById('back-top');
window.addEventListener('scroll', () => {
    if (backTop) backTop.style.opacity = window.scrollY > 300 ? '1' : '0';
});


// === SCROLL REVEAL ===
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
                bar.style.width = bar.dataset.pct + '%';
            });
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


// === TYPEWRITTER ===
const typewriterEl = document.getElementById('typewriter-text');
const words = [
    'Frontend Developer',
    'Building Modern Web Interfaces',
    'Creating Responsive Websites',
    'Crafting Interactive User Experiences',
    'Turning Ideas Into Beautiful Websites',
];
let wordIdx = 0, charIdx = 0, isDeleting = false;

function typeWriter() {
    if (!typewriterEl) return;
    const current = words[wordIdx];
    const displayed = isDeleting
        ? current.substring(0, charIdx--)
        : current.substring(0, charIdx++);

    typewriterEl.textContent = displayed;

    let delay = isDeleting ? 50 : 100;
    if (!isDeleting && charIdx === current.length + 1) {
        delay = 1800;
        isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        delay = 400;
    }
    setTimeout(typeWriter, delay);
}
typeWriter();


// === SKILL BARS ANIMATION === 
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Progress Bar Animation
            entry.target.querySelectorAll('.skill-fill').forEach(bar => {
                bar.classList.add('animated');
            });
            // Animation of Percent Numbers
            entry.target.querySelectorAll('.skill-percent').forEach(counter => {
                const target = parseInt(counter.dataset.target);
                let current = 0;
                const updateCounter = () => {
                    const increment = Math.ceil(target / 40);
                    current += increment;
                    if (current < target) {
                        counter.textContent = `${current}%`;
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = `${target}%`;
                    }
                };
                updateCounter();
            });
            // Animation Only Once
            skillObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.3
});

const skillSection = document.getElementById('skills');
if (skillSection) {
    skillObserver.observe(skillSection);
}


// === FILTER BUTTONS ===
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active', 'bg-green-500', 'text-white'));
        btn.classList.add('active', 'bg-green-500', 'text-white');
        renderProjects(btn.dataset.filter);
    });
});

// === RENDER PROJECTS ===
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Active button
        filterButtons.forEach(b => {
            b.classList.remove('active', 'bg-green-500', 'text-white');
        });
        btn.classList.add('active', 'bg-green-500', 'text-white');

        const filter = btn.dataset.filter;
        
        // Filter project
        projectCards.forEach(card => {
            if (
                filter === 'all' ||
                card.dataset.category === filter
            ) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});


// === WHATSAPP FORM HANDLER
function sendViaWhatsApp() {
    const name    = document.getElementById('form-name')?.value.trim();
    const email   = document.getElementById('form-email')?.value.trim();
    const subject = document.getElementById('form-subject')?.value.trim();
    const message = document.getElementById('form-message')?.value.trim();

    if (!name || !subject || !message) {
        const alertMsg = currentLang === 'id'
        ? 'Harap isi Nama, Subjek, dan Pesan.'
        : 'Please fill in Name, Subject, and Message.';
        alert(alertMsg);
        return;
    }

    const waNumber = '6289653306722';
    const text = encodeURIComponent(
        `Halo Ilham! \n\n*Nama:* ${name}\n*Email:* ${email || '-'}\n*Subjek:* ${subject}\n\n*Pesan:*\n${message}`
    );
    window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank');
};


// === INIT ===
setLang('en');