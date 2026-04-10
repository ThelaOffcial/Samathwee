// =============================================
//  SAMATHWEE – admin.js  (Fixed: no Storage, save status works)
//  Firebase Auth + Firestore + Realtime DB
// =============================================

const firebaseConfig = {
  apiKey: "AIzaSyDlBLrs-WquiVIivoOCuJq2g7BFhNwAtas",
  authDomain: "samathwee.firebaseapp.com",
  projectId: "samathwee",
  storageBucket: "samathwee.firebasestorage.app",
  messagingSenderId: "1094489861098",
  appId: "1:1094489861098:web:e61feb13a5f69a8b78e093",
  databaseURL: "https://samathwee-default-rtdb.firebaseio.com"  // ← replace with your RTDB URL
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db   = firebase.firestore();
const rtdb = firebase.database();

// RTDB: fire-and-forget (never blocks UI or save status)
function rtdbSet(path, value) {
  rtdb.ref(path).set(value).catch(e => console.warn('RTDB:', e));
}

// ── Auth ─────────────────────────────────────────────────────────────
auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboard').style.display  = 'flex';
    loadAllData();
  } else {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('dashboard').style.display  = 'none';
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
  errEl.style.display = 'none';
  btn.disabled = true; btn.textContent = 'Signing in…';
  try {
    await auth.signInWithEmailAndPassword(email, password);
    if (remember) {
      localStorage.setItem('adminEmail', email);
      localStorage.setItem('adminPass', password);
      localStorage.setItem('rememberMe', 'true');
    } else { localStorage.clear(); }
  } catch (err) {
    errEl.textContent = '❌ ' + (err.message || 'Invalid credentials');
    errEl.style.display = 'block';
  } finally { btn.disabled = false; btn.textContent = 'Sign In →'; }
}

async function doSignup() {
  const email    = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const errEl    = document.getElementById('signupError');
  errEl.style.display = 'none';
  try {
    await auth.createUserWithEmailAndPassword(email, password);
    alert('✅ Admin account created!');
    toggleAuth('login');
  } catch (err) {
    errEl.textContent = '❌ ' + err.message;
    errEl.style.display = 'block';
  }
}

function doLogout() { auth.signOut(); }

// ── Toast ─────────────────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg; t.className = `toast ${type}`; t.style.display = 'block';
  setTimeout(() => { t.style.display = 'none'; }, 3500);
}

// ── Save Status ───────────────────────────────────────────────────────
let _saveTimer;
function setSaveStatus(state, text) {
  const box = document.getElementById('saveStatus');
  const el  = document.getElementById('saveStatusText');
  if (!box || !el) return;
  box.classList.remove('saving', 'saved', 'error');
  if (state) box.classList.add(state);
  el.textContent = text || { saving: 'Saving…', saved: 'Saved ✓', error: 'Save failed' }[state] || 'Ready';
  clearTimeout(_saveTimer);
  if (state === 'saved') _saveTimer = setTimeout(() => setSaveStatus('', 'Ready'), 2000);
}

// ── Debounce ──────────────────────────────────────────────────────────
function debounce(fn, wait = 700) {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), wait); };
}

// ── Navigation ────────────────────────────────────────────────────────
function showSection(key, btnEl) {
  document.querySelectorAll('.admin-section').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  document.getElementById(`sec-${key}`)?.classList.add('active');
  if (btnEl) btnEl.classList.add('active');
  document.getElementById('sidebar')?.classList.remove('open');
}
function toggleSidebar() { document.getElementById('sidebar')?.classList.toggle('open'); }

window.addEventListener('load', () => {
  if (localStorage.getItem('rememberMe') === 'true') {
    document.getElementById('loginEmail').value    = localStorage.getItem('adminEmail') || '';
    document.getElementById('loginPassword').value = localStorage.getItem('adminPass')  || '';
    document.getElementById('rememberMe').checked  = true;
  }
});

async function loadAllData() {
  await Promise.all([
    loadHero(), loadStats(), loadCenter(),
    loadContact(), loadFooter(), loadGrades(),
    loadSubjects(), loadTeachers()
  ]);
}

// ════════════════════════════════════════════════════════════════════
//  GENERIC SAVE — Firestore is awaited (drives status), RTDB is async
// ════════════════════════════════════════════════════════════════════
async function saveSection(fsDocId, data, rtdbPath, successMsg) {
  setSaveStatus('saving');
  try {
    await db.collection('config').doc(fsDocId).set(data);
    rtdbSet(rtdbPath, data);           // fire-and-forget
    setSaveStatus('saved');
    showToast('✅ ' + successMsg);
  } catch (e) {
    setSaveStatus('error');
    showToast('❌ ' + e.message, 'error');
  }
}

// ════════════════════════════════════════════════════════════════════
//  HERO
// ════════════════════════════════════════════════════════════════════
async function loadHero() {
  try {
    const doc = await db.collection('config').doc('hero').get();
    if (doc.exists) {
      const d = doc.data();
      document.getElementById('heroTagline').value = d.tagline || '';
      document.getElementById('heroTitle').value   = d.title   || '';
      document.getElementById('heroDesc').value    = d.desc    || '';
    }
  } catch(e) {}
}
async function saveHero() {
  await saveSection('hero', {
    tagline: document.getElementById('heroTagline').value.trim(),
    title:   document.getElementById('heroTitle').value.trim(),
    desc:    document.getElementById('heroDesc').value.trim()
  }, 'config/hero', 'Hero section saved!');
}

// ════════════════════════════════════════════════════════════════════
//  STATS
// ════════════════════════════════════════════════════════════════════
async function loadStats() {
  try {
    const doc = await db.collection('config').doc('stats').get();
    if (doc.exists) {
      const d = doc.data();
      document.getElementById('statStudents').value = d.students || '';
      document.getElementById('statTeachers').value = d.teachers || '';
      document.getElementById('statSubjects').value = d.subjects || '';
      document.getElementById('statCenters').value  = d.centers  || '';
    }
  } catch(e) {}
}
async function saveStats() {
  await saveSection('stats', {
    students: parseInt(document.getElementById('statStudents').value) || 0,
    teachers: parseInt(document.getElementById('statTeachers').value) || 0,
    subjects: parseInt(document.getElementById('statSubjects').value) || 0,
    centers:  parseInt(document.getElementById('statCenters').value)  || 1
  }, 'config/stats', 'Statistics saved!');
}

// ════════════════════════════════════════════════════════════════════
//  CENTER
// ════════════════════════════════════════════════════════════════════
async function loadCenter() {
  try {
    const doc = await db.collection('config').doc('center').get();
    if (doc.exists) {
      const d = doc.data();
      document.getElementById('centerName').value    = d.name    || '';
      document.getElementById('centerDesc').value    = d.desc    || '';
      document.getElementById('centerAddress').value = d.address || '';
      document.getElementById('centerPhone').value   = d.phone   || '';
      document.getElementById('centerMapUrl').value  = d.mapUrl  || '';
    }
  } catch(e) {}
}
async function saveCenter() {
  await saveSection('center', {
    name:    document.getElementById('centerName').value.trim(),
    desc:    document.getElementById('centerDesc').value.trim(),
    address: document.getElementById('centerAddress').value.trim(),
    phone:   document.getElementById('centerPhone').value.trim(),
    mapUrl:  document.getElementById('centerMapUrl').value.trim()
  }, 'config/center', 'Center info saved!');
}

// ════════════════════════════════════════════════════════════════════
//  CONTACT
// ════════════════════════════════════════════════════════════════════
async function loadContact() {
  try {
    const doc = await db.collection('config').doc('contact').get();
    if (doc.exists) {
      const d = doc.data();
      document.getElementById('contactPhone').value   = d.phone   || '';
      document.getElementById('contactEmail').value   = d.email   || '';
      document.getElementById('contactAddress').value = d.address || '';
    }
  } catch(e) {}
}
async function saveContact() {
  await saveSection('contact', {
    phone:   document.getElementById('contactPhone').value.trim(),
    email:   document.getElementById('contactEmail').value.trim(),
    address: document.getElementById('contactAddress').value.trim()
  }, 'config/contact', 'Contact details saved!');
}

// ════════════════════════════════════════════════════════════════════
//  FOOTER
// ════════════════════════════════════════════════════════════════════
async function loadFooter() {
  try {
    const doc = await db.collection('config').doc('footer').get();
    if (doc.exists) document.getElementById('footerText').value = doc.data().text || '';
  } catch(e) {}
}
async function saveFooter() {
  await saveSection('footer', {
    text: document.getElementById('footerText').value.trim()
  }, 'config/footer', 'Footer saved!');
}

// ════════════════════════════════════════════════════════════════════
//  GRADES
// ════════════════════════════════════════════════════════════════════
let gradesData = [];
let _savingGrades = false, _gradesDirty = false, _gradesBound = false;

const scheduleGradesAutosave = debounce(async () => {
  if (_savingGrades) { _gradesDirty = true; return; }
  _savingGrades = true;
  setSaveStatus('saving', 'Saving grades…');
  try { await _commitGrades(); setSaveStatus('saved', 'Grades saved ✓'); }
  catch(e) { setSaveStatus('error'); }
  finally {
    _savingGrades = false;
    if (_gradesDirty) { _gradesDirty = false; scheduleGradesAutosave(); }
  }
});

function bindGradesAutosave() {
  if (_gradesBound) return; _gradesBound = true;
  const list = document.getElementById('gradesList');
  list?.addEventListener('input',  e => { if (e.target?.matches?.('[data-field]')) scheduleGradesAutosave(); });
  list?.addEventListener('change', e => { if (e.target?.matches?.('[data-field]')) scheduleGradesAutosave(); });
}

async function loadGrades() {
  try {
    const snap = await db.collection('grades').orderBy('order').get();
    gradesData = snap.empty ? [] : snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch(e) { gradesData = []; }
  renderGradeRows();
}
function renderGradeRows() {
  document.getElementById('gradesList').innerHTML = gradesData.map((g, i) => `
    <div class="grade-row" data-idx="${i}">
      <div class="form-group small"><label>Emoji</label><input type="text" data-field="emoji" value="${g.emoji||''}" /></div>
      <div class="form-group"><label>Name</label><input type="text" data-field="name" value="${g.name||''}" /></div>
      <div class="form-group"><label>Subtitle</label><input type="text" data-field="sub" value="${g.sub||''}" /></div>
      <div class="form-group small"><label>Count</label><input type="text" data-field="count" value="${g.count||''}" /></div>
      <div class="form-group"><label>Link URL</label><input type="text" data-field="url" value="${g.url||''}" /></div>
      <div class="form-group small"><label>Order</label><input type="number" data-field="order" value="${g.order||i+1}" /></div>
      <div class="remove-btn-wrap"><button class="btn-remove" onclick="removeGradeRow(${i})">✕</button></div>
    </div>`).join('');
  bindGradesAutosave();
}
function addGradeRow() {
  gradesData.push({ emoji:'', name:'', sub:'', count:'', url:'', order: gradesData.length+1 });
  renderGradeRows(); scheduleGradesAutosave();
}
function removeGradeRow(i) { gradesData.splice(i,1); renderGradeRows(); scheduleGradesAutosave(); }

async function _commitGrades() {
  const updated = [];
  document.querySelectorAll('.grade-row').forEach((row, i) => {
    const obj = { order: i+1 };
    row.querySelectorAll('[data-field]').forEach(inp => {
      obj[inp.dataset.field] = inp.dataset.field === 'order' ? parseInt(inp.value)||i+1 : inp.value.trim();
    });
    updated.push(obj);
  });
  const batch = db.batch();
  (await db.collection('grades').get()).docs.forEach(d => batch.delete(d.ref));
  updated.forEach((g,i) => batch.set(db.collection('grades').doc(`grade_${i+1}`), g));
  await batch.commit();
  rtdbSet('grades', updated);
  gradesData = updated;
}
async function saveGrades() {
  setSaveStatus('saving');
  try { await _commitGrades(); setSaveStatus('saved'); showToast('✅ Grades saved!'); }
  catch(e) { setSaveStatus('error'); showToast('❌ '+e.message,'error'); }
}

// ════════════════════════════════════════════════════════════════════
//  SUBJECTS
// ════════════════════════════════════════════════════════════════════
let subjectsData = [];
let _savingSubjects = false, _subjectsDirty = false, _subjectsBound = false;

const scheduleSubjectsAutosave = debounce(async () => {
  if (_savingSubjects) { _subjectsDirty = true; return; }
  _savingSubjects = true;
  setSaveStatus('saving', 'Saving subjects…');
  try { await _commitSubjects(); setSaveStatus('saved', 'Subjects saved ✓'); }
  catch(e) { setSaveStatus('error'); }
  finally {
    _savingSubjects = false;
    if (_subjectsDirty) { _subjectsDirty = false; scheduleSubjectsAutosave(); }
  }
});

function bindSubjectsAutosave() {
  if (_subjectsBound) return; _subjectsBound = true;
  const list = document.getElementById('subjectsList');
  list?.addEventListener('input',  e => { if (e.target?.matches?.('[data-field]')) scheduleSubjectsAutosave(); });
  list?.addEventListener('change', e => { if (e.target?.matches?.('[data-field]')) scheduleSubjectsAutosave(); });
}

async function loadSubjects() {
  try {
    const snap = await db.collection('subjects').orderBy('name').get();
    subjectsData = snap.empty ? [] : snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch(e) { subjectsData = []; }
  renderSubjectRows();
}
function renderSubjectRows() {
  document.getElementById('subjectsList').innerHTML = subjectsData.map((s, i) => `
    <div class="subject-row" data-idx="${i}">
      <div class="form-group small"><label>Icon</label><input type="text" data-field="icon" value="${s.icon||''}" /></div>
      <div class="form-group"><label>Subject Name</label><input type="text" data-field="name" value="${s.name||''}" /></div>
      <div class="form-group"><label>Tag / Level</label><input type="text" data-field="tag" value="${s.tag||''}" /></div>
      <div class="remove-btn-wrap"><button class="btn-remove" onclick="removeSubjectRow(${i})">✕</button></div>
    </div>`).join('');
  bindSubjectsAutosave();
}
function addSubjectRow() {
  subjectsData.push({ icon:'', name:'', tag:'' });
  renderSubjectRows(); scheduleSubjectsAutosave();
}
function removeSubjectRow(i) { subjectsData.splice(i,1); renderSubjectRows(); scheduleSubjectsAutosave(); }

async function _commitSubjects() {
  const updated = [];
  document.querySelectorAll('.subject-row').forEach(row => {
    const obj = {};
    row.querySelectorAll('[data-field]').forEach(inp => { obj[inp.dataset.field] = inp.value.trim(); });
    if (obj.name) updated.push(obj);
  });
  const batch = db.batch();
  (await db.collection('subjects').get()).docs.forEach(d => batch.delete(d.ref));
  updated.forEach((s,i) => batch.set(db.collection('subjects').doc(`subject_${i}`), s));
  await batch.commit();
  rtdbSet('subjects', updated);
  subjectsData = updated;
}
async function saveSubjects() {
  setSaveStatus('saving');
  try { await _commitSubjects(); setSaveStatus('saved'); showToast('✅ Subjects saved!'); }
  catch(e) { setSaveStatus('error'); showToast('❌ '+e.message,'error'); }
}

// ════════════════════════════════════════════════════════════════════
//  TEACHERS
// ════════════════════════════════════════════════════════════════════
let teachersData = [];

async function loadTeachers() {
  try {
    const snap = await db.collection('teachers').orderBy('order').get();
    teachersData = snap.empty ? [] : snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch(e) { teachersData = []; }
  renderTeacherRows();
}
function renderTeacherRows() {
  const list = document.getElementById('teachersList');
  if (!list) return;
  if (!teachersData.length) {
    list.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:24px 0;">No teachers yet. Click ＋ Add Teacher.</p>';
    return;
  }
  list.innerHTML = teachersData.map((t, i) => `
    <div class="teacher-row" data-idx="${i}">
      <div class="teacher-fields">
        <div class="form-row-2">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" value="${t.name||''}" placeholder="e.g. Mr. Perera"
                   oninput="teachersData[${i}].name=this.value" />
          </div>
          <div class="form-group">
            <label>Subject(s)</label>
            <input type="text" value="${t.subject||''}" placeholder="e.g. Mathematics, Physics"
                   oninput="teachersData[${i}].subject=this.value" />
          </div>
        </div>
        <div class="form-row-2">
          <div class="form-group">
            <label>Qualification</label>
            <input type="text" value="${t.qualification||''}" placeholder="e.g. BSc (Hons), MSc"
                   oninput="teachersData[${i}].qualification=this.value" />
          </div>
          <div class="form-group">
            <label>Experience</label>
            <input type="text" value="${t.experience||''}" placeholder="e.g. 10+ Years"
                   oninput="teachersData[${i}].experience=this.value" />
          </div>
        </div>
        <div class="form-group">
          <label>Bio (optional)</label>
          <input type="text" value="${t.bio||''}" placeholder="Short description…"
                 oninput="teachersData[${i}].bio=this.value" />
        </div>
      </div>
      <button class="btn-remove teacher-remove" onclick="removeTeacher(${i})">✕</button>
    </div>`).join('');
}
function addTeacher() {
  teachersData.push({ name:'', subject:'', qualification:'', experience:'', bio:'', order: teachersData.length+1 });
  renderTeacherRows();
}
function removeTeacher(i) { teachersData.splice(i,1); renderTeacherRows(); }

async function saveTeachers() {
  const updated = teachersData.map((t, i) => ({ ...t, order: i+1 }));
  setSaveStatus('saving');
  try {
    const batch = db.batch();
    (await db.collection('teachers').get()).docs.forEach(d => batch.delete(d.ref));
    updated.forEach((t,i) => batch.set(db.collection('teachers').doc(`teacher_${i+1}`), t));
    await batch.commit();
    rtdbSet('teachers', updated);
    teachersData = updated;
    setSaveStatus('saved'); showToast('✅ Teachers saved!');
  } catch(e) { setSaveStatus('error'); showToast('❌ '+e.message,'error'); }
}