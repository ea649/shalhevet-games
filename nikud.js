// Automatic nikud for what the teacher types (Dicta Nakdan) + a panel to fix it + on/off.
// Shared by lesson-map-a and entry-card. Use:
//   Nikud.init({btn, isField(el), fields(), store(el), dict(), saveDict(), say(text), key})
//   Nikud.openFix(el)   – the fixing panel for one field
(function(){
const API = 'https://nakdan-2-0.loadbalancer.dicta.org.il/api';
const NIK = /[֑-ׇ]/g;
const bare = s => s.replace(NIK, '');
const HEB = /[א-ת֑-ׇ]/g;
const WORD = /[א-ת֑-ׇ]+(?:["'״׳][א-ת֑-ׇ]+)*/g;
const skeleton = s => s.replace(HEB, '');                     // everything that is not a Hebrew letter / mark
const cleanOpt = o => String(Array.isArray(o) ? o[0] : o).replace(/\|/g, '');
let cfg = null, on = true, warned = false, timer = null, lastField = null;

async function tokens(text, keep){
  // text/plain keeps the request "simple" (no CORS preflight)
  const r = await fetch(API, {method:'POST', headers:{'Content-Type':'text/plain;charset=UTF-8'},
    body: JSON.stringify({task:'nakdan', data:text, genre:'modern', addmorph:false, keepqq:false, nodageshdefmem:false, patachma:false, keepnikud:keep})});
  if (!r.ok) throw new Error(r.status);
  return r.json();
}
// nikud is written in ktiv haser (פינת → פִּנַּת), so letters may change – everything else must stay the same
async function nakdan(text){
  const d = cfg.dict(), toks = await tokens(text, true);
  let learned = false;
  const out = toks.map(w => {
    if (w.sep) return w.word;
    if (d.keepBare[w.word]) return w.word;                     // the teacher chose "בלי ניקוד" for it
    const v = (w.options && w.options[0]) ? cleanOpt(w.options[0]) : w.word;
    if (v !== w.word && bare(w.word) === w.word && d.plain[v] !== w.word) { d.plain[v] = w.word; learned = true; }
    return v;
  }).join('');
  if (!out.trim() || skeleton(out) !== skeleton(text)) throw new Error('mismatch');
  if (learned) cfg.saveDict();
  return out;
}
const unNik = t => t.replace(WORD, w => cfg.dict().plain[w] || bare(w));

const caretAtEnd = el => {
  const sel = getSelection(); if (!sel.rangeCount || !el.contains(sel.anchorNode)) return false;
  const r = document.createRange(); r.selectNodeContents(el); r.setStart(sel.anchorNode, sel.anchorOffset);
  return r.toString().trim().length === 0;
};
const putCaretEnd = el => { const r = document.createRange(); r.selectNodeContents(el); r.collapse(false); const s = getSelection(); s.removeAllRanges(); s.addRange(r); };

// while typing – only up to the last space (the word being typed stays as is); on leaving the field – everything
async function nikNow(el, all){
  if (!on || !el.isConnected) return;
  const text = el.innerText;
  const cut = all ? text.length : text.search(/\s\S*$/) + 1;
  const head = text.slice(0, cut), tail = text.slice(cut);
  if (!/[א-ת]/.test(head)) return;
  if (!all && !caretAtEnd(el)) return;                         // editing in the middle – wait until leaving the field
  const lead = head.match(/^\s*/)[0], trail = head.match(/\s*$/)[0];   // the nakdan drops edge spaces – put them back
  if (all) el.classList.add('nk-busy');
  try {
    const done = lead + await nakdan(head.trim()) + trail;
    if (el.innerText !== text || !el.isConnected || done === head) return;   // typed more meanwhile – next round does it
    const focused = document.activeElement === el;
    el.innerText = done + tail;
    if (focused) putCaretEnd(el);
    cfg.store(el);
  } catch(e) {
    if (!warned) { warned = true; cfg.say('הנקדן לא זמין כרגע – הטקסט נשמר בלי ניקוד'); }
  } finally { el.classList.remove('nk-busy'); }
}
const nikAll = () => Promise.all(cfg.fields().map(el => nikNow(el, true)));

// ---------- the fixing panel ----------
const MARKS = [['בָ','קמץ'],['בַ','פתח'],['בֵ','צירה'],['בֶ','סגול'],['בִ','חיריק'],['בֹ','חולם'],
  ['בֻ','קובוץ'],['בְ','שווא'],['בֲ','חטף פתח'],['בֱ','חטף סגול'],['בֳ','חטף קמץ'],['בּ','דגש'],
  ['שׁ','שׁ ימנית'],['שׂ','שׂ שמאלית'],['⌫','מחיקה']];
const CSS = `
.nk-busy{opacity:.6}
.nikoff .nk-fix{display:none!important}
#nkPick .panel{max-width:760px;max-height:92vh;overflow-y:auto}
#nkPick h3{text-align:center;font:900 30px 'TamlilCond','Tamlil',sans-serif;margin-bottom:10px;color:#513996}
#nkPick .nk-note{text-align:center;color:#6B6486;font:500 15px 'Tamlil',sans-serif;margin:-4px 0 14px}
.nk-words{display:grid;gap:10px;margin-bottom:14px;max-height:38vh;overflow-y:auto;padding:2px}
.nk-row{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;padding:8px;border-radius:16px;background:#F8F6FE}
.nk-row button{border:2px solid transparent;background:#fff;border-radius:14px;padding:2px 14px;font:700 30px/1.5 'Tamlil',sans-serif;color:#1B1533;cursor:pointer;box-shadow:0 2px 6px -3px rgba(40,30,90,.3)}
.nk-row button.sel{border-color:#AA479A;background:#FFF5FD}
.nk-row button small{display:block;font:700 13px/1 'Tamlil',sans-serif;color:#6B6486}
.nk-wait{text-align:center;color:#6B6486;font:500 16px 'Tamlil',sans-serif}
.nk-text{display:block;width:100%;resize:vertical;font:700 34px/1.6 'Tamlil',sans-serif;text-align:center;border:2px solid #D8D1EE;border-radius:16px;padding:6px 12px;color:#2B1F66;outline:none}
.nk-text:focus{border-color:#AA479A}
.nk-pad{display:grid;grid-template-columns:repeat(auto-fill,minmax(68px,1fr));gap:8px;margin-top:10px}
.nk-pad button{border:0;background:#F8F6FE;border-radius:14px;padding:2px 4px 6px;cursor:pointer;display:flex;flex-direction:column;align-items:center;font:700 32px/1.3 'Tamlil',sans-serif;color:#1B1533}
.nk-pad button span{font:700 13px 'Tamlil',sans-serif;color:#6B6486}
.nk-pad button:hover{background:#EDE7FA}
.nk-foot{display:flex;justify-content:center;gap:10px;margin-top:16px}
.tb.nk-on{background:#3DBB4E;color:#fff;box-shadow:0 10px 24px -8px rgba(61,187,78,.6)}`;
let pick, wordsEl, textEl, opts = null, fixEl = null;
function buildPanel(){
  document.head.insertAdjacentHTML('beforeend', `<style>${CSS}</style>`);
  document.body.insertAdjacentHTML('beforeend', `
  <div class="pick" id="nkPick">
    <div class="panel">
      <h3>תיקון ניקוד</h3>
      <p class="nk-note">לכל מילה לוחצים על הניקוד הנכון · או מתקנים ידנית: לוחצים בטקסט אחרי האות ובוחרים סימן</p>
      <div class="nk-words" id="nkWords"></div>
      <textarea class="nk-text" id="nkText" dir="rtl" rows="1" aria-label="הטקסט עם הניקוד"></textarea>
      <div class="nk-pad" id="nkPad">${MARKS.map(([g, n]) => `<button data-m="${g === '⌫' ? '' : g.slice(1)}" title="${n}">${g}<span>${n}</span></button>`).join('')}</div>
      <div class="nk-foot"><button class="tb main" id="nkSave">שמירה</button><button class="tb" id="nkCancel">ביטול</button></div>
    </div>
  </div>`);
  pick = document.getElementById('nkPick'); wordsEl = document.getElementById('nkWords'); textEl = document.getElementById('nkText');
  const pad = document.getElementById('nkPad');
  pad.addEventListener('mousedown', e => e.preventDefault());          // keep the caret in the text
  pad.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const s = textEl.selectionStart ?? textEl.value.length, en = textEl.selectionEnd ?? s;
    if (b.dataset.m) textEl.setRangeText(b.dataset.m, s, en, 'end');
    else if (s !== en) textEl.setRangeText('', s, en, 'end');
    else if (s > 0) textEl.setRangeText('', s - 1, s, 'end');
    textEl.focus(); drawWords();
  });
  wordsEl.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    let k = -1; textEl.value = textEl.value.replace(WORD, w => ++k === +b.dataset.k ? b.dataset.v : w);
    drawWords();
  });
  textEl.addEventListener('input', () => { fitText(); drawWords(); });
  const close = () => { pick.classList.remove('show'); fixEl = null; };
  document.getElementById('nkCancel').onclick = close;
  pick.addEventListener('click', e => { if (e.target === pick) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && pick.classList.contains('show')) close(); });
  document.getElementById('nkSave').onclick = () => {
    if (!fixEl) return close();
    const t = textEl.value.replace(/[ \t]+/g, ' ').trim(), d = cfg.dict();
    (t.match(WORD) || []).forEach(w => {
      if (bare(w) === w) d.keepBare[w] = true;
      else { delete d.keepBare[d.plain[w] || bare(w)]; delete d.keepBare[bare(w)]; }
    });
    cfg.saveDict();
    fixEl.innerText = t; cfg.store(fixEl); close();
  };
}
const fitText = () => { textEl.style.height = 'auto'; textEl.style.height = textEl.scrollHeight + 4 + 'px'; };
function drawWords(){
  if (!opts) { wordsEl.innerHTML = '<p class="nk-wait">טוען אפשרויות ניקוד…</p>'; return; }
  const ws = textEl.value.match(WORD) || [], d = cfg.dict();
  wordsEl.innerHTML = ws.map((w, k) => {
    const list = [...new Set([...(opts[k] || []), w])].filter(v => bare(v) !== v);
    const plain = d.plain[w] || bare(w);
    return `<div class="nk-row">${list.map(v => `<button data-k="${k}" data-v="${v}" class="${v === w ? 'sel' : ''}">${v}</button>`).join('')}
      <button data-k="${k}" data-v="${plain}" class="${plain === w ? 'sel' : ''}">${plain}<small>בלי ניקוד</small></button></div>`;
  }).join('') || '<p class="nk-wait">אין כאן מילים בעברית</p>';
}
async function openFix(el){
  el = el || lastField;
  if (!el || !el.isConnected || !/[א-ת]/.test(el.innerText)) return cfg.say('לוחצים קודם על השדה שרוצים לתקן בו את הניקוד');
  fixEl = el; opts = null;
  textEl.value = el.innerText.trim(); fitText(); drawWords();
  pick.classList.add('show');
  try {
    await nikNow(el, true);                                    // finish the nikud of the last word first
    if (fixEl !== el) return;
    textEl.value = el.innerText.trim(); fitText();
    const toks = await tokens(unNik(textEl.value), false);
    if (fixEl !== el) return;
    opts = toks.filter(w => !w.sep).map(w => [...new Set((w.options || []).map(cleanOpt))]);
  } catch(e) { opts = []; cfg.say('הנקדן לא זמין כרגע – אפשר לתקן ידנית'); }
  drawWords();
}

// ---------- on / off ----------
function show(){
  cfg.btn.classList.toggle('nk-on', on);
  cfg.btn.textContent = 'ניקוד: ' + (on ? 'פועל' : 'כבוי');
  document.body.classList.toggle('nikoff', !on);
}
function init(c){
  cfg = c;
  try { on = localStorage.getItem(cfg.key) !== '0'; } catch(e) {}
  buildPanel(); show();
  cfg.btn.title = 'כל מה שמקלידים מקבל ניקוד אוטומטי (נקדן דיקטה) · לחיצה מכבה / מפעילה';
  cfg.btn.onclick = () => {
    on = !on; warned = false; show();
    try { localStorage.setItem(cfg.key, on ? '1' : '0'); } catch(e) {}
    if (on) { nikAll(); cfg.say('ניקוד פועל – כל מה שמקלידים מקבל ניקוד'); }
    else { cfg.fields().forEach(el => { const t = unNik(el.innerText); if (t !== el.innerText) { el.innerText = t; cfg.store(el); } }); cfg.say('ניקוד כבוי – הטקסט בלי ניקוד'); }
  };
  document.addEventListener('input', e => {
    const el = e.target; if (!cfg.isField(el)) return;
    clearTimeout(timer); timer = setTimeout(() => nikNow(el, false), 450);
  });
  document.addEventListener('focusin', e => { if (cfg.isField(e.target)) lastField = e.target; });
  document.addEventListener('focusout', e => { if (cfg.isField(e.target)) nikNow(e.target, true); });
  if (on) nikAll();                                            // text written before gets nikud when the page opens
}
window.Nikud = {init, openFix, all: () => on && nikAll(), isOn: () => on, unNik};
})();
