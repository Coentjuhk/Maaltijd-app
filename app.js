// ============================================================
//  MaaltijdApp — app.js
// ============================================================

// ===== STATE =====
let meals        = [];
let shoppingList = [];
let counts       = {};
let dagLog       = {};          // { "2026-03-15": [mealId, ...] }
let activeFilters    = new Set();
let selectedColor    = 'green';
let currentDetailId  = null;
let currentWeekOffset = 0;
let selectedDayKey   = null;
let multiSelectMode  = false;
let selectedDays     = new Set();
let dayClipboard     = null;
let editMealId       = null;

const CAT_LABELS = { ontbijt: '🌅 Ontbijt', lunch: '🥗 Lunch', snack: '🍎 Snack', diner: '🍽️ Diner' };

// Pantry items: worden getoond in ingrediëntenlijst maar NIET aan boodschappenlijst toegevoegd
const PANTRY_ITEMS = new Set([
  'peper', 'zout', 'paprikapoeder', 'knoflookpoeder', 'oregano', 'komijn',
  'chilipoeder', 'italiaanse kruiden', 'olijfolie', 'sesamolie', 'citroensap',
  'knoflookpoeder', 'gemalen koriander', 'kurkuma', 'kaneel', 'nootmuskaat',
  'droge tijm', 'tijm', 'rozemarijn', 'basilicum', 'peterselie', 'bieslook',
]);
const DAG_NL     = ['Zondag','Maandag','Dinsdag','Woensdag','Donderdag','Vrijdag','Zaterdag'];
const DAG_NL_K   = ['Zo','Ma','Di','Wo','Do','Vr','Za'];
const MAAND_NL   = ['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'];

// ===== STORAGE =====
function saveState() {
  localStorage.setItem('ma_meals',    JSON.stringify(meals));
  localStorage.setItem('ma_shopping', JSON.stringify(shoppingList));
  localStorage.setItem('ma_counts',   JSON.stringify(counts));
  localStorage.setItem('ma_daglog',   JSON.stringify(dagLog));
}

function loadState(defaultMeals) {
  const MEALS_VERSION = 3;
  const storedVersion = parseInt(localStorage.getItem('ma_meals_version') || '1');
  if (storedVersion < MEALS_VERSION) {
    localStorage.removeItem('ma_meals');
    localStorage.setItem('ma_meals_version', String(MEALS_VERSION));
  }

  try {
    const m = localStorage.getItem('ma_meals');
    if (m) {
      const loaded = JSON.parse(m);
      meals = loaded.map(meal => {
        if (!meal.afbeelding) {
          const def = defaultMeals.find(d => d.id === meal.id);
          if (def && def.afbeelding) return { ...meal, afbeelding: def.afbeelding };
        }
        return meal;
      });
    } else {
      meals = JSON.parse(JSON.stringify(defaultMeals));
    }
  } catch { meals = JSON.parse(JSON.stringify(defaultMeals)); }

  const VALID_CATS = new Set(['ontbijt', 'lunch', 'snack', 'diner']);
  meals.forEach(m => {
    if (!m.categorie || !VALID_CATS.has(m.categorie))
      console.warn(`Meal id:${m.id} heeft ongeldige categorie: "${m.categorie}"`);
    if (!m.instructions) m.instructions = [];
    if (m.notes === undefined) m.notes = '';
  });

  try {
    const s = localStorage.getItem('ma_shopping');
    const raw = s ? JSON.parse(s) : [];
    // Migreer oude items (naam = ruwe string) naar nieuwe structuur
    shoppingList = raw.map(item => {
      if (!('contributions' in item)) {
        const p = parseIngredient(item.naam || '');
        const contributions = {};
        if (item.mealId != null) contributions[String(item.mealId)] = p.qty || 0;
        return { id: item.id, naam: p.naam, unit: p.unit, qty: p.qty, contributions, afgevinkt: !!item.afgevinkt };
      }
      return item;
    });
  } catch { shoppingList = []; }

  try {
    const c = localStorage.getItem('ma_counts');
    counts = c ? JSON.parse(c) : {};
  } catch { counts = {}; }

  try {
    const d = localStorage.getItem('ma_daglog');
    dagLog = d ? JSON.parse(d) : {};
  } catch { dagLog = {}; }
}

// ===== INGREDIENT PARSING =====
function parseIngredient(raw) {
  const UNITS = new Set(['kg','g','mg','l','ml','dl','el','tl','blik','blikje','blikjes','pak','zakje','stuks']);
  let s = (raw || '').trim();
  // Vervang breukgetallen (langste eerst om "2½" vóór "½" te matchen)
  [['2½','2.5'],['1½','1.5'],['3½','3.5'],['4½','4.5'],
   ['2¼','2.25'],['1¼','1.25'],['3¼','3.25'],
   ['2¾','2.75'],['1¾','1.75'],['3¾','3.75'],
   ['½','0.5'],['¼','0.25'],['¾','0.75'],['⅓','0.33'],['⅔','0.67']
  ].forEach(([f, v]) => { s = s.split(f).join(v); });

  // "800 g / 4 zoete aardappelen" → boodschappenlijst gebruikt alleen het stuks-deel
  const slashMatch = s.match(/^(\d+(?:[.,]\d+)?)\s+\w+\s*\/\s*(\d+(?:[.,]\d+)?)\s+(.+)$/);
  if (slashMatch) {
    return { qty: parseFloat(slashMatch[2].replace(',', '.')), unit: '', naam: slashMatch[3].trim().toLowerCase() };
  }

  const m = s.match(/^(\d+(?:[.,]\d+)?)\s+(.+)$/);
  if (m) {
    const qty  = parseFloat(m[1].replace(',', '.'));
    const rest = m[2].trim();
    const firstWord = rest.split(/\s+/)[0].toLowerCase().replace(/\.$/, '');
    if (UNITS.has(firstWord)) {
      return { qty, unit: firstWord, naam: rest.slice(firstWord.length).trim().toLowerCase() };
    }
    return { qty, unit: '', naam: rest.toLowerCase() };
  }
  return { qty: null, unit: '', naam: s.toLowerCase() };
}

function formatItemDisplay(item) {
  if (item.qty === null || item.qty === undefined) {
    return item.naam.charAt(0).toUpperCase() + item.naam.slice(1);
  }
  const q = item.qty % 1 === 0 ? item.qty : Math.round(item.qty * 10) / 10;
  return item.unit ? `${q} ${item.unit} ${item.naam}` : `${q} ${item.naam}`;
}

function mergeOrAddIngredient(raw, mealId) {
  const p   = parseIngredient(raw);
  // Pantry items tonen we wel in het recept maar voegen we niet toe aan de boodschappenlijst
  if (PANTRY_ITEMS.has(p.naam.toLowerCase())) return;
  const key = mealId !== null ? String(mealId) : null;
  const existing = shoppingList.find(x =>
    !x.afgevinkt && x.naam === p.naam && x.unit === p.unit
  );
  if (existing) {
    if (p.qty !== null && existing.qty !== null) existing.qty += p.qty;
    if (key) existing.contributions[key] = (existing.contributions[key] || 0) + (p.qty || 0);
  } else {
    const contributions = {};
    if (key) contributions[key] = p.qty || 0;
    shoppingList.push({ id: Date.now() + Math.random(), naam: p.naam, unit: p.unit, qty: p.qty, contributions, afgevinkt: false });
  }
}

// ===== GRADIENT / COLOR HELPERS =====
const GRAD = {
  green:  'linear-gradient(135deg,#1B5E3B,#52B788)',
  blue:   'linear-gradient(135deg,#1565C0,#42A5F5)',
  orange: 'linear-gradient(135deg,#E65100,#FFA726)',
  purple: 'linear-gradient(135deg,#4A148C,#AB47BC)',
  teal:   'linear-gradient(135deg,#004D40,#26A69A)',
  red:    'linear-gradient(135deg,#B71C1C,#EF5350)',
  brown:  'linear-gradient(135deg,#4E342E,#A1887F)',
  pink:   'linear-gradient(135deg,#880E4F,#F06292)',
};

function gradStyle(kleur) {
  return `background:${GRAD[kleur] || GRAD.green};`;
}

// ===== FILTER LOGIC =====
function filteredMeals() {
  const catActive = ['cat-ontbijt','cat-lunch','cat-snack','cat-diner'].filter(f => activeFilters.has(f));
  let result = meals.filter(m => {
    if (activeFilters.has('invriesbaar') && !m.invriesbaar) return false;
    if (activeFilters.has('sport') && !activeFilters.has('rust') && m.dagtype === 'rust') return false;
    if (activeFilters.has('rust') && !activeFilters.has('sport') && m.dagtype === 'sport') return false;
    if (catActive.length) {
      const cat = m.categorie || 'diner';
      if (!catActive.includes('cat-' + cat)) return false;
    }
    return true;
  });
  if (activeFilters.has('sort-cal')) {
    result = [...result].sort((a, b) => a.calorieen - b.calorieen);
  } else if (activeFilters.has('sort-alpha')) {
    result = [...result].sort((a, b) => a.naam.localeCompare(b.naam, 'nl'));
  }
  return result;
}

// ===== RENDER MEALS =====
function renderMeals() {
  const list = document.getElementById('meals-list');
  const visible = filteredMeals();

  if (visible.length === 0) {
    list.innerHTML = `<div class="empty-state">
      <span class="big">🍽️</span>
      Geen maaltijden gevonden voor de huidige filters.
    </div>`;
    return;
  }

  const CAT_ORDER = ['ontbijt', 'lunch', 'diner', 'snack'];
  const catActive = ['cat-ontbijt', 'cat-lunch', 'cat-snack', 'cat-diner']
    .filter(f => activeFilters.has(f))
    .map(f => f.replace('cat-', ''));
  const catsToShow = catActive.length ? catActive : CAT_ORDER;

  const grouped = {};
  CAT_ORDER.forEach(c => { grouped[c] = []; });
  visible.forEach(m => {
    const cat = m.categorie || 'diner';
    if (grouped[cat]) grouped[cat].push(m);
  });

  list.innerHTML = catsToShow.map(cat => {
    const items = grouped[cat] || [];
    const gridHTML = items.length
      ? `<div class="cat-grid">${items.map(m => mealCardHTML(m)).join('')}</div>`
      : `<div class="cat-empty">Geen gerechten</div>`;
    return `<div class="cat-section">
      <h2 class="cat-header">${CAT_LABELS[cat] || cat}</h2>
      ${gridHTML}
    </div>`;
  }).join('');
}

function mealCardHTML(m) {
  const dagtype = m.dagtype;
  const dagTag = dagtype === 'sport'
    ? `<span class="card-tag sport">🏃 Sportdag</span>`
    : dagtype === 'rust'
      ? `<span class="card-tag rust">😴 Rustdag</span>`
      : `<span class="card-tag beide">📅 Sport & Rust</span>`;
  const freezeTag = m.invriesbaar ? `<span class="card-tag freeze">❄️ Invries</span>` : '';
  const portiesTag = m.porties ? `<span>🍴 ${m.porties}p</span>` : '';

  const bgContent = m.afbeelding
    ? `<img src="${escapeAttr(m.afbeelding)}" alt="${escapeAttr(m.naam)}">`
    : `<span class="card-emoji">${m.emoji || '🍽️'}</span>`;

  return `
  <div class="meal-card" onclick="openDetail(${m.id})">
    <div class="card-bg" style="${m.afbeelding ? '' : gradStyle(m.kleur)}">
      ${bgContent}
    </div>
    <div class="card-overlay">
      <div class="card-ov-name">${escapeHTML(m.naam)}</div>
      <div class="card-ov-tags">
        ${dagTag}
        ${freezeTag}
      </div>
      <div class="card-ov-footer">
        <div class="card-ov-stats">
          <span>🔥 ${m.calorieen}</span>
          <span>💪 ${m.eiwitten}g</span>
          ${portiesTag}
        </div>
        <div class="card-ov-btns" onclick="event.stopPropagation()">
          <button class="card-btn-minus" onclick="removeIngredientsFromShopping(${m.id})" title="Verwijder van lijst">−</button>
          <button class="card-btn-plus" onclick="addIngredientsToShopping(${m.id}, true)" title="Voeg toe aan lijst">+</button>
        </div>
      </div>
    </div>
  </div>`;
}

function dagBadgeHTML(dagtype) {
  if (dagtype === 'sport') return `<span class="badge sport">🏃 Sportdag</span>`;
  if (dagtype === 'rust')  return `<span class="badge rust">😴 Rustdag</span>`;
  return `<span class="badge beide">📅 Sportdag & Rustdag</span>`;
}

// ===== COUNTER =====
function changeCount(id, delta) {
  counts[id] = Math.max(0, (counts[id] || 0) + delta);
  // Update just the counter element without re-rendering everything
  const el = document.getElementById(`cnt-${id}`);
  if (el) {
    el.textContent = counts[id];
    el.className = `counter-val${counts[id] > 0 ? ' nonzero' : ''}`;
  }
  saveState();
}

// ===== DETAIL MODAL =====
function openDetail(id) {
  const m = meals.find(x => x.id === id);
  if (!m) return;
  currentDetailId = id;

  const imgContent = m.afbeelding
    ? `<img src="${escapeAttr(m.afbeelding)}" alt="${escapeAttr(m.naam)}">`
    : `<span style="font-size:80px;filter:drop-shadow(0 2px 8px rgba(0,0,0,.3))">${m.emoji || '🍽️'}</span>`;
  const heroClass = m.afbeelding ? 'detail-hero has-img' : 'detail-hero';

  const ingListItems = (m.ingredienten || [])
    .map(i => `<li>${escapeHTML(i)}</li>`).join('');

  document.getElementById('detail-content').innerHTML = `
    <div class="${heroClass}" style="${m.afbeelding ? '' : gradStyle(m.kleur)}">
      ${imgContent}
    </div>
    <div class="detail-body">
      <div class="detail-name">${escapeHTML(m.naam)}</div>
      <div class="detail-badges">
        ${dagBadgeHTML(m.dagtype)}
        ${m.invriesbaar ? `<span class="badge freeze">❄️ Invriesbaar</span>` : ''}
        ${m.porties ? `<span class="badge" style="background:#F5F5F5;color:#555">🍴 ${m.porties} port.</span>` : ''}
      </div>
      <div class="detail-macros">
        <div class="macro-card">
          <span class="mc-val">${m.calorieen}</span>
          <span class="mc-lbl">kcal</span>
        </div>
        <div class="macro-card">
          <span class="mc-val">${m.eiwitten}g</span>
          <span class="mc-lbl">eiwit</span>
        </div>
      </div>
      ${m.bewaren ? `<p style="font-size:13px;color:var(--text-muted);margin-bottom:16px">🗓️ ${escapeHTML(m.bewaren)}</p>` : ''}

      <div class="detail-section-title">Ingrediënten</div>
      <ul class="detail-ingr-list">${ingListItems}</ul>

      <div class="detail-section-title">Bereidingswijze</div>
      ${(m.instructions && m.instructions.length > 0)
        ? `<ol class="detail-instructions">${m.instructions.map(s => `<li>${escapeHTML(s)}</li>`).join('')}</ol>`
        : `<p class="detail-bereiding">${escapeHTML(m.bereidingswijze || '—')}</p>`
      }
      ${m.notes ? `<div class="detail-notes"><strong>💡 Tip:</strong> ${escapeHTML(m.notes)}</div>` : ''}

      <button class="detail-add-btn" onclick="addIngredientsToShopping(${m.id})">
        🛒 Ingrediënten naar boodschappenlijst
      </button>
      <button class="detail-edit-btn" onclick="openEditMeal(${m.id})">
        ✏️ Gerecht bewerken
      </button>
      <button class="detail-delete-btn" onclick="deleteMeal(${m.id})">
        🗑️ Gerecht verwijderen
      </button>
    </div>`;

  const modal = document.getElementById('detail-modal');
  modal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
}

function closeDetail() {
  document.getElementById('detail-modal').setAttribute('hidden', '');
  document.body.style.overflow = '';
  currentDetailId = null;
}

function deleteMeal(id) {
  if (!confirm('Weet je zeker dat je dit gerecht wil verwijderen?')) return;
  meals = meals.filter(m => m.id !== id);
  delete counts[id];
  saveState();
  closeDetail();
  renderMeals();
  showToast('Gerecht verwijderd');
}

function openEditMeal(id) {
  const m = meals.find(x => x.id === id);
  if (!m) return;
  editMealId = id;
  document.getElementById('e-naam').value = m.naam;
  document.getElementById('e-cal').value = m.calorieen;
  document.getElementById('e-eiwit').value = m.eiwitten;
  document.getElementById('e-ingr').value = (m.ingredienten || []).join('\n');
  renderInstrEditor(m.instructions || []);
  document.getElementById('e-notes').value = m.notes || '';
  document.getElementById('edit-modal').removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
}

function renderInstrEditor(steps) {
  const container = document.getElementById('instr-editor');
  container.innerHTML = '';
  steps.forEach((step, i) => _addInstrRow(container, step, i, steps.length));
}

function _addInstrRow(container, text, index, total) {
  const row = document.createElement('div');
  row.className = 'instr-row';
  row.innerHTML = `
    <span class="instr-num">${index + 1}.</span>
    <input type="text" class="instr-input" value="${escapeAttr(text)}" placeholder="Stap omschrijving…">
    <button type="button" class="instr-btn" onclick="moveInstrRow(this,-1)" ${index === 0 ? 'disabled' : ''} title="Omhoog">▲</button>
    <button type="button" class="instr-btn" onclick="moveInstrRow(this,1)" ${index === total - 1 ? 'disabled' : ''} title="Omlaag">▼</button>
    <button type="button" class="instr-btn instr-del" onclick="deleteInstrRow(this)" title="Verwijder">✕</button>`;
  container.appendChild(row);
}

function addInstrStep() {
  const container = document.getElementById('instr-editor');
  const rows = container.querySelectorAll('.instr-row');
  _addInstrRow(container, '', rows.length, rows.length + 1);
  renumberInstrRows();
}

function moveInstrRow(btn, dir) {
  const row = btn.closest('.instr-row');
  const container = row.parentElement;
  const rows = Array.from(container.querySelectorAll('.instr-row'));
  const idx = rows.indexOf(row);
  const target = rows[idx + dir];
  if (!target) return;
  if (dir === -1) container.insertBefore(row, target);
  else container.insertBefore(target, row);
  renumberInstrRows();
}

function deleteInstrRow(btn) {
  btn.closest('.instr-row').remove();
  renumberInstrRows();
}

function renumberInstrRows() {
  const rows = document.querySelectorAll('#instr-editor .instr-row');
  const total = rows.length;
  rows.forEach((row, i) => {
    row.querySelector('.instr-num').textContent = `${i + 1}.`;
    const btns = row.querySelectorAll('.instr-btn');
    btns[0].disabled = (i === 0);
    btns[1].disabled = (i === total - 1);
  });
}

function collectInstrSteps() {
  return Array.from(document.querySelectorAll('#instr-editor .instr-input'))
    .map(inp => inp.value.trim()).filter(Boolean);
}

function closeEditMeal() {
  document.getElementById('edit-modal').setAttribute('hidden', '');
  document.body.style.overflow = '';
  editMealId = null;
}

function submitEditMeal(e) {
  e.preventDefault();
  const m = meals.find(x => x.id === editMealId);
  if (!m) return;
  const naam = document.getElementById('e-naam').value.trim();
  const cal  = parseInt(document.getElementById('e-cal').value, 10);
  const eiwit = parseInt(document.getElementById('e-eiwit').value, 10);
  const ingrRaw = document.getElementById('e-ingr').value.trim();
  if (!naam || isNaN(cal) || isNaN(eiwit)) { showToast('Vul naam, calorieën en eiwitten in'); return; }
  m.naam = naam;
  m.calorieen = cal;
  m.eiwitten = eiwit;
  if (ingrRaw) m.ingredienten = ingrRaw.split('\n').map(l => l.trim()).filter(Boolean);
  m.instructions = collectInstrSteps();
  m.notes = document.getElementById('e-notes').value.trim();
  saveState();
  renderMeals();
  closeEditMeal();
  closeDetail();
  showToast(`"${naam}" bijgewerkt`);
}

// ===== SHOPPING LIST =====
function addIngredientsToShopping(mealId, fromCard = false) {
  const m = meals.find(x => x.id === mealId);
  if (!m || !m.ingredienten) return;
  m.ingredienten.forEach(raw => mergeOrAddIngredient(raw, mealId));
  saveState();
  updateShoppingBadge();
  if (!fromCard) closeDetail();
  showToast(`${m.ingredienten.length} ingrediënten toegevoegd`);
}

function removeIngredientsFromShopping(mealId) {
  const key = String(mealId);
  let changed = false;
  shoppingList = shoppingList.filter(item => {
    const c = item.contributions || {};
    if (!(key in c)) return true;
    const contrib = c[key];
    delete item.contributions[key];
    changed = true;
    if (item.qty !== null) {
      item.qty = Math.max(0, item.qty - contrib);
      if (item.qty <= 0) return false;
    } else if (Object.keys(item.contributions).length === 0) {
      return false; // geen-hoeveelheid item zonder resterende bijdragen
    }
    return true;
  });
  saveState();
  updateShoppingBadge();
  showToast(changed ? 'Ingrediënten verwijderd' : 'Geen ingrediënten om te verwijderen');
}

function addShoppingItem() {
  const input = document.getElementById('shopping-input');
  const raw = input.value.trim();
  if (!raw) return;
  mergeOrAddIngredient(raw, null);
  input.value = '';
  saveState();
  renderShopping();
  updateShoppingBadge();
}

function toggleShoppingItem(id) {
  const item = shoppingList.find(x => x.id === id);
  if (item) { item.afgevinkt = !item.afgevinkt; saveState(); renderShopping(); updateShoppingBadge(); }
}

function deleteShoppingItem(id) {
  shoppingList = shoppingList.filter(x => x.id !== id);
  saveState();
  renderShopping();
  updateShoppingBadge();
}

function clearCheckedItems() {
  shoppingList = shoppingList.filter(x => !x.afgevinkt);
  saveState();
  renderShopping();
  updateShoppingBadge();
}

function copyShoppingList() {
  const items = shoppingList.filter(x => !x.afgevinkt);
  if (items.length === 0) { showToast('Geen items om te kopiëren'); return; }
  const text = items.map(x => '• ' + formatItemDisplay(x)).join('\n');
  navigator.clipboard.writeText(text)
    .then(() => showToast('Lijst gekopieerd!'))
    .catch(() => {
      // Fallback for older iOS
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('Lijst gekopieerd!');
    });
}

function renderShopping() {
  const container = document.getElementById('shopping-list');
  if (shoppingList.length === 0) {
    container.innerHTML = `<div class="empty-state" style="padding:40px 20px">
      <span class="big">🛒</span>Jouw boodschappenlijst is leeg.
    </div>`;
    return;
  }

  const open    = shoppingList.filter(x => !x.afgevinkt);
  const checked = shoppingList.filter(x =>  x.afgevinkt);

  let html = '';
  if (open.length) {
    html += open.map(itemHTML).join('');
  }
  if (checked.length) {
    html += `<div class="shopping-section-title">Afgevinkt (${checked.length})</div>`;
    html += checked.map(itemHTML).join('');
  }
  container.innerHTML = html;
}

function itemHTML(item) {
  const checkClass = item.afgevinkt ? 'item-check checked' : 'item-check';
  const rowClass   = item.afgevinkt ? 'shopping-item checked' : 'shopping-item';
  return `
  <div class="${rowClass}">
    <div class="${checkClass}" onclick="toggleShoppingItem(${item.id})">
      ${item.afgevinkt ? '✓' : ''}
    </div>
    <span class="item-name">${escapeHTML(formatItemDisplay(item))}</span>
    <button class="item-del" onclick="deleteShoppingItem(${item.id})">🗑</button>
  </div>`;
}

function updateShoppingBadge() {
  const count = shoppingList.filter(x => !x.afgevinkt).length;
  const badge1 = document.getElementById('cart-badge');
  const badge2 = document.getElementById('nav-badge');
  if (count > 0) {
    badge1.textContent = count; badge1.removeAttribute('hidden');
    badge2.textContent = count; badge2.removeAttribute('hidden');
  } else {
    badge1.setAttribute('hidden', '');
    badge2.setAttribute('hidden', '');
  }
}

// ===== TAB NAVIGATION =====
function switchTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  document.getElementById(`tab-${tab}`).classList.add('active');
  document.querySelector(`.nav-item[data-tab="${tab}"]`).classList.add('active');

  if (tab === 'shopping') renderShopping();
  if (tab === 'dagboek')  renderDagboek();
}

// ===== FILTER CHIPS =====
function initFilters() {
  document.querySelectorAll('.chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      if (activeFilters.has(f)) {
        activeFilters.delete(f);
        btn.classList.remove('active');
      } else {
        activeFilters.add(f);
        btn.classList.add('active');
      }
      renderMeals();
    });
  });
}

// ===== ADD MEAL FORM =====
function initColorPicker() {
  document.querySelectorAll('.color-opt').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('.color-opt').forEach(e => e.classList.remove('active'));
      el.classList.add('active');
      selectedColor = el.dataset.color;
    });
  });
}

function submitMeal(e) {
  e.preventDefault();
  const naam      = document.getElementById('f-naam').value.trim();
  const cal       = parseInt(document.getElementById('f-cal').value, 10);
  const eiwit     = parseInt(document.getElementById('f-eiwit').value, 10);
  const categorie = document.querySelector('input[name="categorie"]:checked')?.value || 'diner';
  const dagtype   = document.querySelector('input[name="dagtype"]:checked')?.value;
  const invries   = document.getElementById('f-invries').checked;
  const emoji     = document.getElementById('f-emoji').value.trim() || '🍽️';
  const ingrRaw   = document.getElementById('f-ingr').value.trim();
  const bereiding = document.getElementById('f-bereiding').value.trim();

  if (!naam || !cal || !eiwit || !dagtype || !ingrRaw || !bereiding) {
    showToast('Vul alle verplichte velden in'); return;
  }

  const ingredienten = ingrRaw.split('\n').map(l => l.trim()).filter(Boolean);
  const notesVal = document.getElementById('f-notes').value.trim();
  const newId = Date.now();

  meals.push({
    id: newId,
    naam,
    emoji,
    kleur: selectedColor,
    categorie,
    invriesbaar: invries,
    dagtype,
    calorieen: cal,
    eiwitten: eiwit,
    ingredienten,
    bereidingswijze: bereiding,
    instructions: bereiding.split('\n\n').map(s => s.trim()).filter(Boolean),
    notes: notesVal
  });

  saveState();
  renderMeals();
  e.target.reset();
  selectedColor = 'green';
  document.querySelectorAll('.color-opt').forEach((el, i) => el.classList.toggle('active', i === 0));
  switchTab('meals');
  showToast(`"${naam}" toegevoegd!`);
}

// ===== SHOPPING INPUT — enter key =====
function initShoppingInput() {
  document.getElementById('shopping-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); addShoppingItem(); }
  });
}

// ===== MODAL CLOSE ON BACKDROP =====
function initModalClose() {
  document.getElementById('detail-modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeDetail();
  });
  document.getElementById('daypicker-modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeDayPicker();
  });
  document.getElementById('edit-modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeEditMeal();
  });
}

// ===== TOAST =====
let toastTimer = null;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.removeAttribute('hidden');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.setAttribute('hidden', ''), 2500);
}

// ===== UTILITY =====
function escapeHTML(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
function escapeAttr(str) { return escapeHTML(str); }

// ===== DAGBOEK =====
function dateKey(date) {
  return date.toISOString().slice(0, 10);
}

function parseCustomItem(entry) {
  const raw = entry.slice(2);
  try {
    const obj = JSON.parse(raw);
    return { naam: obj.n || '', kcal: obj.k || 0, prot: obj.p || 0, note: obj.note || '' };
  } catch {
    return { naam: raw, kcal: 0, prot: 0, note: '' };
  }
}

function makeCustomEntry(naam, kcal, prot, note) {
  return 'c:' + JSON.stringify({ n: naam, k: kcal || 0, p: prot || 0, note: note || '' });
}

function getWeekDays(offset = 0) {
  const today = new Date();
  const dow = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1) + offset * 7);
  monday.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function formatWeekLabel(from, to) {
  const m1 = MAAND_NL[from.getMonth()];
  const m2 = MAAND_NL[to.getMonth()];
  if (m1 === m2) return `${from.getDate()} – ${to.getDate()} ${m1} ${from.getFullYear()}`;
  return `${from.getDate()} ${m1} – ${to.getDate()} ${m2} ${from.getFullYear()}`;
}

function getDayTotals(key) {
  const ids = dagLog[key] || [];
  return ids.reduce((acc, id) => {
    if (typeof id === 'number') {
      const m = meals.find(x => x.id === id);
      if (m) { acc.cal += m.calorieen || 0; acc.eiwit += m.eiwitten || 0; }
    } else if (typeof id === 'string' && id.startsWith('c:')) {
      const item = parseCustomItem(id);
      acc.cal += item.kcal || 0;
      acc.eiwit += item.prot || 0;
    }
    return acc;
  }, { cal: 0, eiwit: 0 });
}

function renderDagboek() {
  const days = getWeekDays(currentWeekOffset);
  const todayKey = dateKey(new Date());
  document.getElementById('week-label').textContent = formatWeekLabel(days[0], days[6]);

  const selectBtn = document.getElementById('select-mode-btn');
  if (selectBtn) {
    selectBtn.textContent = multiSelectMode ? '✕' : '☑️';
    selectBtn.title = multiSelectMode ? 'Annuleer selectie' : 'Selecteer dagen';
  }

  const list = document.getElementById('dagboek-list');
  list.innerHTML = days.map(date => {
    const key = dateKey(date);
    const isToday = key === todayKey;
    const isSelected = selectedDays.has(key);
    const totals = getDayTotals(key);

    const nameCount = {};
    const nameOrder = [];
    (dagLog[key] || []).forEach(id => {
      let naam;
      if (typeof id === 'number') { const m = meals.find(x => x.id === id); naam = m ? m.naam : null; }
      else if (typeof id === 'string' && id.startsWith('c:')) { naam = parseCustomItem(id).naam; }
      if (!naam) return;
      if (!nameCount[naam]) { nameCount[naam] = 0; nameOrder.push(naam); }
      nameCount[naam]++;
    });
    const chips = nameOrder.length
      ? nameOrder.map(n => `<div class="day-meal-chip">${escapeHTML(n)}${nameCount[n] > 1 ? ` ×${nameCount[n]}` : ''}</div>`).join('')
      : `<span class="day-empty">Niets gelogd${multiSelectMode ? '' : ' — tik om toe te voegen'}</span>`;

    const clickFn = multiSelectMode ? `toggleDaySelection('${key}')` : `openDayPicker('${key}')`;
    return `<div class="day-card${isToday ? ' today' : ''}${isSelected ? ' day-selected' : ''}" onclick="${clickFn}">
      <div class="day-card-head">
        <div class="day-name">${DAG_NL[date.getDay()]} <span class="day-date">${date.getDate()} ${MAAND_NL[date.getMonth()]}</span></div>
        <div class="day-totals">${multiSelectMode
          ? `<span class="day-select-check">${isSelected ? '✓' : ''}</span>`
          : (totals.cal > 0 ? `🔥 ${totals.cal} · 💪 ${totals.eiwit}g` : '—')}</div>
      </div>
      <div class="day-meals">${chips}</div>
    </div>`;
  }).join('');
}

function changeWeek(delta) {
  currentWeekOffset += delta;
  renderDagboek();
}

function toggleSelectMode() {
  multiSelectMode = !multiSelectMode;
  selectedDays.clear();
  const bar = document.getElementById('select-bar');
  if (bar) bar.hidden = !multiSelectMode;
  updateSelectBar();
  renderDagboek();
}

function toggleDaySelection(key) {
  if (selectedDays.has(key)) {
    selectedDays.delete(key);
  } else {
    selectedDays.add(key);
  }
  updateSelectBar();
  renderDagboek();
}

function updateSelectBar() {
  const countEl = document.getElementById('select-count');
  const pasteBtn = document.getElementById('paste-btn');
  if (countEl) {
    const n = selectedDays.size;
    countEl.textContent = n === 0
      ? 'Tik op dagen om te selecteren'
      : `${n} dag${n !== 1 ? 'en' : ''} geselecteerd`;
  }
  if (pasteBtn) pasteBtn.hidden = !dayClipboard;
}

function copySelectedDays() {
  if (selectedDays.size === 0) { showToast('Selecteer eerst dagen'); return; }
  dayClipboard = [...selectedDays].sort().map(key => ({
    key,
    ids: [...(dagLog[key] || [])]
  }));
  const n = dayClipboard.length;
  showToast(`${n} dag${n !== 1 ? 'en' : ''} gekopieerd — selecteer doeldagen en tik Plakken`);
  selectedDays.clear();
  updateSelectBar();
  renderDagboek();
}

function pasteSelectedDays() {
  if (!dayClipboard || dayClipboard.length === 0) { showToast('Niets om te plakken'); return; }
  if (selectedDays.size === 0) { showToast('Selecteer doeldagen'); return; }
  const targets = [...selectedDays].sort();
  targets.forEach((targetKey, i) => {
    const src = dayClipboard[i % dayClipboard.length];
    dagLog[targetKey] = [...src.ids];
  });
  saveState();
  const n = targets.length;
  dayClipboard = null;
  selectedDays.clear();
  toggleSelectMode();
  showToast(`${n} dag${n !== 1 ? 'en' : ''} ingeplakt!`);
}

function exportSelectedDays() {
  if (selectedDays.size === 0) { showToast('Selecteer eerst dagen'); return; }
  const keys = [...selectedDays].sort();
  const lines = [];
  let totalCal = 0, totalEiwit = 0;
  keys.forEach(key => {
    const date = new Date(key + 'T12:00:00');
    const totals = getDayTotals(key);
    lines.push(`${DAG_NL[date.getDay()]} ${date.getDate()} ${MAAND_NL[date.getMonth()]}`);
    const ids = dagLog[key] || [];
    if (!ids.length) {
      lines.push('  Niets gelogd');
    } else {
      ids.forEach(id => {
        if (typeof id === 'number') {
          const m = meals.find(x => x.id === id);
          if (m) lines.push(`  • ${m.naam} (🔥 ${m.calorieen} · 💪 ${m.eiwitten}g)`);
        } else if (typeof id === 'string' && id.startsWith('c:')) {
          const item = parseCustomItem(id);
          const macros = item.kcal > 0 ? ` (🔥 ${item.kcal}${item.prot > 0 ? ` · 💪 ${item.prot}g` : ''})` : '';
          lines.push(`  • ${item.naam}${macros}${item.note ? ` — ${item.note}` : ''}`);
        }
      });
      lines.push(`  Totaal: 🔥 ${totals.cal} kcal · 💪 ${totals.eiwit}g`);
    }
    lines.push('');
    totalCal += totals.cal;
    totalEiwit += totals.eiwit;
  });
  if (keys.length > 1) lines.push(`Totaal ${keys.length} dagen: 🔥 ${totalCal} kcal · 💪 ${totalEiwit}g`);
  const text = lines.join('\n');
  if (navigator.share) {
    navigator.share({ title: 'Maaltijdplan', text }).catch(() => {});
  } else {
    navigator.clipboard.writeText(text)
      .then(() => showToast('Gekopieerd naar klembord!'))
      .catch(() => {
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy');
        document.body.removeChild(ta); showToast('Gekopieerd naar klembord!');
      });
  }
}

function openDayPicker(key) {
  selectedDayKey = key;
  renderDayPickerContent(key);
  document.getElementById('daypicker-modal').removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
}

function closeDayPicker() {
  document.getElementById('daypicker-modal').setAttribute('hidden', '');
  document.body.style.overflow = '';
  renderDagboek();
  selectedDayKey = null;
}

function renderDayPickerContent(key) {
  const date = new Date(key);
  const selected = dagLog[key] || [];
  const CAT_ORDER = ['ontbijt', 'lunch', 'snack', 'diner'];

  let html = `<div class="dp-header">${DAG_NL[date.getDay()]} ${date.getDate()} ${MAAND_NL[date.getMonth()]}</div>`;

  CAT_ORDER.forEach(cat => {
    const catMeals = meals.filter(m => (m.categorie || 'diner') === cat);
    if (!catMeals.length) return;
    html += `<div class="dp-cat-title">${CAT_LABELS[cat]}</div>`;
    catMeals.forEach(m => {
      const count = selected.filter(x => x === m.id).length;
      html += `<div class="dp-meal-row${count > 0 ? ' selected' : ''}">
        <div class="dp-meal-info" onclick="adjustDayMeal('${key}', ${m.id}, 1)">
          <span class="dp-meal-name">${escapeHTML(m.naam)}</span>
          <span class="dp-meal-macros">🔥 ${m.calorieen} kcal · 💪 ${m.eiwitten}g eiwit</span>
        </div>
        <div class="dp-counter">
          <button class="dp-counter-btn" onclick="adjustDayMeal('${key}', ${m.id}, -1)"${count === 0 ? ' disabled' : ''}>−</button>
          <span class="dp-counter-num">${count > 0 ? count : ''}</span>
          <button class="dp-counter-btn dp-counter-add" onclick="adjustDayMeal('${key}', ${m.id}, 1)">+</button>
        </div>
      </div>`;
    });
  });

  // Custom items
  const customEntries = selected.map((x, i) => ({ x, i })).filter(({ x }) => typeof x === 'string' && x.startsWith('c:'));
  if (customEntries.length) {
    html += `<div class="dp-cat-title">Eigen items</div>`;
    customEntries.forEach(({ x, i }) => {
      const item = parseCustomItem(x);
      const macroStr = item.kcal > 0 ? `🔥 ${item.kcal} kcal${item.prot > 0 ? ` · 💪 ${item.prot}g` : ''}` : '';
      html += `<div class="dp-meal-row selected">
        <div class="dp-meal-info" style="cursor:default">
          <span class="dp-meal-name">${escapeHTML(item.naam)}</span>
          ${(macroStr || item.note) ? `<span class="dp-meal-macros">${macroStr}${item.note ? (macroStr ? ' · ' : '') + escapeHTML(item.note) : ''}</span>` : ''}
        </div>
        <button class="dp-counter-btn" style="font-size:14px" onclick="removeDayItem('${key}', ${i})">✕</button>
      </div>`;
    });
  }

  html += `<div class="dp-custom-form">
    <div class="dp-custom-form-title">Eigen item toevoegen</div>
    <input id="dp-custom-naam" type="text" placeholder="Naam (bijv. banaan)" autocomplete="off"
      onkeydown="if(event.key==='Enter'){event.preventDefault();document.getElementById('dp-custom-kcal').focus();}">
    <div class="dp-custom-form-macros">
      <input id="dp-custom-kcal" type="number" placeholder="kcal" min="0"
        onkeydown="if(event.key==='Enter'){event.preventDefault();document.getElementById('dp-custom-prot').focus();}">
      <input id="dp-custom-prot" type="number" placeholder="eiwit g" min="0"
        onkeydown="if(event.key==='Enter'){event.preventDefault();addCustomDayItem('${key}');}">
    </div>
    <input id="dp-custom-note" type="text" placeholder="Notitie (optioneel)" autocomplete="off"
      onkeydown="if(event.key==='Enter'){event.preventDefault();addCustomDayItem('${key}');}">
    <button class="dp-custom-submit" onclick="addCustomDayItem('${key}')">+ Toevoegen</button>
  </div>`;

  const totals = getDayTotals(key);
  const hasSelected = selected.length > 0;

  html += `<button class="dp-done-btn" onclick="closeDayPicker()">
    Klaar${totals.cal > 0 ? ` · 🔥 ${totals.cal} kcal · 💪 ${totals.eiwit}g` : ''}
  </button>`;

  if (hasSelected) {
    html += `<button class="dp-add-shop-btn" onclick="addDayToShopping('${key}')">
      🛒 Ingrediënten van vandaag naar boodschappenlijst
    </button>`;
  }

  document.getElementById('daypicker-content').innerHTML = html;
}

function adjustDayMeal(key, mealId, delta) {
  if (!dagLog[key]) dagLog[key] = [];
  if (delta > 0) {
    dagLog[key].push(mealId);
  } else {
    const idx = dagLog[key].lastIndexOf(mealId);
    if (idx >= 0) dagLog[key].splice(idx, 1);
  }
  saveState();
  renderDayPickerContent(key);
}

function removeDayItem(key, idx) {
  if (!dagLog[key]) return;
  dagLog[key].splice(idx, 1);
  saveState();
  renderDayPickerContent(key);
}

function addCustomDayItem(key) {
  const naam = (document.getElementById('dp-custom-naam')?.value || '').trim();
  if (!naam) return;
  const kcal = Math.round(parseFloat(document.getElementById('dp-custom-kcal')?.value || '0') || 0);
  const prot = Math.round(parseFloat(document.getElementById('dp-custom-prot')?.value || '0') || 0);
  const note = (document.getElementById('dp-custom-note')?.value || '').trim();
  if (!dagLog[key]) dagLog[key] = [];
  dagLog[key].push(makeCustomEntry(naam, kcal, prot, note));
  saveState();
  renderDayPickerContent(key);
}

function addDayToShopping(key) {
  const ids = (dagLog[key] || []).filter(x => typeof x === 'number');
  let total = 0;
  ids.forEach(mealId => {
    const m = meals.find(x => x.id === mealId);
    if (m && m.ingredienten) {
      m.ingredienten.forEach(raw => mergeOrAddIngredient(raw, mealId));
      total += m.ingredienten.length;
    }
  });
  saveState();
  updateShoppingBadge();
  showToast(`${total} ingrediënten toegevoegd aan boodschappenlijst`);
}

function copyWeekSummary() {
  const days = getWeekDays(currentWeekOffset);
  const lines = [`Weekoverzicht ${formatWeekLabel(days[0], days[6])}\n`];
  let weekCal = 0, weekEiwit = 0;

  days.forEach(date => {
    const key = dateKey(date);
    const ids = dagLog[key] || [];
    const totals = getDayTotals(key);
    const dayLines = [];
    ids.forEach(id => {
      if (typeof id === 'number') {
        const m = meals.find(x => x.id === id);
        if (m) dayLines.push(`  ${CAT_LABELS[m.categorie || 'diner']} — ${m.naam} (🔥 ${m.calorieen} kcal · 💪 ${m.eiwitten}g eiwit)`);
      } else if (typeof id === 'string' && id.startsWith('c:')) {
        const ci = parseCustomItem(id);
        const macros = ci.kcal > 0 ? ` (🔥 ${ci.kcal} kcal${ci.prot > 0 ? ` · 💪 ${ci.prot}g` : ''})` : '';
        dayLines.push(`  Eigen item — ${ci.naam}${macros}`);
      }
    });

    lines.push(`${DAG_NL[date.getDay()]} ${date.getDate()} ${MAAND_NL[date.getMonth()]}`);
    if (dayLines.length) {
      dayLines.forEach(l => lines.push(l));
      lines.push(`  Totaal: 🔥 ${totals.cal} kcal · 💪 ${totals.eiwit}g eiwit`);
    } else {
      lines.push('  Niets gelogd');
    }
    lines.push('');
    weekCal += totals.cal;
    weekEiwit += totals.eiwit;
  });

  lines.push(`Weektotaal: 🔥 ${weekCal} kcal · 💪 ${weekEiwit}g eiwit`);
  const text = lines.join('\n');

  navigator.clipboard.writeText(text)
    .then(() => showToast('Weekoverzicht gekopieerd!'))
    .catch(() => {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select(); document.execCommand('copy');
      document.body.removeChild(ta); showToast('Weekoverzicht gekopieerd!');
    });
}

// ===== SERVICE WORKER =====
function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

// ===== EXPORT MEALS.JSON =====
function exportMealsJSON() {
  const blob = new Blob([JSON.stringify(meals, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'meals.json';
  a.click();
  URL.revokeObjectURL(a.href);
  showToast('meals.json gedownload!');
}

// ===== INIT =====
async function init() {
  let defaultMeals = [];
  try {
    const res = await fetch('./meals.json');
    defaultMeals = await res.json();
  } catch { /* blijf doorgaan met lege array als fetch mislukt */ }
  loadState(defaultMeals);
  renderMeals();
  updateShoppingBadge();
  initFilters();
  initColorPicker();
  initShoppingInput();
  initModalClose();
  registerSW();
}

document.addEventListener('DOMContentLoaded', init);
