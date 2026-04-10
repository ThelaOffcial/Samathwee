// =============================================
//  SAMATHWEE – script.js (Full + Teachers + Images)
//  Defaults render instantly → Firebase RTDB updates in real-time
// =============================================

const firebaseConfig = {
  apiKey: "AIzaSyDlBLrs-WquiVIivoOCuJq2g7BFhNwAtas",
  authDomain: "samathwee.firebaseapp.com",
  projectId: "samathwee",
  storageBucket: "samathwee.appspot.com",
  messagingSenderId: "1094489861098",
  appId: "1:1094489861098:web:e61feb13a5f69a8b78e093",
  measurementId: "G-GX673DWVTQ",
  databaseURL: "https://samathwee-default-rtdb.firebaseio.com"  // ← add your RTDB URL
};

firebase.initializeApp(firebaseConfig);
const db   = firebase.firestore();
const rtdb = firebase.database();

// ── Enable offline cache ──────────────────────────────
db.enablePersistence({ synchronizeTabs: true }).catch(() => {});

// ── Default fallback data ─────────────────────────────
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
    phone:   "+94 77 000 0000",
    email:   "info@samathwee.lk",
    address: "Panadura, Sri Lanka"
  },
  footer: "© 2026 Samathwee Higher Education Center. All rights reserved. Panadura, Sri Lanka.",
  grades: [
    { emoji: "🌟", name: "Grade 1–5",   sub: "Primary School",    count: "8 Subjects",  url: "grades-1-5.html",       order: 1 },
    { emoji: "📘", name: "Grade 6–O/L", sub: "Junior & O/Levels", count: "17 Subjects", url: "grades-6-ol.html",      order: 2 },
    { emoji: "🔬", name: "A / Levels",  sub: "Advanced Level",    count: "14 Subjects", url: "grades-al.html",        order: 3 },
    { emoji: "🇬🇧", name: "London",     sub: "Edexcel / IGCSE",   count: "10 Subjects", url: "grades-london.html",    order: 4 },
    { emoji: "🏛️", name: "Cambridge",  sub: "CAIE / IGCSE",      count: "10 Subjects", url: "grades-cambridge.html", order: 5 }
  ],
  subjects: [
    { name: "Sinhala",               tag: "Grade 1–5",                    icon: "📖", color: "#fee2e2", iconColor: "#ef4444" },
    { name: "English",               tag: "All Levels",                   icon: "🔤", color: "#dbeafe", iconColor: "#3b82f6" },
    { name: "Mathematics",           tag: "All Levels",                   icon: "🔢", color: "#ede9fe", iconColor: "#8b5cf6" },
    { name: "Environmental Studies", tag: "Grade 1–5",                    icon: "🌿", color: "#dcfce7", iconColor: "#22c55e" },
    { name: "Buddhism",              tag: "All Levels",                   icon: "🙏", color: "#fef9c3", iconColor: "#eab308" },
    { name: "Art",                   tag: "All Levels",                   icon: "🎨", color: "#fce7f3", iconColor: "#ec4899" },
    { name: "Music",                 tag: "All Levels",                   icon: "🎵", color: "#fff7ed", iconColor: "#f97316" },
    { name: "Physical Education",    tag: "All Levels",                   icon: "⚽", color: "#dcfce7", iconColor: "#16a34a" },
    { name: "Science",               tag: "Grade 6–O/L",                  icon: "🧪", color: "#dbeafe", iconColor: "#2563eb" },
    { name: "History",               tag: "Grade 6–O/L",                  icon: "🏛️", color: "#fef3c7", iconColor: "#d97706" },
    { name: "Geography",             tag: "Grade 6–O/L",                  icon: "🌍", color: "#dcfce7", iconColor: "#059669" },
    { name: "Civic Education",       tag: "Grade 6–O/L",                  icon: "⚖️", color: "#e0e7ff", iconColor: "#4f46e5" },
    { name: "Health Education",      tag: "Grade 6–O/L",                  icon: "🏥", color: "#fee2e2", iconColor: "#dc2626" },
    { name: "ICT",                   tag: "O/L / A/L",                    icon: "💻", color: "#ede9fe", iconColor: "#7c3aed" },
    { name: "Commerce",              tag: "Grade 6–O/L",                  icon: "💼", color: "#fef3c7", iconColor: "#b45309" },
    { name: "Home Economics",        tag: "Grade 6–O/L",                  icon: "🏡", color: "#fce7f3", iconColor: "#db2777" },
    { name: "Technical Drawing",     tag: "Grade 6–O/L",                  icon: "📐", color: "#e0f2fe", iconColor: "#0284c7" },
    { name: "Agriculture",           tag: "Grade 6–O/L",                  icon: "🌾", color: "#dcfce7", iconColor: "#15803d" },
    { name: "Drama & Theatre",       tag: "Grade 6–O/L",                  icon: "🎭", color: "#fce7f3", iconColor: "#9333ea" },
    { name: "Dancing",               tag: "Grade 6–O/L",                  icon: "💃", color: "#fff1f2", iconColor: "#e11d48" },
    { name: "Combined Mathematics",  tag: "A/Level",                      icon: "📊", color: "#ede9fe", iconColor: "#6d28d9" },
    { name: "Physics",               tag: "A/Level / Cambridge / London", icon: "⚛️", color: "#dbeafe", iconColor: "#1d4ed8" },
    { name: "Chemistry",             tag: "A/Level / Cambridge / London", icon: "🧬", color: "#dcfce7", iconColor: "#16a34a" },
    { name: "Biology",               tag: "A/Level / Cambridge / London", icon: "🔬", color: "#dcfce7", iconColor: "#15803d" },
    { name: "Economics",             tag: "A/Level / London / Cambridge", icon: "📈", color: "#fef3c7", iconColor: "#92400e" },
    { name: "Business Studies",      tag: "A/Level / London",             icon: "🏢", color: "#e0f2fe", iconColor: "#0369a1" },
    { name: "Accounting",            tag: "A/Level",                      icon: "🧾", color: "#fef9c3", iconColor: "#ca8a04" },
    { name: "Political Science",     tag: "A/Level",                      icon: "🗳️", color: "#e0e7ff", iconColor: "#4338ca" },
    { name: "Logic & Scientific Method", tag: "A/Level",                  icon: "🧠", color: "#fce7f3", iconColor: "#db2777" },
    { name: "Further Mathematics",   tag: "London A/Level",               icon: "∞",  color: "#ede9fe", iconColor: "#7c3aed" },
    { name: "Psychology",            tag: "London A/Level",               icon: "🧘", color: "#fce7f3", iconColor: "#be185d" },
    { name: "Sociology",             tag: "London A/Level",               icon: "👥", color: "#e0f2fe", iconColor: "#0284c7" },
    { name: "Literature in English", tag: "London / Cambridge",           icon: "📚", color: "#fef3c7", iconColor: "#b45309" },
    { name: "Tamil",                 tag: "Grade 1–5 / O/L",              icon: "📝", color: "#fef9c3", iconColor: "#d97706" }
  ],
  teachers: [] // Populated from Firebase only
};

// ── Icon map for subjects ─────────────────────────────
const ICON_MAP = {
  "mathematics": { icon: "🔢", color: "#ede9fe", iconColor: "#8b5cf6" },
  "combined mathematics": { icon: "📊", color: "#ede9fe", iconColor: "#6d28d9" },
  "further mathematics": { icon: "∞", color: "#ede9fe", iconColor: "#7c3aed" },
  "physics":     { icon: "⚛️", color: "#dbeafe", iconColor: "#1d4ed8" },
  "chemistry":   { icon: "🧬", color: "#dcfce7", iconColor: "#16a34a" },
  "biology":     { icon: "🔬", color: "#dcfce7", iconColor: "#15803d" },
  "science":     { icon: "🧪", color: "#dbeafe", iconColor: "#2563eb" },
  "english":     { icon: "🔤", color: "#dbeafe", iconColor: "#3b82f6" },
  "sinhala":     { icon: "📖", color: "#fee2e2", iconColor: "#ef4444" },
  "tamil":       { icon: "📝", color: "#fef9c3", iconColor: "#d97706" },
  "history":     { icon: "🏛️", color: "#fef3c7", iconColor: "#d97706" },
  "geography":   { icon: "🌍", color: "#dcfce7", iconColor: "#059669" },
  "economics":   { icon: "📈", color: "#fef3c7", iconColor: "#92400e" },
  "business studies": { icon: "🏢", color: "#e0f2fe", iconColor: "#0369a1" },
  "accounting":  { icon: "🧾", color: "#fef9c3", iconColor: "#ca8a04" },
  "ict":         { icon: "💻", color: "#ede9fe", iconColor: "#7c3aed" },
  "art":         { icon: "🎨", color: "#fce7f3", iconColor: "#ec4899" },
  "music":       { icon: "🎵", color: "#fff7ed", iconColor: "#f97316" },
  "drama":       { icon: "🎭", color: "#fce7f3", iconColor: "#9333ea" },
  "dancing":     { icon: "💃", color: "#fff1f2", iconColor: "#e11d48" },
  "physical education": { icon: "⚽", color: "#dcfce7", iconColor: "#16a34a" },
  "agriculture": { icon: "🌾", color: "#dcfce7", iconColor: "#15803d" },
  "home economics": { icon: "🏡", color: "#fce7f3", iconColor: "#db2777" },
  "commerce":    { icon: "💼", color: "#fef3c7", iconColor: "#b45309" },
  "buddhism":    { icon: "🙏", color: "#fef9c3", iconColor: "#eab308" },
  "civic education": { icon: "⚖️", color: "#e0e7ff", iconColor: "#4f46e5" },
  "health education": { icon: "🏥", color: "#fee2e2", iconColor: "#dc2626" },
  "psychology":  { icon: "🧘", color: "#fce7f3", iconColor: "#be185d" },
  "sociology":   { icon: "👥", color: "#e0f2fe", iconColor: "#0284c7" },
  "political science": { icon: "🗳️", color: "#e0e7ff", iconColor: "#4338ca" },
  "literature":  { icon: "📚", color: "#fef3c7", iconColor: "#b45309" },
  "technical drawing": { icon: "📐", color: "#e0f2fe", iconColor: "#0284c7" },
  "environmental": { icon: "🌿", color: "#dcfce7", iconColor: "#22c55e" },
  "logic":       { icon: "🧠", color: "#fce7f3", iconColor: "#db2777" }
};
const DEFAULT_ICON = { icon: "📖", color: "#ede9fe", iconColor: "#8b5cf6" };
function getSubjectIcon(name) {
  const key = (name || '').toLowerCase().trim();
  if (ICON_MAP[key]) return ICON_MAP[key];
  for (const k in ICON_MAP) { if (key.includes(k) || k.includes(key)) return ICON_MAP[k]; }
  return DEFAULT_ICON;
}

// ── Helpers ───────────────────────────────────────────
function setText(id, val) {
  const el = document.getElementById(id);
  if (el && val !== undefined && val !== null) el.textContent = val;
}
function setHref(id, href) {
  const el = document.getElementById(id);
  if (el && href) el.href = href;
}

// ── Loading screen ────────────────────────────────────
function dismissLoader() {
  const el = document.getElementById('loadingScreen');
  if (!el) return;
  el.classList.add('fade-out');
  setTimeout(() => { if (el.parentNode) el.style.display = 'none'; }, 700);
}
setTimeout(dismissLoader, 400);

// ── Hamburger ─────────────────────────────────────────
document.getElementById('hamburger')?.addEventListener('click', function () {
  this.classList.toggle('open');
  document.getElementById('nav-links')?.classList.toggle('open');
});

// ── Canvas particles ──────────────────────────────────
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

// ── Grade card render ─────────────────────────────────
function renderGrades(grades) {
  const grid = document.getElementById('gradesGrid');
  if (!grid) return;
  const sorted = [...grades].sort((a, b) => (a.order || 0) - (b.order || 0));
  grid.innerHTML = sorted.map((g, idx) => `
    <a href="${g.url || '#'}" class="grade-card gc-${idx % 8}">
      <span class="gc-emoji">${g.emoji || '📚'}</span>
      <div class="gc-title">${g.name}</div>
      <div class="gc-sub">${g.sub || ''}</div>
      <div class="gc-count">${g.count || ''}</div>
      <span class="gc-arrow">↗</span>
    </a>
  `).join('');
  setTimeout(() => {
    document.querySelectorAll('.grade-card').forEach(c => {
      if (c.getBoundingClientRect().top < window.innerHeight - 80) c.classList.add('visible');
    });
    const gg = document.getElementById('gradesGrid');
    if (gg) cardObserver.observe(gg);
  }, 50);
}

// ── Subject card render ───────────────────────────────
let allSubjects = [];
function renderSubjects(subjects) {
  allSubjects = subjects;
  buildSubjectGrid(subjects);
}
function buildSubjectGrid(list) {
  const grid  = document.getElementById('subjectsGrid');
  const noRes = document.getElementById('noResults');
  if (!grid) return;
  if (!list.length) { grid.innerHTML = ''; if (noRes) noRes.style.display = 'block'; return; }
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
        <div class="subject-name">${s.name}</div>
        <div class="subject-level">${s.tag || s.level || ''}</div>
      </div>
    `;
    card.style.transitionDelay = `${Math.min(idx * 0.02, 0.3)}s`;
    grid.appendChild(card);
    requestAnimationFrame(() => card.classList.add('visible'));
  });
}
document.getElementById('subjectSearch')?.addEventListener('input', e => {
  const q = e.target.value.trim().toLowerCase();
  const filtered = q
    ? allSubjects.filter(s => s.name.toLowerCase().includes(q) || (s.tag || '').toLowerCase().includes(q))
    : allSubjects;
  buildSubjectGrid(filtered);
});

// ── Teachers render ────────────────────────────────────
function renderTeachers(teachers) {
  const grid = document.getElementById('teachersGrid');
  const noEl = document.getElementById('noTeachers');
  if (!grid) return;
  const list = Array.isArray(teachers) ? teachers : Object.values(teachers || {});
  if (!list.length) {
    grid.innerHTML = '';
    if (noEl) noEl.style.display = 'block';
    return;
  }
  if (noEl) noEl.style.display = 'none';
  const sorted = [...list].sort((a, b) => (a.order || 0) - (b.order || 0));
  grid.innerHTML = sorted.map((t, idx) => `
    <div class="teacher-card" style="animation-delay:${idx * 0.07}s">
      <div class="teacher-avatar">
        ${t.photo
          ? `<img src="${t.photo}" alt="${t.name}" />`
          : `<span class="teacher-initials">${(t.name || 'T').charAt(0)}</span>`}
      </div>
      <div class="teacher-info">
        <div class="teacher-name">${t.name || 'Teacher'}</div>
        <div class="teacher-subject">${t.subject || ''}</div>
        ${t.qualification ? `<div class="teacher-qual">🎓 ${t.qualification}</div>` : ''}
        ${t.experience    ? `<div class="teacher-exp">⏱ ${t.experience}</div>`      : ''}
        ${t.bio           ? `<div class="teacher-bio">${t.bio}</div>`               : ''}
      </div>
    </div>
  `).join('');
}

// ── Intersection observers ────────────────────────────
const cardObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.grade-card, .center-card').forEach(el => el.classList.add('visible'));
    }
  });
}, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

const singleObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll('.center-card').forEach(el => singleObserver.observe(el));

// ── Animated counters ─────────────────────────────────
function animateCounter(el, target, duration = 1400) {
  const from = parseInt((el.textContent || '0').replace(/[^\d]/g, ''), 10) || 0;
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
  const ids = { students: 'stat-students', teachers: 'stat-teachers', subjects: 'stat-subjects', centers: 'stat-centers' };
  for (const [key, id] of Object.entries(ids)) {
    const el = document.getElementById(id);
    if (el) animateCounter(el, stats[key] || 0);
  }
}
let countersRan = false;
const statsEl = document.querySelector('.hero-stats');
const statsObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !countersRan) {
    countersRan = true;
    runCounters(DEFAULTS.stats);
    loadStatsBackground();
  }
}, { threshold: 0.4 });
if (statsEl) statsObserver.observe(statsEl);

// ── Render defaults immediately ───────────────────────
(function renderDefaults() {
  setText('hero-tagline', DEFAULTS.hero.tagline);
  setText('hero-desc',    DEFAULTS.hero.desc);
  const shinyEl = document.getElementById('hero-title-shiny');
  if (shinyEl) shinyEl.textContent = DEFAULTS.hero.title;

  setText('center-name', DEFAULTS.center.name);
  setText('center-desc', DEFAULTS.center.desc);
  setHref('center-map',  DEFAULTS.center.mapUrl);
  const addrEl  = document.getElementById('center-address');
  const phoneEl = document.getElementById('center-phone');
  if (addrEl  && DEFAULTS.center.address) addrEl.textContent  = '📍 ' + DEFAULTS.center.address;
  if (phoneEl && DEFAULTS.center.phone)   phoneEl.textContent = '📞 ' + DEFAULTS.center.phone;

  setText('contact-phone',   DEFAULTS.contact.phone);
  setText('contact-email',   DEFAULTS.contact.email);
  setText('contact-address', DEFAULTS.contact.address);

  const footerEl = document.getElementById('footer-text');
  if (footerEl) footerEl.innerHTML = DEFAULTS.footer;

  renderGrades(DEFAULTS.grades);
  renderSubjects(DEFAULTS.subjects);
  renderTeachers(DEFAULTS.teachers);

  if (statsEl && statsEl.getBoundingClientRect().top < window.innerHeight) {
    if (!countersRan) { countersRan = true; runCounters(DEFAULTS.stats); loadStatsBackground(); }
  }
})();

// ── Realtime Database listeners ───────────────────────
const rtdbUnsubs = [];
function onRTDB(path, cb) {
  const ref = rtdb.ref(path);
  const handler = snap => cb(snap.val());
  ref.on('value', handler, () => {});
  return () => ref.off('value', handler);
}

function setupRTDBListeners() {
  // Hero
  rtdbUnsubs.push(onRTDB('config/hero', v => {
    if (!v) return;
    if (v.tagline !== undefined) setText('hero-tagline', v.tagline);
    if (v.desc    !== undefined) setText('hero-desc',    v.desc);
    if (v.title   !== undefined) {
      const el = document.getElementById('hero-title-shiny');
      if (el) el.textContent = v.title;
    }
  }));

  // Stats
  rtdbUnsubs.push(onRTDB('config/stats', v => {
    if (!v) return;
    const d = { ...DEFAULTS.stats, ...v };
    if (countersRan) runCounters(d);
    else {
      // Store for when counters run
      DEFAULTS.stats.students = d.students;
      DEFAULTS.stats.teachers = d.teachers;
      DEFAULTS.stats.subjects = d.subjects;
      DEFAULTS.stats.centers  = d.centers;
    }
  }));

  // Center
  rtdbUnsubs.push(onRTDB('config/center', v => {
    if (!v) return;
    const d = { ...DEFAULTS.center, ...v };
    setText('center-name', d.name);
    setText('center-desc', d.desc);
    setHref('center-map', d.mapUrl);
    const addrEl  = document.getElementById('center-address');
    const phoneEl = document.getElementById('center-phone');
    if (addrEl)  addrEl.textContent  = d.address ? '📍 ' + d.address : '';
    if (phoneEl) phoneEl.textContent = d.phone   ? '📞 ' + d.phone   : '';
  }));

  // Contact
  rtdbUnsubs.push(onRTDB('config/contact', v => {
    if (!v) return;
    const d = { ...DEFAULTS.contact, ...v };
    setText('contact-phone',   d.phone);
    setText('contact-email',   d.email);
    setText('contact-address', d.address);
  }));

  // Footer
  rtdbUnsubs.push(onRTDB('config/footer', v => {
    if (!v) return;
    if (v.text !== undefined) {
      const el = document.getElementById('footer-text');
      if (el) el.innerHTML = v.text;
    }
  }));

  // Grades
  rtdbUnsubs.push(onRTDB('grades', v => {
    if (!v) return;
    const list = Array.isArray(v) ? v : Object.values(v);
    if (list.length) renderGrades(list);
  }));

  // Subjects
  rtdbUnsubs.push(onRTDB('subjects', v => {
    if (!v) return;
    const list = Array.isArray(v) ? v : Object.values(v);
    if (list.length) renderSubjects(list);
  }));

  // Teachers ← NEW
  rtdbUnsubs.push(onRTDB('teachers', v => {
    if (!v) return;
    renderTeachers(v);
  }));

  // Site Images ← NEW
  rtdbUnsubs.push(onRTDB('config/images', v => {
    if (!v) return;
    // Update logo
    if (v.logo) {
      const logoEl = document.getElementById('site-logo');
      if (logoEl) { logoEl.src = v.logo; logoEl.style.display = ''; }
    }
    // Update hero background
    if (v.heroBg) {
      const hero = document.querySelector('.hero-container');
      if (hero) hero.style.backgroundImage = `url('${v.heroBg}')`;
    }
  }));
}

setupRTDBListeners();

window.addEventListener('beforeunload', () => {
  rtdbUnsubs.forEach(u => { try { u(); } catch {} });
});

async function loadStatsBackground() {}