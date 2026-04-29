// =============================================
//  SAMATHWEE – script.js
//  Firebase Realtime Database ONLY
// =============================================

const firebaseConfig = {
  apiKey:            "AIzaSyDlBLrs-WquiVIivoOCuJq2g7BFhNwAtas",
  authDomain:        "samathwee.firebaseapp.com",
  projectId:         "samathwee",
  storageBucket:     "samathwee.firebasestorage.app",
  messagingSenderId: "1094489861098",
  appId:             "1:1094489861098:web:e61feb13a5f69a8b78e093",
  databaseURL:       "https://samathwee-default-rtdb.firebaseio.com"
};

firebase.initializeApp(firebaseConfig);
const rtdb = firebase.database();

// ══════════════════════════════════════════════
//  DEFAULT FALLBACK DATA
// ══════════════════════════════════════════════
const DEFAULTS = {
  hero: {
    tagline: "🎓 Excellence in Education Since 2010",
    title:   "Next Generation",
    desc:    "Samathwee Higher Education Center provides world-class tutoring and academic guidance from Grade 1 through A/Levels. Our expert faculty ensures every student reaches their peak potential."
  },
  stats: { students: 1200, teachers: 45, subjects: 30, centers: 1 },
  center: {
    name:    "Samathwee Panadura",
    desc:    "Our flagship center in Panadura, offering premium classrooms, a vast resource library, and a focused study environment for all students.",
    address: "Panadura, Sri Lanka",
    phone:   "",
    mapUrl:  "https://maps.app.goo.gl/wZSjj3zwNjdNAKVc9"
  },
  contact: {
    phone:       "+94 71 234 5678",
    whatsapp:    "+94 71 234 5678",
    email:       "samathwe@gmail.com",
    address:     "No: 91/3, Sri Mahavihara Rd, Panadura, Sri Lanka",
    facebook:    "Samathwee Education",
    facebookUrl: "https://facebook.com/",
    whatsappUrl: "https://wa.me/94712345678"
  },
  footer: {
    text:        "© 2026 Samathwee Higher Education Center. All rights reserved. Panadura, Sri Lanka.",
    dev:         "Dualsyntax IT",
    facebookUrl: "https://facebook.com/",
    whatsappUrl: "https://wa.me/94712345678"
  },
  grades: [
    { emoji:"🌟", name:"Grade 1–5",   sub:"Primary School",    count:"8 Subjects",  url:"grades-1-5.html",       order:1 },
    { emoji:"📘", name:"Grade 6–O/L", sub:"Junior & O/Levels", count:"17 Subjects", url:"grades-6-ol.html",      order:2 },
    { emoji:"🔬", name:"A / Levels",  sub:"Advanced Level",    count:"14 Subjects", url:"grades-al.html",        order:3 },
    { emoji:"🇬🇧", name:"London",     sub:"Edexcel / IGCSE",   count:"10 Subjects", url:"grades-london.html",    order:4 },
    { emoji:"🏛️", name:"Cambridge",  sub:"CAIE / IGCSE",      count:"10 Subjects", url:"grades-cambridge.html", order:5 }
  ],
  subjects: [
    { name:"Sinhala",               tag:"Grade 1–5",                    icon:"📖", color:"#fee2e2", iconColor:"#ef4444" },
    { name:"English",               tag:"All Levels",                   icon:"🔤", color:"#dbeafe", iconColor:"#3b82f6" },
    { name:"Mathematics",           tag:"All Levels",                   icon:"🔢", color:"#ede9fe", iconColor:"#8b5cf6" },
    { name:"Environmental Studies", tag:"Grade 1–5",                    icon:"🌿", color:"#dcfce7", iconColor:"#22c55e" },
    { name:"Buddhism",              tag:"All Levels",                   icon:"🙏", color:"#fef9c3", iconColor:"#eab308" },
    { name:"Art",                   tag:"All Levels",                   icon:"🎨", color:"#fce7f3", iconColor:"#ec4899" },
    { name:"Music",                 tag:"All Levels",                   icon:"🎵", color:"#fff7ed", iconColor:"#f97316" },
    { name:"Physical Education",    tag:"All Levels",                   icon:"⚽", color:"#dcfce7", iconColor:"#16a34a" },
    { name:"Science",               tag:"Grade 6–O/L",                  icon:"🧪", color:"#dbeafe", iconColor:"#2563eb" },
    { name:"History",               tag:"Grade 6–O/L",                  icon:"🏛️",color:"#fef3c7", iconColor:"#d97706" },
    { name:"Geography",             tag:"Grade 6–O/L",                  icon:"🌍", color:"#dcfce7", iconColor:"#059669" },
    { name:"Civic Education",       tag:"Grade 6–O/L",                  icon:"⚖️", color:"#e0e7ff", iconColor:"#4f46e5" },
    { name:"Health Education",      tag:"Grade 6–O/L",                  icon:"🏥", color:"#fee2e2", iconColor:"#dc2626" },
    { name:"ICT",                   tag:"O/L / A/L",                    icon:"💻", color:"#ede9fe", iconColor:"#7c3aed" },
    { name:"Commerce",              tag:"Grade 6–O/L",                  icon:"💼", color:"#fef3c7", iconColor:"#b45309" },
    { name:"Home Economics",        tag:"Grade 6–O/L",                  icon:"🏡", color:"#fce7f3", iconColor:"#db2777" },
    { name:"Technical Drawing",     tag:"Grade 6–O/L",                  icon:"📐", color:"#e0f2fe", iconColor:"#0284c7" },
    { name:"Agriculture",           tag:"Grade 6–O/L",                  icon:"🌾", color:"#dcfce7", iconColor:"#15803d" },
    { name:"Drama & Theatre",       tag:"Grade 6–O/L",                  icon:"🎭", color:"#fce7f3", iconColor:"#9333ea" },
    { name:"Dancing",               tag:"Grade 6–O/L",                  icon:"💃", color:"#fff1f2", iconColor:"#e11d48" },
    { name:"Combined Mathematics",  tag:"A/Level",                      icon:"📊", color:"#ede9fe", iconColor:"#6d28d9" },
    { name:"Physics",               tag:"A/Level / Cambridge / London", icon:"⚛️", color:"#dbeafe", iconColor:"#1d4ed8" },
    { name:"Chemistry",             tag:"A/Level / Cambridge / London", icon:"🧬", color:"#dcfce7", iconColor:"#16a34a" },
    { name:"Biology",               tag:"A/Level / Cambridge / London", icon:"🔬", color:"#dcfce7", iconColor:"#15803d" },
    { name:"Economics",             tag:"A/Level / London / Cambridge", icon:"📈", color:"#fef3c7", iconColor:"#92400e" },
    { name:"Business Studies",      tag:"A/Level / London",             icon:"🏢", color:"#e0f2fe", iconColor:"#0369a1" },
    { name:"Accounting",            tag:"A/Level",                      icon:"🧾", color:"#fef9c3", iconColor:"#ca8a04" },
    { name:"Political Science",     tag:"A/Level",                      icon:"🗳️",color:"#e0e7ff", iconColor:"#4338ca" },
    { name:"Logic & Scientific Method", tag:"A/Level",                  icon:"🧠", color:"#fce7f3", iconColor:"#db2777" },
    { name:"Further Mathematics",   tag:"London A/Level",               icon:"∞",  color:"#ede9fe", iconColor:"#7c3aed" },
    { name:"Psychology",            tag:"London A/Level",               icon:"🧘", color:"#fce7f3", iconColor:"#be185d" },
    { name:"Sociology",             tag:"London A/Level",               icon:"👥", color:"#e0f2fe", iconColor:"#0284c7" },
    { name:"Literature in English", tag:"London / Cambridge",           icon:"📚", color:"#fef3c7", iconColor:"#b45309" },
    { name:"Tamil",                 tag:"Grade 1–5 / O/L",              icon:"📝", color:"#fef9c3", iconColor:"#d97706" }
  ],
  teachers: []
};

const ICON_MAP = {
  "mathematics":            { icon:"🔢", color:"#ede9fe", iconColor:"#8b5cf6" },
  "combined mathematics":   { icon:"📊", color:"#ede9fe", iconColor:"#6d28d9" },
  "further mathematics":    { icon:"∞",  color:"#ede9fe", iconColor:"#7c3aed" },
  "physics":                { icon:"⚛️", color:"#dbeafe", iconColor:"#1d4ed8" },
  "chemistry":              { icon:"🧬", color:"#dcfce7", iconColor:"#16a34a" },
  "biology":                { icon:"🔬", color:"#dcfce7", iconColor:"#15803d" },
  "science":                { icon:"🧪", color:"#dbeafe", iconColor:"#2563eb" },
  "english":                { icon:"🔤", color:"#dbeafe", iconColor:"#3b82f6" },
  "sinhala":                { icon:"📖", color:"#fee2e2", iconColor:"#ef4444" },
  "tamil":                  { icon:"📝", color:"#fef9c3", iconColor:"#d97706" },
  "history":                { icon:"🏛️",color:"#fef3c7", iconColor:"#d97706" },
  "geography":              { icon:"🌍", color:"#dcfce7", iconColor:"#059669" },
  "economics":              { icon:"📈", color:"#fef3c7", iconColor:"#92400e" },
  "business studies":       { icon:"🏢", color:"#e0f2fe", iconColor:"#0369a1" },
  "accounting":             { icon:"🧾", color:"#fef9c3", iconColor:"#ca8a04" },
  "ict":                    { icon:"💻", color:"#ede9fe", iconColor:"#7c3aed" },
  "art":                    { icon:"🎨", color:"#fce7f3", iconColor:"#ec4899" },
  "music":                  { icon:"🎵", color:"#fff7ed", iconColor:"#f97316" },
  "drama":                  { icon:"🎭", color:"#fce7f3", iconColor:"#9333ea" },
  "dancing":                { icon:"💃", color:"#fff1f2", iconColor:"#e11d48" },
  "physical education":     { icon:"⚽", color:"#dcfce7", iconColor:"#16a34a" },
  "agriculture":            { icon:"🌾", color:"#dcfce7", iconColor:"#15803d" },
  "home economics":         { icon:"🏡", color:"#fce7f3", iconColor:"#db2777" },
  "commerce":               { icon:"💼", color:"#fef3c7", iconColor:"#b45309" },
  "buddhism":               { icon:"🙏", color:"#fef9c3", iconColor:"#eab308" },
  "civic education":        { icon:"⚖️", color:"#e0e7ff", iconColor:"#4f46e5" },
  "health education":       { icon:"🏥", color:"#fee2e2", iconColor:"#dc2626" },
  "psychology":             { icon:"🧘", color:"#fce7f3", iconColor:"#be185d" },
  "sociology":              { icon:"👥", color:"#e0f2fe", iconColor:"#0284c7" },
  "political science":      { icon:"🗳️",color:"#e0e7ff", iconColor:"#4338ca" },
  "literature":             { icon:"📚", color:"#fef3c7", iconColor:"#b45309" },
  "technical drawing":      { icon:"📐", color:"#e0f2fe", iconColor:"#0284c7" },
  "environmental":          { icon:"🌿", color:"#dcfce7", iconColor:"#22c55e" },
  "logic":                  { icon:"🧠", color:"#fce7f3", iconColor:"#db2777" }
};
const DEFAULT_ICON = { icon:"📖", color:"#ede9fe", iconColor:"#8b5cf6" };

function getSubjectIcon(name) {
  const key = (name || '').toLowerCase().trim();
  if (ICON_MAP[key]) return ICON_MAP[key];
  for (const k in ICON_MAP) {
    if (key.includes(k) || k.includes(key)) return ICON_MAP[k];
  }
  return DEFAULT_ICON;
}

// ── DOM HELPERS ──
function setText(id, val) {
  const el = document.getElementById(id);
  if (el && val !== undefined && val !== null && val !== '') el.textContent = val;
}
function setHref(id, href) {
  const el = document.getElementById(id);
  if (el && href) el.href = href;
}

// ── LOADING SCREEN ──
function dismissLoader() {
  const el = document.getElementById('loadingScreen');
  if (!el) return;
  el.classList.add('fade-out');
  setTimeout(() => { if (el) el.style.display = 'none'; }, 700);
}
setTimeout(dismissLoader, 400);

// ── HAMBURGER MENU ──
document.getElementById('hamburger')?.addEventListener('click', function () {
  this.classList.toggle('open');
  document.getElementById('nav-links')?.classList.toggle('open');
});

// ── CANVAS PARTICLES ──
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  function resizeCanvas() {
    canvas.width  = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  resizeCanvas();
  const COLORS = [[90,45,145],[243,146,35],[124,63,184],[255,180,60]];
  let particles = [];
  function initParticles() {
    particles = [];
    const count = Math.min(55, Math.floor(window.innerWidth / 22));
    for (let i = 0; i < count; i++) {
      const c = COLORS[Math.floor(Math.random() * COLORS.length)];
      particles.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        r: 2 + Math.random() * 5,
        dx: (Math.random() - 0.5) * 0.4, dy: (Math.random() - 0.5) * 0.4,
        color: c, alpha: 0.05 + Math.random() * 0.18,
        pulse: Math.random() * Math.PI * 2, pulseSpeed: 0.008 + Math.random() * 0.018
      });
    }
  }
  let animId;
  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < 130) {
          ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255,255,255,${(1 - dist / 130) * 0.07})`;
          ctx.lineWidth = 0.6; ctx.stroke();
        }
      }
    }
    particles.forEach(p => {
      p.pulse += p.pulseSpeed;
      const r = p.r + Math.sin(p.pulse) * 1.1;
      ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${p.alpha})`;
      ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.x < -p.r) p.x = canvas.width + p.r;
      if (p.x > canvas.width + p.r) p.x = -p.r;
      if (p.y < -p.r) p.y = canvas.height + p.r;
      if (p.y > canvas.height + p.r) p.y = -p.r;
    });
    animId = requestAnimationFrame(drawParticles);
  }
  resizeCanvas(); initParticles(); drawParticles();
  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId); resizeCanvas(); initParticles(); drawParticles();
  });
})();

// ── GRADE CARDS ──
function renderGrades(grades) {
  const grid = document.getElementById('gradesGrid');
  if (!grid) return;
  const sorted = [...grades].filter(Boolean).sort((a, b) => (a.order || 0) - (b.order || 0));
  if (!sorted.length) return;
  grid.innerHTML = sorted.map((g, idx) => `
    <a href="${g.url || '#'}" class="grade-card gc-${idx % 8}" style="transition-delay:${idx * 0.08}s">
      <span class="gc-emoji">${g.emoji || '📚'}</span>
      <div class="gc-title">${g.name || ''}</div>
      <div class="gc-sub">${g.sub || ''}</div>
      <div class="gc-count">${g.count || ''}</div>
      <span class="gc-arrow">↗</span>
    </a>
  `).join('');
  requestAnimationFrame(() => {
    document.querySelectorAll('.grade-card').forEach(c => {
      if (c.getBoundingClientRect().top < window.innerHeight - 60) {
        c.classList.add('visible');
      } else {
        revealObserver.observe(c);
      }
    });
  });
}

// ── SUBJECTS ──
let allSubjects = [];
function renderSubjects(subjects) {
  allSubjects = subjects.filter(Boolean);
  buildSubjectGrid(allSubjects);
}
function buildSubjectGrid(list) {
  const grid  = document.getElementById('subjectsGrid');
  const noRes = document.getElementById('noResults');
  if (!grid) return;
  if (!list.length) {
    grid.innerHTML = '';
    if (noRes) noRes.style.display = 'block';
    return;
  }
  if (noRes) noRes.style.display = 'none';
  grid.innerHTML = '';
  list.forEach((s, idx) => {
    const iconData = (s.icon && s.color && s.iconColor)
      ? { icon: s.icon, color: s.color, iconColor: s.iconColor }
      : getSubjectIcon(s.name || '');
    const card = document.createElement('div');
    card.className = 'subject-card';
    card.innerHTML = `
      <div class="subject-icon" style="background:${iconData.color}">
        <span style="color:${iconData.iconColor}">${iconData.icon}</span>
      </div>
      <div>
        <div class="subject-name">${s.name || ''}</div>
        <div class="subject-level">${s.tag || s.level || ''}</div>
      </div>
    `;
    card.style.transitionDelay = `${Math.min(idx * 0.04, 0.5)}s`;
    grid.appendChild(card);
    requestAnimationFrame(() => {
      if (card.getBoundingClientRect().top < window.innerHeight - 60) {
        card.classList.add('visible');
      } else {
        revealObserver.observe(card);
      }
    });
  });
}
document.getElementById('subjectSearch')?.addEventListener('input', e => {
  const q = e.target.value.trim().toLowerCase();
  const filtered = q
    ? allSubjects.filter(s =>
        (s.name || '').toLowerCase().includes(q) ||
        (s.tag  || '').toLowerCase().includes(q)
      )
    : allSubjects;
  buildSubjectGrid(filtered);
});

// ── TEACHERS ──
let allTeachers = [];
function renderTeachers(teachers) {
  allTeachers = Array.isArray(teachers)
    ? teachers.filter(Boolean)
    : Object.values(teachers || {}).filter(Boolean);
  buildTeacherGrid(allTeachers);
}
function buildTeacherGrid(list) {
  const grid  = document.getElementById('teachersGrid');
  const noEl  = document.getElementById('noTeachers');
  const noMsg = document.getElementById('noTeachersMsg');
  if (!grid) return;
  const sorted = [...list].sort((a, b) => (a.order || 0) - (b.order || 0));
  if (!sorted.length) {
    grid.innerHTML = '';
    if (noEl)  noEl.style.display  = allTeachers.length === 0 ? 'block' : 'none';
    if (noMsg) noMsg.style.display = allTeachers.length > 0  ? 'block' : 'none';
    return;
  }
  if (noEl)  noEl.style.display  = 'none';
  if (noMsg) noMsg.style.display = 'none';
  grid.innerHTML = sorted.map((t, idx) => `
    <a href="${t.name ? 'teacher.html?name=' + encodeURIComponent(t.name) : '#'}"
       class="teacher-card" style="text-decoration:none;color:inherit;cursor:pointer;display:block;transition-delay:${idx * 0.08}s">
      <div class="teacher-avatar">
        ${t.image
          ? `<img src="${t.image}" alt="${t.name || ''}" />`
          : `<span class="teacher-initials">${(t.name || 'T').charAt(0).toUpperCase()}</span>`
        }
      </div>
      <div class="teacher-name">${t.name || ''}</div>
      <div class="teacher-subject">${t.subject || ''}</div>
      ${t.qualification ? `<div class="teacher-qual">🎓 ${t.qualification}</div>` : ''}
      ${t.experience    ? `<div class="teacher-exp">⏱ ${t.experience}</div>`      : ''}
      ${t.bio           ? `<div class="teacher-bio">${t.bio}</div>`               : ''}
    </a>
  `).join('');
  requestAnimationFrame(() => {
    grid.querySelectorAll('.teacher-card').forEach(c => {
      if (c.getBoundingClientRect().top < window.innerHeight - 60) {
        c.classList.add('visible');
      } else {
        revealObserver.observe(c);
      }
    });
  });
}
document.getElementById('teacherSearch')?.addEventListener('input', e => {
  const q = e.target.value.trim().toLowerCase();
  const filtered = q
    ? allTeachers.filter(t =>
        (t.name    || '').toLowerCase().includes(q) ||
        (t.subject || '').toLowerCase().includes(q)
      )
    : allTeachers;
  buildTeacherGrid(filtered);
});

// ── OBSERVERS ──
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

const singleObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll('.center-card').forEach(el => singleObserver.observe(el));

// ── COUNTERS ──
let currentStats = { ...DEFAULTS.stats };
let countersRan  = false;

function animateCounter(el, target, duration = 1400) {
  const from  = parseInt((el.textContent || '0').replace(/[^\d]/g, ''), 10) || 0;
  const start = performance.now();
  const update = now => {
    const t    = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.floor(from + (target - from) * ease);
    if (t < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}
function runCounters(stats) {
  const ids = { students:'stat-students', teachers:'stat-teachers', subjects:'stat-subjects', centers:'stat-centers' };
  for (const [key, id] of Object.entries(ids)) {
    const el = document.getElementById(id);
    if (el) animateCounter(el, stats[key] || 0);
  }
}
const statsEl = document.querySelector('.hero-stats');
const statsObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !countersRan) {
    countersRan = true;
    runCounters(currentStats);
  }
}, { threshold: 0.4 });
if (statsEl) statsObserver.observe(statsEl);

// ══════════════════════════════════════════════
//  APPLY HELPERS
// ══════════════════════════════════════════════
function applyHero(v) {
  if (!v) return;
  if (v.tagline !== undefined && v.tagline !== '') setText('hero-tagline', v.tagline);
  if (v.desc    !== undefined && v.desc    !== '') setText('hero-desc',    v.desc);
  if (v.title   !== undefined && v.title   !== '') {
    const el = document.getElementById('hero-title-shiny');
    if (el) el.textContent = v.title;
  }
}

function applyStats(v) {
  if (!v) return;
  currentStats = {
    students: v.students !== undefined ? v.students : DEFAULTS.stats.students,
    teachers: v.teachers !== undefined ? v.teachers : DEFAULTS.stats.teachers,
    subjects: v.subjects !== undefined ? v.subjects : DEFAULTS.stats.subjects,
    centers:  v.centers  !== undefined ? v.centers  : DEFAULTS.stats.centers
  };
  if (countersRan) runCounters(currentStats);
}

function applyCenter(v) {
  if (!v) return;
  if (v.name !== undefined)   setText('center-name', v.name);
  if (v.desc !== undefined)   setText('center-desc', v.desc);
  if (v.mapUrl)               setHref('center-map',  v.mapUrl);
  const addrEl  = document.getElementById('center-address');
  const phoneEl = document.getElementById('center-phone');
  if (addrEl)  addrEl.textContent  = v.address ? '📍 ' + v.address : '';
  if (phoneEl) phoneEl.textContent = v.phone   ? '📞 ' + v.phone   : '';
}

function applyContact(v) {
  if (!v) return;
  if (v.phone    !== undefined) setText('contact-phone',    v.phone    || DEFAULTS.contact.phone);
  if (v.whatsapp !== undefined) setText('contact-whatsapp', v.whatsapp || DEFAULTS.contact.whatsapp);
  const waUrl = v.whatsappUrl || (v.whatsapp ? 'https://wa.me/' + v.whatsapp.replace(/[^0-9]/g,'') : '#');
  const waLinkEl = document.getElementById('contact-wa-link');
  if (waLinkEl) waLinkEl.href = waUrl;
  if (v.email    !== undefined) setText('contact-email',    v.email    || DEFAULTS.contact.email);
  if (v.facebook !== undefined) setText('contact-facebook', v.facebook || DEFAULTS.contact.facebook);
  const fbLinkEl = document.getElementById('contact-fb-link');
  if (fbLinkEl && v.facebookUrl) fbLinkEl.href = v.facebookUrl;
  if (v.address  !== undefined) setText('contact-address',  v.address  || DEFAULTS.contact.address);
  // Mirror into footer
  if (v.phone   !== undefined) setText('footer-phone',   v.phone   || '');
  if (v.email   !== undefined) setText('footer-email',   v.email   || '');
  if (v.address !== undefined) setText('footer-address', v.address || '');
}

function applyFooter(v) {
  if (!v) return;
  if (typeof v === 'string') {
    const el = document.getElementById('footer-text');
    if (el) el.innerHTML = v;
    return;
  }
  if (v.text) {
    const el = document.getElementById('footer-text');
    if (el) el.innerHTML = v.text;
  }
  if (v.dev) setText('footer-dev', v.dev);
  const fbFooter = document.getElementById('footer-fb-link');
  const waFooter = document.getElementById('footer-wa-link');
  if (fbFooter && v.facebookUrl) fbFooter.href = v.facebookUrl;
  if (waFooter && v.whatsappUrl) waFooter.href = v.whatsappUrl;
}

// ── RENDER DEFAULTS IMMEDIATELY ──
(function renderDefaults() {
  setText('hero-tagline', DEFAULTS.hero.tagline);
  setText('hero-desc', DEFAULTS.hero.desc);
  const shinyEl = document.getElementById('hero-title-shiny');
  if (shinyEl) shinyEl.textContent = DEFAULTS.hero.title;
  applyCenter(DEFAULTS.center);
  applyContact(DEFAULTS.contact);
  applyFooter(DEFAULTS.footer);
  renderGrades(DEFAULTS.grades);
  renderSubjects(DEFAULTS.subjects);
  renderTeachers(DEFAULTS.teachers);
  if (statsEl && statsEl.getBoundingClientRect().top < window.innerHeight) {
    if (!countersRan) { countersRan = true; runCounters(currentStats); }
  }
})();

// ══════════════════════════════════════════════
//  REALTIME DATABASE LISTENERS
// ══════════════════════════════════════════════
const listeners = [];
function listen(path, callback) {
  const ref = rtdb.ref(path);
  const handler = snap => {
    try { callback(snap.val()); } catch (e) { console.warn('Listener error at', path, e); }
  };
  ref.on('value', handler, err => console.warn('RTDB read error at', path, err));
  listeners.push({ ref, handler });
}

listen('config/hero',    v => { if (v) applyHero(v); });
listen('config/stats',   v => { if (v) applyStats(v); });
listen('config/center',  v => { if (v) applyCenter(v); });
listen('config/contact', v => { if (v) applyContact(v); });
listen('config/footer',  v => { if (v) applyFooter(v); });
listen('grades', v => {
  if (!v) return;
  const list  = Array.isArray(v) ? v : Object.values(v);
  const clean = list.filter(Boolean);
  if (clean.length) renderGrades(clean);
});
listen('subjects', v => {
  if (!v) return;
  const list  = Array.isArray(v) ? v : Object.values(v);
  const clean = list.filter(Boolean);
  if (clean.length) renderSubjects(clean);
});
listen('teachers', v => { if (v) renderTeachers(v); });

window.addEventListener('beforeunload', () => {
  listeners.forEach(({ ref, handler }) => {
    try { ref.off('value', handler); } catch {}
  });
});

// ══════════════════════════════════════════════
//  BANNER / EVENTS SLIDER
//  Field mapping (admin saves):
//    title   → banner title
//    sub     → subtitle / eyebrow text
//    btnText → CTA button label
//    btnLink → CTA button URL
//    image   → background image
// ══════════════════════════════════════════════
let bannerSlides  = [];
let bannerCurrent = 0;
let bannerTimer   = null;

function escBanner(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function updateBannerCounter() {
  const el = document.getElementById('bannerCounter');
  if (el && bannerSlides.length > 0) {
    el.textContent = `${bannerCurrent + 1} / ${bannerSlides.length}`;
  }
}

function initBannerSlider(banners) {
  // Accept banners with either image or title
  const active = banners.filter(b => b.active !== false && (b.image || b.title));
  if (!active.length) return;
  bannerSlides = active;

  const section = document.getElementById('eventsSection');
  const track   = document.getElementById('bannerTrack');
  const dots    = document.getElementById('bannerDots');
  if (!section || !track) return;

  // Build slides
  track.innerHTML = '';
  dots.innerHTML  = '';

  bannerSlides.forEach((b, i) => {
    const slide = document.createElement('div');
    slide.className = `bsl-slide${i === 0 ? ' bsl-active' : ''}`;

    // subtitle: admin stores as "sub", also accept legacy "subtitle"
    const subtitle = b.sub || b.subtitle || '';
    // button: admin stores as "btnText"/"btnLink", also accept legacy "ctaText"/"ctaUrl"
    const ctaText = b.btnText || b.ctaText || '';
    const ctaUrl  = b.btnLink || b.ctaUrl  || '#';

    slide.innerHTML = `
      <div class="bsl-bg" style="background-image:url('${escBanner(b.image)}')"></div>
      <div class="bsl-overlay"></div>
      <div class="bsl-content">
        ${subtitle ? `<div class="bsl-eyebrow">✦ ${escBanner(subtitle)}</div>` : ''}
        ${b.title  ? `<h2 class="bsl-title">${escBanner(b.title)}</h2>`       : ''}
        ${ctaText  ? `<a href="${escBanner(ctaUrl)}" class="bsl-cta">${escBanner(ctaText)} →</a>` : ''}
      </div>
    `;
    track.appendChild(slide);

    // Dot
    const dot = document.createElement('button');
    dot.className = `bsl-dot${i === 0 ? ' active' : ''}`;
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.onclick = () => { clearInterval(bannerTimer); goToBanner(i); startBannerAuto(); };
    dots.appendChild(dot);
  });

  // Show / hide arrow buttons based on count
  const prevBtn = document.getElementById('bslPrev');
  const nextBtn = document.getElementById('bslNext');
  if (bannerSlides.length <= 1) {
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
  } else {
    if (prevBtn) prevBtn.style.display = '';
    if (nextBtn) nextBtn.style.display = '';
  }

  section.style.display = 'block';
  updateBannerCounter();
  startBannerAuto();

  // Pause on hover
  const wrap = document.getElementById('bannerSliderWrap');
  if (wrap) {
    wrap.addEventListener('mouseenter', () => clearInterval(bannerTimer));
    wrap.addEventListener('mouseleave', startBannerAuto);
  }

  // Touch / swipe support
  let touchStartX = 0;
  if (wrap) {
    wrap.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    wrap.addEventListener('touchend',   e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        clearInterval(bannerTimer);
        goToBanner(bannerCurrent + (diff > 0 ? 1 : -1));
        startBannerAuto();
      }
    });
  }
}

function goToBanner(idx) {
  const slides = document.querySelectorAll('.bsl-slide');
  const dotEls = document.querySelectorAll('.bsl-dot');
  const track  = document.getElementById('bannerTrack');
  if (!slides.length) return;

  slides[bannerCurrent].classList.remove('bsl-active');
  dotEls[bannerCurrent]?.classList.remove('active');

  bannerCurrent = ((idx % bannerSlides.length) + bannerSlides.length) % bannerSlides.length;

  slides[bannerCurrent].classList.add('bsl-active');
  dotEls[bannerCurrent]?.classList.add('active');
  if (track) track.style.transform = `translateX(-${bannerCurrent * 100}%)`;

  updateBannerCounter();
}

function slideBanner(dir) {
  clearInterval(bannerTimer);
  goToBanner(bannerCurrent + dir);
  startBannerAuto();
}

function startBannerAuto() {
  clearInterval(bannerTimer);
  if (bannerSlides.length > 1) {
    bannerTimer = setInterval(() => goToBanner(bannerCurrent + 1), 6000);
  }
}

// Listen for banners from Firebase
listen('config/banners', v => {
  if (!v) return;
  const list  = Array.isArray(v) ? v : Object.values(v);
  const clean = list.filter(Boolean);
  if (clean.length) initBannerSlider(clean);
});
