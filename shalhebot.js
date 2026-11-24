// "מילוי מהשלהבוט": the teacher pastes the lesson summary שלהבוט wrote, and the map fills itself.
// Shared by lesson-map-a and entry-card. Use:
//   Shalhebot.init({btn, say(text), pictures:[[key,name],...], onFill(lesson)})
// lesson = {topic, minutes, entry, exit, stations:[{title, task, bring, intels:[key], picture:key}]}
// The format שלהבוט is told to write (lenient – bold, bullets and small changes are fine):
//   === מפת שיעור ===
//   נושא: ...            זמן לכל תחנה: 10
//   כרטיס כניסה: ...
//   תחנה 1: <שם>   מה עושים: ...   מה צריך להביא: ...   אינטליגנציות: ...   תמונה: ...
//   כרטיס יציאה: ...
//   === סוף ===
(function(){
const BOT_URL = 'https://chatgpt.com/g/g-67ee5b6f6e2881919d27ed70c5d25254-shlhbvt';
const INTEL_WORDS = [
  ['linguistic', /לשונ|מילולי/], ['logical', /לוגי|מתמטי/], ['spatial', /מרחב|חזותי|ויזואל/],
  ['bodily', /גופני|תנועת|קינסת/], ['musical', /מוזיק|מוסיק|קצב/], ['interpersonal', /בין[\s-]?אישי|בינאישי|חברת/],
  ['intrapersonal', /תוך[\s-]?אישי|תוכאישי|רפלקטיב/], ['naturalist', /נטורל|טבע/]
];
const FIELDS = [
  ['topic', /^(?:נושא(?: השיעור)?|שם השיעור|כותרת השיעור)$/],
  ['minutes', /^(?:זמן(?: לכל)?(?: תחנה)?|דקות(?: לכל תחנה)?|משך(?: כל)?(?: תחנה)?)$/],
  ['grade', /^(?:כיתה|שכבה)$/],
  ['entry', /^(?:כרטיס כניסה|שאלת פתיחה|פתיחה)$/],
  ['exit', /^(?:כרטיס יציאה|שאלת סיכום|סיכום)$/],
  ['task', /^(?:מה עושים(?: בתחנה)?|משימה|המשימה|פעילות|מהלך)$/],
  ['bring', /^(?:מה צריך להביא|מה להביא|להביא|ציוד|חומרים|ציוד וחומרים)$/],
  ['intels', /^(?:אינטליגנציות?|סמלי אינטליגנציה|סמלים)$/],
  ['picture', /^(?:תמונה|תמונת הפעילות|איור)$/],
];
const clean = l => l.replace(/\*\*|__|`/g, '').replace(/^\s*(?:[#>]+|[-•*●▪◦]|•)\s*/, '').trim();

function parse(text, pictures){
  const out = {topic:'', minutes:0, entry:'', exit:'', stations:[]};
  let cur = null, field = null;          // where free lines are added
  const put = (obj, f, v) => { obj[f] = obj[f] ? obj[f] + '\n' + v : v; };
  for (const raw of String(text).replace(/\r/g, '').split('\n')) {
    const line = clean(raw), r = raw.trim();
    if (!line || /^[=\-–—_~*]{2,}\s*$/.test(line) || /^[=\-–—_~*]{3,}/.test(r) || /^=+.*=+$/.test(line)) { field = null; continue; }
    const st = line.match(/^תחנה\s*(?:מספר\s*)?(\d+|[א-ת]{1,8}(?=\s*[:\-–.]))?\s*[:\-–.]\s*(.*)$/) || line.match(/^תחנה\s+(\d+)\s*(.*)$/);
    if (st) { cur = {title: st[2].trim(), task:'', bring:'', intels:'', picture:''}; out.stations.push(cur); field = 'title'; continue; }
    const m = line.match(/^([^:：]{1,24})\s*[:：]\s*(.*)$/);
    const f = m && (FIELDS.find(([, re]) => re.test(m[1].trim())) || [])[0];
    const ST_F = ['task', 'bring', 'intels', 'picture'];
    if (f) {
      const v = m[2].trim();
      if (ST_F.includes(f)) { field = cur ? f : null; if (cur && v) put(cur, f, v); }
      else { field = f; if (f === 'entry' || f === 'exit') cur = null; if (v && f !== 'grade') put(out, f, v); }
      continue;
    }
    // a line without a label continues the last field (the line after "תחנה N: שם" starts the task)
    if (field === 'title') field = 'task';
    if (cur && ST_F.includes(field)) put(cur, field, line);
    else if (field === 'entry' || field === 'exit') put(out, field, line);
  }
  out.minutes = Math.min(120, Math.max(0, parseInt(String(out.minutes).match(/\d+/)) || 0));
  out.stations.forEach(s => {
    s.intels = INTEL_WORDS.filter(([, re]) => re.test(s.intels)).map(([k]) => k)
      .sort((a, b) => s.intels.search(INTEL_WORDS.find(x => x[0] === a)[1]) - s.intels.search(INTEL_WORDS.find(x => x[0] === b)[1])).slice(0, 3);
    const p = s.picture.replace(/[.,;!]/g, '').trim();
    const hit = p && (pictures || []).find(([, n]) => n === p) || p && (pictures || []).find(([, n]) => n.includes(p) || p.includes(n.split(/[\s-+]/)[0]));
    s.picture = hit ? hit[0] : '';
    s.title = s.title.replace(/^["'״]|["'״]$/g, '').trim();
  });
  out.stations = out.stations.slice(0, 8);
  return out;
}

const CSS = `
#sbPick .panel{max-width:760px;max-height:92vh;overflow-y:auto}
#sbPick h3{text-align:center;font:900 30px 'TamlilCond','Tamlil',sans-serif;margin-bottom:8px;color:#513996}
.sb-note{text-align:center;color:#6B6486;font:500 16px/1.5 'Tamlil',sans-serif;margin:0 0 12px}
.sb-note a{color:#AA479A;font-weight:700}
.sb-text{display:block;width:100%;min-height:260px;resize:vertical;font:500 17px/1.5 'Tamlil',sans-serif;border:2px solid #D8D1EE;border-radius:16px;padding:10px 14px;color:#1B1533;outline:none}
.sb-text:focus{border-color:#AA479A}
.sb-foot{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-top:14px}`;
let cfg, pick, ta;
function init(c){
  cfg = c;
  document.head.insertAdjacentHTML('beforeend', `<style>${CSS}</style>`);
  document.body.insertAdjacentHTML('beforeend', `
  <div class="pick" id="sbPick">
    <div class="panel">
      <h3>מילוי מהשלהבוט</h3>
      <p class="sb-note">אחרי שבניתם את המערך ב<a href="${BOT_URL}" target="_blank" rel="noopener">שלהבוט</a> – כתבו לו <b>"מפת שיעור"</b>,<br>
        העתיקו את מה שהוא כותב והדביקו כאן. כל חלק ייכנס למקום שלו, ואחר כך אפשר לתקן הכול.</p>
      <textarea class="sb-text" id="sbText" dir="rtl" placeholder="=== מפת שיעור ===&#10;נושא: ...&#10;כרטיס כניסה: ...&#10;תחנה 1: ...&#10;מה עושים: ..."></textarea>
      <div class="sb-foot">
        <button class="tb main" id="sbFill">מילוי המפה</button>
        <button class="tb" id="sbPaste">📋 הדבקה מהלוח</button>
        <button class="tb" id="sbCancel">ביטול</button>
      </div>
    </div>
  </div>`);
  pick = document.getElementById('sbPick'); ta = document.getElementById('sbText');
  const close = () => pick.classList.remove('show');
  cfg.btn.onclick = () => { pick.classList.add('show'); ta.focus(); };
  document.getElementById('sbCancel').onclick = close;
  pick.addEventListener('click', e => { if (e.target === pick) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  document.getElementById('sbPaste').onclick = async () => {
    try { ta.value = await navigator.clipboard.readText(); ta.focus(); }
    catch(e) { cfg.say('לא הצלחנו לקרוא מהלוח – לחצו בתיבה ו-Ctrl+V'); ta.focus(); }
  };
  document.getElementById('sbFill').onclick = () => {
    const lesson = parse(ta.value, cfg.pictures);
    if (!lesson.stations.length) return cfg.say('לא מצאנו תחנות בטקסט – בקשו מהשלהבוט "מפת שיעור" והדביקו את כל התשובה');
    if (cfg.onFill(lesson) === false) return;
    ta.value = ''; close();
  };
}
window.Shalhebot = {init, parse, BOT_URL};
})();
