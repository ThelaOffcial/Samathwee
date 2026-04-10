// =============================================
//  SAMATHWEE – admin.js  (FINAL FIXED)
//  100% Firebase Realtime Database
//  NO Firestore anywhere
//  Writes to RTDB → script.js .on('value')
//  listener fires instantly on index.html
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
const auth = firebase.auth();
const rtdb  = firebase.database(); // Realtime DB ONLY

// ──────────────────────────────────────────────
//  RTDB HELPERS
// ──────────────────────────────────────────────
function rtdbWrite(path, value) {
  // Strip undefined so RTDB doesn't choke
  const clean = JSON.parse(JSON.stringify(value !== undefined ? value : null));
  return rtdb.ref(path).set(clean);
}
function rtdbRead(path) {
  return rtdb.ref(path).once('value').then(function(snap) { return snap.val(); });
}

// ──────────────────────────────────────────────
//  AUTH
// ──────────────────────────────────────────────
auth.onAuthStateChanged(function(user) {
  if (user) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboard').style.display   = 'flex';
    loadAllData();
  } else {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('dashboard').style.display   = 'none';
  }
});

function toggleAuth(type) {
  document.getElementById('loginForm').style.display  = type === 'login'  ? 'block' : 'none';
  document.getElementById('signupForm').style.display = type === 'signup' ? 'block' : 'none';
}

async function doLogin() {
  var email    = document.getElementById('loginEmail').value.trim();
  var password = document.getElementById('loginPassword').value;
  var remember = document.getElementById('rememberMe').checked;
  var errEl    = document.getElementById('loginError');
  var btn      = document.getElementById('loginBtn');

  if (!email || !password) {
    errEl.textContent = '❌ Please enter email and password.';
    errEl.style.display = 'block'; return;
  }

  errEl.style.display = 'none';
  btn.disabled = true; btn.textContent = 'Signing in…';

  try {
    await auth.signInWithEmailAndPassword(email, password);
    if (remember) {
      localStorage.setItem('adminEmail', email);
      localStorage.setItem('adminPass',  password);
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('adminEmail');
      localStorage.removeItem('adminPass');
      localStorage.removeItem('rememberMe');
    }
  } catch (err) {
    errEl.textContent = '❌ ' + friendlyAuthError(err.code);
    errEl.style.display = 'block';
  } finally {
    btn.disabled = false; btn.textContent = 'Sign In →';
  }
}

async function doSignup() {
  var email    = document.getElementById('signupEmail').value.trim();
  var password = document.getElementById('signupPassword').value;
  var errEl    = document.getElementById('signupError');
  errEl.style.display = 'none';

  if (!email || !password) {
    errEl.textContent = '❌ Please fill in all fields.';
    errEl.style.display = 'block'; return;
  }

  try {
    await auth.createUserWithEmailAndPassword(email, password);
    showToast('✅ Admin account created!');
    toggleAuth('login');
  } catch (err) {
    errEl.textContent = '❌ ' + friendlyAuthError(err.code);
    errEl.style.display = 'block';
  }
}

function doLogout() {
  if (confirm('Sign out?')) auth.signOut();
}

function friendlyAuthError(code) {
  var map = {
    'auth/user-not-found':       'No account found with that email.',
    'auth/wrong-password':       'Incorrect password.',
    'auth/invalid-email':        'Invalid email address.',
    'auth/email-already-in-use': 'That email is already registered.',
    'auth/weak-password':        'Password must be at least 6 characters.',
    'auth/too-many-requests':    'Too many attempts. Try again later.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/invalid-credential':   'Invalid email or password.'
  };
  return map[code] || 'Authentication failed. Try again.';
}

// ──────────────────────────────────────────────
//  UI HELPERS
// ──────────────────────────────────────────────
function showToast(msg, type) {
  type = type || 'success';
  var t = document.getElementById('toast');
  t.textContent   = msg;
  t.className     = 'toast ' + type;
  t.style.display = 'block';
  clearTimeout(t._timer);
  t._timer = setTimeout(function() { t.style.display = 'none'; }, 3500);
}

var _saveTimer;
function setSaveStatus(state, text) {
  var box = document.getElementById('saveStatus');
  var el  = document.getElementById('saveStatusText');
  if (!box || !el) return;
  box.classList.remove('saving', 'saved', 'error');
  if (state) box.classList.add(state);
  var defaults = { saving: 'Saving…', saved: 'Saved ✓', error: 'Error!' };
  el.textContent = text || defaults[state] || 'Ready';
  clearTimeout(_saveTimer);
  if (state === 'saved') _saveTimer = setTimeout(function() { setSaveStatus('', 'Ready'); }, 3000);
}

function showSection(key, btnEl) {
  document.querySelectorAll('.admin-section').forEach(function(el) { el.classList.remove('active'); });
  document.querySelectorAll('.nav-item').forEach(function(el) { el.classList.remove('active'); });
  var sec = document.getElementById('sec-' + key);
  if (sec) sec.classList.add('active');
  if (btnEl) btnEl.classList.add('active');
  var sb = document.getElementById('sidebar');
  if (sb) sb.classList.remove('open');
}

function toggleSidebar() {
  var sb = document.getElementById('sidebar');
  if (sb) sb.classList.toggle('open');
}

function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;').replace(/"/g, '&quot;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

window.addEventListener('load', function() {
  if (localStorage.getItem('rememberMe') === 'true') {
    var e = document.getElementById('loginEmail');
    var p = document.getElementById('loginPassword');
    var c = document.getElementById('rememberMe');
    if (e) e.value = localStorage.getItem('adminEmail') || '';
    if (p) p.value = localStorage.getItem('adminPass')  || '';
    if (c) c.checked = true;
  }
});

// ──────────────────────────────────────────────
//  LOAD ALL DATA
// ──────────────────────────────────────────────
async function loadAllData() {
  await Promise.all([
    loadHero(), loadStats(), loadCenter(), loadContact(),
    loadFooter(), loadGrades(), loadSubjects(), loadTeachers()
  ]);
}

// ──────────────────────────────────────────────
//  GENERIC SAVE → writes to RTDB path
//  script.js .on('value') fires automatically
//  → index.html updates in real time
// ──────────────────────────────────────────────
async function saveData(path, data, label, btn) {
  // Lock button
  var origHTML = btn ? btn.innerHTML : null;
  if (btn) { btn.disabled = true; btn.innerHTML = '⏳ Saving…'; }
  setSaveStatus('saving');

  try {
    await rtdbWrite(path, data);
    setSaveStatus('saved');
    showToast('✅ ' + label);
    console.log('[RTDB] Saved ' + path, data);
  } catch (err) {
    setSaveStatus('error');
    console.error('[RTDB] Failed ' + path, err);
    showToast('❌ ' + (err.message || 'Save failed'), 'error');
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = origHTML; }
  }
}

// ──────────────────────────────────────────────
//  HERO  →  RTDB: config/hero
// ──────────────────────────────────────────────
async function loadHero() {
  try {
    var data = await rtdbRead('config/hero');
    if (data) {
      document.getElementById('heroTagline').value = data.tagline || '';
      document.getElementById('heroTitle').value   = data.title   || '';
      document.getElementById('heroDesc').value    = data.desc    || '';
    }
  } catch(e) { console.warn('loadHero:', e); }
}

function saveHero(btn) {
  saveData('config/hero', {
    tagline: document.getElementById('heroTagline').value.trim(),
    title:   document.getElementById('heroTitle').value.trim(),
    desc:    document.getElementById('heroDesc').value.trim()
  }, 'Hero section saved!', btn);
}

// ──────────────────────────────────────────────
//  STATS  →  RTDB: config/stats
// ──────────────────────────────────────────────
async function loadStats() {
  try {
    var data = await rtdbRead('config/stats');
    if (data) {
      document.getElementById('statStudents').value = data.students != null ? data.students : '';
      document.getElementById('statTeachers').value = data.teachers != null ? data.teachers : '';
      document.getElementById('statSubjects').value = data.subjects != null ? data.subjects : '';
      document.getElementById('statCenters').value  = data.centers  != null ? data.centers  : '';
    }
  } catch(e) { console.warn('loadStats:', e); }
}

function saveStats(btn) {
  saveData('config/stats', {
    students: parseInt(document.getElementById('statStudents').value) || 0,
    teachers: parseInt(document.getElementById('statTeachers').value) || 0,
    subjects: parseInt(document.getElementById('statSubjects').value) || 0,
    centers:  parseInt(document.getElementById('statCenters').value)  || 1
  }, 'Statistics saved!', btn);
}

// ──────────────────────────────────────────────
//  CENTER  →  RTDB: config/center
// ──────────────────────────────────────────────
async function loadCenter() {
  try {
    var data = await rtdbRead('config/center');
    if (data) {
      document.getElementById('centerName').value    = data.name    || '';
      document.getElementById('centerDesc').value    = data.desc    || '';
      document.getElementById('centerAddress').value = data.address || '';
      document.getElementById('centerPhone').value   = data.phone   || '';
      document.getElementById('centerMapUrl').value  = data.mapUrl  || '';
    }
  } catch(e) { console.warn('loadCenter:', e); }
}

function saveCenter(btn) {
  saveData('config/center', {
    name:    document.getElementById('centerName').value.trim(),
    desc:    document.getElementById('centerDesc').value.trim(),
    address: document.getElementById('centerAddress').value.trim(),
    phone:   document.getElementById('centerPhone').value.trim(),
    mapUrl:  document.getElementById('centerMapUrl').value.trim()
  }, 'Center info saved!', btn);
}

// ──────────────────────────────────────────────
//  CONTACT  →  RTDB: config/contact
// ──────────────────────────────────────────────
async function loadContact() {
  try {
    var data = await rtdbRead('config/contact');
    if (data) {
      document.getElementById('contactPhone').value   = data.phone   || '';
      document.getElementById('contactEmail').value   = data.email   || '';
      document.getElementById('contactAddress').value = data.address || '';
    }
  } catch(e) { console.warn('loadContact:', e); }
}

function saveContact(btn) {
  saveData('config/contact', {
    phone:   document.getElementById('contactPhone').value.trim(),
    email:   document.getElementById('contactEmail').value.trim(),
    address: document.getElementById('contactAddress').value.trim()
  }, 'Contact details saved!', btn);
}

// ──────────────────────────────────────────────
//  FOOTER  →  RTDB: config/footer
// ──────────────────────────────────────────────
async function loadFooter() {
  try {
    var data = await rtdbRead('config/footer');
    if (data) document.getElementById('footerText').value = data.text || '';
  } catch(e) { console.warn('loadFooter:', e); }
}

function saveFooter(btn) {
  saveData('config/footer', {
    text: document.getElementById('footerText').value.trim()
  }, 'Footer saved!', btn);
}

// ──────────────────────────────────────────────
//  GRADES  →  RTDB: grades
// ──────────────────────────────────────────────
var gradesData = [];

async function loadGrades() {
  try {
    var data = await rtdbRead('grades');
    if (data) {
      gradesData = Array.isArray(data)
        ? data.filter(Boolean)
        : Object.values(data).filter(Boolean);
    } else { gradesData = []; }
  } catch(e) { gradesData = []; }
  renderGradeRows();
}

function renderGradeRows() {
  var list = document.getElementById('gradesList');
  if (!list) return;
  if (!gradesData.length) {
    list.innerHTML = '<p class="empty-msg">No grade cards yet. Click ＋ Add Grade Card.</p>';
    return;
  }
  list.innerHTML = gradesData.map(function(g, i) {
    return '<div class="grade-row" data-idx="' + i + '">' +
      '<div class="form-group small"><label>Emoji</label>' +
      '<input type="text" data-field="emoji" data-idx="' + i + '" value="' + escHtml(g.emoji) + '" placeholder="📚" /></div>' +
      '<div class="form-group"><label>Name</label>' +
      '<input type="text" data-field="name" data-idx="' + i + '" value="' + escHtml(g.name) + '" placeholder="Grade 6" /></div>' +
      '<div class="form-group"><label>Subtitle</label>' +
      '<input type="text" data-field="sub" data-idx="' + i + '" value="' + escHtml(g.sub) + '" placeholder="Primary" /></div>' +
      '<div class="form-group small"><label>Count</label>' +
      '<input type="text" data-field="count" data-idx="' + i + '" value="' + escHtml(g.count) + '" placeholder="120+" /></div>' +
      '<div class="form-group"><label>Link URL</label>' +
      '<input type="text" data-field="url" data-idx="' + i + '" value="' + escHtml(g.url) + '" placeholder="/grade6" /></div>' +
      '<div class="form-group small"><label>Order</label>' +
      '<input type="number" data-field="order" data-idx="' + i + '" value="' + (g.order || i + 1) + '" /></div>' +
      '<div class="remove-btn-wrap"><button class="btn-remove" onclick="removeGradeRow(' + i + ')">✕ Remove</button></div>' +
    '</div>';
  }).join('');
}

function addGradeRow() {
  gradesData.push({ emoji: '', name: '', sub: '', count: '', url: '', order: gradesData.length + 1 });
  renderGradeRows();
}

function removeGradeRow(i) {
  gradesData.splice(i, 1);
  renderGradeRows();
}

function saveGrades(btn) {
  // Collect DOM values
  document.querySelectorAll('.grade-row').forEach(function(row) {
    var idx = parseInt(row.dataset.idx);
    if (isNaN(idx) || !gradesData[idx]) return;
    row.querySelectorAll('[data-field]').forEach(function(inp) {
      var f = inp.dataset.field;
      gradesData[idx][f] = f === 'order' ? (parseInt(inp.value) || idx + 1) : inp.value.trim();
    });
  });

  var toSave = gradesData.map(function(g, i) {
    return { emoji: g.emoji || '', name: g.name || '', sub: g.sub || '',
             count: g.count || '', url: g.url || '', order: g.order || i + 1 };
  });

  saveData('grades', toSave, 'Grades saved!', btn);
}

// ──────────────────────────────────────────────
//  SUBJECTS  →  RTDB: subjects
// ──────────────────────────────────────────────
var subjectsData = [];

async function loadSubjects() {
  try {
    var data = await rtdbRead('subjects');
    if (data) {
      subjectsData = Array.isArray(data)
        ? data.filter(Boolean)
        : Object.values(data).filter(Boolean);
    } else { subjectsData = []; }
  } catch(e) { subjectsData = []; }
  renderSubjectRows();
}

function renderSubjectRows() {
  var list = document.getElementById('subjectsList');
  if (!list) return;
  if (!subjectsData.length) {
    list.innerHTML = '<p class="empty-msg">No subjects yet. Click ＋ Add Subject.</p>';
    return;
  }
  list.innerHTML = subjectsData.map(function(s, i) {
    return '<div class="subject-row" data-idx="' + i + '">' +
      '<div class="form-group small"><label>Icon</label>' +
      '<input type="text" data-field="icon" data-idx="' + i + '" value="' + escHtml(s.icon) + '" placeholder="🔬" /></div>' +
      '<div class="form-group"><label>Subject Name</label>' +
      '<input type="text" data-field="name" data-idx="' + i + '" value="' + escHtml(s.name) + '" placeholder="Mathematics" /></div>' +
      '<div class="form-group"><label>Tag / Level</label>' +
      '<input type="text" data-field="tag" data-idx="' + i + '" value="' + escHtml(s.tag) + '" placeholder="A/L, O/L…" /></div>' +
      '<div class="remove-btn-wrap"><button class="btn-remove" onclick="removeSubjectRow(' + i + ')">✕ Remove</button></div>' +
    '</div>';
  }).join('');
}

function addSubjectRow() {
  subjectsData.push({ icon: '', name: '', tag: '' });
  renderSubjectRows();
}

function removeSubjectRow(i) {
  subjectsData.splice(i, 1);
  renderSubjectRows();
}

function saveSubjects(btn) {
  document.querySelectorAll('.subject-row').forEach(function(row) {
    var idx = parseInt(row.dataset.idx);
    if (isNaN(idx) || !subjectsData[idx]) return;
    row.querySelectorAll('[data-field]').forEach(function(inp) {
      subjectsData[idx][inp.dataset.field] = inp.value.trim();
    });
  });

  var toSave = subjectsData
    .filter(function(s) { return s.name && s.name.trim(); })
    .map(function(s) { return { icon: s.icon || '', name: s.name || '', tag: s.tag || '' }; });

  saveData('subjects', toSave, 'Subjects saved!', btn);
}

// ──────────────────────────────────────────────
//  TEACHERS  →  RTDB: teachers
// ──────────────────────────────────────────────
var teachersData = [];

async function loadTeachers() {
  try {
    var data = await rtdbRead('teachers');
    if (data) {
      teachersData = Array.isArray(data)
        ? data.filter(Boolean)
        : Object.values(data).filter(Boolean);
    } else { teachersData = []; }
  } catch(e) { teachersData = []; }
  renderTeacherRows();
}

function renderTeacherRows() {
  var list = document.getElementById('teachersList');
  if (!list) return;
  if (!teachersData.length) {
    list.innerHTML = '<p class="empty-msg">No teachers yet. Click ＋ Add Teacher.</p>';
    return;
  }
  list.innerHTML = teachersData.map(function(t, i) {
    return '<div class="teacher-row" data-idx="' + i + '">' +
      '<div class="teacher-fields">' +
        '<div class="form-row-2">' +
          '<div class="form-group"><label>Full Name</label>' +
          '<input type="text" data-field="name" data-idx="' + i + '" value="' + escHtml(t.name) + '" placeholder="Mr. Perera" /></div>' +
          '<div class="form-group"><label>Subject(s)</label>' +
          '<input type="text" data-field="subject" data-idx="' + i + '" value="' + escHtml(t.subject) + '" placeholder="Mathematics, Physics" /></div>' +
        '</div>' +
        '<div class="form-row-2">' +
          '<div class="form-group"><label>Qualification</label>' +
          '<input type="text" data-field="qualification" data-idx="' + i + '" value="' + escHtml(t.qualification) + '" placeholder="BSc (Hons)" /></div>' +
          '<div class="form-group"><label>Experience</label>' +
          '<input type="text" data-field="experience" data-idx="' + i + '" value="' + escHtml(t.experience) + '" placeholder="10+ Years" /></div>' +
        '</div>' +
        '<div class="form-group"><label>Bio (optional)</label>' +
        '<input type="text" data-field="bio" data-idx="' + i + '" value="' + escHtml(t.bio) + '" placeholder="Short description…" /></div>' +
      '</div>' +
      '<button class="btn-remove teacher-remove" onclick="removeTeacher(' + i + ')">✕</button>' +
    '</div>';
  }).join('');
}

function addTeacher() {
  teachersData.push({ name:'', subject:'', qualification:'', experience:'', bio:'', order: teachersData.length + 1 });
  renderTeacherRows();
}

function removeTeacher(i) {
  teachersData.splice(i, 1);
  renderTeacherRows();
}

function saveTeachers(btn) {
  document.querySelectorAll('.teacher-row').forEach(function(row) {
    var idx = parseInt(row.dataset.idx);
    if (isNaN(idx) || !teachersData[idx]) return;
    row.querySelectorAll('[data-field]').forEach(function(inp) {
      teachersData[idx][inp.dataset.field] = inp.value.trim();
    });
  });

  var toSave = teachersData.map(function(t, i) {
    return {
      name:          t.name          || '',
      subject:       t.subject       || '',
      qualification: t.qualification || '',
      experience:    t.experience    || '',
      bio:           t.bio           || '',
      order:         i + 1
    };
  });

  saveData('teachers', toSave, 'Teachers saved!', btn);
}
