/* ===========================================================
   STATE
   =========================================================== */
const state = {
  view: 'overview',
  selectedMajor: 'MAT',
  plannerMajor: 'MAT',
  numYears: 4,
  includeSummer: false,
  search: '',
  filter: 'all',
  plan: {},
  currentPlanName: 'Untitled Plan'
};

const STORAGE_KEY = 'polyu-ama-planner-v1';
const AUTOSAVE_KEY = 'polyu-ama-planner-autosave';

/* ===========================================================
   UTILITIES
   =========================================================== */

function getCourse(code) {
  return COURSES[code] || null;
}

function semLabel(key) {
  const m = key.match(/Y(\d+)(S\d|SS)/);
  if (!m) return key;
  const y = m[1], s = m[2];
  if (s === 'S1') return `Year ${y} · Semester 1`;
  if (s === 'S2') return `Year ${y} · Semester 2`;
  if (s === 'SS') return `Year ${y} · Summer Term`;
  return key;
}

function semSortKey(key) {
  const m = key.match(/Y(\d+)(S\d|SS)/);
  if (!m) return 999;
  const y = parseInt(m[1]);
  const s = m[2] === 'S1' ? 1 : m[2] === 'SS' ? 2 : 3;
  return y * 10 + s;
}

function getAllPlacedBefore(targetKey) {
  const allKeys = Object.keys(state.plan).sort((a,b) => semSortKey(a) - semSortKey(b));
  const targetSort = semSortKey(targetKey);
  const placed = new Set();
  for (const k of allKeys) {
    if (semSortKey(k) >= targetSort) break;
    state.plan[k].forEach(c => placed.add(c));
  }
  return placed;
}

function getAllPlaced() {
  const placed = new Set();
  Object.values(state.plan).forEach(arr => arr.forEach(c => placed.add(c)));
  return placed;
}

function checkPrereq(code, targetSemKey) {
  const course = getCourse(code);
  if (!course || !course.p || course.p.length === 0) return { ok: true };
  const before = getAllPlacedBefore(targetSemKey);
  const sameSem = state.plan[targetSemKey] || [];
  const missing = course.p.filter(p => !before.has(p) && !sameSem.includes(p));
  return { ok: missing.length === 0, missing };
}

function checkExclusion(code) {
  const course = getCourse(code);
  if (!course || !course.ex) return { ok: true };
  const placed = getAllPlaced();
  const conflict = course.ex.filter(e => placed.has(e));
  return { ok: conflict.length === 0, conflict };
}

function toast(msg, type='info') {
  const colors = { info:'bg-blue-600', success:'bg-emerald-600', warn:'bg-amber-600', error:'bg-red-600' };
  const el = document.createElement('div');
  el.className = `toast text-white ${colors[type]}`;
  el.textContent = msg;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(() => el.remove(), 2800);
}

/* ===========================================================
   LOCAL STORAGE
   =========================================================== */

function getSavedPlans() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch(e) {
    return {};
  }
}

function savePlan(name) {
  if (!name || !name.trim()) { toast('Please enter a plan name', 'warn'); return; }
  try {
    const all = getSavedPlans();
    all[name] = {
      major: state.plannerMajor,
      numYears: state.numYears,
      includeSummer: state.includeSummer,
      plan: state.plan,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    state.currentPlanName = name;
    toast(`💾 Plan "${name}" saved`, 'success');
    if (state.view === 'saved') render();
  } catch(e) {
    toast('⚠️ Could not save — storage unavailable', 'error');
  }
}

function loadPlan(name) {
  const all = getSavedPlans();
  if (!all[name]) { toast('Plan not found', 'error'); return; }
  const p = all[name];
  state.plannerMajor = p.major;
  state.numYears = p.numYears;
  state.includeSummer = p.includeSummer;
  state.plan = p.plan;
  state.currentPlanName = name;
  state.view = 'planner';
  document.querySelectorAll('[id^="tab-"]').forEach(t => t.classList.remove('tab-active'));
  document.getElementById('tab-planner').classList.add('tab-active');
  render();
  toast(`📂 Loaded "${name}"`, 'success');
}

function deletePlan(name) {
  if (!confirm(`Delete plan "${name}"?`)) return;
  const all = getSavedPlans();
  delete all[name];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  toast(`🗑️ Deleted "${name}"`, 'info');
  render();
}

function autoSave() {
  try {
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify({
      major: state.plannerMajor,
      numYears: state.numYears,
      includeSummer: state.includeSummer,
      plan: state.plan
    }));
  } catch(e) {}
}

function loadAutoSave() {
  try {
    const raw = localStorage.getItem(AUTOSAVE_KEY);
    if (!raw) return false;
    const p = JSON.parse(raw);
    state.plannerMajor = p.major || 'MAT';
    state.numYears = p.numYears || 4;
    state.includeSummer = p.includeSummer || false;
    state.plan = p.plan || {};
    return true;
  } catch(e) { return false; }
}

function exportJSON() {
  const data = {
    name: state.currentPlanName,
    major: state.plannerMajor,
    numYears: state.numYears,
    includeSummer: state.includeSummer,
    plan: state.plan,
    exportedAt: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type:'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `study-plan-${state.plannerMajor}-${Date.now()}.json`;
  a.click();
  toast('📥 JSON exported', 'success');
}

function importJSON() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';
  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const p = JSON.parse(ev.target.result);
        state.plannerMajor = p.major;
        state.numYears = p.numYears;
        state.includeSummer = p.includeSummer;
        state.plan = p.plan;
        state.currentPlanName = p.name || 'Imported Plan';
        render();
        toast('📤 Plan imported successfully', 'success');
      } catch(err) {
        toast('⚠️ Invalid JSON file', 'error');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

/* ===========================================================
   PRINT / PDF
   =========================================================== */

function printPlan() {
  const dateEl = document.getElementById('print-date');
  const prog = PROGRAMMES[state.plannerMajor];
  dateEl.textContent = `${prog.name} · Plan: "${state.currentPlanName}" · Printed on ${new Date().toLocaleDateString('en-GB', {year:'numeric', month:'long', day:'numeric'})}`;
  // Ensure planner view is showing
  if (state.view !== 'planner') {
    state.view = 'planner';
    render();
    setTimeout(() => window.print(), 250);
  } else {
    setTimeout(() => window.print(), 100);
  }
}

/* ===========================================================
   VIEW SWITCHER
   =========================================================== */

function switchView(view) {
  state.view = view;
  document.querySelectorAll('[id^="tab-"]').forEach(t => t.classList.remove('tab-active'));
  document.getElementById('tab-' + view).classList.add('tab-active');
  render();
}

function render() {
  const el = document.getElementById('content');
  if (state.view === 'overview') el.innerHTML = renderOverview();
  else if (state.view === 'planner') { el.innerHTML = renderPlanner(); setupDnD(); autoSave(); }
  else if (state.view === 'library') el.innerHTML = renderLibrary();
  else if (state.view === 'saved') el.innerHTML = renderSaved();
}

/* ===========================================================
   OVERVIEW VIEW
   =========================================================== */

function renderOverview() {
  const major = state.selectedMajor;
  const prog = PROGRAMMES[major];
  let html = `
    <div class="bg-white rounded-xl shadow-sm p-5 mb-5 no-print">
      <h2 class="text-2xl font-bold text-slate-800 mb-2">Programme Overview</h2>
      <p class="text-slate-600 text-sm mb-4">Standard study patterns. Click a major to view its suggested curriculum.</p>
      <div class="flex flex-wrap gap-2">
        ${Object.keys(PROGRAMMES).map(k => `
          <button onclick="state.selectedMajor='${k}';render()" 
            class="px-3 py-2 rounded-lg font-medium text-xs md:text-sm transition ${major===k?'bg-red-700 text-white shadow':'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
            ${PROGRAMMES[k].fullName}
          </button>
        `).join('')}
      </div>
    </div>
    
    <div class="bg-gradient-to-r from-${prog.accent}-50 to-${prog.accent}-100 border-l-4 border-${prog.accent}-600 p-4 rounded-r mb-5">
      <div class="flex justify-between flex-wrap gap-2 items-start">
        <div class="flex-1">
          <h3 class="text-xl font-bold text-${prog.accent}-900">${prog.name}</h3>
          <p class="text-xs text-${prog.accent}-700 mb-2">Programme Code: ${prog.code}</p>
          <p class="text-sm text-slate-700">${prog.description}</p>
        </div>
        <div class="text-right text-xs">
          <p class="font-semibold text-slate-700">Total Credits</p>
          <p class="text-2xl font-bold text-${prog.accent}-700">${prog.targetCredits.total}</p>
          <p class="text-slate-500">+ 2 training credits</p>
        </div>
      </div>
      <div class="mt-3 grid grid-cols-${prog.targetCredits.secondary ? 4 : 3} gap-2 text-xs">
        <div class="bg-white rounded p-2 text-center"><div class="font-bold text-${prog.accent}-700 text-lg">${prog.targetCredits.major}</div><div>Major</div></div>
        <div class="bg-white rounded p-2 text-center"><div class="font-bold text-${prog.accent}-700 text-lg">${prog.targetCredits.gur}</div><div>GUR</div></div>
        ${prog.targetCredits.secondary ? `<div class="bg-white rounded p-2 text-center"><div class="font-bold text-${prog.accent}-700 text-lg">${prog.targetCredits.secondary}</div><div>AIDA Sec.</div></div>` : ''}
        <div class="bg-white rounded p-2 text-center"><div class="font-bold text-${prog.accent}-700 text-lg">${prog.targetCredits.free}</div><div>Free</div></div>
      </div>
    </div>
  `;

  const years = new Set();
  Object.keys(prog.overview).forEach(k => { const m = k.match(/Y(\d+)/); if (m) years.add(parseInt(m[1])); });
  Array.from(years).sort().forEach(y => html += renderYearTable(y, prog));
  html += renderLegend();
  return html;
}

function renderYearTable(y, prog) {
  const s1 = prog.overview[`Y${y}S1`] || [];
  const s2 = prog.overview[`Y${y}S2`] || [];
  const ss = prog.overview[`Y${y}SS`] || [];
  const c1 = s1.reduce((s,c) => s + (getCourse(c)?.c || 0), 0);
  const c2 = s2.reduce((s,c) => s + (getCourse(c)?.c || 0), 0);
  const cs = ss.reduce((s,c) => s + (getCourse(c)?.c || 0), 0);

  return `
    <div class="bg-white rounded-xl shadow-sm overflow-hidden mb-4 print-break-avoid">
      <div class="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-4 py-3 flex justify-between items-center">
        <h3 class="text-lg font-bold">Year ${y}</h3>
        <span class="text-sm bg-white/10 px-3 py-1 rounded-full">${c1 + c2 + cs} credits this year</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-${ss.length ? 3 : 2}">
        <div class="border-r border-slate-200">
          <div class="bg-slate-100 px-4 py-2 flex justify-between border-b">
            <span class="font-semibold text-slate-700">📘 Semester 1</span>
            <span class="text-sm font-bold text-red-700">${c1} credits</span>
          </div>
          <div class="p-3 space-y-2">${s1.map(c => courseCardHTML(c)).join('') || '<p class="text-slate-400 text-sm italic">—</p>'}</div>
        </div>
        <div class="${ss.length ? 'border-r border-slate-200' : ''}">
          <div class="bg-slate-100 px-4 py-2 flex justify-between border-b">
            <span class="font-semibold text-slate-700">📗 Semester 2</span>
            <span class="text-sm font-bold text-red-700">${c2} credits</span>
          </div>
          <div class="p-3 space-y-2">${s2.map(c => courseCardHTML(c)).join('') || '<p class="text-slate-400 text-sm italic">—</p>'}</div>
        </div>
        ${ss.length ? `
        <div>
          <div class="bg-slate-100 px-4 py-2 flex justify-between border-b">
            <span class="font-semibold text-slate-700">☀️ Summer</span>
            <span class="text-sm font-bold text-red-700">${cs} credits</span>
          </div>
          <div class="p-3 space-y-2">${ss.map(c => courseCardHTML(c)).join('') || '<p class="text-slate-400 text-sm italic">—</p>'}</div>
        </div>` : ''}
      </div>
    </div>
  `;
}

function courseCardHTML(code) {
  const course = getCourse(code);
  if (!course) return `<div class="text-xs text-slate-400 bg-slate-50 p-2 rounded">${code} (data not found)</div>`;
  const c = CAT[course.cat] || { cls: 'bg-slate-50 text-slate-700 border-slate-200', label: course.cat };
  return `
    <div class="p-2 rounded border-l-4 ${c.cls} flex justify-between items-start gap-2">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="font-mono text-xs font-bold">${code.replace('_E','')}</span>
          <span class="badge ${c.cls}">${c.label}</span>
        </div>
        <p class="text-sm mt-0.5 leading-tight">${course.n}</p>
      </div>
      <div class="font-bold text-sm whitespace-nowrap text-slate-700">${course.c}c</div>
    </div>
  `;
}

function renderLegend() {
  return `
    <div class="bg-white rounded-xl shadow-sm p-4 mt-5 no-print">
      <h3 class="font-bold text-slate-800 mb-3">🎨 Colour Legend</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
        ${Object.entries(CAT).map(([k,v]) => `<div class="border-l-4 ${v.cls} p-2 rounded">${v.label}</div>`).join('')}
      </div>
    </div>
  `;
}

/* ===========================================================
   PLANNER VIEW
   =========================================================== */

function initPlan() {
  state.plan = {};
  for (let y = 1; y <= state.numYears; y++) {
    state.plan[`Y${y}S1`] = [];
    state.plan[`Y${y}S2`] = [];
    if (state.includeSummer) state.plan[`Y${y}SS`] = [];
  }
}

function renderPlanner() {
  if (Object.keys(state.plan).length === 0) initPlan();
  for (let y = 1; y <= state.numYears; y++) {
    if (!state.plan[`Y${y}S1`]) state.plan[`Y${y}S1`] = [];
    if (!state.plan[`Y${y}S2`]) state.plan[`Y${y}S2`] = [];
    if (state.includeSummer && !state.plan[`Y${y}SS`]) state.plan[`Y${y}SS`] = [];
  }

  return `
    <div class="bg-white rounded-xl shadow-sm p-4 mb-4 no-print">
      <div class="flex justify-between items-center mb-3 flex-wrap gap-2">
        <h2 class="text-xl font-bold text-slate-800">🎯 Custom Study Planner</h2>
        <div class="text-sm text-slate-600">Current plan: <span class="font-semibold">${state.currentPlanName}</span></div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3 items-end mb-3">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Major</label>
          <select onchange="state.plannerMajor=this.value;render()" class="w-full p-2 border rounded text-sm">
            ${Object.keys(PROGRAMMES).map(k => `<option value="${k}" ${state.plannerMajor===k?'selected':''}>${PROGRAMMES[k].fullName}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Number of Years (3–8)</label>
          <input type="number" min="3" max="8" value="${state.numYears}" 
            onchange="state.numYears=Math.max(3,Math.min(8,parseInt(this.value)||4));initPlan();render()" 
            class="w-full p-2 border rounded text-sm">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Summer Terms</label>
          <select onchange="state.includeSummer=this.value==='yes';initPlan();render()" class="w-full p-2 border rounded text-sm">
            <option value="no" ${!state.includeSummer?'selected':''}>Not included</option>
            <option value="yes" ${state.includeSummer?'selected':''}>Include Summer</option>
          </select>
        </div>
        <div class="flex gap-1">
          <button onclick="loadSuggested()" class="bg-red-700 text-white px-2 py-2 rounded hover:bg-red-800 text-xs flex-1">Load Suggested</button>
          <button onclick="if(confirm('Reset all?')){initPlan();render()}" class="bg-slate-200 px-2 py-2 rounded hover:bg-slate-300 text-xs">Reset</button>
        </div>
      </div>
      <div class="flex flex-wrap gap-2 pt-3 border-t">
        <button onclick="promptSave()" class="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded text-sm">💾 Save Plan</button>
        <button onclick="switchView('saved')" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm">📂 Load Plan</button>
        <button onclick="printPlan()" class="bg-violet-600 hover:bg-violet-700 text-white px-3 py-1.5 rounded text-sm">🖨️ Print / PDF</button>
        <button onclick="exportJSON()" class="bg-slate-600 hover:bg-slate-700 text-white px-3 py-1.5 rounded text-sm">📥 Export JSON</button>
        <button onclick="importJSON()" class="bg-slate-600 hover:bg-slate-700 text-white px-3 py-1.5 rounded text-sm">📤 Import JSON</button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <aside class="lg:col-span-4 no-print" id="pool-section">
        <div class="bg-white rounded-xl shadow-sm p-4 sticky top-20">
          <h3 class="font-bold text-slate-800 mb-2">📦 Course Pool</h3>
          <input type="text" placeholder="🔍 Search by code or name..." value="${state.search}"
            oninput="state.search=this.value;document.getElementById('pool').innerHTML=renderPool();setupDnD()" 
            class="w-full p-2 border rounded text-sm mb-2">
          <select onchange="state.filter=this.value;document.getElementById('pool').innerHTML=renderPool();setupDnD()" class="w-full p-2 border rounded text-sm mb-3">
            <option value="all">All categories</option>
            <option value="compulsory">Compulsory only</option>
            <option value="elective">Electives only</option>
            <option value="gur">GUR only</option>
            <option value="free">Free electives</option>
            <option value="aida">AIDA only</option>
          </select>
          <p class="text-xs text-slate-500 mb-2">💡 Drag courses into a semester slot. Click ✕ to remove.</p>
          <div id="pool" class="scroll-y space-y-1.5">${renderPool()}</div>
        </div>
      </aside>

      <section class="lg:col-span-8 space-y-3">
        <div class="print-only mb-3">
          <h2 class="text-lg font-bold">${PROGRAMMES[state.plannerMajor].name}</h2>
          <p class="text-xs text-slate-600">Plan: ${state.currentPlanName}</p>
        </div>
        ${renderPlanYearByYear()}
        ${renderSummary()}
      </section>
    </div>
  `;
}

function renderPool() {
  const major = state.plannerMajor;
  const placed = getAllPlaced();
  const search = state.search.toLowerCase();
  const filter = state.filter;

  let codes = Object.keys(COURSES).filter(code => {
    const c = COURSES[code];
    if (!c.for.includes(major)) return false;
    if (placed.has(code)) return false;
    if (search && !code.toLowerCase().includes(search) && !c.n.toLowerCase().includes(search)) return false;
    if (filter === 'compulsory' && !c.cat.startsWith('compulsory')) return false;
    if (filter === 'elective' && !c.cat.startsWith('elective')) return false;
    if (filter === 'gur' && !c.cat.startsWith('gur')) return false;
    if (filter === 'free' && c.cat !== 'free') return false;
    if (filter === 'aida' && !c.cat.includes('aida')) return false;
    return true;
  });

  codes.sort((a, b) => {
    const ca = COURSES[a], cb = COURSES[b];
    const pa = ca.cat.startsWith('compulsory') ? 0 : ca.cat === 'capstone' ? 1 : ca.cat.startsWith('elective') ? 2 : 3;
    const pb = cb.cat.startsWith('compulsory') ? 0 : cb.cat === 'capstone' ? 1 : cb.cat.startsWith('elective') ? 2 : 3;
    if (pa !== pb) return pa - pb;
    return a.localeCompare(b);
  });

  if (codes.length === 0) return '<p class="text-slate-400 text-sm italic p-4 text-center">No courses match.</p>';

  return codes.map(code => {
    const c = COURSES[code];
    const cat = CAT[c.cat] || { cls: 'bg-slate-50', label: c.cat };
    const preTxt = c.p && c.p.length ? `<div class="text-xs text-slate-500 mt-0.5">Pre-req: ${c.p.join(', ')}</div>` : '';
    return `
      <div class="draggable p-2 rounded border-l-4 ${cat.cls}" draggable="true" data-code="${code}">
        <div class="flex justify-between items-start gap-2">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-mono text-xs font-bold">${code.replace('_E','')}</span>
              <span class="badge ${cat.cls}">${cat.label}</span>
            </div>
            <p class="text-xs mt-0.5">${c.n}</p>
            ${preTxt}
          </div>
          <span class="font-bold text-xs whitespace-nowrap">${c.c}c</span>
        </div>
      </div>
    `;
  }).join('');
}

function renderPlanYearByYear() {
  let html = '';
  for (let y = 1; y <= state.numYears; y++) {
    const s1 = state.plan[`Y${y}S1`] || [];
    const s2 = state.plan[`Y${y}S2`] || [];
    const ss = state.plan[`Y${y}SS`] || [];
    const yearCredits = [...s1, ...s2, ...ss].reduce((s,c) => s + (getCourse(c)?.c || 0), 0);

    html += `
      <div class="bg-white rounded-xl shadow-sm overflow-hidden print-break-avoid">
        <div class="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-4 py-2 flex justify-between items-center">
          <h3 class="font-bold">📅 Year ${y}</h3>
          <span class="text-xs bg-white/10 px-2 py-0.5 rounded-full">${yearCredits} credits</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-${state.includeSummer ? 3 : 2}">
          ${renderSemSlot(`Y${y}S1`, 'Semester 1', s1)}
          ${renderSemSlot(`Y${y}S2`, 'Semester 2', s2)}
          ${state.includeSummer ? renderSemSlot(`Y${y}SS`, 'Summer', ss) : ''}
        </div>
      </div>
    `;
  }
  return html;
}

function renderSemSlot(key, label, courses) {
  const credits = courses.reduce((s,c) => s + (getCourse(c)?.c || 0), 0);
  const tooHeavy = credits > 21;
  const tooLight = credits < 12 && courses.length > 0;

  return `
    <div class="border-r last:border-r-0 border-slate-200">
      <div class="bg-slate-100 px-3 py-1.5 flex justify-between items-center border-b">
        <span class="text-sm font-semibold text-slate-700">${label}</span>
        <span class="text-xs font-bold ${tooHeavy?'text-red-600':tooLight?'text-amber-600':'text-emerald-700'}">${credits}c</span>
      </div>
      <div class="drop-slot p-2 space-y-1.5 border-2 border-dashed border-slate-200" data-key="${key}">
        ${courses.length === 0 
          ? '<p class="text-slate-400 text-xs italic text-center py-4">Drop courses here</p>' 
          : courses.map(code => placedCardHTML(code, key)).join('')}
      </div>
    </div>
  `;
}

function placedCardHTML(code, semKey) {
  const c = getCourse(code);
  if (!c) return '';
  const cat = CAT[c.cat] || { cls: 'bg-slate-50', label: c.cat };
  const pre = checkPrereq(code, semKey);
  const exc = checkExclusion(code);
  const errClass = (!pre.ok || !exc.ok) ? 'ring-2 ring-red-500 warn-pulse' : '';
  const errMsg = !pre.ok ? `<div class="text-xs text-red-700 font-semibold mt-1">⚠️ Missing pre-req: ${pre.missing.join(', ')}</div>` 
                 : !exc.ok ? `<div class="text-xs text-red-700 font-semibold mt-1">⚠️ Conflicts with: ${exc.conflict.join(', ')}</div>`
                 : '';
  return `
    <div class="p-2 rounded border-l-4 ${cat.cls} ${errClass} flex justify-between items-start gap-2 draggable" draggable="true" data-code="${code}" data-from="${semKey}">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-1 flex-wrap">
          <span class="font-mono text-xs font-bold">${code.replace('_E','')}</span>
          <span class="text-xs text-slate-600">${c.c}c</span>
        </div>
        <p class="text-xs leading-tight">${c.n}</p>
        ${errMsg}
      </div>
      <button onclick="removeCourse('${semKey}','${code}')" class="text-red-500 hover:text-red-700 font-bold leading-none px-1" title="Remove">✕</button>
    </div>
  `;
}

function renderSummary() {
  const prog = PROGRAMMES[state.plannerMajor];
  const placed = getAllPlaced();
  let totalCredits = 0, majorCredits = 0, gurCredits = 0, freeCredits = 0, aidaCredits = 0;
  let compulsoryDone = 0, compulsoryTotal = 0;

  Object.keys(COURSES).forEach(code => {
    const c = COURSES[code];
    if (c.for.includes(state.plannerMajor) && (c.cat.startsWith('compulsory') || c.cat === 'capstone')) {
      compulsoryTotal++;
      if (placed.has(code)) compulsoryDone++;
    }
  });

  placed.forEach(code => {
    const c = getCourse(code);
    if (!c) return;
    totalCredits += c.c;
    if (c.cat.startsWith('gur')) gurCredits += c.c;
    else if (c.cat === 'free') freeCredits += c.c;
    else if (c.cat === 'compulsory-aida' || c.cat === 'elective-aida') aidaCredits += c.c;
    else majorCredits += c.c;
  });

  const errors = [];
  Object.keys(state.plan).forEach(semKey => {
    state.plan[semKey].forEach(code => {
      const pre = checkPrereq(code, semKey);
      if (!pre.ok) errors.push(`${code} (${semLabel(semKey)}): missing ${pre.missing.join(', ')}`);
    });
  });

  const pct = Math.min(100, Math.round((totalCredits / prog.targetCredits.total) * 100));
  const hasSecondary = !!prog.targetCredits.secondary;

  return `
    <div class="bg-white rounded-xl shadow-sm p-4 print-break-avoid">
      <h3 class="font-bold text-slate-800 mb-3">📊 Plan Summary</h3>
      
      <div class="mb-3">
        <div class="flex justify-between text-sm mb-1">
          <span class="font-semibold">Progress: ${totalCredits} / ${prog.targetCredits.total} credits</span>
          <span class="text-slate-600">${pct}%</span>
        </div>
        <div class="bg-slate-200 rounded-full h-3 overflow-hidden">
          <div class="bg-gradient-to-r from-red-600 to-red-800 h-3 transition-all" style="width:${pct}%"></div>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-${hasSecondary ? 5 : 4} gap-2 mb-3">
        <div class="bg-blue-50 p-2 rounded text-center">
          <div class="font-bold text-blue-800 text-lg">${majorCredits}</div>
          <div class="text-xs text-blue-700">Major (need ${prog.targetCredits.major})</div>
        </div>
        <div class="bg-pink-50 p-2 rounded text-center">
          <div class="font-bold text-pink-800 text-lg">${gurCredits}</div>
          <div class="text-xs text-pink-700">GUR (need ${prog.targetCredits.gur})</div>
        </div>
        ${hasSecondary ? `
        <div class="bg-rose-50 p-2 rounded text-center">
          <div class="font-bold text-rose-800 text-lg">${aidaCredits}</div>
          <div class="text-xs text-rose-700">AIDA (need ${prog.targetCredits.secondary})</div>
        </div>` : ''}
        <div class="bg-purple-50 p-2 rounded text-center">
          <div class="font-bold text-purple-800 text-lg">${freeCredits}</div>
          <div class="text-xs text-purple-700">Free (need ${prog.targetCredits.free})</div>
        </div>
        <div class="bg-emerald-50 p-2 rounded text-center">
          <div class="font-bold text-emerald-800 text-lg">${compulsoryDone}/${compulsoryTotal}</div>
          <div class="text-xs text-emerald-700">Compulsory done</div>
        </div>
      </div>

      ${errors.length > 0 ? `
        <div class="bg-red-50 border-l-4 border-red-500 p-3 rounded-r">
          <p class="font-semibold text-red-800 mb-1">⚠️ ${errors.length} Pre-requisite issue${errors.length>1?'s':''} found:</p>
          <ul class="text-xs text-red-700 space-y-0.5">
            ${errors.slice(0,5).map(e => `<li>• ${e}</li>`).join('')}
            ${errors.length > 5 ? `<li class="text-red-500">...and ${errors.length - 5} more</li>` : ''}
          </ul>
        </div>
      ` : totalCredits >= prog.targetCredits.total ? `
        <div class="bg-emerald-50 border-l-4 border-emerald-500 p-3 rounded-r">
          <p class="font-semibold text-emerald-800">✅ Credit target reached! Please verify all compulsory subjects are completed.</p>
        </div>
      ` : `
        <div class="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r">
          <p class="text-sm text-amber-800">📝 ${prog.targetCredits.total - totalCredits} more credits needed to reach graduation requirement.</p>
        </div>
      `}
    </div>
  `;
}

/* ===========================================================
   DRAG & DROP
   =========================================================== */

let dragData = null;

function setupDnD() {
  document.querySelectorAll('.draggable').forEach(el => {
    el.addEventListener('dragstart', e => {
      dragData = { code: el.dataset.code, fromKey: el.dataset.from || null };
      el.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    el.addEventListener('dragend', () => el.classList.remove('dragging'));
  });
  
  document.querySelectorAll('.drop-slot').forEach(slot => {
    slot.addEventListener('dragover', e => {
      e.preventDefault();
      slot.classList.add('drag-over');
    });
    slot.addEventListener('dragleave', () => slot.classList.remove('drag-over'));
    slot.addEventListener('drop', e => {
      e.preventDefault();
      slot.classList.remove('drag-over');
      if (!dragData) return;
      const targetKey = slot.dataset.key;
      Object.keys(state.plan).forEach(k => {
        state.plan[k] = state.plan[k].filter(c => c !== dragData.code);
      });
      if (!state.plan[targetKey].includes(dragData.code)) {
        state.plan[targetKey].push(dragData.code);
      }
      dragData = null;
      render();
    });
  });
}

function removeCourse(semKey, code) {
  state.plan[semKey] = state.plan[semKey].filter(c => c !== code);
  render();
}

function loadSuggested() {
  if (Object.values(state.plan).some(arr => arr.length > 0)) {
    if (!confirm('This will replace your current plan. Continue?')) return;
  }
  const prog = PROGRAMMES[state.plannerMajor];
  // Detect if suggested has summer terms
  const hasSummer = Object.keys(prog.overview).some(k => k.endsWith('SS'));
  if (hasSummer) state.includeSummer = true;
  // Detect max year
  let maxY = 4;
  Object.keys(prog.overview).forEach(k => {
    const m = k.match(/Y(\d+)/);
    if (m) maxY = Math.max(maxY, parseInt(m[1]));
  });
  state.numYears = maxY;
  initPlan();
  Object.keys(prog.overview).forEach(key => {
    if (state.plan[key]) state.plan[key] = [...prog.overview[key]];
  });
  state.currentPlanName = `${PROGRAMMES[state.plannerMajor].fullName} (Suggested)`;
  render();
  toast('📋 Suggested plan loaded', 'success');
}

function promptSave() {
  const name = prompt('Enter a name for this plan:', state.currentPlanName);
  if (name) savePlan(name.trim());
}

/* ===========================================================
   LIBRARY VIEW
   =========================================================== */

function renderLibrary() {
  return `
    <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
      <h2 class="text-xl font-bold text-slate-800 mb-2">📖 Course Library</h2>
      <p class="text-sm text-slate-600 mb-3">Complete reference of all subjects in the 2025/26 curriculum.</p>
      <input type="text" placeholder="🔍 Search by code or name..." value="${state.search}"
        oninput="state.search=this.value;document.getElementById('lib').innerHTML=renderLibList()" 
        class="w-full p-2 border rounded">
    </div>
    <div id="lib">${renderLibList()}</div>
  `;
}

function renderLibList() {
  const search = state.search.toLowerCase();
  const codes = Object.keys(COURSES).filter(code => {
    if (!search) return true;
    return code.toLowerCase().includes(search) || COURSES[code].n.toLowerCase().includes(search);
  }).sort();

  if (codes.length === 0) {
    return '<div class="bg-white rounded-xl shadow-sm p-8 text-center text-slate-500">No courses match your search.</div>';
  }

  return `
    <div class="bg-white rounded-xl shadow-sm overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-slate-100 text-slate-700">
          <tr>
            <th class="px-3 py-2 text-left">Code</th>
            <th class="px-3 py-2 text-left">Subject Title</th>
            <th class="px-3 py-2 text-center">Cr</th>
            <th class="px-3 py-2 text-left">Pre-requisite</th>
            <th class="px-3 py-2 text-left">Exclusion</th>
            <th class="px-3 py-2 text-center">Majors</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          ${codes.map(code => {
            const c = COURSES[code];
            const cat = CAT[c.cat] || { cls: '', label: c.cat };
            return `
              <tr class="hover:bg-slate-50">
                <td class="px-3 py-2 font-mono text-xs font-bold">${code.replace('_E','')}</td>
                <td class="px-3 py-2">
                  <div>${c.n}</div>
                  <span class="badge ${cat.cls} mt-0.5">${cat.label}</span>
                </td>
                <td class="px-3 py-2 text-center font-bold">${c.c}</td>
                <td class="px-3 py-2 text-xs text-slate-600">${c.p && c.p.length ? c.p.join(', ') : '—'}</td>
                <td class="px-3 py-2 text-xs text-slate-600">${c.ex && c.ex.length ? c.ex.join(', ') : '—'}</td>
                <td class="px-3 py-2 text-center text-xs">${c.for.join(', ')}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

/* ===========================================================
   SAVED PLANS VIEW
   =========================================================== */

function renderSaved() {
  const all = getSavedPlans();
  const names = Object.keys(all).sort((a,b) => (all[b].savedAt||'').localeCompare(all[a].savedAt||''));
  
  return `
    <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
      <h2 class="text-xl font-bold text-slate-800 mb-2">💾 Saved Plans</h2>
      <p class="text-sm text-slate-600">Plans stored in your browser's local storage. ${names.length} plan${names.length!==1?'s':''} saved.</p>
    </div>
    
    ${names.length === 0 ? `
      <div class="bg-white rounded-xl shadow-sm p-8 text-center">
        <div class="text-5xl mb-2">📭</div>
        <p class="text-slate-600 mb-3">No saved plans yet.</p>
        <button onclick="switchView('planner')" class="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 text-sm">Go to Planner</button>
      </div>
    ` : `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        ${names.map(name => {
          const p = all[name];
          const prog = PROGRAMMES[p.major];
          const credits = Object.values(p.plan).flat().reduce((s,c) => s + (getCourse(c)?.c || 0), 0);
          const date = p.savedAt ? new Date(p.savedAt).toLocaleString('en-GB', { dateStyle:'medium', timeStyle:'short' }) : '—';
          return `
            <div class="bg-white rounded-xl shadow-sm p-4 border-l-4 border-${prog?.accent || 'slate'}-500">
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-slate-800 flex-1">${name}</h3>
                <span class="text-xs bg-slate-100 px-2 py-0.5 rounded">${credits}c</span>
              </div>
              <p class="text-xs text-slate-600 mb-1">${prog?.fullName || p.major}</p>
              <p class="text-xs text-slate-500 mb-3">📅 ${date} · ${p.numYears} years${p.includeSummer ? ' + summer' : ''}</p>
              <div class="flex gap-2">
                <button onclick="loadPlan('${name.replace(/'/g,"\\'")}')" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs flex-1">📂 Load</button>
                <button onclick="deletePlan('${name.replace(/'/g,"\\'")}')" class="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs">🗑️ Delete</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `}
  `;
}

/* ===========================================================
   INITIAL RENDER
   =========================================================== */

(function init() {
  if (!loadAutoSave()) initPlan();
  render();
})();
