// המסך הגדול — בית הספר שלהבות מתמלא בחיים עם כל חזון שנשלח
// עובד בשני מצבים: מהשרת במחשב המציג, או מגיטהאב (STATIC_SITE) — שם הוא מתחבר לשרת החי אם הוא פועל, ואם לא מציג הדגמה
import { TOPIC, classify, gist, domainOf } from './topics.js';
import { pickItems, scoreItems, ITEM } from './items.js';
import { placeItem } from './items-place.js';

const $ = (s, el = document) => el.querySelector(s);
const app = $('#app');
const IMG = 'images/web/';
const STATIC = !!window.STATIC_SITE;
const LIVE_JSON = 'https://api.github.com/repos/ea649/shalhevet-games/contents/vision/live.json';
let API = '';        // כתובת השרת החי ('' = אותו שרת)
let DEMO_MODE = false;
let M = {};          // מידות האיורים (manifest)
const img = p => (p.startsWith('gen/') ? API : '') + IMG + p + '.png'; // איורי זמן אמת נמצאים רק בשרת החי

// ---------- גאומטריה (בפיקסלים של קנבס 1920×1080) ----------
const SCHOOL = { x: 390, y: 250, w: 980, h: 609 };
// החלונות בתמונת בית הספר — יחסיים לגודל התמונה (נמדדו מהאיור). סדר = סדר המילוי
const WIN = [
  [.2007, .3816, .0614, .146], [.7357, .3828, .0643, .1448], [.1129, .3816, .0621, .146], [.8279, .3828, .0614, .1448],
  [.2871, .3828, .0614, .1448], [.6457, .3828, .0629, .1448], [.4371, .3138, .0596, .2172], [.4967, .3138, .0597, .2172],
  [.2, .6471, .0614, .1448], [.7357, .6471, .0643, .1448], [.1121, .6471, .0621, .1448], [.8279, .6471, .0607, .1448],
  [.2871, .6471, .0607, .1448], [.6457, .6471, .0629, .1448]];
const SIGN = [.3507, .1115, .2793, .1115];   // השלט הלבן על החזית — שם הלוגו של בית הספר
// מקומות לקבוצות: מרכז־תחתית וגובה
const SPOTS = {
  front: [{ x: 720, y: 1074, h: 300 }, { x: 1040, y: 1074, h: 300 }, { x: 420, y: 1074, h: 300 }, { x: 1340, y: 1074, h: 300 },
    { x: 590, y: 912, h: 232 }, { x: 1160, y: 912, h: 232 }],
  side: [{ x: 352, y: 902, h: 240 }, { x: 1412, y: 902, h: 240 }],
  roof: [{ x: 586, y: 432, h: 150 }, { x: 1174, y: 432, h: 150 }, { x: 870, y: 324, h: 112 }],
};
// גיוון: כל תשובה מקבלת מקום אחר — לפני בית הספר, בחלון, על הגג, בצד...
const CYCLE = ['front', 'window', 'roof', 'front', 'window', 'side', 'front', 'roof', 'window', 'front'];
const VISION_SIGN = [.1994, .0244, .6057, .2622];
const BOYS = ['b1', 'b2', 'b3', 'b4'], GIRLS = ['g1', 'g2', 'g3'];
const DECO = {
  sun: { x: 296, y: 78, w: 150 }, plane: { x: 1240, y: 96, w: 170 }, planet: { x: 440, y: 150, w: 88 },
  comet: { x: 1236, y: 200, w: 150 }, star: { x: 292, y: 270, w: 96 },
  rocket: { x: 250, y: 300, w: 120, fly: { dx: '1250px', dy: '-560px' } },
};
const SKY_SPOTS = [[330, 70, 1400, 170], [300, 300, 370, 760], [1400, 580, 1430, 780]];

// ---------- מצב ----------
const S = { answers: [], items: [], wins: Array(WIN.length).fill(null), byId: new Map(), order: 0, n: 0,
  focus: null, queue: [], flying: false, tour: false, lastClose: 0, tourIdx: -1, local: false, pending: new Map(), demoN: 0 };
const visible = () => S.answers.filter(a => a.status !== 'pending');

function rng(seed) {
  let h = 1779033703 ^ seed.length;
  for (const c of seed) { h = Math.imul(h ^ c.charCodeAt(0), 3432918353); h = h << 13 | h >>> 19; }
  return () => { h = Math.imul(h ^ h >>> 16, 2246822507); h = Math.imul(h ^ h >>> 13, 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; };
}
const pick = (arr, r = Math.random) => arr[Math.floor(r() * arr.length)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---------- מה מציגים לתשובה ----------
// לכל נושא יש איור בנים (-b) ואיור בנות (-g) — אף פעם לא ביחד. בוחרים את מה שעוד לא על הבמה
function variant(a, T) {
  const has = g => M[`scenes/${T.id}-${g}`];
  if (T.windows === 'boys') return has('b') ? 'b' : null;
  if (T.windows === 'girls') return has('g') ? 'g' : null;
  if (has('b') && has('g')) {
    const on = g => S.items.some(it => it.key === `scenes/${T.id}-${g}`);
    if (on('b') !== on('g')) return on('b') ? 'g' : 'b';
    return rng(a.id + T.id)() < .5 ? 'b' : 'g';
  }
  return has('b') ? 'b' : has('g') ? 'g' : null;
}
function info(a) {
  const t = a.topics?.[0];
  if (t === 'custom' && a.custom) return { id: 'custom', key: a.custom.scene, label: a.custom.label, color: a.custom.color, icon: img(a.custom.icon),
    scene: img(a.custom.scene), ar: a.custom.w / a.custom.h, unique: true, gender: a.custom.gender };
  const T = TOPIC[t] && t !== 'custom' ? TOPIC[t] : TOPIC.vision, v = variant(a, T);
  const key = v ? `scenes/${T.id}-${v}` : `scenes/${T.id}`, m = M[key] || { w: 1, h: 1 };
  const icon = T.logo && M[T.logo] ? img(T.logo) : img(`icons/${T.id}`);
  return { id: T.id, key, label: T.label, color: T.color, icon, scene: img(key), ar: m.w / m.h, unique: T.id === 'vision',
    sign: T.id === 'vision' ? (m.sign || VISION_SIGN) : null, gender: v || (T.windows === 'boys' ? 'b' : T.windows === 'girls' ? 'g' : null) };
}
// אייקון / לוגו של תחום המנהלת
function domainIcons(a) {
  const d = domainOf(a.domain); if (!d) return [];
  const one = (p, fb) => M[p] ? img(p) : fb && M[fb] ? img(fb) : null;
  if (d.id === 'chayalei' && /מורשת/.test(a.domain)) return [one('logos/moreshet'), one('logos/chayalei')].filter(Boolean);
  return [one(d.icon, d.fallback)].filter(Boolean);
}

// ---------- התאמת הקנבס לחלון ----------
function fit() { app.style.transform = `scale(${Math.min(innerWidth / 1920, innerHeight / 1080)})`; }
addEventListener('resize', fit); fit();

// ---------- בית הספר: לוגו בשלט, חלונות ----------
function buildSchool() {
  const [sx, sy, sw, sh] = SIGN, pad = 10;
  Object.assign($('.sign-panel').style, { left: SCHOOL.x + sx * SCHOOL.w - pad + 'px', top: SCHOOL.y + sy * SCHOOL.h - pad + 'px',
    width: sw * SCHOOL.w + pad * 2 + 'px', height: sh * SCHOOL.h + pad * 2 + 'px' });
  const box = $('#windows');
  for (const [x, y, w, h] of WIN) {
    const d = document.createElement('div'); d.className = 'win';
    Object.assign(d.style, { left: SCHOOL.x + x * SCHOOL.w + 'px', top: SCHOOL.y + y * SCHOOL.h + 'px', width: w * SCHOOL.w + 'px', height: h * SCHOOL.h + 'px' });
    box.append(d);
  }
  if (M['logos/bidenu']) $('.logo').src = img('logos/bidenu'); else $('.side').classList.add('nologo');
}
const winRect = i => { const [x, y, w, h] = WIN[i]; return { x: SCHOOL.x + x * SCHOOL.w, y: SCHOOL.y + y * SCHOOL.h, w: w * SCHOOL.w, h: h * SCHOOL.h }; };
// ילד בחלון — גדול, הראש יוצא מעל המסגרת. held = אייקון הנושא שהוא מחזיק
function showWindow(i, animate, delay = 0) {
  const d = $('#windows').children[i], w = S.wins[i];
  d.classList.remove('on', 'answer');
  d.innerHTML = '';
  if (!w) return;
  d.innerHTML = `<img class="kid" src="${img('kids/' + w.kid)}" alt="">` + (w.icon ? `<img class="held" src="${w.icon}" alt="">` : '');
  if (w.icon) d.classList.add('answer'), d.style.setProperty('--tc', w.color);
  const k = d.querySelector('.kid');
  if (!animate) { k.style.transition = 'none'; d.classList.add('on'); requestAnimationFrame(() => k.style.transition = ''); }
  else setTimeout(() => d.classList.add('on'), delay);
}

// ---------- קבוצות על הבמה (לפני בית הספר / בצד / על הגג) ----------
function signText(cls, text, w, h, rect = VISION_SIGN) {
  const box = document.createElement('div'); box.className = cls;
  const [fx, fy, fw, fh] = rect, sw = fw * w, sh = fh * h, len = Math.max(text.length, 5);
  Object.assign(box.style, { left: fx * w + 'px', top: fy * h + 'px', width: sw + 'px', height: sh + 'px',
    fontSize: Math.min(sh * .4, sw * 1.75 / len, sw * .2) + 'px' });
  box.textContent = text;
  return box;
}
function makeGroup(a, inf, kind, slot) {
  const sp = SPOTS[kind][slot], h = sp.h, w = h * inf.ar;
  const el = document.createElement('div'); el.className = 'scene k-' + kind; // לא 'side' — זה שם העמודה הימנית
  el.style.cssText = `left:${sp.x - w / 2}px; top:${sp.y - h}px; width:${w}px; height:${h}px; z-index:${kind === 'roof' ? 1 : sp.y}; --tc:${inf.color}`;
  el.innerHTML = `<img src="${inf.scene}" alt="">`;
  if (inf.sign) el.append(signText('sign-text', gist(a.text), w, h, inf.sign));
  const it = { el, kind, slot, key: inf.unique ? null : inf.key, ids: [a.id], order: 0, rect: { x: sp.x - w / 2, y: sp.y - h, w, h } };
  el.onclick = () => openReplay(S.answers.find(x => x.id === it.ids[it.ids.length - 1]));
  (kind === 'roof' ? $('#roof') : $('#scenes')).append(el);
  return it;
}
function badge(it) {
  if (!it.el) return;
  $('.badge', it.el)?.remove();
  if (it.ids.length > 1) it.el.insertAdjacentHTML('beforeend', `<div class="badge">${it.ids.length}</div>`);
}
function removeItem(it, animate) {
  S.items = S.items.filter(x => x !== it);
  if (it.kind === 'window') { for (const i of it.wins) { S.wins[i] = null; showWindow(i, false); } return; }
  if (animate) { it.el.classList.add('out'); setTimeout(() => it.el.remove(), 700); } else it.el.remove();
}
const freeSlot = kind => kind === 'window' ? (S.wins.findIndex(w => !w) >= 0 ? 0 : -1)
  : SPOTS[kind].findIndex((_, i) => !S.items.some(it => it.kind === kind && it.slot === i));

// ---------- מאגר הפריטים (מהסשן "מאגר אפשרויות לתיאור בית הספר"): איור שמתאים לתשובה עצמה + חפצים מרחפים ----------
const BANK = { used: new Set(), placed: [], els: [] }, MAX_FLOATS = 12;
let BM = {}; // מידות פריטי המאגר
// איור מהמאגר במקום האיור הכללי של הנושא — רק כשיש מילה בתשובה שמתאימה לו, ורק מאותו מין כמו שנבחר
function bankScene(a, gender) {
  const t = a.topics?.[0];
  if (t === 'custom' || t === 'vision' || TOPIC[t]?.windows) return null; // לאיורי זמן אמת ולשלט יש איור משלהם
  const ok = x => (x.kind === 'kid' || x.kind === 'big') && (!x.g || !gender || x.g === gender) && BM[x.id];
  if (!scoreItems(a.text).some(x => x.own.length && ok(ITEM[x.id]))) return null; // אין התאמה ממשית → האיור של הנושא
  const it = pickItems(a.text, { used: BANK.used, rand: rng('bank' + a.id), max: 1, filter: ok })[0];
  if (!it) return null;
  BANK.used.add(it.id);
  return { src: img('items/' + it.id), ar: BM[it.id].w / BM[it.id].h, key: 'items/' + it.id };
}
// 1–2 חפצים מרחפים סביב בית הספר, שלא מכסים קבוצות, חלונות, קישוטים והחיווי העליון
function bankFloats(a, animate) {
  if (!Object.keys(BM).length) return;
  const r = rng('bankf' + a.id);
  const avoid = [...SPOTS.front, ...SPOTS.side, ...SPOTS.roof,
    ...WIN.map((_, i) => { const q = winRect(i); return { x: q.x - 10, y: q.y - 34, w: q.w + 20, h: q.h + 34 }; }),
    ...Object.values(DECO).map(d => ({ x: d.x, y: d.y, w: d.w, h: d.w })), { l: 1320, t: 40, r: 1500, b: 600 }]; // + השאלה מימין
  for (const it of pickItems(a.text, { used: BANK.used, rand: r, max: 1, filter: x => (x.zone === 'float' || x.zone === 'sky') && BM[x.id] })) {
    const p = placeItem(it, BM[it.id], BANK.placed, r, { avoid });
    BANK.placed.push(p); BANK.used.add(it.id);
    const el = document.createElement('img'); el.className = 'bank-float' + (animate ? ' in' : ''); el.src = img('items/' + it.id); el.alt = '';
    Object.assign(el.style, { left: p.rect.l + 'px', top: p.rect.t + 'px', width: p.w + 'px', height: p.h + 'px', zIndex: p.z, animationDelay: animate ? '' : (-r() * 6).toFixed(1) + 's' });
    $('#bankLayer').append(el); BANK.els.push(el);
    // לא יותר מדי חפצים בשמיים — הוותיק מפנה מקום
    if (BANK.els.length > MAX_FLOATS) { BANK.els.shift().remove(); BANK.placed.shift(); }
  }
}

// איפה התשובה תופיע: לפני בית הספר, בחלון, על הגג, בצד... (בלי לשנות מצב — נקרא גם לפני ההצגה)
function chooseKind(a) {
  const T = TOPIC[a.topics?.[0]] || {};
  let kind = T.windows ? 'window' : CYCLE[S.n % CYCLE.length];
  if (freeSlot(kind) < 0) kind = ['front', 'window', 'roof', 'side'].find(k => freeSlot(k) >= 0) || kind;
  return kind;
}
// לתשובה חדשה מחליטים מראש מקום ואיור, כדי שההצגה הגדולה תראה בדיוק את מה שיעוף לבמה
function prepare(a) {
  if (a._kind) return;
  a._kind = chooseKind(a);
  a._bank = a._kind === 'front' || a._kind === 'side' ? bankScene(a, info(a).gender) || false : false;
}

// מוסיף תשובה לבמה. מחזיר מה השתנה כדי להנפיש
function place(a, animate) {
  prepare(a);
  const inf = info(a), T = TOPIC[a.topics?.[0]] || {};
  S.n++;
  let kind = a._kind;
  const key = a._bank ? a._bank.key : inf.key;
  // אותו איור כבר על הבמה → מצטרפים אליו
  const same = !inf.unique && S.items.find(it => it.key === key && it.kind !== 'window');
  if (same && kind !== 'window') {
    same.ids.push(a.id); same.order = ++S.order; S.byId.set(a.id, same);
    if (!animate) badge(same);
    return { it: same, fresh: false, inf };
  }
  // אין מקום מהסוג הזה → מנסים סוג אחר, ואם אין בכלל — מפנים את הוותיק ביותר מאותו סוג
  if (freeSlot(kind) < 0) kind = ['front', 'window', 'roof', 'side'].find(k => freeSlot(k) >= 0) || kind;
  if (freeSlot(kind) < 0) {
    const old = S.items.filter(it => it.kind === kind).reduce((m, it) => !m || it.order < m.order ? it : m, null);
    if (old) removeItem(old, animate);
  }
  let it;
  if (kind === 'window') {
    const r = rng(a.id), count = T.windows ? 3 : 1, wins = [];
    const gender = inf.gender || (r() < .5 ? 'b' : 'g'), pool = gender === 'b' ? BOYS : GIRLS;
    for (let k = 0; k < count; k++) {
      let i = S.wins.findIndex(w => !w);
      if (i < 0) break;
      S.wins[i] = { kid: pick(pool, r), icon: k === 0 ? inf.icon : null, color: inf.color, aid: a.id };
      wins.push(i);
    }
    const rects = wins.map(winRect), x0 = Math.min(...rects.map(q => q.x)), y0 = Math.min(...rects.map(q => q.y));
    it = { kind, wins, key: null, ids: [a.id], order: 0,
      rect: { x: x0 - 20, y: y0 - 30, w: Math.max(...rects.map(q => q.x + q.w)) - x0 + 40, h: Math.max(...rects.map(q => q.y + q.h)) - y0 + 30 } };
    if (!animate) wins.forEach(i => showWindow(i, false));
  } else {
    const ginf = a._bank && (kind === 'front' || kind === 'side') ? { ...inf, scene: a._bank.src, ar: a._bank.ar, key: a._bank.key } : inf;
    it = makeGroup(a, ginf, kind, Math.max(0, freeSlot(kind)));
  }
  it.order = ++S.order; S.items.push(it); S.byId.set(a.id, it);
  return { it, fresh: true, inf };
}

function rebuild() {
  $('#scenes').innerHTML = ''; $('#roof').innerHTML = ''; $('#bankLayer').innerHTML = '';
  S.items = []; S.byId.clear(); S.order = 0; S.n = 0; S.wins.fill(null);
  BANK.used.clear(); BANK.placed = []; BANK.els = [];
  [...$('#windows').children].forEach(d => { d.classList.remove('on', 'answer'); d.innerHTML = ''; });
  for (const a of S.answers) { delete a._kind; delete a._bank; }
  for (const a of visible()) { place(a, false); bankFloats(a, false); }
  renderTiles(); refreshExtras();
}

// ---------- סרגל החזונות ----------
function tileHtml(a, n) {
  const inf = info(a), dom = domainIcons(a)[0];
  return `<div class="tile${a.demo ? ' demo' : ''}" data-id="${a.id}" style="--tc:${inf.color}" title="${esc(inf.label)}">
    ${dom ? `<img class="dom" src="${dom}" alt="">` : '<i class="dot"></i>'}<span class="no">${String(n).padStart(2, '0')}</span>
    <img class="ic" src="${inf.icon}" alt=""><span class="nm">${esc(a.name)}</span></div>`;
}
function renderTiles(newId) {
  const list = visible(), box = $('#tiles');
  box.innerHTML = list.length ? list.map((a, i) => tileHtml(a, i + 1)).reverse().join('') : '<i class="tile-ghost"></i>'.repeat(6);
  if (newId) box.querySelector(`[data-id="${newId}"]`)?.classList.add('new'), box.scrollTop = 0;
  $('#count').textContent = list.length;
  markCurrent();
}
function markCurrent() {
  document.querySelectorAll('.tile.cur').forEach(t => t.classList.remove('cur'));
  if (S.focus) $(`#tiles [data-id="${S.focus.a.id}"]`)?.classList.add('cur');
}
$('#tiles').addEventListener('click', e => { const t = e.target.closest('.tile'); if (t) openReplay(S.answers.find(a => a.id === t.dataset.id)); });
$('#tiles').addEventListener('contextmenu', e => { const t = e.target.closest('.tile'); if (t) { e.preventDefault(); openMenu(t.dataset.id, t); } });
$('#windows').addEventListener('click', e => {
  const d = e.target.closest('.win'); if (!d) return;
  const w = S.wins[[...$('#windows').children].indexOf(d)]; if (w) openReplay(S.answers.find(a => a.id === w.aid));
});

// ---------- חיים על הבמה: בועות, סימנים מרחפים, קישוטים, קונפטי ----------
let extras = { bubbles: [], floaters: [], confetti: false };
function refreshExtras() {
  const ts = new Set(visible().flatMap(a => a.topics || []));
  extras = { bubbles: [], floaters: [], confetti: ts.has('joy') };
  const deco = new Set(['sun', 'plane', 'planet']);
  for (const id of ts) {
    const T = TOPIC[id]; if (!T) continue;
    (T.bubbles || []).forEach(b => extras.bubbles.push(b));
    (T.floaters || []).forEach(f => extras.floaters.push({ t: f, c: T.color }));
    (T.deco || []).forEach(d => deco.add(d));
  }
  for (const [name, d] of Object.entries(DECO)) {
    const el = $(`#sky .deco[data-n="${name}"]`);
    if (deco.has(name) && !el && M['deco/' + name]) {
      const e = document.createElement('div'); e.className = 'deco' + (d.fly ? ' fly' : ''); e.dataset.n = name;
      Object.assign(e.style, { left: d.x + 'px', top: d.y + 'px', width: d.w + 'px' });
      if (d.fly) e.style.setProperty('--dx', d.fly.dx), e.style.setProperty('--dy', d.fly.dy);
      e.innerHTML = `<img src="${img('deco/' + name)}" alt="">`;
      $('#sky').append(e);
    } else if (!deco.has(name) && el) el.remove();
  }
}
function anchors() {
  const out = [];
  S.wins.forEach((w, i) => { if (w) { const r = winRect(i); out.push([r.x + r.w / 2, r.y - 26]); } });
  S.items.filter(it => it.el).forEach(it => out.push([it.rect.x + it.rect.w / 2 + (Math.random() - .5) * it.rect.w * .4, it.rect.y + 12]));
  return out;
}
setInterval(() => { // בועת דיבור
  if (S.focus || !extras.bubbles.length || document.querySelectorAll('.bubble').length >= 3) return;
  const an = anchors(); if (!an.length) return;
  const [x, y] = pick(an), text = pick(extras.bubbles);
  const b = document.createElement('div'); b.className = 'bubble' + (/[a-z]/i.test(text) ? ' ltr' : '');
  b.textContent = text; b.style.setProperty('--r', (Math.random() * 8 - 4).toFixed(1) + 'deg');
  b.style.left = Math.max(330, Math.min(1430, x)) + 'px'; b.style.top = y + 'px'; b.style.translate = '-50% -100%';
  $('#bubbles').append(b); setTimeout(() => b.remove(), 3700);
}, 2300);
setInterval(() => { // סימן מרחף
  if (S.focus || !extras.floaters.length || document.querySelectorAll('.fl').length >= 7) return;
  const f = pick(extras.floaters), [x0, y0, x1, y1] = pick(SKY_SPOTS);
  const e = document.createElement('div'); e.className = 'fl'; e.dir = 'auto'; e.textContent = f.t;
  e.style.cssText = `left:${x0 + Math.random() * (x1 - x0)}px; top:${y0 + Math.random() * (y1 - y0)}px; --c:${f.c}; --r:${(Math.random() * 16 - 8).toFixed(0)}deg; translate:-50% 0`;
  $('#sky').append(e); setTimeout(() => e.remove(), 8200);
}, 1500);
const CF = ['#00B4D8', '#FBB616', '#F26B2A', '#EE2E5D', '#BCCD32', '#A84A9C'];
function confettiPiece(box, x, opts = {}) {
  const c = document.createElement('i'); c.className = 'cf';
  c.style.cssText = `left:${x}px; --c:${pick(CF)}; --t:${opts.t || 6 + Math.random() * 4}s; --dx:${(Math.random() * 300 - 150).toFixed(0)}px; --rot:${(Math.random() * 900 - 450).toFixed(0)}deg;
    width:${8 + Math.random() * 8}px; height:${12 + Math.random() * 10}px; animation-delay:${opts.delay || 0}s; z-index:5`;
  box.append(c); setTimeout(() => c.remove(), ((opts.delay || 0) + (opts.t || 10)) * 1000 + 200);
}
setInterval(() => { if (extras.confetti && !S.focus) confettiPiece($('#confetti'), 290 + Math.random() * 1180); }, 700);
setInterval(() => { // קפיצה קטנה של קבוצה אקראית
  const groups = S.items.filter(it => it.el);
  if (S.focus || !groups.length) return;
  const s = pick(groups).el; s.classList.remove('hop'); void s.offsetWidth; s.classList.add('hop');
}, 3200);

// ---------- מצב הצגה של חזון ----------
let focusTimer = null;
function showFocus(a, mode) {
  const f = $('#focus'), inf = info(a), list = visible();
  clearTimeout(focusTimer);
  S.focus = { a, mode };
  f.classList.remove('on', 'replay'); void f.offsetWidth;
  f.style.setProperty('--tc', inf.color);
  if (mode === 'new') prepare(a);
  const heroSrc = a._bank ? a._bank.src : inf.scene, heroAr = a._bank ? a._bank.ar : inf.ar;
  const cx = 520, bottom = 990; let hh = 790, hw = hh * heroAr; if (hw > 840) { hw = 840; hh = hw / heroAr; }
  const hero = $('.hero', f);
  Object.assign(hero.style, { left: cx - hw / 2 + 'px', top: bottom - hh + 'px', width: hw + 'px', height: hh + 'px' });
  hero.innerHTML = `<img src="${heroSrc}" alt="">`;
  if (inf.sign && !a._bank) hero.append(signText('hero-sign', gist(a.text), hw, hh, inf.sign));
  S.heroRect = { x: cx - hw / 2, y: bottom - hh, w: hw, h: hh };
  Object.assign($('.hero-shadow', f).style, { left: cx - hw * .46 + 'px', top: bottom - 34 + 'px', width: hw * .92 + 'px' });
  const burst = $('.burst', f);
  Object.assign(burst.style, { left: cx - 150 + 'px', top: bottom - hh - 110 + 'px' });
  burst.innerHTML = Array.from({ length: 9 }, (_, i) => {
    const ang = (-160 + i * 17.5) * Math.PI / 180, r0 = 62 + (i % 2) * 10, r1 = r0 + 26 + (i % 3) * 8;
    return `<path d="M${(Math.cos(ang) * r0).toFixed(1)} ${(Math.sin(ang) * r0).toFixed(1)} L${(Math.cos(ang) * r1).toFixed(1)} ${(Math.sin(ang) * r1).toFixed(1)}" style="animation-delay:${.5 + i * .04}s"/>`;
  }).join('');
  $('.topic img', f).src = inf.icon; $('.topic span', f).textContent = inf.label;
  const words = a.text.split(/\s+/).filter(Boolean), len = a.text.length;
  const qs = len <= 40 ? 76 : len <= 80 ? 64 : len <= 140 ? 54 : len <= 220 ? 46 : 39;
  const q = $('.quote', f); q.style.setProperty('--qs', qs + 'px');
  q.innerHTML = words.map((w, i) => `<span class="w" style="--i:${i}">${esc(w)}</span>`).join(' ');
  f.style.setProperty('--late', (.9 + words.length * .055).toFixed(2) + 's');
  $('.who .nm', f).textContent = a.name;
  const doms = domainIcons(a).map(s => `<img class="dom" src="${s}" alt="">`).join('');
  $('.role', f).innerHTML = (doms ? `<span class="doms">${doms}</span>` : '') + (a.domain ? `<span>מנהלת תחום <b>${esc(a.domain)}</b></span>` : '<span>שלהבות חב״ד</span>');
  const dur = mode === 'new' ? Math.min(20, Math.max(11, 7 + words.length * .45)) : (S.tour ? 12 : 25);
  f.style.setProperty('--dur', dur + 's');
  if (mode === 'replay') f.classList.add('replay');
  f.classList.add('on');
  markCurrent();
  if (mode === 'new') for (let i = 0; i < 46; i++) confettiPiece(f, 80 + Math.random() * 1760, { t: 3.2 + Math.random() * 2.5, delay: Math.random() * .6 });
  focusTimer = setTimeout(closeFocus, dur * 1000);
}

function closeFocus() {
  if (!S.focus) return;
  const { a, mode } = S.focus, f = $('#focus');
  clearTimeout(focusTimer); S.focus = null;
  f.querySelectorAll('.cf').forEach(c => c.remove());
  if (mode === 'new') {
    const { it, fresh } = place(a, true), from = S.heroRect, to = it.rect;
    if (fresh && it.el) it.el.style.opacity = '0';
    // הדמויות "עפות" מהמסך המוגדל למקום שלהן — לפני בית הספר, על הגג או לחלון
    const fly = $('.hero', f).cloneNode(true); fly.className = 'flyer';
    Object.assign(fly.style, { left: from.x + 'px', top: from.y + 'px', width: from.w + 'px', height: from.h + 'px' });
    app.append(fly); S.flying = true;
    const k = Math.min(to.w / from.w, to.h / from.h), win = it.kind === 'window';
    fly.animate([{ transform: 'none', opacity: 1 }, { transform: `translate(${to.x + (to.w - from.w * k) / 2 - from.x}px, ${to.y + (to.h - from.h * k) - from.y}px) scale(${k})`, opacity: win ? 0 : 1 }],
      { duration: 1000, easing: 'cubic-bezier(.6,0,.25,1)', fill: 'forwards' }).onfinish = () => {
      fly.remove(); S.flying = false;
      if (win) it.wins.forEach((i, j) => showWindow(i, true, j * 220));
      else if (fresh) { it.el.style.opacity = ''; it.el.classList.add('in'); } else flash(it);
      bankFloats(a, true);
      badge(it);
      renderTiles(a.id); refreshExtras();
      S.lastClose = Date.now(); setTimeout(next, 900);
    };
  } else {
    const it = S.byId.get(a.id); if (it) setTimeout(() => flash(it), 300);
    S.lastClose = Date.now(); setTimeout(next, 500);
  }
  f.classList.remove('on');
  markCurrent();
}
function flash(it) {
  const els = it.el ? [it.el] : it.wins.map(i => $('#windows').children[i]);
  for (const el of els) { el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); }
}

function next() {
  if (S.focus || S.flying) return;
  const a = S.queue.shift(); if (a) showFocus(a, 'new');
}
function enqueue(a) {
  S.queue.push(a);
  if (S.focus?.mode === 'replay') closeFocus(); else next();
}
function openReplay(a) {
  if (!a || a.status === 'pending' || S.flying || S.focus?.mode === 'new' || !S.byId.has(a.id)) return;
  showFocus(a, 'replay');
}
$('#focus').addEventListener('click', closeFocus);

// סיור אוטומטי (מקש A, ובהדגמה תמיד): כשאין פעילות — מציג שוב את החזונות אחד אחרי השני
setInterval(() => {
  const list = visible();
  if (!(S.tour || DEMO_MODE) || S.focus || S.flying || S.queue.length || list.length < 1 || Date.now() - S.lastClose < 5000) return;
  S.tourIdx = (S.tourIdx + 1) % list.length; openReplay(list[S.tourIdx]);
}, 1000);

// ---------- חזון חדש בהכנה (מציירים לו איור) — שיראו שאין תקלה ושזה יגיע לבד ----------
let pendSig = '';
function renderPending() {
  const box = $('#pending'), items = [...S.pending.values()];
  box.classList.toggle('on', items.length > 0);
  const sig = items.map(x => x.name + x.t).join('|');
  if (!items.length || sig === pendSig) return;
  pendSig = sig;
  const p = items[items.length - 1], since = (Date.now() - p.t) / 1000;
  box.innerHTML = `<div class="pd-art"><i></i><i></i><i></i></div>
    <div class="pd-text"><b>${items.length > 1 ? `${items.length} חזונות חדשים התקבלו!` : 'חזון חדש התקבל!'}</b>
    <span>${esc(items.map(x => x.name).join(' · '))} — מציירים איור, עוד רגע זה על המסך</span>
    <div class="pd-bar"><i style="animation-delay:-${since.toFixed(1)}s"></i></div></div>`;
}
const addPending = (id, name, at) => { S.pending.set(id, { name, t: at ? Date.parse(at) : Date.now() }); renderPending(); };

// ---------- ניהול (קליק ימני על ריבוע, רק מהמחשב המציג) ----------
const TOPIC_OPTS = ['kippa', 'girls', 'english', 'math', 'reading', 'tefila', 'torah', 'science', 'sport', 'art', 'heart', 'parents',
  'mivtzaim', 'excellence', 'joy', 'nature', 'staff', 'everychild', 'middot', 'shabbat', 'pedagogy', 'climate', 'chayalei', 'vision'];
function openMenu(id, tile) {
  const a = S.answers.find(x => x.id === id), menu = $('#menu'); if (!a) return;
  if (!S.local && !a.demo) return toast('שינויים אפשריים רק מהמחשב המציג');
  const opts = [...(a.custom ? ['custom'] : []), ...TOPIC_OPTS];
  menu.innerHTML = `<h4>${esc(a.name)} — לשנות נושא?</h4><div class="opts">${opts.map(t => {
    const inf = info({ ...a, topics: [t] });
    return `<button data-t="${t}"><img src="${inf.icon}" alt="">${esc(inf.label)}</button>`;
  }).join('')}</div><div class="acts"><button class="show">הצגה</button><button class="del">הסרה מהמסך</button><button class="cls">סגירה</button></div>`;
  const r = tile.getBoundingClientRect(), s = app.getBoundingClientRect(), k = s.width / 1920;
  menu.style.left = Math.min(1480, (r.right - s.left) / k + 12) + 'px'; menu.style.top = Math.min(520, (r.top - s.top) / k) + 'px';
  menu.classList.add('on');
  menu.onclick = async e => {
    const b = e.target.closest('button'); if (!b) return;
    menu.classList.remove('on');
    if (b.classList.contains('show')) return openReplay(a);
    if (b.classList.contains('del')) {
      if (a.demo) { S.answers = S.answers.filter(x => x !== a); return rebuild(); }
      return fetch(API + 'api/answers/' + a.id, { method: 'DELETE' });
    }
    if (b.dataset.t) {
      if (a.demo) { a.topics = [b.dataset.t]; return rebuild(); }
      fetch(API + 'api/answers/' + a.id, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic: b.dataset.t }) });
    }
  };
}
document.addEventListener('click', e => { if (!e.target.closest('#menu')) $('#menu').classList.remove('on'); });
let toastT;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2600); }

// ---------- חזונות לדוגמה (מקש D, ובהדגמה בגיטהאב) ----------
const DEMO = [
  ['חיה כהן', 'קידום אנגלית ואנגלית דבורה', 'בכל הפסקה שומעים ילדים מדברים אנגלית בביטחון'],
  ['מושקא לוי', 'מורשת חגים חיילי האור', 'כל הבנים מגיעים עם כיפה וציצית בגאווה'],
  ['רבקה פרידמן', 'מצוינות בכיתה א-ב', 'ילדי כיתה א קוראים בשטף ומצטיינים בחשבון'],
  ['דבורה שפירא', 'אקלים מיטבי', 'מעגלי שיח בכל כיתה וכל ילד מרגיש בטוח'],
  ['שטערנא גולד', 'למידה מגוונת', 'לומדים בתחנות, בפרויקטים ובלמידת חקר'],
  ['לאה מזרחי', 'מורשת חגים חיילי האור', 'חיילי האור מאירים את בית הספר בערכים ובדרך ארץ'],
  ['רחל אוחיון', 'ניהול מיטבי', 'צוות מקצועי שלומד כל הזמן ומוביל בהתלהבות'],
  ['נחמה ביטון', 'אקלים מיטבי', 'ההורים שותפים ומגיעים לשבת כיתתית'],
  ['יהודית אזולאי', 'מורשת חגים חיילי האור', 'הילדים מניחים תפילין עם עוברים ושבים ומחלקים נרות שבת'],
  ['שרה דהן', 'מצוינות בכיתה א-ב', 'הספרייה מלאה, ילדים קוראים ספרים בהפסקות'],
  ['מרים אדרי', 'למידה מגוונת', 'גינה ירוקה שהילדים מגדלים בעצמם'],
  ['אסתר ברגר', 'ניהול מיטבי', 'בית ספר שכולו סקרנות והרפתקאות'],
];
function demoAnswer() {
  const [name, domain, text] = DEMO[S.demoN++ % DEMO.length];
  return { id: 'demo-' + Date.now().toString(36) + S.demoN, name, domain, text, demo: true, at: new Date().toISOString(), topics: classify(text, domain) };
}

// ---------- מקשים ----------
addEventListener('keydown', e => {
  if (e.target.closest?.('input, textarea')) return;
  const list = visible();
  switch (e.code) {
    case 'KeyF': document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); break;
    case 'Escape': $('#bigqr').classList.remove('on'); $('#menu').classList.remove('on'); if (S.focus?.mode === 'replay') closeFocus(); break;
    case 'Space': e.preventDefault(); if (S.focus) { if (S.focus.mode === 'replay') closeFocus(); } else openReplay(list[list.length - 1]); break;
    case 'ArrowLeft': case 'ArrowRight': {
      if (S.focus?.mode !== 'replay') break;
      const i = list.findIndex(x => x.id === S.focus.a.id) + (e.code === 'ArrowLeft' ? 1 : -1);
      if (list[i]) openReplay(list[i]); break;
    }
    case 'KeyQ': $('#bigqr').classList.toggle('on'); break;
    case 'KeyA': S.tour = !S.tour; S.tourIdx = -1; toast(S.tour ? 'סיור אוטומטי: פועל' : 'סיור אוטומטי: כבוי'); break;
    case 'KeyD': // חזון לדוגמה — רק על המסך הזה, לא נשמר. Shift+D = מילוי מהיר בלי הצגה
      if (e.shiftKey) { for (let k = 0; k < 6; k++) { const a = demoAnswer(); S.answers.push(a); place(a, false); bankFloats(a, false); } renderTiles(); refreshExtras(); }
      else { const a = demoAnswer(); S.answers.push(a); enqueue(a); }
      break;
  }
});
$('#bigqr').addEventListener('click', () => $('#bigqr').classList.remove('on'));

// ---------- חיבור לשרת ----------
async function loadInfo() {
  if (DEMO_MODE) return;
  const i = await fetch(API + 'api/info').then(r => r.json());
  S.local = i.local;
  $('#qr').innerHTML = i.qr; $('.bq-code').innerHTML = i.qr;
}
function onAnswer(a) {
  S.pending.delete(a.id); renderPending();
  const old = S.answers.find(x => x.id === a.id);
  if (old) { delete old.status; Object.assign(old, a); } else S.answers.push(a);
  if (!S.byId.has(a.id) && !S.queue.some(q => q.id === a.id) && S.focus?.a.id !== a.id) enqueue(old || a);
}
async function sync() { // משלימים כל מה שפוספס — גם בלי לרענן את המסך
  const all = await fetch(API + 'api/answers', { cache: 'no-store' }).then(r => r.json());
  const ids = new Set(all.map(a => a.id));
  for (const a of all) {
    if (a.status === 'pending') { if (!S.pending.has(a.id)) addPending(a.id, a.name, a.at); if (!S.answers.some(x => x.id === a.id)) S.answers.push(a); }
    else onAnswer(a);
  }
  for (const id of [...S.pending.keys()]) if (!ids.has(id)) S.pending.delete(id);
  renderPending();
}
function connect() {
  const es = new EventSource(API + 'api/events');
  let first = true;
  es.addEventListener('answer', e => onAnswer(JSON.parse(e.data)));
  es.addEventListener('pending', e => { const p = JSON.parse(e.data); S.answers.push({ ...p, status: 'pending', topics: [] }); addPending(p.id, p.name); });
  es.addEventListener('remove', e => { const { id } = JSON.parse(e.data); S.answers = S.answers.filter(a => a.id !== id); S.queue = S.queue.filter(a => a.id !== id); rebuild(); });
  es.addEventListener('update', e => { const a = JSON.parse(e.data), old = S.answers.find(x => x.id === a.id); if (old) Object.assign(old, a); rebuild(); });
  es.addEventListener('info', loadInfo);
  es.onopen = () => { if (first) return void (first = false); sync().catch(() => {}); loadInfo().catch(() => {}); };
  es.onerror = () => { if (es.readyState === 2) setTimeout(connect, 3000); }; // נסגר לגמרי → מתחברים מחדש
}
// בגיטהאב: מוצאים את השרת החי (הכתובת מתעדכנת אוטומטית בכל הפעלה)
async function findLive() {
  try {
    const cfg = await fetch(LIVE_JSON, { headers: { Accept: 'application/vnd.github.raw+json' }, cache: 'no-store' }).then(r => r.json());
    if (!cfg.url) return null;
    const ctl = new AbortController(); setTimeout(() => ctl.abort(), 5000);
    const ok = await fetch(cfg.url + 'api/info', { signal: ctl.signal }).then(r => r.ok).catch(() => false);
    return ok ? cfg.url : null;
  } catch { return null; }
}
async function startDemo() {
  DEMO_MODE = true; document.body.classList.add('demo');
  const svg = await fetch('qr.svg').then(r => r.ok ? r.text() : '').catch(() => ''); // נוצר בזמן הפרסום לגיטהאב
  $('#qr').innerHTML = svg; $('.bq-code').innerHTML = svg;
  const add = () => { if (S.answers.length >= DEMO.length) return; const a = demoAnswer(); S.answers.push(a); enqueue(a); };
  add(); setInterval(() => { if (!S.focus && !S.flying && !S.queue.length) add(); }, 9000);
}
async function init() {
  M = await fetch(IMG + 'manifest.json', { cache: 'no-store' }).then(r => r.json());
  BM = await fetch(IMG + 'items/manifest.json', { cache: 'no-store' }).then(r => r.ok ? r.json() : {}).catch(() => ({}));
  const sch = M.school; SCHOOL.h = SCHOOL.w * sch.h / sch.w;
  buildSchool();
  await document.fonts.ready;
  if (STATIC) {
    const live = await findLive();
    if (!live) { rebuild(); return startDemo(); }
    API = live;
  }
  S.answers = await fetch(API + 'api/answers', { cache: 'no-store' }).then(r => r.json());
  for (const a of S.answers) if (a.status === 'pending') addPending(a.id, a.name, a.at);
  rebuild(); loadInfo();
  connect();
  setInterval(() => sync().catch(() => {}), 20000);
}
init();
