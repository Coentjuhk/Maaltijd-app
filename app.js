// ============================================================
//  MaaltijdApp — app.js
// ============================================================

// ===== DEFAULT MEALS =====
const DEFAULT_MEALS = [
  {
    id: 1,
    naam: "Geroosterde Kip, Zoete Aardappel & Broccoli",
    emoji: "🍗",
    kleur: "orange",
    afbeelding: "./images/kip-zoete-aardappel.png",
    invriesbaar: true,
    dagtype: "rust",
    calorieen: 600,
    eiwitten: 45,
    ingredienten: [
      "600 g kipfilet",
      "800 g zoete aardappel",
      "600 g broccoli",
      "2½ el olijfolie",
      "Paprikapoeder",
      "Knoflookpoeder",
      "Peper",
      "Zout"
    ],
    bereidingswijze: `Verwarm de oven voor op 200 °C.

Schil de zoete aardappelen en snijd ze in blokjes van ±2–3 cm. Meng met 1½ el olijfolie, peper en zout en verdeel over een bakplaat.

Rooster de zoete aardappel 15 minuten in de oven.

Snijd ondertussen de kipfilet in grove stukken en meng met 1 el olijfolie, paprikapoeder, knoflookpoeder, peper en zout.

Snijd de broccoli in kleine roosjes.

Haal de bakplaat uit de oven, voeg kip en broccoli toe en schep alles door elkaar.

Zet de bakplaat nog 20 minuten terug in de oven tot alles gaar is.

Verdeel over 4 porties.`,
    porties: 4,
    bewaren: "3–4 dagen koelkast | goed invriesbaar"
  },
  {
    id: 2,
    naam: "Zalm met Quinoa & Geroosterde Groenten",
    emoji: "🐟",
    kleur: "teal",
    afbeelding: "./images/zalm-quinoa.png",
    invriesbaar: false,
    dagtype: "sport",
    calorieen: 650,
    eiwitten: 40,
    ingredienten: [
      "300 g zalmfilet",
      "150 g quinoa (ongekookt)",
      "300 g courgette en paprika",
      "1½ el olijfolie",
      "Citroensap",
      "Peper",
      "Zout"
    ],
    bereidingswijze: `Verwarm de oven voor op 180 °C.

Snijd de groenten grof en meng met olijfolie, peper en zout. Verdeel over een bakplaat en rooster 20–25 minuten.

Spoel de quinoa goed af en kook volgens de verpakking (±12–15 minuten).

Leg de zalm op bakpapier en besprenkel met citroensap, peper en zout. Bak de zalm 12–15 minuten in de oven.

Verdeel quinoa, groenten en zalm over 2 porties.`,
    porties: 2,
    bewaren: "Max. 2 dagen koelkast | liever niet invriezen"
  },
  {
    id: 3,
    naam: "Kip Bolognese met Volkoren Pasta",
    emoji: "🍝",
    kleur: "red",
    afbeelding: "./images/kip-bolognese.png",
    invriesbaar: true,
    dagtype: "sport",
    calorieen: 620,
    eiwitten: 45,
    ingredienten: [
      "600 g kipgehakt",
      "300 g volkoren pasta (ongekookt)",
      "400 g tomatenblokjes (blik)",
      "1 grote ui",
      "1 grote wortel",
      "Italiaanse kruiden",
      "Peper",
      "Zout"
    ],
    bereidingswijze: `Snipper de ui en rasp de wortel.

Verhit een grote pan op middelhoog vuur en bak het kipgehakt rul en goudbruin.

Voeg ui en wortel toe en bak 5 minuten mee.

Voeg tomatenblokjes en Italiaanse kruiden toe. Laat de saus 15–20 minuten zachtjes pruttelen op laag vuur.

Kook ondertussen de pasta volgens de verpakking.

Meng pasta en saus of bewaar apart voor meal prep.

Verdeel over 4 maaltijden.`,
    porties: 4,
    bewaren: "4 dagen koelkast | zeer goed invriesbaar"
  },
  {
    id: 4,
    naam: "Griekse Kip met Couscous & Gegrilde Groenten",
    emoji: "🥙",
    kleur: "blue",
    afbeelding: "./images/griekse-kip-couscous.png",
    invriesbaar: false,
    dagtype: "rust",
    calorieen: 600,
    eiwitten: 45,
    ingredienten: [
      "600 g kipfilet",
      "300 g volkoren couscous",
      "400 g paprika, courgette en rode ui",
      "2½ el olijfolie",
      "Citroensap",
      "Oregano",
      "Peper",
      "Zout"
    ],
    bereidingswijze: `Verwarm de oven voor op 200 °C.

Snijd de kipfilet in stukken en meng met olijfolie, citroensap, oregano, peper en zout.

Snijd de groenten grof en verdeel over een bakplaat. Rooster de groenten 20–25 minuten.

Bak de kip in een pan 6–8 minuten tot gaar.

Bereid de couscous met heet water volgens de verpakking (laat 5 minuten staan, roer daarna los met een vork).

Meng couscous, kip en groenten. Verdeel over 4 porties.`,
    porties: 4,
    bewaren: "3–4 dagen koelkast | matig invriesbaar"
  },
  {
    id: 5,
    naam: "Tofu Roerbak met Groenten & Zilvervliesrijst",
    emoji: "🥡",
    kleur: "green",
    afbeelding: "./images/tofu-roerbak.png",
    invriesbaar: false,
    dagtype: "rust",
    calorieen: 580,
    eiwitten: 37,
    ingredienten: [
      "300 g tofu (stevig)",
      "150 g zilvervliesrijst",
      "200 g roerbakgroenten",
      "2 el sojasaus",
      "1 el sesamolie"
    ],
    bereidingswijze: `Kook de zilvervliesrijst volgens de verpakking.

Snijd de tofu in blokjes en dep droog met keukenpapier (dit zorgt voor een knapperige korst).

Verhit de sesamolie in een wok of koekenpan op hoog vuur en bak de tofu goudbruin, ±5–7 minuten.

Voeg de groenten toe en roerbak 5–7 minuten tot gaar maar nog knapperig.

Voeg sojasaus toe en meng goed.

Meng met de rijst en verdeel over 2 porties.`,
    porties: 2,
    bewaren: "3 dagen koelkast | niet ideaal invriezen"
  },
  {
    id: 6,
    naam: "Rundergehakt met Paprika & Rijst",
    emoji: "🥩",
    kleur: "brown",
    afbeelding: "./images/rundergehakt-paprika.png",
    invriesbaar: true,
    dagtype: "rust",
    calorieen: 630,
    eiwitten: 42,
    ingredienten: [
      "600 g mager rundergehakt",
      "300 g zilvervliesrijst",
      "4 paprika's (gemengd)",
      "1 grote ui",
      "Paprikapoeder",
      "Komijn",
      "Peper",
      "Zout"
    ],
    bereidingswijze: `Kook de rijst volgens de verpakking.

Snipper de ui en snijd de paprika in reepjes.

Verhit een pan op middelhoog vuur en bak de ui 2–3 minuten tot glazig.

Voeg het rundergehakt toe en bak rul en bruin.

Voeg paprika, paprikapoeder en komijn toe en bak 7 minuten mee.

Breng op smaak met peper en zout.

Verdeel samen met rijst over 4 porties.`,
    porties: 4,
    bewaren: "4 dagen koelkast | goed invriesbaar"
  },
  {
    id: 7,
    naam: "Rijstnoedels met Kip & Roerbakgroenten",
    emoji: "🍜",
    kleur: "purple",
    afbeelding: "./images/rijstnoedels-kip.png",
    invriesbaar: false,
    dagtype: "sport",
    calorieen: 600,
    eiwitten: 40,
    ingredienten: [
      "300 g kipfilet",
      "130 g rijstnoedels",
      "200 g roerbakgroenten",
      "2 el sojasaus",
      "1 el sesamolie",
      "1 teentje knoflook (optioneel)",
      "Stukje gember (optioneel)"
    ],
    bereidingswijze: `Bereid de rijstnoedels volgens de verpakking (week of kook kort).

Snijd de kipfilet in dunne reepjes.

Verhit de olie in een wok op hoog vuur en bak de kip 4–5 minuten gaar.

Voeg knoflook, gember en de groenten toe. Roerbak 5–7 minuten op hoog vuur.

Voeg noedels en sojasaus toe en meng alles goed door.

Verdeel over 2 porties.`,
    porties: 2,
    bewaren: "2–3 dagen koelkast | niet invriezen"
  },
  {
    id: 8,
    naam: "Kip Teriyaki met Rijst & Broccoli",
    emoji: "🍱",
    kleur: "teal",
    afbeelding: "./images/kip-teriyaki.png",
    invriesbaar: true,
    dagtype: "sport",
    calorieen: 610,
    eiwitten: 45,
    ingredienten: [
      "600 g kipfilet",
      "300 g zilvervliesrijst",
      "600 g broccoli",
      "4 el teriyakisaus (light)"
    ],
    bereidingswijze: `Kook de rijst volgens de verpakking.

Snijd de kipfilet in blokjes.

Verhit een koekenpan op middelhoog vuur en bak de kip goudbruin, ±6–8 minuten.

Voeg de teriyakisaus toe en laat 2–3 minuten karamelliseren terwijl je blijft roeren.

Kook of stoom de broccoli 4–5 minuten tot beetgaar.

Meng alles en verdeel over 4 porties.`,
    porties: 4,
    bewaren: "3–4 dagen koelkast | goed invriesbaar"
  },
  {
    id: 9,
    naam: "Chili con Carne met Rijst",
    emoji: "🌶️",
    kleur: "red",
    afbeelding: "./images/chili-con-carne.png",
    invriesbaar: true,
    dagtype: "beide",
    calorieen: 620,
    eiwitten: 45,
    ingredienten: [
      "600 g mager rundergehakt",
      "300 g zilvervliesrijst",
      "1 blik kidneybonen (uitgelekt)",
      "1 blik tomatenblokjes",
      "1 paprika",
      "1 ui",
      "2 teentjes knoflook",
      "Chilipoeder",
      "Komijn"
    ],
    bereidingswijze: `Kook de rijst volgens de verpakking.

Snipper de ui en knoflook. Snijd de paprika in blokjes.

Bak ui en knoflook 2–3 minuten in een pan tot glazig.

Voeg het rundergehakt toe en bak rul en bruin.

Voeg paprika toe en bak 3 minuten mee.

Voeg tomatenblokjes, kidneybonen, chilipoeder en komijn toe. Breng op smaak met peper en zout.

Laat de chili 15–20 minuten sudderen op laag vuur.

Verdeel samen met rijst over 4 porties.`,
    porties: 4,
    bewaren: "4 dagen koelkast | zeer goed invriesbaar"
  },
  {
    id: 11,
    naam: "Turkse Gehakt Schotel met Aardappel",
    emoji: "🥘",
    kleur: "brown",
    afbeelding: "./images/turkse-gehakt-schotel.png",
    invriesbaar: true,
    dagtype: "rust",
    calorieen: 630,
    eiwitten: 45,
    ingredienten: [
      "600 g mager rundergehakt",
      "800 g aardappelen",
      "2 paprika's",
      "1 grote ui",
      "400 g tomatenblokjes (blik)",
      "2 teentjes knoflook",
      "Paprikapoeder",
      "Komijn",
      "Olijfolie",
      "Peper",
      "Zout"
    ],
    bereidingswijze: `Verwarm de oven voor op 200 °C.

Schil de aardappelen en snijd ze in blokjes van ±2 cm. Meng met olijfolie, peper en zout en verdeel over een bakplaat. Rooster 20 minuten.

Bak het rundergehakt rul en bruin in een grote pan.

Snipper de ui en knoflook, snijd de paprika's in reepjes. Voeg toe aan het gehakt en bak 5 minuten mee.

Voeg tomatenblokjes, paprikapoeder en komijn toe. Laat 10 minuten sudderen op laag vuur.

Meng met de geroosterde aardappelen of serveer apart.

Verdeel over 4 porties.`,
    porties: 4,
    bewaren: "4 dagen koelkast | goed invriesbaar"
  },
  {
    id: 10,
    naam: "Kip Curry met Rijst",
    emoji: "🍛",
    kleur: "orange",
    afbeelding: "./images/kip-curry.png",
    invriesbaar: true,
    dagtype: "sport",
    calorieen: 600,
    eiwitten: 45,
    ingredienten: [
      "600 g kipfilet",
      "300 g zilvervliesrijst",
      "400 g roerbakgroenten",
      "400 ml lichte kokosmelk",
      "2 el currypasta"
    ],
    bereidingswijze: `Kook de rijst volgens de verpakking.

Snijd de kipfilet in blokjes.

Verhit een pan op middelhoog vuur en bak de kip 5 minuten aan alle kanten bruin.

Voeg de currypasta toe en bak 1 minuut mee.

Voeg de groenten toe en bak 3 minuten mee.

Voeg de kokosmelk toe en roer goed door. Laat 10–15 minuten zachtjes sudderen tot de saus indikt.

Serveer met rijst en verdeel over 4 porties.`,
    porties: 4,
    bewaren: "3–4 dagen koelkast | goed invriesbaar"
  }
];

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

const CAT_LABELS = { ontbijt: '🌅 Ontbijt', lunch: '🥗 Lunch', snack: '🍎 Snack', diner: '🍽️ Diner' };
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

function loadState() {
  try {
    const m = localStorage.getItem('ma_meals');
    if (m) {
      const loaded = JSON.parse(m);
      // Merge: voeg afbeelding toe aan bestaande maaltijden als DEFAULT_MEALS die heeft
      meals = loaded.map(meal => {
        if (!meal.afbeelding) {
          const def = DEFAULT_MEALS.find(d => d.id === meal.id);
          if (def && def.afbeelding) return { ...meal, afbeelding: def.afbeelding };
        }
        return meal;
      });
    } else {
      meals = JSON.parse(JSON.stringify(DEFAULT_MEALS));
    }
  } catch { meals = JSON.parse(JSON.stringify(DEFAULT_MEALS)); }

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

  list.innerHTML = visible.map(m => mealCardHTML(m)).join('');
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
      <p class="detail-bereiding">${escapeHTML(m.bereidingswijze || '—')}</p>

      <button class="detail-add-btn" onclick="addIngredientsToShopping(${m.id})">
        🛒 Ingrediënten naar boodschappenlijst
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
    bereidingswijze: bereiding
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
    const m = meals.find(x => x.id === id);
    if (m) { acc.cal += m.calorieen || 0; acc.eiwit += m.eiwitten || 0; }
    return acc;
  }, { cal: 0, eiwit: 0 });
}

function renderDagboek() {
  const days = getWeekDays(currentWeekOffset);
  const todayKey = dateKey(new Date());
  document.getElementById('week-label').textContent = formatWeekLabel(days[0], days[6]);

  const list = document.getElementById('dagboek-list');
  list.innerHTML = days.map(date => {
    const key = dateKey(date);
    const isToday = key === todayKey;
    const dayMeals = (dagLog[key] || []).map(id => meals.find(m => m.id === id)).filter(Boolean);
    const totals = getDayTotals(key);

    const chips = dayMeals.length
      ? dayMeals.map(m => `<div class="day-meal-chip">${escapeHTML(m.naam)}</div>`).join('')
      : `<span class="day-empty">Niets gelogd — tik om toe te voegen</span>`;

    return `<div class="day-card${isToday ? ' today' : ''}" onclick="openDayPicker('${key}')">
      <div class="day-card-head">
        <div class="day-name">${DAG_NL[date.getDay()]} <span class="day-date">${date.getDate()} ${MAAND_NL[date.getMonth()]}</span></div>
        <div class="day-totals">${totals.cal > 0 ? `🔥 ${totals.cal} · 💪 ${totals.eiwit}g` : '—'}</div>
      </div>
      <div class="day-meals">${chips}</div>
    </div>`;
  }).join('');
}

function changeWeek(delta) {
  currentWeekOffset += delta;
  renderDagboek();
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
      const on = selected.includes(m.id);
      html += `<div class="dp-meal-row${on ? ' selected' : ''}" onclick="toggleDayMeal('${key}', ${m.id})">
        <div class="dp-check${on ? ' on' : ''}">${on ? '✓' : ''}</div>
        <div class="dp-meal-info">
          <span class="dp-meal-name">${escapeHTML(m.naam)}</span>
          <span class="dp-meal-macros">🔥 ${m.calorieen} kcal · 💪 ${m.eiwitten}g eiwit</span>
        </div>
      </div>`;
    });
  });

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

function toggleDayMeal(key, mealId) {
  if (!dagLog[key]) dagLog[key] = [];
  const idx = dagLog[key].indexOf(mealId);
  if (idx >= 0) dagLog[key].splice(idx, 1);
  else dagLog[key].push(mealId);
  saveState();
  renderDayPickerContent(key);
}

function addDayToShopping(key) {
  const ids = dagLog[key] || [];
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
    const dayMeals = ids.map(id => meals.find(m => m.id === id)).filter(Boolean);
    const totals = getDayTotals(key);

    lines.push(`${DAG_NL[date.getDay()]} ${date.getDate()} ${MAAND_NL[date.getMonth()]}`);
    if (dayMeals.length) {
      dayMeals.forEach(m => {
        const cat = CAT_LABELS[m.categorie || 'diner'];
        lines.push(`  ${cat} — ${m.naam} (🔥 ${m.calorieen} kcal · 💪 ${m.eiwitten}g eiwit)`);
      });
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

// ===== INIT =====
function init() {
  loadState();
  renderMeals();
  updateShoppingBadge();
  initFilters();
  initColorPicker();
  initShoppingInput();
  initModalClose();
  registerSW();
}

document.addEventListener('DOMContentLoaded', init);
