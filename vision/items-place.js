// מיקום פריטי המאגר על האיור — באותה מערכת צירים של מסך המשחק (קנבס 1920×1080, בית הספר ב-390,250 ברוחב 980).
// כל אזור מוגדר בנקודת עיגון: x = מרכז הפריט, y = תחתית הפריט (בשמיים ובריחוף: מרכז).
// placeItem בוחר מתוך הרבה מועמדים את המקום שהכי פחות מכסה פריטים קיימים ואזורים תפוסים; כשצפוף — מקטין קצת.

export const STAGE = { w: 1920, h: 1080 };
export const SCHOOL = { x: 390, y: 250, w: 980, h: 609 };
// בנים ובנות בצדדים נפרדים של האיור (הקו באמצע בית הספר)
export const SPLIT = { x: 880, b: 'right', g: 'left' };

// אזורים קבועים שאסור לכסות: האזור שמעל השלט (בדף ההדגמה — הלוגו על הגג) והשלט הלבן עם הלוגו בחזית
export const AVOID = [{ l: 575, t: 195, r: 1170, b: 335 }, { l: 724, t: 308, r: 1018, b: 394 }];

const R = (x0, x1, y0, y1) => ({ x0, x1, y0, y1 });
export const ZONES = {
  front: { boxes: [R(300, 1460, 990, 1078)], anchor: 'bottom', z: 600, persp: [990, 1078, 0.84, 1], tol: 0.6 }, // ילדים — שתי שורות, האחורית קטנה יותר
  yard:  { boxes: [R(310, 1450, 880, 965)], anchor: 'bottom', z: 400 },            // חצר — מבנים קטנים
  side:  { boxes: [R(290, 395, 846, 878), R(1365, 1470, 846, 878)], anchor: 'bottom', z: 300 }, // בצדי הבניין — עצים, מגדלור, רהיטים
  roof:  { boxes: [R(440, 565, 398, 410), R(1180, 1325, 398, 410)], anchor: 'bottom', z: 250 }, // על הגג, משני צדי השלט
  float: { boxes: [R(300, 1460, 110, 205), R(285, 405, 270, 740), R(1355, 1475, 270, 740), R(430, 515, 255, 345), R(1235, 1320, 255, 345)], anchor: 'center', z: 720 }, // חפצים מרחפים
  sky:   { boxes: [R(300, 1460, 105, 195), R(285, 375, 250, 560), R(1385, 1475, 250, 560)], anchor: 'center', z: 700 },
};

function rect(x, y, w, h, anchor) {
  return anchor === 'center' ? { l: x - w / 2, t: y - h / 2, r: x + w / 2, b: y + h / 2 } : { l: x - w / 2, t: y - h, r: x + w / 2, b: y };
}
// מקבל מלבן בכל אחת מהצורות: {l,t,r,b} · {x,y,w,h} (פינה שמאלית־עליונה) · {x,y,h,ar} של נקודת עיגון מרכז־תחתית (כמו SPOTS במסך)
export function toRect(q) {
  if ('l' in q) return q;
  if ('w' in q) return { l: q.x, t: q.y, r: q.x + q.w, b: q.y + q.h };
  const w = q.h * (q.ar || 1.35);
  return { l: q.x - w / 2, t: q.y - q.h, r: q.x + w / 2, b: q.y };
}
const area = r => Math.max(0, r.r - r.l) * Math.max(0, r.b - r.t);
const inter = (a, b) => area({ l: Math.max(a.l, b.l), t: Math.max(a.t, b.t), r: Math.min(a.r, b.r), b: Math.min(a.b, b.b) });

// it = פריט מהמאגר · size = {w, h} של התמונה (ליחס רוחב-גובה, מה-manifest) · placed = מערך המיקומים הקודמים (מה שהפונקציה מחזירה)
// opts.avoid = אזורים תפוסים על הבמה (קבוצות, חלונות...) בכל צורה ש-toRect מכיר — הפריט יעדיף לא לכסות אותם
// opts.zones = החלפת אזורים, למשל { front: {...} } · opts.scale = הקטנה/הגדלה של כל הפריטים (ברירת מחדל 1)
export function placeItem(it, size, placed, rand = Math.random, opts = {}) {
  const zones = { ...ZONES, ...(opts.zones || {}) };
  const Z = zones[it.zone] || zones.yard;
  const avoid = [...AVOID, ...(opts.avoid || []).map(toRect)];
  const ratio = size && size.h ? size.w / size.h : 1;
  const base = it.h * STAGE.h * (opts.scale ?? 1);
  let best = null;
  // מעדיפים גודל מלא: מקטינים רק כשזה חוסך הרבה חפיפה (קנס על הקטנה). בשורת הילדים חפיפה טבעית — סובלנות גבוהה.
  const tol = Z.tol ?? 1;
  for (const scale of [1, 0.9, 0.8, 0.7]) {
    if (best && best.cost <= 0.4) break;
    for (let n = 0; n < 48; n++) {
      let box = Z.boxes[Math.floor(rand() * Z.boxes.length)];
      if (it.g && it.zone !== 'sky') { // בנים מימין, בנות משמאל
        const right = SPLIT[it.g] === 'right';
        box = { ...box, x0: right ? Math.max(box.x0, SPLIT.x) : box.x0, x1: right ? box.x1 : Math.min(box.x1, SPLIT.x) };
        if (box.x1 - box.x0 < 40) continue;
      }
      const y = box.y0 + rand() * (box.y1 - box.y0);
      const k = Z.persp ? Z.persp[2] + (Z.persp[3] - Z.persp[2]) * (y - Z.persp[0]) / (Z.persp[1] - Z.persp[0]) : 1;
      const h = base * scale * k, w = h * ratio;
      const half = Math.min(w / 2, (box.x1 - box.x0) / 2);
      const x = box.x0 + half + rand() * Math.max(0, box.x1 - box.x0 - 2 * half);
      const r = rect(x, y, w, h, Z.anchor);
      let cost = 0;
      for (const p of placed) {
        const o = inter(r, p.rect);
        if (o) cost = Math.max(cost, o / Math.min(area(r), area(p.rect)) * (p.zone === it.zone ? 1 : 0.45) * tol);
      }
      if (r.l < 280 || r.r > 1480) cost += 0.5; // לא לגלוש מחוץ לעמודה המרכזית
      for (const a of avoid) { const o = inter(r, a); if (o > 0) cost += 0.8 + o / area(r); } // לא לכסות אזורים תפוסים
      const adj = cost + (1 - scale) * 0.8;
      if (!best || adj < best.adj) best = { x, y, w, h, rect: r, cost, adj, zone: it.zone };
    }
  }
  if (!best) { const h = base, w = h * ratio, b = Z.boxes[0], x = (b.x0 + b.x1) / 2, y = (b.y0 + b.y1) / 2; best = { x, y, w, h, rect: rect(x, y, w, h, Z.anchor), cost: 1, zone: it.zone }; }
  best.z = (zones[best.zone]?.z || 400) + Math.round(best.rect.b / 4);
  return best;
}
