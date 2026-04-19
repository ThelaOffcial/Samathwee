/* ═══════════════════════════════════════════════════════════
   TIMETABLE ADDON — Samathwee Admin Panel
   Drop this file alongside admin.js and include it in admin.html
═══════════════════════════════════════════════════════════ */

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const GRADE_LABELS = {
  'grade1':'🌟 Grade 1','grade2':'🌟 Grade 2','grade3':'🌟 Grade 3',
  'grade4':'🌟 Grade 4','grade5':'🌟 Grade 5',
  'grade6':'📘 Grade 6','grade7':'📘 Grade 7','grade8':'📘 Grade 8',
  'grade9':'📘 Grade 9','grade10':'📘 Grade 10','grade11_ol':'📘 Grade 11 (O/L)',
  'al_science':'🔬 A/L — Science','al_commerce':'📊 A/L — Commerce','al_arts':'🎨 A/L — Arts',
  'cambridge_primary':'🏛️ Cambridge Primary','cambridge_igcse':'🏛️ Cambridge IGCSE','cambridge_al':'🏛️ Cambridge A-Level',
  'london_igcse':'🇬🇧 London IGCSE','london_al':'🇬🇧 London A-Level',
  // backwards compat
  'grade1_5':'🌟 Grade 1–5','grade6_ol':'📘 Grade 6–O/L','grade_al':'🔬 A / Levels',
  'grade_cambridge':'🏛️ Cambridge','grade_london':'🇬🇧 London',
};

const GRADE_COLORS = {
  'grade1':'#ff6b6b','grade2':'#ff8c42','grade3':'#ffd93d','grade4':'#6bcb77','grade5':'#4d96ff',
  'grade6':'#8b5cf6','grade7':'#a855f7','grade8':'#7c3aed','grade9':'#6d28d9','grade10':'#5b21b6','grade11_ol':'#8b5cf6',
  'al_science':'#38bdf8','al_commerce':'#22c55e','al_arts':'#f59e0b',
  'cambridge_primary':'#0073cc','cambridge_igcse':'#005da8','cambridge_al':'#c47d00',
  'london_igcse':'#b22222','london_al':'#8b1a1a',
  'grade1_5':'#ff6b6b','grade6_ol':'#8b5cf6','grade_al':'#38bdf8','grade_cambridge':'#f59e0b','grade_london':'#34d399',
};

let timetableSlots = [];  // { teacherName, day, startTime, endTime, grade, subject }

/* ──────────────────────────────────────────
   LOAD & SAVE
────────────────────────────────────────── */

async function loadTimetable() {
  try {
    const data = await rtdbRead('timetable/slots');
    if (data) {
      timetableSlots = Array.isArray(data)
        ? data.filter(Boolean)
        : Object.values(data).filter(Boolean);
    } else {
      timetableSlots = [];
    }
  } catch (e) {
    console.warn('loadTimetable:', e);
    timetableSlots = [];
  }
  renderSlotsList();
  populateTTFilters();
}

async function saveTimetable() {
  if (!timetableSlots.length) {
    showToast('⚠️ No slots to save.', 'error');
    return;
  }
  await saveData('timetable/slots', timetableSlots, 'Timetable saved!');
}

/* ──────────────────────────────────────────
   POPULATE DROPDOWNS
────────────────────────────────────────── */

function populateSlotTeacherDropdown() {
  const sel = document.getElementById('slotTeacher');
  if (!sel) return;
  const prev = sel.value;
  sel.innerHTML = '<option value="">— Select Teacher —</option>';
  const names = [...new Set(teachersData.map(t => t.name).filter(Boolean))].sort();
  names.forEach(name => {
    const opt = document.createElement('option');
    opt.value = opt.textContent = name;
    sel.appendChild(opt);
  });
  if (prev) sel.value = prev;
}

function populateTTFilters() {
  // Teacher filter
  const tSel = document.getElementById('ttFilterTeacher');
  if (tSel) {
    const prev = tSel.value;
    tSel.innerHTML = '<option value="">— All Teachers —</option>';
    const names = [...new Set(timetableSlots.map(s => s.teacherName).filter(Boolean))].sort();
    names.forEach(n => {
      const opt = document.createElement('option');
      opt.value = opt.textContent = n;
      tSel.appendChild(opt);
    });
    if (prev) tSel.value = prev;
  }

  // Grade filter
  const gSel = document.getElementById('ttFilterGrade');
  if (gSel) {
    const prev = gSel.value;
    gSel.innerHTML = '<option value="">— All Grades —</option>';
    const grades = [...new Set(timetableSlots.map(s => s.grade).filter(Boolean))];
    grades.forEach(g => {
      const opt = document.createElement('option');
      opt.value = g;
      opt.textContent = GRADE_LABELS[g] || g;
      gSel.appendChild(opt);
    });
    if (prev) gSel.value = prev;
  }
}

/* ──────────────────────────────────────────
   ADD / REMOVE SLOT
────────────────────────────────────────── */

function addSlot() {
  const teacher = document.getElementById('slotTeacher').value.trim();
  const day     = document.getElementById('slotDay').value;
  const start   = document.getElementById('slotStart').value;
  const end     = document.getElementById('slotEnd').value;
  const grade   = document.getElementById('slotGrade').value;
  const subject = document.getElementById('slotSubject').value.trim();

  if (!teacher || !day || !start || !end || !grade || !subject) {
    showToast('❌ Please fill in all slot fields.', 'error');
    return;
  }
  if (start >= end) {
    showToast('❌ End time must be after start time.', 'error');
    return;
  }

  // Conflict check — same teacher, same day, overlapping time
  const conflict = timetableSlots.find(s =>
    s.teacherName === teacher &&
    s.day === day &&
    !(end <= s.startTime || start >= s.endTime)
  );
  if (conflict) {
    showToast(`❌ Conflict! ${teacher} already has "${conflict.subject}" at that time on ${day}.`, 'error');
    return;
  }

  timetableSlots.push({ teacherName: teacher, day, startTime: start, endTime: end, grade, subject });
  renderSlotsList();
  populateTTFilters();
  document.getElementById('slotSubject').value = '';
  showToast('✅ Slot added — click Save Timetable to persist.');
}

function removeSlot(i) {
  timetableSlots.splice(i, 1);
  renderSlotsList();
  populateTTFilters();
}

/* ──────────────────────────────────────────
   RENDER SLOTS LIST (raw entry view)
────────────────────────────────────────── */

function renderSlotsList() {
  const list = document.getElementById('slotsList');
  if (!list) return;

  if (!timetableSlots.length) {
    list.innerHTML = '<p class="empty-msg">No time slots yet. Use the form above to add slots.</p>';
    return;
  }

  // Group by teacher
  const byTeacher = {};
  timetableSlots.forEach((s, i) => {
    if (!byTeacher[s.teacherName]) byTeacher[s.teacherName] = [];
    byTeacher[s.teacherName].push({ ...s, _idx: i });
  });

  list.innerHTML = Object.entries(byTeacher).map(([teacher, slots]) => {
    // Sort slots by day index then time
    slots.sort((a, b) => {
      const di = DAYS.indexOf(a.day) - DAYS.indexOf(b.day);
      return di !== 0 ? di : a.startTime.localeCompare(b.startTime);
    });
    return `
      <div class="tt-teacher-group">
        <div class="tt-group-header">
          <span class="tt-group-avatar">${escHtml(teacher.charAt(0))}</span>
          <span>${escHtml(teacher)}</span>
          <span class="tt-slot-count">${slots.length} slot${slots.length !== 1 ? 's' : ''}</span>
        </div>
        <div class="tt-slots-list">
          ${slots.map(s => `
            <div class="tt-slot-row">
              <span class="tt-day-badge" style="background:${GRADE_COLORS[s.grade]}22;color:${GRADE_COLORS[s.grade]};border-color:${GRADE_COLORS[s.grade]}44">
                ${escHtml(s.day.slice(0,3))}
              </span>
              <span class="tt-time-range">
                <span class="tt-time-icon">🕐</span>
                ${formatTime(s.startTime)} – ${formatTime(s.endTime)}
              </span>
              <span class="tt-grade-pill" style="background:${GRADE_COLORS[s.grade]}18;color:${GRADE_COLORS[s.grade]};">
                ${escHtml(GRADE_LABELS[s.grade] || s.grade)}
              </span>
              <span class="tt-subject-name">📖 ${escHtml(s.subject)}</span>
              <button class="btn-remove tt-slot-remove" onclick="removeSlot(${s._idx})">✕</button>
            </div>
          `).join('')}
        </div>
      </div>`;
  }).join('');
}

/* ──────────────────────────────────────────
   VIEW SWITCHER
────────────────────────────────────────── */

function switchTTView(view, btnEl) {
  document.querySelectorAll('.tt-view-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tt-view-panel').forEach(p => p.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  const panel = document.getElementById(`tt-panel-${view}`);
  if (panel) panel.classList.add('active');
  // Auto-generate on switch
  if (view === 'teacher') generateTeacherTimetable();
  if (view === 'grade')   generateGradeTimetable();
}

/* ──────────────────────────────────────────
   GENERATE TEACHER-WISE TIMETABLE
────────────────────────────────────────── */

function generateTeacherTimetable() {
  const filterTeacher = document.getElementById('ttFilterTeacher')?.value || '';
  const container     = document.getElementById('tt-teacher-grid');
  if (!container) return;

  const slots = filterTeacher
    ? timetableSlots.filter(s => s.teacherName === filterTeacher)
    : timetableSlots;

  if (!slots.length) {
    container.innerHTML = '<p class="empty-msg">No slots found. Add slots or change the filter.</p>';
    return;
  }

  if (filterTeacher) {
    // Single teacher — one grid
    const activeDays = DAYS.filter(d => slots.some(s => s.day === d));
    container.innerHTML = `
      <div class="tt-section-label">
        <div class="tt-section-avatar">${escHtml(filterTeacher.charAt(0))}</div>
        <span>${escHtml(filterTeacher)}</span>
      </div>
      ${renderGrid(slots, activeDays, 'teacher')}`;
  } else {
    // All teachers — one grid per teacher
    const teachers = [...new Set(slots.map(s => s.teacherName))].sort();
    container.innerHTML = teachers.map(teacher => {
      const ts = slots.filter(s => s.teacherName === teacher);
      const activeDays = DAYS.filter(d => ts.some(s => s.day === d));
      return `
        <div class="tt-section-label">
          <div class="tt-section-avatar">${escHtml(teacher.charAt(0))}</div>
          <span>${escHtml(teacher)}</span>
        </div>
        ${renderGrid(ts, activeDays, 'teacher')}
        <div style="margin-bottom:28px;"></div>`;
    }).join('');
  }
}

/* ──────────────────────────────────────────
   GENERATE GRADE-WISE TIMETABLE
────────────────────────────────────────── */

function generateGradeTimetable() {
  const filterGrade = document.getElementById('ttFilterGrade')?.value || '';
  const container   = document.getElementById('tt-grade-grid');
  if (!container) return;

  const slots = filterGrade
    ? timetableSlots.filter(s => s.grade === filterGrade)
    : timetableSlots;

  if (!slots.length) {
    container.innerHTML = '<p class="empty-msg">No slots found. Add slots or change the filter.</p>';
    return;
  }

  if (filterGrade) {
    const activeDays = DAYS.filter(d => slots.some(s => s.day === d));
    const color = GRADE_COLORS[filterGrade] || '#94a3b8';
    container.innerHTML = `
      <div class="tt-section-label" style="color:${color}">
        <div class="tt-section-avatar" style="background:${color}22;border-color:${color}44;color:${color}">${(GRADE_LABELS[filterGrade] || filterGrade).slice(0,2)}</div>
        <span>${escHtml(GRADE_LABELS[filterGrade] || filterGrade)}</span>
      </div>
      ${renderGrid(slots, activeDays, 'grade')}`;
  } else {
    const grades = Object.keys(GRADE_LABELS).filter(g => slots.some(s => s.grade === g));
    container.innerHTML = grades.map(grade => {
      const gs = slots.filter(s => s.grade === grade);
      const activeDays = DAYS.filter(d => gs.some(s => s.day === d));
      const color = GRADE_COLORS[grade] || '#94a3b8';
      return `
        <div class="tt-section-label" style="color:${color}">
          <div class="tt-section-avatar" style="background:${color}22;border-color:${color}44;color:${color}">${(GRADE_LABELS[grade] || grade).slice(0,2)}</div>
          <span>${escHtml(GRADE_LABELS[grade] || grade)}</span>
        </div>
        ${renderGrid(gs, activeDays, 'grade')}
        <div style="margin-bottom:28px;"></div>`;
    }).join('');
  }
}

/* ──────────────────────────────────────────
   RENDER GRID TABLE
────────────────────────────────────────── */

function renderGrid(slots, days, mode) {
  if (!slots.length || !days.length) {
    return '<p class="empty-msg">No data available.</p>';
  }

  // Unique, sorted time ranges
  const timeKeys = [...new Set(slots.map(s => `${s.startTime}|${s.endTime}`))].sort();

  const headerCells = days.map(d =>
    `<th class="tt-th">${d.slice(0,3)}<span class="tt-th-full">${d.slice(3)}</span></th>`
  ).join('');

  const rows = timeKeys.map(tk => {
    const [startTime, endTime] = tk.split('|');
    const rowSlots = slots.filter(s => s.startTime === startTime && s.endTime === endTime);

    const cells = days.map(day => {
      const cell = rowSlots.find(s => s.day === day);
      if (!cell) return `<td class="tt-td"><div class="tt-cell-empty">—</div></td>`;

      const color = GRADE_COLORS[cell.grade] || '#94a3b8';
      const label = mode === 'teacher'
        ? `<div class="tt-cell-grade" style="color:${color}">${escHtml(GRADE_LABELS[cell.grade] || cell.grade)}</div>`
        : `<div class="tt-cell-teacher">👨‍🏫 ${escHtml(cell.teacherName)}</div>`;

      return `<td class="tt-td">
        <div class="tt-cell-content" style="border-left-color:${color}">
          ${label}
          <div class="tt-cell-subject">📖 ${escHtml(cell.subject)}</div>
        </div>
      </td>`;
    }).join('');

    return `<tr>
      <td class="tt-time-td">
        <span class="tt-start">${formatTime(startTime)}</span>
        <span class="tt-arrow">↓</span>
        <span class="tt-end">${formatTime(endTime)}</span>
      </td>
      ${cells}
    </tr>`;
  }).join('');

  return `
    <div class="tt-table-wrap">
      <table class="tt-table">
        <thead><tr>
          <th class="tt-time-th">Time</th>
          ${headerCells}
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

/* ──────────────────────────────────────────
   PRINT TIMETABLE
────────────────────────────────────────── */

function printTimetable(panelId) {
  const content = document.getElementById(panelId)?.innerHTML || '';
  const win = window.open('', '_blank');
  win.document.write(`
    <!DOCTYPE html><html><head>
    <title>Samathwee — Timetable</title>
    <style>
      body { font-family: 'Segoe UI', sans-serif; background: #fff; color: #1f2937; padding: 24px; }
      table { width: 100%; border-collapse: collapse; margin-top: 16px; }
      th, td { border: 1px solid #e5e7eb; padding: 10px 12px; text-align: left; font-size: 13px; }
      th { background: #f9fafb; font-weight: 700; }
      .tt-cell-content { padding: 4px 0; border-left: 3px solid #38bdf8; padding-left: 8px; }
      .tt-cell-empty { color: #9ca3af; text-align: center; }
      .tt-cell-teacher, .tt-cell-grade { font-weight: 600; font-size: 12px; }
      .tt-cell-subject { font-size: 12px; color: #374151; margin-top: 2px; }
      .tt-start { font-weight: 700; } .tt-end { color: #6b7280; font-size: 11px; }
      .tt-arrow { display: block; color: #d1d5db; font-size: 10px; line-height: 1; }
      .tt-section-label { font-size: 16px; font-weight: 700; margin: 24px 0 12px; color: #111; }
      .tt-section-avatar { display: inline-block; margin-right: 8px; }
      .tt-th-full { font-size: 11px; font-weight: 400; }
      h1 { font-size: 20px; color: #0c1120; margin-bottom: 4px; }
      .print-meta { color: #6b7280; font-size: 12px; margin-bottom: 24px; }
      @media print { body { padding: 0; } }
    </style>
    </head><body>
    <h1>📅 Samathwee — Timetable</h1>
    <p class="print-meta">Generated: ${new Date().toLocaleDateString('en-LK', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</p>
    ${content}
    <script>window.onload=()=>window.print()<\/script>
    </body></html>`);
  win.document.close();
}

/* ──────────────────────────────────────────
   HELPER
────────────────────────────────────────── */

function formatTime(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12  = h % 12 || 12;
  return `${h12}:${String(m).padStart(2,'0')} ${ampm}`;
}