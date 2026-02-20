/* ============================================================
   script.js — Bryant Phanvong Portfolio
   ============================================================ */


/* ===== CUSTOM CURSOR ===== */

const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Dot follows instantly
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
});

// Ring follows with smooth lag
function animateCursor() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();


/* ===== HEADER — SHRINK ON SCROLL ===== */

const mainHeader = document.getElementById('mainHeader');

window.addEventListener('scroll', () => {
    mainHeader.classList.toggle('scrolled', window.scrollY > 50);
});


/* ===== ACTIVE NAV LINK ON SCROLL ===== */

const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            navLinks.forEach((link) => {
                link.classList.toggle(
                    'active',
                    link.getAttribute('href') === '#' + entry.target.id
                );
            });
        }
    });
}, { threshold: 0.4 });

sections.forEach((section) => navObserver.observe(section));


/* ===== SCROLL REVEAL ===== */

const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

revealEls.forEach((el) => revealObserver.observe(el));


/* ===== SKILL BARS — ANIMATE ON SCROLL ===== */

const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const el = entry.target;
            setTimeout(() => {
                el.style.width = el.dataset.width + '%';
            }, 200);
            skillObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

skillFills.forEach((fill) => skillObserver.observe(fill));


/* ===== PROJECT FILTER ===== */

const filterBtns   = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        // Update active button
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        // Show/hide cards with staggered animation
        projectCards.forEach((card, i) => {
            const show = filter === 'all' || card.dataset.category === filter;

            if (show) {
                card.style.display = 'block';
                // Reset animation
                card.style.animation = 'none';
                void card.offsetHeight; // force reflow
                card.style.animation = `fadeUp 0.4s ${i * 0.06}s both`;
            } else {
                card.style.display = 'none';
            }
        });
    });
});


/* ===== CONTACT FORM — SUBMIT TO BACKEND ===== */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const name    = document.getElementById('name').value;
        const email   = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        fetch('http://localhost:5000/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message })
        })
        .then((res) => {
            if (res.ok) {
                alert('Message sent successfully!');
                form.reset();
            } else {
                alert('Error sending message. Check the backend.');
            }
        })
        .catch((err) => {
            console.error('Fetch error:', err);
            alert('Cannot reach backend. Make sure the server is running.');
        });
    });
});
