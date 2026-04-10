// =============================================
//  SAMATHWEE – admin.js  (FULLY FIXED)
//  Root cause: event.target bug removed
//  Persistence removed (was blocking writes)
//  btnEl passed explicitly to all save fns
// =============================================

const firebaseConfig = {
  apiKey: "AIzaSyDlBLrs-WquiVIivoOCuJq2g7BFhNwAtas",
  authDomain: "samathwee.firebaseapp.com",
  projectId: "samathwee",
  storageBucket: "samathwee.firebasestorage.app",
  messagingSenderId: "1094489861098",
  appId: "1:1094489861098:web:e61feb13a5f69a8b78e093"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db   = firebase.firestore();

// ── Auth State ─────────────────────────────────────
auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboard').style.display  = 'flex';
    loadAllData();
    setupRealtimeListeners();
  } else {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('dashboard').style.display  = 'none';
    stopRealtimeListeners();
  }
});

// ── Toggle Login / Signup ──────────────────────────
function toggleAuth(type) {
  document.getElementById('loginForm').style.display  = type === 'login'  ? 'block' : 'none';
  document.getElementById('signupForm').style.display = type === 'signup' ? 'block' : 'none';
}

// ── Login ──────────────────────────────────────────
async function doLogin() {
  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const remember = document.getElementById('rememberMe').checked;
  const errEl    = document.getElementById('loginError');
  const btn      = document.getElementById('loginBtn');

  errEl.style.display = 'none';
  setBtn(btn, true, '<span class="btn-spinner"></span> Signing in…');

  try {
    const persistence = remember
      ? firebase.auth.Auth.Persistence.LOCAL
      : firebase.auth.Auth.Persistence.SESSION;
    await auth.setPersistence(persistence);
    await auth.signInWithEmailAndPassword(email, password);
    if (remember) {
      localStorage.setItem('adminEmail', email);
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('adminEmail');
      localStorage.removeItem('rememberMe');
    }
  } catch (err) {
    errEl.textContent = '❌ ' + (err.message || 'Invalid credentials');
    errEl.style.display = 'block';
    setBtn(btn, false, 'Sign In <span class="arrow">→</span>');
  }
}

// ── Signup ─────────────────────────────────────────
async function doSignup() {
  const email    = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const errEl    = document.getElementById('signupError');
  const btn      = document.getElementById('signupBtn');

  errEl.style.display = 'none';
  setBtn(btn, true, '<span class="btn-spinner"></span> Creating…');

  try {
    await auth.createUserWithEmailAndPassword(email, password);
    showToast('✅ Account created! You can now sign in.');
    toggleAuth('login');
  } catch (err) {
    errEl.textContent = '❌ ' + err.message;
    errEl.style.display = 'block';
  } finally {
    setBtn(btn, false, 'Register Admin');
  }
}

// ── Logout ─────────────────────────────────────────
function doLogout() {
  if (confirm('Sign out of admin panel?')) auth.signOut();
}

// ── Button Helper ──────────────────────────────────
function setBtn(btn, disabled, html) {
  if (!btn) return;
  btn.disabled = disabled;
  btn.innerHTML = html;
}

// ── Toast ──────────────────────────────────────────
let toastTimer;
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.innerHTML = msg;
  t.className = 'toast ' + type + ' show';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.className = 'toast ' + type; }, 4000);
}

// ── Navigation ─────────────────────────────────────
function showSection(key, btnEl) {
  document.querySelectorAll('.admin-section').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const sec = document.getElementById('sec-' + key);
  if (sec) sec.classList.add('active');
  if (btnEl) btnEl.classList.add('active');
  closeSidebar();
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('show');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('show');
}

// ── Remember Me ────────────────────────────────────
window.addEventListener('load', () => {
  if (localStorage.getItem('rememberMe') === 'true') {
    const el = document.getElementById('loginEmail');
    if (el) el.value = localStorage.getItem('adminEmail') || '';
    const cb = document.getElementById('rememberMe');
    if (cb) cb.checked = true;
  }
});

// ══════════════════════════════════════════════════
//  REAL-TIME LISTENERS
// ══════════════════════════════════════════════════
const unsubscribers = [];

function setupRealtimeListeners() {
  stopRealtimeListeners();

  ['hero','stats','center','contact','footer'].forEach(function(docId) {
    var unsub = db.collection('config').doc(docId).onSnapshot(
      function(doc) { if (doc.exists) applyConfigData(docId, doc.data()); },
      function(err) { console.warn('Snapshot error [' + docId + ']:', err); }
    );
    unsubscribers.push(unsub);
  });

  unsubscribers.push(
    db.collection('grades').orderBy('order').onSnapshot(
      function(snap) { gradesData = snap.docs.map(function(d) { return Object.assign({id: d.id}, d.data()); }); renderGradeRows(); },
      function(err) { console.warn('Grades snapshot error:', err); }
    )
  );

  unsubscribers.push(
    db.collection('subjects').orderBy('name').onSnapshot(
      function(snap) { subjectsData = snap.docs.map(function(d) { return Object.assign({id: d.id}, d.data()); }); renderSubjectRows(); },
      function(err) { console.warn('Subjects snapshot error:', err); }
    )
  );
}

function stopRealtimeListeners() {
  unsubscribers.forEach(function(fn) { fn(); });
  unsubscribers.length = 0;
}

// ── Apply data to form fields ──────────────────────
function applyConfigData(docId, d) {
  if (docId === 'hero')    { safeSet('heroTagline', d.tagline); safeSet('heroTitle', d.title); safeSet('heroDesc', d.desc); }
  if (docId === 'stats')   { safeSet('statStudents', d.students); safeSet('statTeachers', d.teachers); safeSet('statSubjects', d.subjects); safeSet('statCenters', d.centers); }
  if (docId === 'center')  { safeSet('centerName', d.name); safeSet('centerDesc', d.desc); safeSet('centerAddress', d.address); safeSet('centerPhone', d.phone); safeSet('centerMapUrl', d.mapUrl); }
  if (docId === 'contact') { safeSet('contactPhone', d.phone); safeSet('contactEmail', d.email); safeSet('contactAddress', d.address); }
  if (docId === 'footer')  { safeSet('footerText', d.text); }
}

function safeSet(id, val) {
  var el = document.getElementById(id);
  if (el && document.activeElement !== el) el.value = (val !== undefined && val !== null) ? val : '';
}

// ── Load All Data ──────────────────────────────────
async function loadAllData() {
  await Promise.all([
    loadConfig('hero'), loadConfig('stats'), loadConfig('center'),
    loadConfig('contact'), loadConfig('footer'),
    loadGrades(), loadSubjects()
  ]);
}

async function loadConfig(docId) {
  try {
    var doc = await db.collection('config').doc(docId).get();
    if (doc.exists) applyConfigData(docId, doc.data());
  } catch(e) {
    console.warn('loadConfig error [' + docId + ']:', e);
  }
}

// ══════════════════════════════════════════════════
//  SAVE CONFIG — btnEl passed explicitly (BUG FIX)
//  The old code used event?.target which was undefined
//  when called from saveHero(), saveStats(), etc.
// ══════════════════════════════════════════════════
async function saveConfig(docId, data, label, btnEl) {
  var originalHTML = btnEl ? btnEl.innerHTML : ('💾 Save ' + label);
  setBtn(btnEl, true, '<span class="btn-spinner"></span> Saving…');

  try {
    await db.collection('config').doc(docId).set(data, { merge: true });
    showToast('✅ ' + label + ' saved!');
    console.log('[Firestore] Saved config/' + docId, data);
  } catch(e) {
    console.error('[Firestore] Error saving config/' + docId, e);
    showToast('❌ Failed: ' + e.message, 'error');
  } finally {
    setBtn(btnEl, false, originalHTML);
  }
}

// ── HERO ──────────────────────────────────────────
function saveHero(btnEl) {
  saveConfig('hero', {
    tagline: document.getElementById('heroTagline').value.trim(),
    title:   document.getElementById('heroTitle').value.trim(),
    desc:    document.getElementById('heroDesc').value.trim()
  }, 'Hero', btnEl);
}

// ── STATS ─────────────────────────────────────────
function saveStats(btnEl) {
  saveConfig('stats', {
    students: parseInt(document.getElementById('statStudents').value) || 0,
    teachers: parseInt(document.getElementById('statTeachers').value) || 0,
    subjects: parseInt(document.getElementById('statSubjects').value) || 0,
    centers:  parseInt(document.getElementById('statCenters').value)  || 1
  }, 'Stats', btnEl);
}

// ── CENTER ────────────────────────────────────────
function saveCenter(btnEl) {
  saveConfig('center', {
    name:    document.getElementById('centerName').value.trim(),
    desc:    document.getElementById('centerDesc').value.trim(),
    address: document.getElementById('centerAddress').value.trim(),
    phone:   document.getElementById('centerPhone').value.trim(),
    mapUrl:  document.getElementById('centerMapUrl').value.trim()
  }, 'Center', btnEl);
}

// ── CONTACT ───────────────────────────────────────
function saveContact(btnEl) {
  saveConfig('contact', {
    phone:   document.getElementById('contactPhone').value.trim(),
    email:   document.getElementById('contactEmail').value.trim(),
    address: document.getElementById('contactAddress').value.trim()
  }, 'Contact', btnEl);
}

// ── FOOTER ────────────────────────────────────────
function saveFooter(btnEl) {
  saveConfig('footer', {
    text: document.getElementById('footerText').value.trim()
  }, 'Footer', btnEl);
}

// ══════════════════════════════════════════════════
//  GRADES
// ══════════════════════════════════════════════════
var gradesData = [];

async function loadGrades() {
  try {
    var snap = await db.collection('grades').orderBy('order').get();
    gradesData = snap.docs.map(function(d) { return Object.assign({id: d.id}, d.data()); });
  } catch(e) {
    console.warn('loadGrades error:', e);
    gradesData = [];
  }
  renderGradeRows();
}

function renderGradeRows() {
  var list = document.getElementById('gradesList');
  if (!list) return;
  if (gradesData.length === 0) {
    list.innerHTML = '<div class="empty-state">No grade cards yet. Click "+ Add Grade Card" to begin.</div>';
    return;
  }
  list.innerHTML = gradesData.map(function(g, i) {
    return '<div class="data-row grade-row" data-idx="' + i + '">' +
      '<div class="row-handle">⠿</div>' +
      '<div class="form-group small"><label>Emoji</label><input type="text" data-field="emoji" value="' + esc(g.emoji) + '" placeholder="📚" /></div>' +
      '<div class="form-group flex2"><label>Name</label><input type="text" data-field="name" value="' + esc(g.name) + '" placeholder="Grade 11" /></div>' +
      '<div class="form-group flex2"><label>Subtitle</label><input type="text" data-field="sub" value="' + esc(g.sub) + '" placeholder="O/L Preparation" /></div>' +
      '<div class="form-group small"><label>Count</label><input type="text" data-field="count" value="' + esc(g.count) + '" placeholder="120+" /></div>' +
      '<div class="form-group flex3"><label>Link URL</label><input type="text" data-field="url" value="' + esc(g.url) + '" placeholder="https://..." /></div>' +
      '<div class="form-group small"><label>Order</label><input type="number" data-field="order" value="' + (g.order !== undefined ? g.order : i+1) + '" min="1" /></div>' +
      '<button class="btn-remove" onclick="removeGradeRow(' + i + ')" title="Remove">✕</button>' +
    '</div>';
  }).join('');
}

function addGradeRow() {
  gradesData.push({ emoji: '📚', name: '', sub: '', count: '', url: '', order: gradesData.length + 1 });
  renderGradeRows();
  var last = document.getElementById('gradesList').lastElementChild;
  if (last) last.scrollIntoView({ behavior: 'smooth' });
}

function removeGradeRow(i) {
  gradesData.splice(i, 1);
  renderGradeRows();
}

async function saveGrades(btnEl) {
  var originalHTML = btnEl ? btnEl.innerHTML : '💾 Save All Grades';
  setBtn(btnEl, true, '<span class="btn-spinner"></span> Saving…');

  var rows = document.querySelectorAll('.grade-row');
  var updated = [];
  rows.forEach(function(row, i) {
    var obj = { order: i + 1 };
    row.querySelectorAll('[data-field]').forEach(function(inp) {
      var f = inp.dataset.field;
      obj[f] = f === 'order' ? (parseInt(inp.value) || i+1) : inp.value.trim();
    });
    updated.push(obj);
  });

  try {
    var batch = db.batch();
    var existing = await db.collection('grades').get();
    existing.docs.forEach(function(d) { batch.delete(d.ref); });
    updated.forEach(function(g, i) {
      batch.set(db.collection('grades').doc('grade_' + (i+1)), g);
    });
    await batch.commit();
    gradesData = updated;
    showToast('✅ Grades saved!');
    console.log('[Firestore] Grades saved:', updated);
  } catch(e) {
    console.error('[Firestore] saveGrades error:', e);
    showToast('❌ Failed: ' + e.message, 'error');
  } finally {
    setBtn(btnEl, false, originalHTML);
  }
}

// ══════════════════════════════════════════════════
//  SUBJECTS
// ══════════════════════════════════════════════════
var subjectsData = [];

async function loadSubjects() {
  try {
    var snap = await db.collection('subjects').orderBy('name').get();
    subjectsData = snap.docs.map(function(d) { return Object.assign({id: d.id}, d.data()); });
  } catch(e) {
    console.warn('loadSubjects error:', e);
    subjectsData = [];
  }
  renderSubjectRows();
}

function renderSubjectRows() {
  var list = document.getElementById('subjectsList');
  if (!list) return;
  if (subjectsData.length === 0) {
    list.innerHTML = '<div class="empty-state">No subjects yet. Click "+ Add Subject" to begin.</div>';
    return;
  }
  list.innerHTML = subjectsData.map(function(s, i) {
    return '<div class="data-row subject-row" data-idx="' + i + '">' +
      '<div class="row-handle">⠿</div>' +
      '<div class="form-group small"><label>Icon</label><input type="text" data-field="icon" value="' + esc(s.icon) + '" placeholder="🔬" /></div>' +
      '<div class="form-group flex3"><label>Subject Name</label><input type="text" data-field="name" value="' + esc(s.name) + '" placeholder="Physics" /></div>' +
      '<div class="form-group flex2"><label>Tag / Level</label><input type="text" data-field="tag" value="' + esc(s.tag) + '" placeholder="A/L · Science" /></div>' +
      '<button class="btn-remove" onclick="removeSubjectRow(' + i + ')" title="Remove">✕</button>' +
    '</div>';
  }).join('');
}

function addSubjectRow() {
  subjectsData.push({ icon: '📖', name: '', tag: '' });
  renderSubjectRows();
  var last = document.getElementById('subjectsList').lastElementChild;
  if (last) last.scrollIntoView({ behavior: 'smooth' });
}

function removeSubjectRow(i) {
  subjectsData.splice(i, 1);
  renderSubjectRows();
}

async function saveSubjects(btnEl) {
  var originalHTML = btnEl ? btnEl.innerHTML : '💾 Save All Subjects';
  setBtn(btnEl, true, '<span class="btn-spinner"></span> Saving…');

  var rows = document.querySelectorAll('.subject-row');
  var updated = [];
  rows.forEach(function(row) {
    var obj = {};
    row.querySelectorAll('[data-field]').forEach(function(inp) { obj[inp.dataset.field] = inp.value.trim(); });
    if (obj.name) updated.push(obj);
  });

  try {
    var batch = db.batch();
    var existing = await db.collection('subjects').get();
    existing.docs.forEach(function(d) { batch.delete(d.ref); });
    updated.forEach(function(s, i) {
      batch.set(db.collection('subjects').doc('subject_' + i), s);
    });
    await batch.commit();
    subjectsData = updated;
    showToast('✅ Subjects saved!');
    console.log('[Firestore] Subjects saved:', updated);
  } catch(e) {
    console.error('[Firestore] saveSubjects error:', e);
    showToast('❌ Failed: ' + e.message, 'error');
  } finally {
    setBtn(btnEl, false, originalHTML);
  }
}

// ── Utility ────────────────────────────────────────
function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
