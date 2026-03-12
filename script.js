/* ---------------------------
   First-visit micro-animations
---------------------------- */
(() => {
  const key = 'visited';
  try{
    if(!sessionStorage.getItem(key)){
      document.documentElement.classList.add('first-visit');
      sessionStorage.setItem(key, '1');
      setTimeout(() => document.documentElement.classList.remove('first-visit'), 1500);
    }
  }catch(e){ }
})();

/* ---------------------------
   Elements
---------------------------- */
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.getElementById('navLinks');
const themeToggle = document.getElementById('themeToggle');

/* ---------------------------
   Mobile nav toggle
---------------------------- */
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

/* ---------------------------
   Theme toggle with persistence
---------------------------- */
const root = document.documentElement;
const storedTheme = localStorage.getItem('theme');

if (storedTheme) {
  root.setAttribute('data-theme', storedTheme);
}

themeToggle?.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', current);
  localStorage.setItem('theme', current);
});

/* ---------------------------
   Footer year
---------------------------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------------------------
   Scroll reveal
---------------------------- */
const reveals = document.querySelectorAll('.reveal');

const onReveal = () => {
  const trigger = window.innerHeight * 0.88;

  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < trigger) el.classList.add('visible');
  });
};

window.addEventListener('scroll', onReveal);
window.addEventListener('load', onReveal);

/* ---------------------------
   Active link highlight on scroll
---------------------------- */
const sections = Array.from(document.querySelectorAll('main section[id]'));
const links = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));

const highlightOnScroll = () => {

  const scrollPos = window.scrollY + 120;
  let currentId = '';

  sections.forEach(sec => {
    const top = sec.offsetTop;
    const bottom = top + sec.offsetHeight;

    if (scrollPos >= top && scrollPos < bottom) {
      currentId = sec.id;
    }
  });

  links.forEach(a =>
    a.classList.toggle(
      'active',
      a.getAttribute('href') === `#${currentId}`
    )
  );
};

window.addEventListener('scroll', highlightOnScroll);
window.addEventListener('load', highlightOnScroll);

/* ---------------------------
   Copy email button
---------------------------- */
document.querySelectorAll('.copy').forEach(btn => {

  btn.addEventListener('click', async () => {

    const text = btn.getAttribute('data-copy');

    try{
      await navigator.clipboard.writeText(text);
      btn.textContent = 'Copied!';
      setTimeout(()=> btn.textContent='Copy', 1200);
    }catch{
      btn.textContent = 'Failed';
      setTimeout(()=> btn.textContent='Copy', 1200);
    }

  });

});

/* ---------------------------
   Tilt hover for project cards
---------------------------- */
const tiltCards = document.querySelectorAll('.tilt');
const maxTilt = 10;

tiltCards.forEach(card => {

  card.addEventListener('mousemove', (e) => {

    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const midX = rect.width / 2;
    const midY = rect.height / 2;

    const rotY = ((x - midX) / midX) * maxTilt;
    const rotX = -((y - midY) / midY) * maxTilt;

    card.style.transform =
      `rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-2px)`;

  });

  card.addEventListener('mouseleave', () => {

    card.style.transform = 'rotateX(0) rotateY(0)';

  });

});

/* ---------------------------
   Close mobile menu on link click
---------------------------- */
document.querySelectorAll('.nav-links a').forEach(a => {

  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });

});

/* ---------------------------
   Live Parallax Wallpaper
---------------------------- */
(() => {

  const html = document.documentElement;

  let target = 0;
  let current = 0;

  const ease = 0.12;
  const maxShift = 600;

  const updateTarget = () => {

    const docH = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );

    const winH = window.innerHeight;

    const maxScroll = Math.max(1, docH - winH);

    const progress = window.scrollY / maxScroll;

    target = -Math.round(progress * maxShift);

  };

  const raf = () => {

    current += (target - current) * ease;

    html.style.setProperty('--bg-pos-y', `${current}px`);

    requestAnimationFrame(raf);

  };

  window.addEventListener('scroll', updateTarget, { passive: true });
  window.addEventListener('resize', updateTarget);

  updateTarget();
  raf();

})();

/* ---------------------------
   Live particles background
---------------------------- */
(() => {

  const canvas = document.getElementById('bg-canvas');
  if(!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });

  let w, h;
  let particles = [];

  let mouse = {x: -1e6, y: -1e6};

  let density = 100;

  const setSize = () => {

    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;

    const target = Math.floor((w * h) / 16000);

    density = Math.max(60, Math.min(160, target));

    particles = Array.from(
      { length: density },
      () => makeParticle()
    );

  };

  const makeParticle = () => ({

    x: Math.random() * w,
    y: Math.random() * h,

    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,

    r: Math.random() * 1.6 + 0.6,

    hue: 250 + Math.random() * 70

  });

  const tick = () => {

    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < particles.length; i++) {

      const a = particles[i];

      a.x += a.vx;
      a.y += a.vy;

      if (a.x < 0 || a.x > w) a.vx *= -1;
      if (a.y < 0 || a.y > h) a.vy *= -1;

      const dx = a.x - mouse.x;
      const dy = a.y - mouse.y;

      const dist2 = dx*dx + dy*dy;

      if (dist2 < 20000) {

        a.vx += dx * -0.000003;
        a.vy += dy * -0.000003;

      }

    }

    for (let i = 0; i < particles.length; i++) {

      for (let j = i + 1; j < particles.length; j++) {

        const a = particles[i];
        const b = particles[j];

        const dx = a.x - b.x;
        const dy = a.y - b.y;

        const d2 = dx*dx + dy*dy;

        if (d2 < 9000) {

          const alpha = 1 - d2 / 9000;

          ctx.strokeStyle = `rgba(124, 58, 237, ${0.12 * alpha})`;

          ctx.lineWidth = 1;

          ctx.beginPath();

          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);

          ctx.stroke();

        }

      }

    }

    for (const p of particles) {

      ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, 0.8)`;

      ctx.beginPath();

      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);

      ctx.fill();

    }

    requestAnimationFrame(tick);

  };

  window.addEventListener('resize', setSize);

  window.addEventListener('mousemove', (e) => {

    mouse.x = e.clientX;
    mouse.y = e.clientY;

  });

  setSize();
  tick();

})();