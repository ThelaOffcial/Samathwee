// =============================================
//  SAMATHWEE – admin.js
//  Firebase Auth + Realtime Database ONLY
//  NO Firestore used anywhere in this file
// =============================================
 
// ── PASTE YOUR FIREBASE CONFIG HERE ──────────
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
const db   = firebase.database(); // Realtime Database ONLY
 
// ══════════════════════════════════════════════
//  CORE RTDB HELPERS
// ══════════════════════════════════════════════
 
function rtdbWrite(path, value) {
  const clean = JSON.parse(JSON.stringify(value));
  return db.ref(path).set(clean);
}
 
function rtdbRead(path) {
  return db.ref(path).once('value').then(snap => snap.val());
}
 
// ══════════════════════════════════════════════
//  AUTH
// ══════════════════════════════════════════════
 
auth.onAuthStateChanged(user => {
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
  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const remember = document.getElementById('rememberMe').checked;
  const errEl    = document.getElementById('loginError');
  const btn      = document.getElementById('loginBtn');
 
  if (!email || !password) {
    errEl.textContent   = '❌ Please enter email and password.';
    errEl.style.display = 'block';
    return;
  }
 
  errEl.style.display = 'none';
  btn.disabled = true;
  btn.textContent = 'Signing in…';
 
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
    errEl.textContent   = '❌ ' + friendlyAuthError(err.code);
    errEl.style.display = 'block';
  } finally {
    btn.disabled    = false;
    btn.textContent = 'Sign In →';
  }
}
 
async function doSignup() {
  const email    = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const errEl    = document.getElementById('signupError');
  errEl.style.display = 'none';
 
  if (!email || !password) {
    errEl.textContent   = '❌ Please fill in all fields.';
    errEl.style.display = 'block';
    return;
  }
 
  try {
    await auth.createUserWithEmailAndPassword(email, password);
    showToast('✅ Admin account created!');
    toggleAuth('login');
  } catch (err) {
    errEl.textContent   = '❌ ' + friendlyAuthError(err.code);
    errEl.style.display = 'block';
  }
}
 
function doLogout() { auth.signOut(); }
 
function friendlyAuthError(code) {
  const map = {
    'auth/user-not-found':       'No account found with that email.',
    'auth/wrong-password':       'Incorrect password.',
    'auth/invalid-email':        'Invalid email address.',
    'auth/email-already-in-use': 'That email is already registered.',
    'auth/weak-password':        'Password must be at least 6 characters.',
    'auth/too-many-requests':    'Too many attempts. Try again later.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/invalid-credential':   'Invalid email or password.',
  };
  return map[code] || 'Authentication failed. Try again.';
}
 
// ══════════════════════════════════════════════
//  UI HELPERS
// ══════════════════════════════════════════════
 
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent   = msg;
  t.className     = `toast ${type}`;
  t.style.display = 'block';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.style.display = 'none'; }, 3500);
}
 
let _saveTimer;
function setSaveStatus(state, text) {
  const box = document.getElementById('saveStatus');
  const el  = document.getElementById('saveStatusText');
  if (!box || !el) return;
  box.classList.remove('saving', 'saved', 'error');
  if (state) box.classList.add(state);
  const defaults = { saving: 'Saving…', saved: 'Saved ✓', error: 'Error!' };
  el.textContent = text || defaults[state] || 'Ready';
  clearTimeout(_saveTimer);
  if (state === 'saved') _saveTimer = setTimeout(() => setSaveStatus('', 'Ready'), 3000);
}
 
function showSection(key, btnEl) {
  document.querySelectorAll('.admin-section').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const sec = document.getElementById(`sec-${key}`);
  if (sec) sec.classList.add('active');
  if (btnEl) btnEl.classList.add('active');
  document.getElementById('sidebar')?.classList.remove('open');
}
 
function toggleSidebar() {
  document.getElementById('sidebar')?.classList.toggle('open');
}
 
function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
 
window.addEventListener('load', () => {
  if (localStorage.getItem('rememberMe') === 'true') {
    const emailEl = document.getElementById('loginEmail');
    const passEl  = document.getElementById('loginPassword');
    const cbEl    = document.getElementById('rememberMe');
    if (emailEl) emailEl.value = localStorage.getItem('adminEmail') || '';
    if (passEl)  passEl.value  = localStorage.getItem('adminPass')  || '';
    if (cbEl)    cbEl.checked  = true;
  }
});
 
// ══════════════════════════════════════════════
//  LOAD ALL DATA
// ══════════════════════════════════════════════
 
async function loadAllData() {
  await Promise.all([
    loadHero(),
    loadStats(),
    loadCenter(),
    loadContact(),
    loadFooter(),
    loadGrades(),
    loadSubjects(),
    loadTeachers(),
    loadAllSubPageData()
  ]);
}
 
// ══════════════════════════════════════════════
//  GENERIC SAVE
// ══════════════════════════════════════════════
 
async function saveData(path, data, label) {
  setSaveStatus('saving');
  try {
    await rtdbWrite(path, data);
    setSaveStatus('saved');
    showToast('✅ ' + label);
  } catch (err) {
    setSaveStatus('error');
    console.error('RTDB write failed:', err);
    showToast('❌ ' + (err.message || 'Save failed'), 'error');
  }
}
 
// ══════════════════════════════════════════════
//  HERO
// ══════════════════════════════════════════════
 
async function loadHero() {
  try {
    const data = await rtdbRead('config/hero');
    if (data) {
      document.getElementById('heroTagline').value = data.tagline || '';
      document.getElementById('heroTitle').value   = data.title   || '';
      document.getElementById('heroDesc').value    = data.desc    || '';
    }
  } catch (e) { console.warn('loadHero:', e); }
}
 
async function saveHero() {
  await saveData('config/hero', {
    tagline: document.getElementById('heroTagline').value.trim(),
    title:   document.getElementById('heroTitle').value.trim(),
    desc:    document.getElementById('heroDesc').value.trim()
  }, 'Hero section saved!');
}
 
// ══════════════════════════════════════════════
//  STATS
// ══════════════════════════════════════════════
 
async function loadStats() {
  try {
    const data = await rtdbRead('config/stats');
    if (data) {
      document.getElementById('statStudents').value = data.students ?? '';
      document.getElementById('statTeachers').value = data.teachers ?? '';
      document.getElementById('statSubjects').value = data.subjects ?? '';
      document.getElementById('statCenters').value  = data.centers  ?? '';
    }
  } catch (e) { console.warn('loadStats:', e); }
}
 
async function saveStats() {
  await saveData('config/stats', {
    students: parseInt(document.getElementById('statStudents').value) || 0,
    teachers: parseInt(document.getElementById('statTeachers').value) || 0,
    subjects: parseInt(document.getElementById('statSubjects').value) || 0,
    centers:  parseInt(document.getElementById('statCenters').value)  || 1
  }, 'Statistics saved!');
}
 
// ══════════════════════════════════════════════
//  CENTER
// ══════════════════════════════════════════════
 
async function loadCenter() {
  try {
    const data = await rtdbRead('config/center');
    if (data) {
      document.getElementById('centerName').value    = data.name    || '';
      document.getElementById('centerDesc').value    = data.desc    || '';
      document.getElementById('centerAddress').value = data.address || '';
      document.getElementById('centerPhone').value   = data.phone   || '';
      document.getElementById('centerMapUrl').value  = data.mapUrl  || '';
    }
  } catch (e) { console.warn('loadCenter:', e); }
}
 
async function saveCenter() {
  await saveData('config/center', {
    name:    document.getElementById('centerName').value.trim(),
    desc:    document.getElementById('centerDesc').value.trim(),
    address: document.getElementById('centerAddress').value.trim(),
    phone:   document.getElementById('centerPhone').value.trim(),
    mapUrl:  document.getElementById('centerMapUrl').value.trim()
  }, 'Center info saved!');
}
 
// ══════════════════════════════════════════════
//  CONTACT
// ══════════════════════════════════════════════
 
async function loadContact() {
  try {
    const data = await rtdbRead('config/contact');
    if (data) {
      document.getElementById('contactPhone').value   = data.phone   || '';
      document.getElementById('contactEmail').value   = data.email   || '';
      document.getElementById('contactAddress').value = data.address || '';
    }
  } catch (e) { console.warn('loadContact:', e); }
}
 
async function saveContact() {
  await saveData('config/contact', {
    phone:   document.getElementById('contactPhone').value.trim(),
    email:   document.getElementById('contactEmail').value.trim(),
    address: document.getElementById('contactAddress').value.trim()
  }, 'Contact details saved!');
}
 
// ══════════════════════════════════════════════
//  FOOTER
// ══════════════════════════════════════════════
 
async function loadFooter() {
  try {
    const data = await rtdbRead('config/footer');
    if (data) document.getElementById('footerText').value = data.text || '';
  } catch (e) { console.warn('loadFooter:', e); }
}
 
async function saveFooter() {
  await saveData('config/footer', {
    text: document.getElementById('footerText').value.trim()
  }, 'Footer saved!');
}
 
// ══════════════════════════════════════════════
//  GRADES
// ══════════════════════════════════════════════
 
let gradesData = [];
 
async function loadGrades() {
  try {
    const data = await rtdbRead('grades');
    if (data) {
      gradesData = Array.isArray(data)
        ? data.filter(Boolean)
        : Object.values(data).filter(Boolean);
    } else {
      gradesData = [];
    }
  } catch (e) { gradesData = []; }
  renderGradeRows();
}
 
function renderGradeRows() {
  const list = document.getElementById('gradesList');
  if (!list) return;
  if (!gradesData.length) {
    list.innerHTML = '<p class="empty-msg">No grade cards yet. Click ＋ Add Grade Card.</p>';
    return;
  }
  list.innerHTML = gradesData.map((g, i) => `
    <div class="grade-row" data-idx="${i}">
      <div class="form-group small"><label>Emoji</label>
        <input type="text" data-field="emoji" data-idx="${i}" value="${escHtml(g.emoji)}" placeholder="📚" />
      </div>
      <div class="form-group"><label>Name</label>
        <input type="text" data-field="name" data-idx="${i}" value="${escHtml(g.name)}" placeholder="Grade 6" />
      </div>
      <div class="form-group"><label>Subtitle</label>
        <input type="text" data-field="sub" data-idx="${i}" value="${escHtml(g.sub)}" placeholder="Primary" />
      </div>
      <div class="form-group small"><label>Count</label>
        <input type="text" data-field="count" data-idx="${i}" value="${escHtml(g.count)}" placeholder="120+" />
      </div>
      <div class="form-group"><label>Link URL</label>
        <input type="text" data-field="url" data-idx="${i}" value="${escHtml(g.url)}" placeholder="/grade6" />
      </div>
      <div class="form-group small"><label>Order</label>
        <input type="number" data-field="order" data-idx="${i}" value="${g.order || i + 1}" />
      </div>
      <div class="remove-btn-wrap">
        <button class="btn-remove" onclick="removeGradeRow(${i})">✕ Remove</button>
      </div>
    </div>`).join('');
}
 
function addGradeRow() {
  gradesData.push({ emoji: '', name: '', sub: '', count: '', url: '', order: gradesData.length + 1 });
  renderGradeRows();
}
 
function removeGradeRow(i) {
  gradesData.splice(i, 1);
  renderGradeRows();
}
 
async function saveGrades() {
  document.querySelectorAll('.grade-row').forEach(row => {
    const idx = parseInt(row.dataset.idx);
    if (isNaN(idx) || !gradesData[idx]) return;
    row.querySelectorAll('[data-field]').forEach(inp => {
      const field = inp.dataset.field;
      gradesData[idx][field] = field === 'order'
        ? (parseInt(inp.value) || idx + 1)
        : inp.value.trim();
    });
  });
 
  const toSave = gradesData.map((g, i) => ({
    emoji: g.emoji  || '',
    name:  g.name   || '',
    sub:   g.sub    || '',
    count: g.count  || '',
    url:   g.url    || '',
    order: g.order  || i + 1
  }));
 
  await saveData('grades', toSave, 'Grades saved!');
}
 
// ══════════════════════════════════════════════
//  SUBJECTS
// ══════════════════════════════════════════════
 
let subjectsData = [];
 
async function loadSubjects() {
  try {
    const data = await rtdbRead('subjects');
    if (data) {
      subjectsData = Array.isArray(data)
        ? data.filter(Boolean)
        : Object.values(data).filter(Boolean);
    } else {
      subjectsData = [];
    }
  } catch (e) { subjectsData = []; }
  renderSubjectRows();
}
 
function renderSubjectRows() {
  const list = document.getElementById('subjectsList');
  if (!list) return;
  if (!subjectsData.length) {
    list.innerHTML = '<p class="empty-msg">No subjects yet. Click ＋ Add Subject.</p>';
    return;
  }
  list.innerHTML = subjectsData.map((s, i) => `
    <div class="subject-row" data-idx="${i}">
      <div class="form-group small"><label>Icon</label>
        <input type="text" data-field="icon" data-idx="${i}" value="${escHtml(s.icon)}" placeholder="🔬" />
      </div>
      <div class="form-group"><label>Subject Name</label>
        <input type="text" data-field="name" data-idx="${i}" value="${escHtml(s.name)}" placeholder="Mathematics" />
      </div>
      <div class="form-group"><label>Tag / Level</label>
        <input type="text" data-field="tag" data-idx="${i}" value="${escHtml(s.tag)}" placeholder="A/L, O/L…" />
      </div>
      <div class="remove-btn-wrap">
        <button class="btn-remove" onclick="removeSubjectRow(${i})">✕ Remove</button>
      </div>
    </div>`).join('');
}
 
function addSubjectRow() {
  subjectsData.push({ icon: '', name: '', tag: '' });
  renderSubjectRows();
}
 
function removeSubjectRow(i) {
  subjectsData.splice(i, 1);
  renderSubjectRows();
}
 
async function saveSubjects() {
  document.querySelectorAll('.subject-row').forEach(row => {
    const idx = parseInt(row.dataset.idx);
    if (isNaN(idx) || !subjectsData[idx]) return;
    row.querySelectorAll('[data-field]').forEach(inp => {
      subjectsData[idx][inp.dataset.field] = inp.value.trim();
    });
  });
 
  const toSave = subjectsData
    .filter(s => s.name && s.name.trim())
    .map(s => ({
      icon: s.icon || '',
      name: s.name || '',
      tag:  s.tag  || ''
    }));
 
  await saveData('subjects', toSave, 'Subjects saved!');
}
 
// ══════════════════════════════════════════════
//  TEACHERS (main page — with Cloudinary upload)
// ══════════════════════════════════════════════
 
const CLOUDINARY_CLOUD_NAME = 'drmmn0xp3';
const CLOUDINARY_UPLOAD_PRESET = 'samathwee';
const CLOUDINARY_FOLDER = 'samathwee';
 
let teachersData = [];
 
async function loadTeachers() {
  try {
    const data = await rtdbRead('teachers');
    if (data) {
      teachersData = Array.isArray(data)
        ? data.filter(Boolean)
        : Object.values(data).filter(Boolean);
    } else {
      teachersData = [];
    }
  } catch (e) { teachersData = []; }
  renderTeacherRows();
}
 
function renderTeacherRows() {
  const list = document.getElementById('teachersList');
  if (!list) return;
  if (!teachersData.length) {
    list.innerHTML = '<p class="empty-msg">No teachers yet. Click ＋ Add Teacher.</p>';
    return;
  }
  list.innerHTML = teachersData.map((t, i) => `
    <div class="teacher-row" data-idx="${i}">
      <div class="teacher-fields">
        <div class="form-row-2">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" data-field="name" data-idx="${i}" value="${escHtml(t.name)}" placeholder="Mr. Perera" />
          </div>
          <div class="form-group">
            <label>Subject(s)</label>
            <input type="text" data-field="subject" data-idx="${i}" value="${escHtml(t.subject)}" placeholder="Mathematics, Physics" />
          </div>
        </div>
        <div class="form-row-2">
          <div class="form-group">
            <label>Qualification</label>
            <input type="text" data-field="qualification" data-idx="${i}" value="${escHtml(t.qualification)}" placeholder="BSc (Hons)" />
          </div>
          <div class="form-group">
            <label>Experience</label>
            <input type="text" data-field="experience" data-idx="${i}" value="${escHtml(t.experience)}" placeholder="10+ Years" />
          </div>
        </div>
        <div class="form-group">
          <label>Bio (optional)</label>
          <input type="text" data-field="bio" data-idx="${i}" value="${escHtml(t.bio)}" placeholder="Short description…" />
        </div>
        <div class="form-group">
          <label>Profile Image</label>
          <div class="image-upload-row">
            <input type="text" data-field="image" data-idx="${i}" value="${escHtml(t.image)}" placeholder="https://.../teacher.jpg" class="image-url-input" id="img-url-${i}" />
            <input type="file" accept="image/*" style="display:none;" id="file-input-${i}" onchange="handleTeacherImageUpload(event, ${i})" />
            <button type="button" class="btn-upload" onclick="document.getElementById('file-input-${i}').click()">📤 Upload</button>
          </div>
          <div class="image-preview" id="preview-${i}">
            ${t.image ? `<img src="${escHtml(t.image)}" alt="Preview" onerror="this.style.display='none'" />` : ''}
          </div>
          <div class="upload-progress" id="progress-${i}" style="display:none;"></div>
        </div>
      </div>
      <button class="btn-remove teacher-remove" onclick="removeTeacher(${i})">✕</button>
    </div>`).join('');
}
 
function addTeacher() {
  teachersData.push({ 
    name: '', subject: '', qualification: '', experience: '', bio: '', 
    image: '',
    order: teachersData.length + 1 
  });
  renderTeacherRows();
}
 
function removeTeacher(i) {
  teachersData.splice(i, 1);
  renderTeacherRows();
}
 
async function saveTeachers() {
  document.querySelectorAll('.teacher-row').forEach(row => {
    const idx = parseInt(row.dataset.idx);
    if (isNaN(idx) || !teachersData[idx]) return;
    row.querySelectorAll('[data-field]').forEach(inp => {
      teachersData[idx][inp.dataset.field] = inp.value.trim();
    });
  });
 
  const toSave = teachersData.map((t, i) => ({
    name:          t.name          || '',
    subject:       t.subject       || '',
    qualification: t.qualification || '',
    experience:    t.experience    || '',
    bio:           t.bio           || '',
    image:         t.image         || '',
    order:         i + 1
  }));
 
  await saveData('teachers', toSave, 'Teachers saved!');
}
 
async function handleTeacherImageUpload(event, index) {
  const file = event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    showToast('❌ Please select an image file', 'error');
    return;
  }
  const progressDiv = document.getElementById(`progress-${index}`);
  const previewDiv = document.getElementById(`preview-${index}`);
  const urlInput = document.getElementById(`img-url-${index}`);
  progressDiv.style.display = 'block';
  progressDiv.textContent = 'Uploading... 0%';
  progressDiv.className = 'upload-progress';
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', CLOUDINARY_FOLDER);
  const xhr = new XMLHttpRequest();
  xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, true);
  xhr.upload.addEventListener('progress', (e) => {
    if (e.lengthComputable) {
      const percent = Math.round((e.loaded / e.total) * 100);
      progressDiv.textContent = `Uploading... ${percent}%`;
    }
  });
  xhr.onload = function() {
    progressDiv.style.display = 'none';
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      const secureUrl = response.secure_url;
      urlInput.value = secureUrl;
      previewDiv.innerHTML = `<img src="${secureUrl}" alt="Preview" />`;
      showToast('✅ Image uploaded successfully!', 'success');
    } else {
      let errorMsg = 'Upload failed';
      try { const err = JSON.parse(xhr.responseText); errorMsg = err.error?.message || errorMsg; } catch (e) {}
      progressDiv.textContent = `❌ ${errorMsg}`;
      progressDiv.style.display = 'block';
      showToast('❌ Upload failed: ' + errorMsg, 'error');
    }
    event.target.value = '';
  };
  xhr.onerror = function() {
    progressDiv.style.display = 'none';
    showToast('❌ Network error during upload', 'error');
    event.target.value = '';
  };
  xhr.send(formData);
}
 
// ══════════════════════════════════════════════
//  SUB PAGE DATA — per-grade teachers & subjects
// ══════════════════════════════════════════════
 
// Grade keys must match the Firebase paths and HTML section IDs
const GRADE_PAGES = [
  { key: 'grade1_5',     label: '🌟 Grade 1–5',      color: '#ff6b6b' },
  { key: 'grade6_ol',    label: '📘 Grade 6–O/L',    color: '#8b5cf6' },
  { key: 'grade_al',     label: '🔬 A / Levels',      color: '#0ea5e9' },
  { key: 'grade_cambridge', label: '🏛️ Cambridge',   color: '#f59e0b' },
  { key: 'grade_london', label: '🇬🇧 London',         color: '#10b981' },
];
 
// Store data per grade
const subPageData = {};
GRADE_PAGES.forEach(g => {
  subPageData[g.key] = { teachers: [], subjects: [] };
});
 
async function loadAllSubPageData() {
  for (const grade of GRADE_PAGES) {
    try {
      const data = await rtdbRead(`subpages/${grade.key}`);
      if (data) {
        subPageData[grade.key].teachers = Array.isArray(data.teachers)
          ? data.teachers.filter(Boolean)
          : (data.teachers ? Object.values(data.teachers).filter(Boolean) : []);
        subPageData[grade.key].subjects = Array.isArray(data.subjects)
          ? data.subjects.filter(Boolean)
          : (data.subjects ? Object.values(data.subjects).filter(Boolean) : []);
      }
    } catch (e) {
      console.warn(`loadSubPage ${grade.key}:`, e);
    }
    renderSubPageTeachers(grade.key);
    renderSubPageSubjects(grade.key);
  }
}
 
// ── SUB PAGE TEACHERS ──────────────────────────
 
function renderSubPageTeachers(gradeKey) {
  const list = document.getElementById(`sp-teachers-${gradeKey}`);
  if (!list) return;
  const teachers = subPageData[gradeKey].teachers;
  if (!teachers.length) {
    list.innerHTML = '<p class="empty-msg">No teachers yet. Click ＋ Add Teacher.</p>';
    return;
  }
  list.innerHTML = teachers.map((t, i) => `
    <div class="sp-teacher-row" data-grade="${gradeKey}" data-idx="${i}">
      <div class="sp-teacher-photo-wrap">
        <div class="sp-avatar-circle" id="sp-avatar-${gradeKey}-${i}">
          ${t.image
            ? `<img src="${escHtml(t.image)}" alt="${escHtml(t.name)}" />`
            : `<span>${escHtml(t.name ? t.name.charAt(0).toUpperCase() : '?')}</span>`
          }
        </div>
        <div class="sp-upload-wrap">
          <input type="file" accept="image/*" style="display:none;"
            id="sp-file-${gradeKey}-${i}"
            onchange="handleSubPageImageUpload(event,'${gradeKey}',${i})" />
          <button type="button" class="btn-upload-small"
            onclick="document.getElementById('sp-file-${gradeKey}-${i}').click()">
            📷 Photo
          </button>
          <div class="upload-progress" id="sp-progress-${gradeKey}-${i}" style="display:none;"></div>
        </div>
      </div>
      <div class="sp-teacher-fields">
        <div class="form-row-2">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" data-field="name" value="${escHtml(t.name)}" placeholder="Mr. Perera" />
          </div>
          <div class="form-group">
            <label>Subject(s)</label>
            <input type="text" data-field="subject" value="${escHtml(t.subject)}" placeholder="Mathematics" />
          </div>
        </div>
        <div class="form-row-2">
          <div class="form-group">
            <label>Qualification</label>
            <input type="text" data-field="qualification" value="${escHtml(t.qualification)}" placeholder="BSc (Hons)" />
          </div>
          <div class="form-group">
            <label>Experience</label>
            <input type="text" data-field="experience" value="${escHtml(t.experience)}" placeholder="10+ Years" />
          </div>
        </div>
        <div class="form-group">
          <label>Bio (optional)</label>
          <input type="text" data-field="bio" value="${escHtml(t.bio)}" placeholder="Short description…" />
        </div>
        <input type="hidden" data-field="image" value="${escHtml(t.image)}" id="sp-img-${gradeKey}-${i}" />
      </div>
      <button class="btn-remove teacher-remove" onclick="removeSubPageTeacher('${gradeKey}', ${i})">✕</button>
    </div>`).join('');
}
 
function addSubPageTeacher(gradeKey) {
  subPageData[gradeKey].teachers.push({
    name: '', subject: '', qualification: '', experience: '', bio: '', image: ''
  });
  renderSubPageTeachers(gradeKey);
}
 
function removeSubPageTeacher(gradeKey, i) {
  subPageData[gradeKey].teachers.splice(i, 1);
  renderSubPageTeachers(gradeKey);
}
 
async function saveSubPageTeachers(gradeKey) {
  // Collect values from DOM
  const rows = document.querySelectorAll(`.sp-teacher-row[data-grade="${gradeKey}"]`);
  const teachers = [];
  rows.forEach((row, i) => {
    const t = { image: subPageData[gradeKey].teachers[i]?.image || '' };
    row.querySelectorAll('[data-field]').forEach(inp => {
      t[inp.dataset.field] = inp.value.trim();
    });
    teachers.push(t);
  });
  subPageData[gradeKey].teachers = teachers;
  await saveData(`subpages/${gradeKey}/teachers`, teachers.filter(t => t.name), 'Teachers saved!');
}
 
async function handleSubPageImageUpload(event, gradeKey, index) {
  const file = event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    showToast('❌ Please select an image file', 'error');
    return;
  }
  const progressDiv = document.getElementById(`sp-progress-${gradeKey}-${index}`);
  const avatarDiv   = document.getElementById(`sp-avatar-${gradeKey}-${index}`);
  const imgInput    = document.getElementById(`sp-img-${gradeKey}-${index}`);
 
  progressDiv.style.display = 'block';
  progressDiv.textContent = 'Uploading…';
 
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', CLOUDINARY_FOLDER + '/subpages');
 
  const xhr = new XMLHttpRequest();
  xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, true);
  xhr.upload.addEventListener('progress', (e) => {
    if (e.lengthComputable) {
      progressDiv.textContent = `${Math.round((e.loaded / e.total) * 100)}%`;
    }
  });
  xhr.onload = function() {
    progressDiv.style.display = 'none';
    if (xhr.status === 200) {
      const url = JSON.parse(xhr.responseText).secure_url;
      if (imgInput) imgInput.value = url;
      if (subPageData[gradeKey].teachers[index]) {
        subPageData[gradeKey].teachers[index].image = url;
      }
      if (avatarDiv) avatarDiv.innerHTML = `<img src="${url}" alt="Teacher" />`;
      showToast('✅ Photo uploaded!');
    } else {
      showToast('❌ Upload failed', 'error');
    }
    event.target.value = '';
  };
  xhr.onerror = () => { progressDiv.style.display = 'none'; showToast('❌ Network error', 'error'); };
  xhr.send(formData);
}
 
// ── SUB PAGE SUBJECTS ──────────────────────────
 
function renderSubPageSubjects(gradeKey) {
  const list = document.getElementById(`sp-subjects-${gradeKey}`);
  if (!list) return;
  const subjects = subPageData[gradeKey].subjects;
  if (!subjects.length) {
    list.innerHTML = '<p class="empty-msg">No subjects yet. Click ＋ Add Subject.</p>';
    return;
  }
  list.innerHTML = subjects.map((s, i) => `
    <div class="sp-subject-row" data-grade="${gradeKey}" data-idx="${i}">
      <div class="form-group small">
        <label>Icon</label>
        <input type="text" data-field="icon" value="${escHtml(s.icon)}" placeholder="📚" />
      </div>
      <div class="form-group">
        <label>Subject Name</label>
        <input type="text" data-field="name" value="${escHtml(s.name)}" placeholder="Mathematics" />
      </div>
      <div class="form-group">
        <label>Teacher Name</label>
        <input type="text" data-field="teacher" value="${escHtml(s.teacher)}" placeholder="Mr. Perera" />
      </div>
      <div class="form-group small">
        <label>Monthly Fee (Rs.)</label>
        <input type="text" data-field="fee" value="${escHtml(s.fee)}" placeholder="2500" />
      </div>
      <div class="remove-btn-wrap">
        <button class="btn-remove" onclick="removeSubPageSubject('${gradeKey}', ${i})">✕ Remove</button>
      </div>
    </div>`).join('');
}
 
function addSubPageSubject(gradeKey) {
  subPageData[gradeKey].subjects.push({ icon: '', name: '', teacher: '', fee: '' });
  renderSubPageSubjects(gradeKey);
}
 
function removeSubPageSubject(gradeKey, i) {
  subPageData[gradeKey].subjects.splice(i, 1);
  renderSubPageSubjects(gradeKey);
}
 
async function saveSubPageSubjects(gradeKey) {
  const rows = document.querySelectorAll(`.sp-subject-row[data-grade="${gradeKey}"]`);
  const subjects = [];
  rows.forEach(row => {
    const s = {};
    row.querySelectorAll('[data-field]').forEach(inp => {
      s[inp.dataset.field] = inp.value.trim();
    });
    subjects.push(s);
  });
  subPageData[gradeKey].subjects = subjects;
  await saveData(`subpages/${gradeKey}/subjects`, subjects.filter(s => s.name), 'Subjects saved!');
}