// מאגר הפריטים לשאלה "איך את רואה את בית הספר בשנה הבאה?"
// כל תשובה שנכתבת מוסיפה לאיור של בית הספר 1–3 פריטים (חפץ / ילד / קישוט) לפי מילות מפתח.
//
// מבנה: קבוצות (GROUPS) → בכל קבוצה מילות מפתח כלליות + פריטים, ולכל פריט מילות מפתח משלו.
//   מילה של הפריט עצמו = 3 נקודות · מילה של הקבוצה = נקודה אחת לכל פריטי הקבוצה (כך הם מתחלפים ביניהם).
//   פריט שכבר מופיע באיור מקבל קנס, כדי שתשובה דומה תוסיף משהו אחר מאותה קבוצה.
// תחביר מילות מפתח: רגיל = מופיע בתוך הטקסט · ^מילה = מילה שלמה (מותרות תחיליות ו/ה/ב/ל) · =מילה = מילה שלמה עם ו/ה/ב/ל/כ/מ/ש/ד.
// kind: kid = ילד/ים (צילום + קרטון) · obj = חפץ קרטון · big = מבנה קרטון גדול · roof = על הגג · sky = ציור טוש בשמיים
// zone: front = שורה קדמית · yard = חצר · side = צדי הבניין · roof = גג · sky = שמיים · float = חפץ שמרחף סביב בית הספר
// sz: גודל התמונה ביצירה (tall 1024x1536 · sq 1024x1024 · wide 1536x1024) · h: גובה בתצוגה כחלק מגובה הבמה
// p: ההנחיה לאיור (באנגלית). v: מספר גרסה כשמחליפים איור (הקובץ יהיה id_v2.png וכו').

// 6 תחומי האחריות של המנהלות — כל נושא במאגר שייך לאחד מהם (domain)
export const DOMAINS = [
  { id: 'pedagogy', n: 1, he: 'למידה מגוונת — פדגוגיה חדשנית', color: '#00B4D8' },
  { id: 'climate', n: 2, he: 'אקלים מיטבי — מוגנות, מניעת אלימות, שיח', color: '#EE2E5D' },
  { id: 'heritage', n: 3, he: 'מורשת, חגים, חיילי האור', color: '#4F3A96' },
  { id: 'english', n: 4, he: 'אנגלית בשיעורים ואנגלית דבורה', color: '#F26B2A' },
  { id: 'management', n: 5, he: 'ניהול מיטבי — מקצועיות המנהלת והצוות', color: '#A84A9C' },
  { id: 'early', n: 6, he: 'מצוינות בכיתות א–ב', color: '#FBB616' },
];
export const DOMAIN = Object.fromEntries(DOMAINS.map(d => [d.id, d]));
// ref: תמונת התייחסות ליצירה (images/logos/<ref>.*). לכל פריט ילדים מתווסף אוטומטית לוגו התלבושת "פרח האינטליגנציות".

const K = (id, he, kw, p, o = {}) => ({ id, he, kw, p, kind: 'kid', zone: 'front', sz: 'tall', h: 0.25, ...o });
const O = (id, he, kw, p, o = {}) => ({ id, he, kw, p, kind: 'obj', zone: 'float', sz: 'sq', h: 0.12, ...o });
const B = (id, he, kw, p, o = {}) => ({ id, he, kw, p, kind: 'big', zone: 'side', sz: 'sq', h: 0.3, ...o });
const R = (id, he, kw, p, o = {}) => ({ id, he, kw, p, kind: 'roof', zone: 'roof', sz: 'sq', h: 0.14, ...o });
const S = (id, he, kw, p, o = {}) => ({ id, he, kw, p, kind: 'sky', zone: 'sky', sz: 'sq', h: 0.12, ...o });

export const GROUPS = [
  // ───────────── קודש ─────────────
  { id: 'torah', domain: 'heritage', he: 'לימוד תורה', topic: 'torah',
    kw: ['תורה', 'לימודי קודש', 'לימוד קודש', 'קודש', '^גמרא', 'משנה', 'משניות', 'חומש', 'תנך', 'פרשה', 'פרשת השבוע', 'הלכה', 'הלכות', 'רמבם', 'בקיאות', 'ספרי קודש', 'בית מדרש', 'לומדים תורה', 'לומדות תורה'],
    items: [
      O('torah-scroll', 'ספר תורה', ['ספר תורה', 'הכנסת ספר תורה', 'אות בספר תורה', 'סיום'],
        'an open Torah scroll on two wooden rollers with turned handles, the parchment showing neat columns of tiny abstract black lines (no readable letters), a purple velvet mantle and a small silver crown beside it.', { h: 0.13 }),
      O('shtender', 'סטנדר עם חומש', ['חומש', 'סטנדר', 'פרשה', 'פרשת השבוע', 'תנך'],
        'a wooden-look study lectern (shtender) made of cardboard holding a large open holy book with gold-edged pages (pages show only abstract grey lines).', { h: 0.14 }),
      B('seforim-shelf', 'ארון ספרי קודש', ['ספרי קודש', 'ארון ספרים', 'בית מדרש', 'ספרייה תורנית', 'ספריה תורנית'],
        'a tall cardboard bookcase filled with neat rows of dark-blue, burgundy and black holy books with shiny gold-painted spines (no letters), a small brass lamp on top.'),
      K('chavruta', 'זוג חברותא', ['חברותא', 'חברותות', 'לומדים ביחד', 'לימוד בזוגות', 'לומדים בזוגות'],
        'Two boys learning together as chavruta partners at a small cardboard study lectern with a large open holy book: one boy (curly black hair, orange T-shirt) points at the page explaining eagerly, the other (light-brown hair, round glasses, cyan T-shirt) listens thoughtfully with a finger on his chin.', { sz: 'sq', v: 3, uniform: 1 }),
      K('boy-mishna', 'ילד חוזר משניות בעל פה', ['משנה', 'משניות', 'בעל פה', 'בעלפה', 'שינון', 'חזרה', '^גמרא', 'סיום מסכת'],
        'ONE boy proudly reciting by heart: eyes closed, a confident smile, one finger raised in the air, holding a small closed holy book against his chest. Sandy-blond hair, purple T-shirt, jeans.', { v: 3, uniform: 1 }),
      K('girl-chumash', 'ילדה לומדת חומש', ['בנות לומדות', 'לימודי קודש לבנות', 'לומדת', 'דינים'],
        'ONE girl sitting on a small cardboard stool, reading an open holy book with deep interest, her finger following the line, a happy focused expression. Long dark braid, teal top with three-quarter sleeves covering the elbows, a straight knee-length denim skirt.', { sz: 'sq', h: 0.21, v: 4, uniform: 1 }),
      O('halacha-books', 'ערימת ספרי הלכה', ['הלכה', 'הלכות', 'רמבם', 'שולחן ערוך', 'ידיעות', 'בקיאות'],
        'a neat stack of five thick holy books with dark leather-look covers and gold-painted spines (no letters), a red ribbon bookmark hanging out.'),
      K('chidon-kid', 'ילד זוכה בחידון', ['חידון', 'חידונים', 'חידון תורני', 'מבחן ידיעות', 'מבצע לימוד'],
        'ONE boy beaming with pride, holding a golden trophy high in one hand and a thick holy book in the other. Red curly hair, lime-green T-shirt, beige trousers.', { v: 3, uniform: 1 }),
    ] },

  { id: 'chassidut', domain: 'heritage', he: 'חסידות והתקשרות', topic: 'torah',
    kw: ['חסידות', 'חסידי', 'חסידית', 'תניא', 'שיחות הרבי', 'מאמר', 'הרבי', '^רבי', 'התקשרות', 'נשיא הדור', '770', 'ליובאוויטש', 'חבד', 'יט כסלו', 'דרכי החסידות', 'התוועדות', '^משיח', 'גאולה', 'אחד בשבט', 'חיבור לרבי', 'מחוברים לרבי', 'קשר לרבי'],
    items: [
      O('tanya', 'ספר תניא', ['תניא', 'יט כסלו', 'שיעור תניא', 'חסידות'],
        'a small square holy book with a deep navy-blue cover decorated with an embossed gold geometric frame (no letters), standing slightly open.', { h: 0.11 }),
      B('model-770', 'דגם 770', ['770', 'הרבי', '^רבי', 'התקשרות', 'נשיא הדור', 'ליובאוויטש', 'בית חיינו'],
        'a detailed cardboard architectural model of a three-storey red-brick building in Gothic Revival style with three steep peaked gables on the roofline, arched windows with white frames and a small staircase up to the entrance (the famous Chabad headquarters building in Brooklyn), a few tiny cardboard trees in front.', { zone: 'yard', sz: 'wide', h: 0.27 }),
      O('farbrengen', 'שולחן התוועדות', ['התוועדות', 'התוועדויות', 'פארבריינגען', 'פרבריינגען', 'לחיים'],
        'a small cardboard table covered with a white tablecloth, with little cups of red grape juice, a plate of cake slices and pretzels and an open holy book.', { zone: 'side', h: 0.13 }),
      B('beit-hamikdash', 'בית המקדש', ['^משיח', 'גאולה', 'בית המקדש', 'גאולה שלמה', 'ימות המשיח', 'בית המקדש השלישי'],
        'a golden-white cardboard model of the Holy Temple in Jerusalem (Beit HaMikdash): a tall majestic facade with columns and a wide gold-trimmed entrance, an altar and a courtyard with steps, soft golden glow.'),
      O('tzivos-badge', 'תג צבאות השם', ['צבאות השם', 'צבאות ה', 'דרגה', 'דרגות', 'חיילים', '^חייל', 'חיילי'],
        'a round shiny merit badge medal with a red-white-blue ribbon and a gold star in the center.', { h: 0.1 }),
    ] },

  { id: 'tefila', domain: 'heritage', he: 'תפילה', topic: 'tefila',
    kw: ['תפילה', 'תפילות', 'להתפלל', 'מתפלל', 'מתפללים', 'מתפללת', 'מתפללות', '^סידור', '^סידורים', 'שחרית', 'מנחה', 'מודה אני', 'שמע ישראל', 'כוונה', 'בכוונה', 'בית כנסת', 'בית הכנסת'],
    items: [
      O('siddur', 'סידור', ['^סידור', '^סידורים', 'תפילה'],
        'a closed prayer book (siddur) with a deep royal-blue cover, gold-painted page edges and a red ribbon bookmark.', { h: 0.1 }),
      K('boy-praying', 'ילד מתפלל', ['מתפלל', 'מתפללים', 'שחרית', 'תפילה בכוונה'],
        'ONE boy praying with sincere concentration, eyes gently closed, holding an open small prayer book in both hands. Black hair, navy T-shirt, grey trousers.', { v: 3, uniform: 1 }),
      K('girl-praying', 'ילדה מתפללת', ['מתפללת', 'מתפללות', 'תפילת בנות', 'מודה אני'],
        'ONE girl praying from an open small prayer book with a calm sweet smile. Auburn ponytail, raspberry-pink top with three-quarter sleeves covering the elbows, a straight knee-length grey skirt.', { v: 5, uniform: 1 }),
      B('aron-kodesh', 'ארון קודש', ['בית כנסת', 'בית הכנסת', 'ארון קודש', 'ארון הקודש', 'היכל'],
        'a cardboard Holy Ark (aron kodesh) for a synagogue with a deep-red velvet curtain embroidered with two golden lions and a crown (no letters), two small stone tablets on top with no writing.'),
      K('prayer-group', 'בנים מתפללים יחד', ['תפילה בציבור', 'מניין', 'תפילה משותפת', 'מתפללים יחד', 'מתפללים ביחד'],
      'Three boys (only boys) standing in a row holding small prayer books, praying together with joyful devotion: one in a navy T-shirt, one in an orange T-shirt, one in a lime-green T-shirt.', { sz: 'wide', v: 2, uniform: 1 }),
      K('girls-prayer', 'בנות מתפללות יחד', ['תפילה בציבור', 'תפילה משותפת', 'מתפללות יחד', 'מתפללות ביחד', 'תפילת בנות'],
      'Three girls (only girls) standing in a row holding small prayer books, praying together with sweet devotion: one in a cyan top, one in a raspberry top, one in a yellow top, all with three-quarter sleeves covering the elbows and straight knee-length denim skirts.', { sz: 'wide', v: 4, uniform: 1 }),
      O('tehillim', 'ספר תהילים', ['תהילים', 'תהלים', 'פרקי תהילים', 'אמירת תהילים'],
        'a small book of Psalms with a burgundy cover and an ornate gold border (no letters).', { h: 0.1 }),
      K('girl-bracha', 'ילדה מברכת על תפוח', ['ברכות', '^ברכה', '^ברכת', 'ברכות הנהנין', '^אמן', 'לפני האוכל'],
        'ONE girl holding up a shiny red apple, about to say a blessing over it, eyes on the apple with a sweet focused expression. Two dark puffs of hair, sunflower-yellow top with three-quarter sleeves covering the elbows, a straight knee-length navy skirt.', { v: 3, uniform: 1 }),
    ] },

  { id: 'kippa', domain: 'heritage', he: 'כיפה וציצית', topic: 'kippa',
    kw: ['כיפה', 'כיפות', 'ציצית', 'ציציות', 'טלית קטן', 'יראת שמים', 'יראת שמיים', 'מראה חסידי', 'לבוש חסידי', '^פאות'],
    items: [
      O('kippah', 'כיפה', ['כיפה', 'כיפות'],
        'the school kippah exactly as in the reference image: dark indigo denim with a turquoise trim around the edge and the small colorful embroidered logo on its side, shown at a slight angle.', { h: 0.08, ref: 'kippah', v: 2 }),
      O('tzitzit', 'ציצית', ['ציצית', 'ציציות', 'טלית קטן'],
        'a neatly folded small white four-cornered tzitzit garment with long knotted white strings hanging from the corners.', { h: 0.1 }),
      K('boy-kippa', 'ילד עם כיפה וציצית', ['כיפה', 'ציצית', 'יראת שמים', 'יראת שמיים', 'גאווה'],
        'ONE proud boy gently adjusting his school denim kippah with one hand, the white tzitzit strings clearly visible at his hips, big confident smile. Light-brown hair, tomato-red T-shirt, jeans.', { v: 3, logo: 1, uniform: 1 }),
      K('boys-highfive', 'שני ילדים בכיפות', ['כיפות', 'ציציות', 'מראה חסידי', 'לבוש חסידי'],
        'Two boys giving each other a high five and laughing, both with school denim kippot and white tzitzit strings visible at their hips; one in a cyan T-shirt, one in a sunflower-yellow T-shirt.', { sz: 'sq', v: 2, uniform: 1 }),
    ] },

  { id: 'girls', domain: 'heritage', he: 'בנות', topic: 'girls',
    kw: ['צניעות', 'צנועה', 'צנועות', 'בת מלך', 'בנות מלך', '^בנות', 'תלמידות', '^ילדות', 'חצאית', '^שמלה', 'עדינות', '^בת'],
    items: [
      O('crown', 'כתר בת מלך', ['בת מלך', 'בנות מלך', 'מלכות', '^כתר', 'ערך עצמי'],
        'a golden cardboard crown decorated with pink, purple and cyan paper jewels.', { h: 0.1 }),
      K('girls-pair', 'שתי חברות', ['^בנות', 'תלמידות', 'חברות טובות'],
        'Two girls walking arm in arm, chatting and laughing, carrying school backpacks: one in a straight knee-length denim skirt and a cyan T-shirt with three-quarter sleeves covering the elbows, one in a straight knee-length denim skirt and a yellow top.', { sz: 'sq', v: 5, uniform: 1 }),
      O('hair-bow', 'סרט שיער', ['^ילדות', 'עדינות', '^חן'],
        'a big pink and purple hair bow ribbon.', { h: 0.08 }),
      K('girl-leader', 'ילדה נואמת', ['מנהיגה', 'מנהיגות', 'מובילה', 'מובילות', 'בנות מובילות', 'ביטחון עצמי'],
        'ONE girl confidently giving a short speech into a cardboard microphone on a stand, the other hand gesturing, bright smile. Shoulder-length chestnut hair with a white headband, orange top with three-quarter sleeves covering the elbows, a straight knee-length denim skirt.', { v: 3, uniform: 1 }),
    ] },

  // ───────────── שליחות, שבת וחגים ─────────────
  { id: 'mivtzaim', domain: 'heritage', he: 'שליחות ומבצעים', topic: 'mivtzaim',
    kw: ['שליחות', 'שלוחים', '^שליח', 'שליחה', '^מבצע', '^מבצעים', 'מבצעי', 'הפצה', 'הפצת', 'מעיינות', 'להאיר', 'מאירים', 'מאירות', '^אור', '^אורה', 'קירוב', 'משפיעים', 'משפיע', 'משפיעה', '^מצווה', '^מצוה', '^מצוות', 'מצוות', 'ופרצת', 'הפצת המעיינות'],
    items: [
      B('mitzvah-tank', 'טנק מבצעים', ['טנק', 'טנק מבצעים', 'יציאה למבצעים', 'מבצעים ברחוב'],
        'a cardboard model of a Chabad "Mitzvah Tank": a large white RV camper van decorated with bold colorful painted stripes, a big painted icon of two Shabbat candles and a painted icon of a tefillin box on its side (no letters), a cardboard loudspeaker on the roof.', { zone: 'yard', sz: 'wide', h: 0.24 }),
      O('globe', 'גלובוס של שליחות', ['כל העולם', 'העולם', 'גלובוס', 'בכל העולם', 'שלוחי הרבי', 'שליחות'],
        'a cardboard globe on a stand with small colorful flag-pins (blank flags) and tiny glowing stars pinned all around the world.', { h: 0.14 }),
      O('lantern', 'פנס מאיר', ['להאיר', '^אור', 'מאירים', 'מאירות', 'אור לגויים', '^אורה', '^נר'],
        'a glowing cardboard lantern with warm golden light shining out through cut-out star shapes.', { h: 0.12 }),
      B('lighthouse', 'מגדלור', ['מגדלור', 'להוביל', 'דוגמה אישית', 'דוגמא אישית', 'מוביל', 'מובילים', 'מאיר', 'מאירה', 'מגדלור'],
        'a tall cardboard lighthouse painted with red and white stripes, a glowing yellow lamp at the top sending out bright light rays.', { h: 0.34, sz: 'tall' }),
      O('shabbat-candles', 'נרות שבת', ['נרות שבת', 'נר שבת', 'הדלקת נרות', 'נשק', 'מבצע נרות', 'נשי ובנות'],
        'two tall white Shabbat candles in polished silver candlesticks with warm glowing flames.', { h: 0.13 }),
      K('girl-candles', 'ילדה מחלקת נרות שבת', ['מחלקות נרות', 'מבצע נשק', 'נשי ובנות ישראל', 'נרות שבת'],
        'ONE girl holding out a small box of Shabbat candles with a warm inviting smile, offering it to someone. Dark wavy hair with a yellow headband, purple top with three-quarter sleeves covering the elbows, a straight knee-length denim skirt.', { v: 3, uniform: 1 }),
      K('boy-tefillin', 'ילד מציע תפילין', ['מבצע תפילין', 'הנחת תפילין', 'להניח תפילין', 'מניחים תפילין'],
        'ONE boy proudly holding a small navy velvet tefillin bag in both hands, offering it with a warm inviting smile. Brown hair, grass-green T-shirt, jeans.', { v: 2, uniform: 1 }),
      O('tefillin', 'תפילין', ['תפילין', 'בר מצווה', 'בר מצוה'],
        'a pair of black leather tefillin boxes with black leather straps, beside a navy velvet tefillin bag.', { h: 0.1 }),
      O('tzedakah-box', 'קופת צדקה', ['צדקה', 'קופת צדקה', 'פושקע', 'תרומה'],
        'a colorful cardboard tzedakah charity box with a coin slot on top and a shiny golden coin dropping in.', { h: 0.12 }),
      O('mezuzah', 'מזוזה', ['מזוזה', 'מזוזות'],
        'a decorative mezuzah case in turquoise and gold, standing upright.', { h: 0.1 }),
      K('boy-speech', 'ילד משפיע על במה', ['נאום', 'נואמים', 'להשפיע', 'משפיע', 'משפיעים', 'מנהיגים', 'מועצת תלמידים', 'מובילים'],
        'ONE boy standing on a small cardboard box giving an enthusiastic speech into a cardboard microphone, one arm raised high. Dark curly hair, sunflower-yellow T-shirt, navy trousers.', { v: 2, uniform: 1 }),
    ] },

  { id: 'shabbat', domain: 'heritage', he: 'שבת', topic: 'shabbat',
    kw: ['^שבת', '^שבתות', 'שבת קודש', 'קבלת שבת', 'עונג שבת', '^חלה', '^חלות', 'קידוש', 'הבדלה', 'שבת שלום', 'שבת המלכה'],
    items: [
      O('challah', 'חלה', ['^חלה', '^חלות', 'הפרשת חלה'],
        'a golden braided challah bread on a wooden board with a white embroidered challah cover folded beside it.', { h: 0.1 }),
      O('kiddush-cup', 'גביע קידוש', ['קידוש', 'הבדלה', '^יין', 'גביע'],
        'a polished silver kiddush cup filled with red grape juice, on a small silver saucer.', { h: 0.11 }),
      K('girl-challah', 'ילדה מביאה חלה', ['^חלה', 'קבלת שבת', 'הכנות לשבת', 'ערב שבת'],
        'ONE girl carrying a tray with a golden braided challah, smiling proudly. Blond bob haircut, lime-green top with three-quarter sleeves covering the elbows, a straight knee-length navy skirt.', { v: 3, uniform: 1 }),
      O('shabbat-table', 'שולחן שבת', ['קבלת שבת', 'עונג שבת', 'שולחן שבת', 'סעודת שבת'],
        'a small Shabbat table with a white tablecloth, two silver candlesticks with lit candles, a challah under an embroidered cover and a silver cup.', { zone: 'side', h: 0.14 }),
    ] },

  { id: 'chagim', domain: 'heritage', he: 'חגים', topic: 'shabbat',
    kw: ['^חג', '^חגים', 'חגי ישראל', 'מועדים', 'מועדי ישראל', 'יום טוב', 'מעגל השנה', 'לוח השנה', 'חגיגות'],
    items: [
      O('shofar', 'שופר', ['^שופר', 'ראש השנה', 'אלול', 'תשרי', 'תקיעת שופר', 'ימים נוראים'],
        'a long curved ram\'s-horn shofar in glossy honey and brown tones.', { h: 0.1 }),
      O('apple-honey', 'תפוח בדבש', ['ראש השנה', 'שנה טובה', 'שנה מתוקה', 'תפוח בדבש', 'שנה חדשה'],
        'a shiny red apple and a small glass jar of golden honey with a wooden honey dipper.', { h: 0.1 }),
      B('sukkah', 'סוכה', ['סוכה', 'סוכות', 'חול המועד', '^סוכת'],
        'a small cardboard sukkah hut with a roof of green palm branches, colorful paper chains and hanging paper fruit decorations, an open front.', { zone: 'yard', h: 0.26 }),
      O('lulav-etrog', 'לולב ואתרוג', ['לולב', 'אתרוג', 'ארבעת המינים', 'נענועים'],
        'a lulav palm frond bound with myrtle and willow branches, beside a yellow etrog citron in an open decorative box.', { h: 0.15 }),
      O('torah-flag', 'דגל שמחת תורה', ['שמחת תורה', 'הקפות', '^דגל', '^דגלים'],
        'a festive cardboard Simchat Torah flag on a wooden stick topped with a red apple, decorated with colorful stripes and a painted Torah scroll (no letters).', { h: 0.13 }),
      R('menorah', 'חנוכייה על הגג', ['חנוכה', 'חנוכייה', 'חנוכיה', 'נרות חנוכה', 'פרסומי ניסא', '^מנורה'],
        'a large golden Chabad-style Chanukah menorah with straight diagonal arms rising upward, eight glowing flames in a row and a raised shamash flame.', { h: 0.16 }),
      O('dreidel', 'סביבון', ['^סביבון', 'סביבונים', 'חנוכה'],
        'a colorful spinning dreidel (spinning top) made of cardboard, mid-spin (no letters).', { h: 0.09 }),
      O('sufganiya', 'סופגנייה', ['סופגניה', 'סופגנייה', 'סופגניות'],
        'a fluffy powdered-sugar jelly doughnut (sufganiya) with red jam peeking out on top.', { h: 0.08 }),
      O('mishloach-manot', 'משלוח מנות', ['פורים', 'משלוח מנות', 'משלוחי מנות', 'מתנות לאביונים'],
        'a festive gift basket of treats (mishloach manot) wrapped in clear cellophane with a curly pink ribbon, candies, cookies and a small juice bottle inside.', { h: 0.12 }),
      K('girl-esther', 'ילדה מחופשת למלכה אסתר', ['פורים', 'תחפושת', 'תחפושות', 'עדלאידע', 'מגילה', 'מגילת אסתר'],
        'ONE girl dressed up for Purim as Queen Esther: a long modest royal-purple gown with sleeves to the wrists, a golden cardboard crown, holding a rolled scroll, delighted smile. Long black hair.', { v: 3, uniform: 1 }),
      K('boy-purim', 'ילד מחופש לטבח', ['פורים', 'תחפושת', 'תחפושות', 'עדלאידע', 'שמחת פורים'],
        'ONE boy dressed up for Purim as a chef: a white chef hat over his kippah, a white apron over a cyan T-shirt, holding a big wooden spoon, laughing. Freckles, ginger hair.', { v: 2, uniform: 1 }),
      O('seder-plate', 'קערת פסח ומצות', ['פסח', '^מצה', 'ליל הסדר', 'סדר פסח', 'הגדה', 'יציאת מצרים'],
        'a decorative Passover seder plate with the symbolic foods (shank bone, egg, bitter herbs, charoset, parsley), beside a stack of square matzahs.', { h: 0.11 }),
      O('lag-baomer', 'מדורת ל"ג בעומר', ['לג בעומר', 'מדורה', 'מדורות', 'תהלוכה', 'תהלוכות', '^קשת וחץ'],
        'a small cardboard campfire with paper flames in red, orange and yellow, a toy bow and arrow lying beside it.', { h: 0.12 }),
      O('bikkurim', 'סל ביכורים', ['שבועות', 'ביכורים', 'בכורים', 'שבעת המינים', 'טו בשבט', 'מתן תורה'],
        'a woven basket overflowing with the seven species: wheat stalks, barley, purple grapes, figs, a pomegranate, olives and dates.', { h: 0.12 }),
    ] },

  // ───────────── לימודים ─────────────
  { id: 'english', domain: 'english', he: 'אנגלית', topic: 'english',
    kw: ['אנגלית', 'english', '^אנגלי', 'באנגלית', '^שפות', 'שפה זרה', 'דוברי אנגלית', 'דוברים אנגלית', 'hello', 'אנגלית דבורה', 'אנגלית מדוברת', 'דיבור באנגלית', 'לדבר באנגלית', 'אנגלית בשיעורים', 'שיעורים רגילים', 'שילוב אנגלית', 'משלבים אנגלית', 'אנגלית בכל'],
    items: [
      O('abc-blocks', 'קוביות ABC', ['אנגלית', 'english', 'abc', 'אותיות באנגלית'],
        'three big cardboard toy blocks stacked playfully, painted cyan, yellow and pink, with the large capital letters A, B and C on their fronts.', { h: 0.12 }),
      O('london-bus', 'אוטובוס קומתיים', ['דוברי אנגלית', 'לדבר אנגלית', 'מדברים אנגלית', 'שפות'],
        'a red double-decker bus made of cardboard with white windows and black wheels (no text).', { sz: 'wide', h: 0.14 }),
      K('girl-english', 'ילדה עם ספר באנגלית', ['קריאה באנגלית', 'ספרים באנגלית', 'אנגלית'],
        'ONE girl holding up a big open picture book showing a large red apple and a cartoon cat, pointing at it excitedly with her mouth open as if saying a word. Ginger curls, cyan top with three-quarter sleeves covering the elbows, a straight knee-length navy skirt.', { v: 4, uniform: 1 }),
      S('speech-bubbles', 'בועות דיבור', ['^דיבור', 'לדבר', 'מדברים', 'מדברות', 'שיח', 'תקשורת', 'שיחה'],
        'two colorful empty speech bubbles overlapping, one cyan and one raspberry pink (empty, no letters).'),
      K('boy-headphones', 'ילד מאזין באוזניות', ['האזנה', 'שמיעה', 'הבנת הנשמע', 'אנגלית מדוברת'],
        'ONE boy wearing big colorful headphones, listening and smiling with a thumbs up, holding a cardboard tablet. Black hair in a buzz cut, orange T-shirt, jeans.', { v: 2, uniform: 1 }),
      K('boys-english-game', 'בנים במשחק מילים באנגלית', ['משחק באנגלית', 'משחקים באנגלית', 'מילים באנגלית', 'אוצר מילים באנגלית', 'למידה משחקית באנגלית'],
        'Two boys (only boys) playing an English word game with big cardboard picture cards (a cat, a dog, a sun) on a small cardboard table, one raising a card excitedly, the other laughing.', { sz: 'sq', uniform: 1 }),
      K('girls-english-song', 'בנות שרות באנגלית', ['שירים באנגלית', 'שירה באנגלית', 'שיר באנגלית', 'אנגלית בשירים'],
        'Three girls (only girls) singing an English song together joyfully, one holding a cardboard microphone, colorful paper music notes around them.', { sz: 'wide', uniform: 1 }),
      B('english-corner', 'פינת אנגלית', ['פינת אנגלית', 'מרחב אנגלית', 'סביבה אנגלית', 'חשיפה לאנגלית', 'אנגלית בכיתה'],
        'a cozy English corner: a small cardboard bookshelf with colorful picture books for children, a round striped rug, a yellow beanbag and a big cardboard alphabet poster with the letters A B C D E.', { zone: 'yard', sz: 'wide', h: 0.16 }),
      S('hello-bubble', 'בועת HELLO', ['hello', 'לברך באנגלית', 'מברכים באנגלית', 'good morning', 'בוקר טוב באנגלית'],
        'a big colorful speech bubble with the word HELLO written in bold rainbow marker letters.'),
      K('boys-english-talk', 'בנים מדברים אנגלית', ['אנגלית דבורה', 'אנגלית מדוברת', 'דיבור באנגלית', 'מדברים באנגלית', 'שיחה באנגלית', 'לדבר באנגלית'],
        'Two boys (only boys) having a cheerful conversation, one waving hello and talking, the other laughing and answering; one holds up an empty colorful cardboard speech bubble on a stick (no letters).', { sz: 'sq', v: 2, uniform: 1 }),
      K('girls-english-talk', 'בנות מדברות אנגלית', ['אנגלית דבורה', 'אנגלית מדוברת', 'דיבור באנגלית', 'מדברות באנגלית', 'שיחה באנגלית', 'לדבר באנגלית'],
        'Two girls (only girls) having a cheerful conversation, one waving hello and talking, the other laughing and answering; one holds up an empty colorful cardboard speech bubble on a stick (no letters). Both in long-sleeved tops and straight knee-length denim skirts.', { sz: 'sq', v: 2, uniform: 1 }),
      O('flashcards', 'כרטיסי מילים', ['אוצר מילים באנגלית', 'מילים באנגלית', 'כרטיסיות', 'אנגלית בשיעורים', 'שילוב אנגלית', 'משלבים אנגלית'],
        'a string of colorful picture flash cards hanging like bunting, each card with a simple picture: an apple, a sun, a cat, a house, a ball (no letters).', { sz: 'wide', h: 0.09 }),
      O('english-book', 'ספר באנגלית', ['ספר באנגלית', 'ספרים באנגלית', 'קריאה באנגלית', 'סיפור באנגלית'],
        'an open children\'s picture book standing upright, showing a big friendly cartoon lion and the large English word LION.', { h: 0.11 }),
    ] },

  { id: 'math', domain: 'early', he: 'חשבון', topic: 'math',
    kw: ['מתמטיקה', 'מתמטי', 'חשבון', 'מספרים', '^כפל', 'לוח הכפל', 'שברים', 'גאומטריה', 'גיאומטריה', 'הנדסה', 'חישוב', 'חשיבה כמותית', 'בעיות מילוליות', 'תרגול'],
    items: [
      O('abacus', 'חשבונייה', ['חשבון', 'חשבוניה', 'חשבונייה', 'ספירה', 'לספור'],
        'a small abacus with rows of colorful beads (red, yellow, cyan, green, purple) in a cardboard frame.', { h: 0.12 }),
      O('numbers', 'מספרי קרטון ענקיים', ['מספרים', 'מתמטיקה', 'מספרים ענקיים'],
        'three separate giant chunky cardboard numerals 1, 2 and 3 standing side by side with small gaps between them (no plus sign, no other symbols), painted orange, cyan and yellow.', { h: 0.13, v: 2 }),
      O('calculator', 'מחשבון', ['מחשבון', 'חישוב', 'חישובים', 'חישובית'],
        'a chunky cardboard calculator with colorful round buttons and a small screen.', { h: 0.1 }),
      O('geometry-set', 'ערכת גאומטריה', ['גאומטריה', 'גיאומטריה', 'הנדסה', 'מדידה', 'סרגל', 'מחוגה'],
        'a drawing compass, a triangle ruler and a protractor made of colorful cardboard, arranged together.', { h: 0.1 }),
      K('boy-chalkboard', 'ילד פותר על לוח', ['לוח הכפל', '^כפל', 'שברים', 'תרגול', 'פותרים', 'פתרון בעיות'],
        'ONE boy holding a piece of chalk, writing on a small cardboard chalkboard on an easel with simple chalk doodles of plus signs, circles and triangles, looking back at the viewer proudly. Wavy brown hair, purple T-shirt, jeans.', { v: 2, uniform: 1 }),
      O('shapes', 'גופים הנדסיים', ['צורות', 'גופים', 'גופים הנדסיים'],
        'colorful cardboard 3D geometric shapes grouped together: a cube, a pyramid, a cylinder and a sphere.', { h: 0.1 }),
    ] },

  { id: 'reading', domain: 'early', he: 'קריאה', topic: 'reading',
    kw: ['קריאה', 'לקרוא', 'קוראים', 'קוראות', 'הבנת הנקרא', 'ספרייה', 'ספריה', 'ספרי קריאה', 'אוהבים לקרוא', 'אוהבות לקרוא', 'תולעי ספרים', 'אוריינות', 'קריאת ספרים'],
    items: [
      O('book-stack', 'ערימת ספרים', ['ספרים', 'קריאת ספרים', 'ספרים רבים'],
        'a tall slightly wobbly stack of colorful children\'s books with bright covers (no letters).', { h: 0.14 }),
      B('library-shelf', 'מדף ספרייה', ['ספרייה', 'ספריה', 'ספריית', 'ספרייה כיתתית', 'השאלת ספרים'],
        'a colorful cardboard library bookcase packed with bright children\'s books (no letters), a little reading lamp and a small potted plant on top.'),
      K('girl-reading', 'ילדה קוראת', ['קוראת', 'קוראות', 'אוהבות לקרוא', 'קריאה להנאה'],
        'ONE girl sitting cross-legged on a big yellow beanbag, completely absorbed in a book, a dreamy smile. Long light-brown hair in a side braid, mint top with three-quarter sleeves covering the elbows, a straight knee-length denim skirt.', { sz: 'sq', h: 0.2, v: 3, uniform: 1 }),
      K('boy-reading', 'ילד קורא בהנאה', ['קורא', 'קוראים', 'אוהבים לקרוא', 'קריאה בהנאה'],
        'ONE boy walking while reading a book held close to his face, giggling at something funny in it. Short black curly hair, glasses, tomato-red T-shirt, beige trousers.', { v: 2, uniform: 1 }),
      O('reading-nook', 'פינת קריאה', ['פינת קריאה', 'פינות קריאה', 'פינה נעימה'],
        'a cozy cardboard armchair with a soft orange cushion, a small open book resting on it and a little standing lamp beside it.', { zone: 'side', h: 0.15 }),
      S('magic-book', 'ספר מעופף', ['דמיון', 'סיפורים', '^סיפור', 'ספרות', 'סיפורת'],
        'an open book with its pages fluttering and little colorful stars and swirls flying out of it.'),
    ] },

  { id: 'writing', domain: 'early', he: 'לשון וכתיבה', topic: 'reading',
    kw: ['לשון', 'כתיבה', 'לכתוב', 'כותבים', 'כותבות', 'הבעה', 'הבעה בכתב', '^עברית', 'דקדוק', '^ניקוד', 'אוצר מילים', 'אותיות', 'אלף בית', 'חיבור בכתב', 'כתיבת חיבור', 'כתב יד'],
    items: [
      O('giant-pencil', 'עיפרון ענק', ['כתיבה', 'כותבים', 'כותבות', '^עיפרון', 'עפרונות'],
        'a giant yellow pencil with a sharpened tip and a pink eraser, lying diagonally.', { h: 0.08 }),
      O('notebooks', 'מחברות', ['מחברת', 'מחברות', 'שיעורי בית', 'סדר במחברת'],
        'a stack of colorful notebooks (cyan, orange, pink, lime) with a pencil lying on top.', { h: 0.1 }),
      O('alef-bet', 'קוביות אלף־בית', ['אותיות', 'אלף בית', 'קריאה ראשונית', '^ניקוד', '^עברית'],
        'three chunky cardboard toy blocks painted orange, cyan and yellow, with the large Hebrew letters א, ב and ג painted on their fronts.', { h: 0.12 }),
      K('girl-writing', 'ילדה כותבת', ['כותבת', 'כותבות', 'כתיבת חיבור', 'הבעה בכתב', 'יומן'],
        'ONE girl writing in a notebook that she holds against her forearm, pencil in hand, a thoughtful happy smile. Black hair in two puffs, sunflower-yellow top with three-quarter sleeves covering the elbows, a straight knee-length denim skirt.', { v: 4, uniform: 1 }),
      O('newspaper', 'עיתון בית ספרי', ['עיתון', 'עיתון בית ספרי', 'כתבים', 'כתבות', 'עיתונאות'],
        'a folded school newspaper with columns of abstract grey lines and small colorful photos (no readable text).', { h: 0.1 }),
    ] },

  { id: 'science', domain: 'pedagogy', he: 'מדעים', topic: 'science',
    kw: ['מדע', 'מדעים', 'מדעי', '^מעבדה', '^מעבדת', '^מעבדות', 'ניסוי', 'ניסויים', 'חקר', '^חוקרים', '^חוקרות', 'מחקר', 'כימיה', 'פיזיקה', 'ביולוגיה', 'סקרנות מדעית', 'סטם', 'stem'],
    items: [
      O('microscope', 'מיקרוסקופ', ['מיקרוסקופ', 'מדע', 'מעבדה', 'מעבדת', 'ביולוגיה'],
        'a cardboard microscope painted cyan and purple with shiny silver lenses.', { h: 0.13 }),
      O('flasks', 'מבחנות וכלי מעבדה', ['מבחנות', 'ניסויים', 'כימיה', 'מעבדה'],
        'three glass lab flasks with bubbling glowing liquids in cyan, pink and lime green, colorful bubbles rising.', { h: 0.12 }),
      K('girl-scientist', 'ילדה מדענית', ['מדענית', 'מדענים', 'מדעניות', 'חוקרות', 'ניסוי'],
        'ONE girl in a white lab coat over her clothes and clear safety goggles, holding up a test tube with a bubbling green liquid, amazed open-mouthed smile. Brown ponytail, a straight knee-length navy skirt.', { v: 3, uniform: 1 }),
      O('volcano', 'הר געש של ניסוי', ['יום מדע', 'תערוכה מדעית', 'כנס מדע', 'ניסויים'],
        'a cardboard volcano model erupting with colorful foam lava in pink, orange and yellow.', { h: 0.12 }),
      O('magnet', 'מגנט', ['מגנט', 'פיזיקה', 'כוחות', 'משיכה'],
        'a big red and silver horseshoe magnet attracting a few colorful paper clips.', { h: 0.09 }),
    ] },

  { id: 'tech', domain: 'pedagogy', he: 'טכנולוגיה וחדשנות', topic: 'science',
    kw: ['טכנולוגיה', 'טכנולוגי', 'טכנולוגית', '^מחשב', '^מחשבים', 'מחשוב', 'דיגיטל', 'דיגיטלי', 'דיגיטלית', 'תכנות', '^קוד', 'סייבר', 'הייטק', '^מסך', '^מסכים', 'חדשנות', 'חדשני', 'חדשנית', 'חדשניים', 'מתקדם', 'מתקדמת', 'עתידני', 'עתידנית', '^ai', 'בינה מלאכותית', 'רובוט'],
    items: [
      O('robot', 'רובוט', ['רובוט', 'רובוטים', 'רובוטיקה'],
        'a friendly full-body cardboard robot standing upright with glowing round eyes, an antenna with a light bulb, colorful LED buttons on its chest and boxy arms and legs.', { h: 0.17, sz: 'tall' }),
      O('laptop', 'מחשב נייד', ['^מחשב', '^מחשבים', 'מחשב נייד', 'מחשוב', 'תכנות', '^קוד'],
        'an open cardboard laptop with a glowing cyan screen showing colorful abstract code blocks.', { h: 0.1 }),
      K('boy-tablet', 'ילד עם טאבלט', ['טאבלט', 'טאבלטים', 'אייפד', 'לומדה', 'למידה דיגיטלית', 'למידה מקוונת'],
        'ONE boy holding a tablet in both hands, looking at it with excitement and turning it slightly toward the viewer, the screen glowing with colorful shapes. Blond hair, round glasses, cyan T-shirt, jeans.', { v: 2, uniform: 1 }),
      S('drone', 'רחפן', ['רחפן', 'רחפנים', 'צילום אווירי'],
        'a small quadcopter drone flying with four spinning propellers and a tiny camera.'),
      O('3d-printer', 'מדפסת תלת־ממד', ['מדפסת תלת', 'תלת מימד', 'תלת ממד', 'מייקר', 'מייקרים', 'מייקרספייס', 'מרחב יצירה', 'המצאה', 'להמציא', 'ממציאים'],
        'a cardboard 3D printer printing a small colorful toy rocket, with a spool of cyan filament on its side.', { h: 0.13 }),
      O('ai-chip', 'שבב בינה מלאכותית', ['בינה מלאכותית', '^ai', 'צאט', 'gpt', '^בוט'],
        'a glowing brain-shaped computer chip made of cardboard with cyan and purple glowing circuit lines.', { h: 0.11 }),
      K('girl-vr', 'ילדה עם משקפי מציאות מדומה', ['מציאות מדומה', '^vr', 'מציאות רבודה', 'משקפי מציאות', 'עתידני', 'עתידנית'],
        'ONE girl wearing cardboard virtual-reality goggles, reaching one hand out in wonder, a huge delighted smile. Curly dark hair with a pink clip, purple top with three-quarter sleeves covering the elbows, a straight knee-length denim skirt.', { v: 3, uniform: 1 }),
      B('smartboard', 'לוח חכם', ['לוח חכם', 'לוחות חכמים', '^לוחות', 'כיתה חכמה', 'כיתות חכמות', 'מקרן', 'כיתה דיגיטלית', 'כיתות דיגיטליות', '^מסך'],
        'a cardboard interactive smart board on a rolling stand with a glowing screen showing colorful charts, shapes and stars (no text).', { zone: 'yard', h: 0.24 }),
    ] },

  { id: 'space', domain: 'pedagogy', he: 'חלל ושאיפות', topic: 'science',
    kw: ['^חלל', 'אסטרונומיה', '^כוכבים', 'להמריא', 'המראה', 'ממריאים', 'ממריאות', 'הגבול', 'אין גבול', 'אין גבולות', '^שמיים', '^שמים', '^לשאוף', 'שאיפות', '^רחוק', 'להגיע רחוק', '^טיל', 'חללית'],
    items: [
      S('rocket', 'טיל', ['^טיל', 'להמריא', 'המראה', 'ממריאים', 'ממריאות', 'חללית', 'לשגר'],
        'a blue and red rocket with orange-yellow flames, flying diagonally upward.', { h: 0.15 }),
      S('planet', 'כוכב לכת', ['^חלל', 'כוכב לכת', 'כוכבי לכת', 'יקום', 'אסטרונומיה'],
        'a turquoise planet with craters and a thin orange ring.'),
      S('comet', 'שביט', ['שביט', 'מהירות', 'קפיצת דרך', 'תנופה', '^זינוק', 'מואץ', 'מואצת'],
        'a blue comet with a long orange and yellow fiery tail.'),
      R('telescope', 'טלסקופ על הגג', ['טלסקופ', 'לראות רחוק', 'ראייה למרחוק', 'ראיה למרחוק', 'מבט קדימה', 'מבט לעתיד'],
        'a cardboard telescope on a tripod pointing up to the sky, painted purple and yellow with a shiny lens.'),
      S('satellite', 'לוויין', ['לוויין', 'לווין', 'תקשורת', 'קליטה'],
        'a small satellite with blue solar panels and an antenna.'),
      K('boy-astronaut', 'ילד אסטרונאוט', ['אסטרונאוט', 'אסטרונאוטים', '^חלל', 'אין גבול', 'השמיים הם הגבול', 'השמים הם הגבול'],
        'ONE boy dressed as an astronaut with a cardboard space helmet tucked under his arm (his school denim kippah visible on his head), a cardboard jetpack on his back, arms raised in triumph. Brown hair, orange T-shirt, jeans.', { v: 2, uniform: 1 }),
      K('rocket-kid', 'ילדה בחללית קרטון', ['חללית', 'חלום', 'חלומות', 'להגיע רחוק', '^רחוק'],
        'a big upright cardboard rocket ship with round porthole windows and hand-drawn colorful marker stars and planets on it; ONE cheerful girl peeking out of the open top, waving one hand high. Blond ponytail, yellow LONG-SLEEVED top (sleeves down to the wrists). ONE girl only — nobody else in the image, no boys, no other people.', { v: 4, uniform: 1 }),
    ] },

  // ───────────── גוף, אמנות וחוויה ─────────────
  { id: 'sport', domain: 'pedagogy', he: 'ספורט', topic: 'sport',
    kw: ['ספורט', 'ספורטיבי', 'ספורטיבית', 'חנג', 'חינוך גופני', '^כושר', 'התעמלות', '^תנועה', 'פעילות גופנית', 'אימון', 'אימונים', 'ליגה', 'נבחרת', '^כדור'],
    items: [
      O('soccer-ball', 'כדורגל', ['כדורגל', '^כדור', 'ליגה'],
        'a soccer ball with classic black and white panels.', { h: 0.07 }),
      K('boy-soccer', 'ילד בועט בכדור', ['כדורגל', 'בועט', 'ליגה', 'נבחרת'],
        'ONE boy in dynamic motion kicking a soccer ball, one leg swinging forward, joyful determined face. Short dark hair, tomato-red T-shirt, black track pants with white stripes.', { v: 2, uniform: 1 }),
      B('basketball-hoop', 'סל כדורסל', ['כדורסל', '^סל'],
        'a cardboard basketball hoop on a tall pole with an orange rim and a white net, a basketball resting at its base.', { sz: 'tall', h: 0.32 }),
      K('boy-basketball', 'ילד קופץ לסל', ['כדורסל', 'קליעה', 'לקלוע'],
        'ONE boy jumping high to shoot a basketball, arms stretched up. Light-brown hair, sunflower-yellow T-shirt, navy track pants.', { v: 2, uniform: 1 }),
      K('girl-jumprope', 'ילדה בקפיצה בחבל', ['חבל', 'קפיצה בחבל', 'התעמלות', 'ספורט בנות'],
        'ONE girl jumping rope mid-air, the rope arcing over her, laughing. Black braids, cyan top with three-quarter sleeves covering the elbows, a straight knee-length denim skirt.', { v: 2, uniform: 1 }),
      K('boys-race', 'בנים במרוץ', ['ריצה', 'מרוץ', 'רצים', 'אתלטיקה', 'יום ספורט', 'תחרות'],
      'Two boys (only boys) racing each other, running joyfully side by side mid-stride: one in an orange T-shirt and jeans, one in a cyan T-shirt and black track pants.', { sz: 'sq', v: 2, uniform: 1 }),
      K('girls-race', 'בנות במרוץ', ['ריצה', 'מרוץ', 'רצות', 'יום ספורט', 'ספורט בנות'],
      'Two girls (only girls) racing each other, running joyfully side by side mid-stride: one in a lime-green top and a straight knee-length navy skirt, one in a purple top and a straight knee-length grey skirt, both with three-quarter sleeves covering the elbows.', { sz: 'sq', v: 2, uniform: 1 }),
      O('bicycle', 'אופניים', ['אופניים', 'רכיבה', 'זהירות בדרכים'],
        'a colorful cardboard bicycle with cyan frame, orange wheels and a little bell.', { zone: 'side', sz: 'wide', h: 0.12 }),
      O('sneakers', 'נעלי ספורט', ['^נעליים', 'נעלי ספורט', 'ריצה'],
        'a pair of colorful running sneakers in cyan, orange and lime.', { h: 0.07 }),
    ] },

  { id: 'health', domain: 'climate', he: 'בריאות ותזונה', topic: 'sport',
    kw: ['בריאות', '^בריא', '^בריאה', '^בריאים', 'תזונה', 'תזונה נכונה', 'אוכל בריא', 'ירקות', 'פירות', '^מים', 'אורח חיים בריא', 'ארוחה', 'ארוחות', 'ארוחת עשר', 'הזנה', 'חדר אוכל', 'ארוחת צהריים'],
    items: [
      O('lunchbox', 'קופסת אוכל בריא', ['ארוחת עשר', 'אוכל בריא', 'ארוחה', 'ארוחות', 'הזנה', 'ארוחת צהריים'],
        'an open lunch box with a sandwich, cucumber slices, cherry tomatoes and an apple, beside a cyan water bottle.', { h: 0.1 }),
      O('fruit-bowl', 'קערת פירות', ['פירות', 'ירקות', 'תזונה', 'תזונה נכונה'],
        'a bowl of colorful fresh fruits: red apples, a banana, grapes, oranges and a slice of watermelon.', { h: 0.1 }),
      K('boy-apple', 'ילד אוכל תפוח', ['^בריא', '^בריאים', 'בריאות', 'אורח חיים בריא'],
        'ONE boy taking a big crunchy bite of a red apple and giving a thumbs up with the other hand. Wavy black hair, grass-green T-shirt, jeans.', { v: 2, uniform: 1 }),
      O('water-bottle', 'בקבוק מים', ['^מים', 'שתייה', 'שתיה'],
        'a colorful reusable water bottle in cyan with a lime cap, droplets on its surface.', { h: 0.09 }),
    ] },

  { id: 'playground', domain: 'pedagogy', he: 'חצר, הפסקות ומשחק', topic: 'joy',
    kw: ['חצר משחקים', 'חצר פעילה', 'משחקים בחצר', 'הפסקה', 'הפסקות', 'מתקנים', 'מתקני משחק', 'גן משחקים', 'נדנדה', 'מגלשה', 'משחקי חצר', '^משחק', '^משחקים', 'למידה משחקית', 'משחוק', 'גיימיפיקציה'],
    items: [
      B('slide', 'מגלשה', ['מגלשה', 'מתקנים', 'מתקני משחק', 'גן משחקים'],
        'a colorful cardboard playground slide with a ladder, painted cyan, yellow and orange.', { zone: 'yard', h: 0.22 }),
      B('swing', 'נדנדה', ['נדנדה', 'נדנדות', 'מתקנים'],
        'a cardboard swing set with two swings hanging on ropes, painted lime and purple.', { zone: 'yard', h: 0.22 }),
      K('girls-tag', 'בנות משחקות תופסת', ['הפסקה', 'הפסקות', 'משחקי חצר', 'משחקות בחצר', 'תופסת'],
      'Two girls (only girls) playing tag, running and laughing, one reaching out to touch the other girl on the shoulder: one in a sunflower-yellow top and a straight knee-length denim skirt, one in a pink top and a straight knee-length navy skirt, both with three-quarter sleeves covering the elbows.', { sz: 'sq', v: 2, uniform: 1 }),
      K('boys-tag', 'בנים משחקים בחצר', ['הפסקה', 'הפסקות', 'משחקי חצר', 'משחקים בחצר', 'תופסת'],
      'Two boys (only boys) playing tag in the schoolyard, running and laughing, one reaching out to touch the other boy on the shoulder: one in a purple T-shirt, one in a red T-shirt.', { sz: 'sq', v: 2, uniform: 1 }),
      O('dice', 'קוביות משחק', ['^משחק', '^משחקים', 'למידה משחקית', 'משחוק', 'גיימיפיקציה', 'משחקי קופסה'],
        'two big colorful cardboard dice, one cyan and one orange, tumbling.', { h: 0.08 }),
      O('chess', 'שחמט', ['שחמט', '^שח', 'אסטרטגיה', 'חשיבה לוגית', 'חידות', 'משחקי חשיבה'],
        'a big cardboard chess knight and a pawn standing on a small black-and-white chessboard.', { h: 0.12 }),
      O('lego', 'קוביות בנייה', ['^לגו', 'קוביות', 'בונים', 'הרכבה'],
        'a pile of big colorful interlocking toy building bricks in red, yellow, cyan and green, partly built into a little tower.', { h: 0.1 }),
    ] },

  { id: 'art', domain: 'pedagogy', he: 'אמנות ויצירה', topic: 'art',
    kw: ['אמנות', 'אומנות', 'ציור', 'ציורים', '^יצירה', '^יצירות', 'יצירתי', 'יצירתית', 'יצירתיות', '^צבעים', '^מלאכה', '^פיסול', 'קרמיקה', '^חימר', 'אמנים'],
    items: [
      B('easel', 'כן ציור', ['ציור', 'ציורים', 'אמנות', 'אומנות', 'סדנת אמנות'],
        'a cardboard easel holding a bright joyful abstract painting with big colorful shapes, a paint palette and brushes leaning at its base.', { zone: 'yard', h: 0.22 }),
      O('palette', 'פלטת צבעים', ['^צבעים', 'אמנות', 'אומנות'],
        'an artist\'s paint palette with colorful paint blobs and a paintbrush.', { h: 0.09 }),
      K('girl-painter', 'ילדה מציירת', ['מציירת', 'מציירים', 'ציור', 'אמנית', 'אמניות'],
        'ONE girl holding a paintbrush and a small palette, a smudge of blue paint on her cheek, proudly showing a colorful painting on a small cardboard canvas. Short wavy auburn hair, raspberry top with three-quarter sleeves covering the elbows, a straight knee-length denim skirt.', { v: 2, uniform: 1 }),
      O('crafts', 'ערכת יצירה', ['^יצירה', '^יצירות', '^מלאכה', 'גזירה', 'הדבקה', 'עבודות יד'],
        'a pair of colorful scissors, a glue stick, sheets of colored paper and fluffy pom-poms arranged together.', { h: 0.09 }),
      O('clay', 'פיסול בחימר', ['^פיסול', 'קרמיקה', '^חימר', 'פסלים'],
        'a small handmade clay vase on a pottery wheel with sculpting tools beside it.', { h: 0.1 }),
      S('paint-splash', 'כתמי צבע', ['צבעוני', 'צבעונית', 'צבעוניים', 'צבעוניות', 'מלא צבע'],
        'joyful colorful paint splatters and brush strokes in cyan, yellow, pink and lime.'),
    ] },

  { id: 'music', domain: 'pedagogy', he: 'מוזיקה ושירה', topic: 'art',
    kw: ['מוזיקה', 'מוסיקה', 'מוזיקלי', 'נגינה', 'לנגן', 'כלי נגינה', '^שיר', '^שירים', '^שירה', '^שרים', '^לשיר', 'ניגון', 'ניגונים', 'מקהלה', 'תזמורת', 'להקה', '^קצב'],
    items: [
      O('violin', 'כינור', ['כינור', 'כינורות', 'תזמורת'],
        'a violin with a bow, warm glossy wood tones.', { h: 0.12 }),
      O('drum', 'תוף', ['^תוף', 'תופים', '^קצב', 'מתופפים'],
        'a colorful cardboard drum painted cyan and orange with two drumsticks crossed on top.', { h: 0.1 }),
      O('guitar', 'גיטרה', ['גיטרה', 'גיטרות'],
        'an acoustic guitar with a sunflower-yellow body and a pink strap.', { h: 0.14 }),
      O('keyboard', 'אורגן', ['פסנתר', 'אורגן', 'קלידים'],
        'a small electronic keyboard piano with colorful buttons on a cardboard stand.', { sz: 'wide', h: 0.11 }),
      S('music-notes', 'תווים מעופפים', ['ניגון', 'ניגונים', 'מוזיקה', 'מוסיקה', '^שיר', '^שירים', 'מנגינה'],
        'a flowing stream of colorful music notes (eighth notes, quarter notes, a treble clef) dancing in the air.'),
      K('girls-choir', 'מקהלת בנות', ['מקהלה', 'מקהלות', '^שרות', '^שירה', 'שרות ביחד', 'מקהלת בנות'],
      'Three girls (only girls) singing together joyfully with open mouths, one conducting with a pencil like a baton, another holding a sheet of music; tops with three-quarter sleeves covering the elbows, straight knee-length denim skirts.', { sz: 'wide', v: 2, uniform: 1 }),
      K('boys-choir', 'מקהלת בנים', ['מקהלה', 'מקהלות', '^שרים', '^שירה', 'שרים ביחד', 'ניגון', 'מקהלת ילדים'],
      'Three boys (only boys) singing a joyful niggun together with open mouths, one conducting with a pencil like a baton, another clapping.', { sz: 'wide', v: 2, uniform: 1 }),
      K('boy-violin', 'ילד מנגן בכינור', ['מנגן', 'מנגנים', 'נגינה', 'לנגן', 'כינור'],
        'ONE boy playing the violin with eyes half-closed in delight. Curly brown hair, navy T-shirt, beige trousers.', { v: 2, uniform: 1 }),
      K('girl-flute', 'ילדה מנגנת בחלילית', ['חליל', 'חלילית', 'מנגנת', 'מנגנות'],
        'ONE girl playing a recorder flute, cheeks puffed, eyes smiling. Long straight black hair with a cyan headband, orange top with three-quarter sleeves covering the elbows, a straight knee-length grey skirt.', { v: 2, uniform: 1 }),
    ] },

  { id: 'stage', domain: 'pedagogy', he: 'במה, הצגות ומדיה', topic: 'art',
    kw: ['תיאטרון', 'הצגה', 'הצגות', 'דרמה', '^במה', 'הופעה', 'הופעות', 'טקס', 'טקסים', 'הפקה', 'הפקות', '^כנס', 'צילום', '^סרט', '^סרטים', 'סרטון', 'סרטונים', 'וידאו', 'מדיה', 'קולנוע'],
    items: [
      B('stage', 'במה עם וילונות', ['תיאטרון', 'הצגה', 'הצגות', '^במה', 'הופעה', 'הופעות', 'הפקה'],
        'a small cardboard theater stage with red velvet curtains drawn open, a wooden-look floor and three colorful spotlights on top.', { zone: 'yard', sz: 'wide', h: 0.24 }),
      O('microphone', 'מיקרופון', ['מיקרופון', 'פודקאסט', 'רדיו', 'הסכת', 'תחנת רדיו', 'שידור'],
        'a vintage silver microphone on a stand.', { h: 0.13 }),
      K('boy-actor', 'ילד שחקן קד לקהל', ['שחקן', 'שחקנים', 'דרמה', 'תיאטרון', 'הצגה'],
        'ONE boy wearing a royal-red cardboard cape and a golden cardboard crown over his kippah, bowing theatrically with one arm wide. Brown hair, white T-shirt, jeans.', { v: 2, uniform: 1 }),
      O('video-camera', 'מצלמת וידאו', ['צילום', '^סרט', '^סרטים', 'סרטון', 'סרטונים', 'וידאו', 'קולנוע', 'מדיה', 'תקשורת'],
        'a cardboard video camera on a small tripod, painted purple with a big shiny lens.', { h: 0.12 }),
    ] },

  { id: 'joy', domain: 'climate', he: 'שמחה ואווירה', topic: 'joy',
    kw: ['שמחה', 'שמחים', 'שמחות', '^שמח', '^כיף', 'מהנה', 'נהנים', 'נהנות', 'ליהנות', 'אווירה', 'חוויה', 'חוויתי', 'חוויתית', 'חוויות', 'התלהבות', 'נלהבים', 'אנרגיה', '^חיוך', '^חיוכים', '^מחייכים', '^צחוק', 'מאושרים', '^אושר', 'תוסס', 'תוססת', 'אוהבים לבוא', 'אוהבות לבוא', 'רצים לבית הספר', 'מדהים', 'מדהימה', 'נפלא', 'נפלאה', 'מקסים', 'מקסימה', 'מושלם', 'מושלמת'],
    items: [
      S('balloons', 'בלונים', ['בלונים', 'בלון', 'שמחה', 'שמחים', 'מסיבה'],
        'a bunch of five colorful balloons (cyan, yellow, pink, orange, lime) with curly strings.', { h: 0.16 }),
      S('confetti', 'קונפטי', ['קונפטי', 'חגיגה', 'חגיגי', 'חגיגית', 'מסיבה', 'מסיבות'],
        'a joyful burst of colorful confetti and curly streamers.'),
      K('boys-jumping', 'בנים קופצים משמחה', ['קופצים', 'שמחה', 'שמחים', 'התלהבות', 'אנרגיה', 'תוסס'],
      'Two boys (only boys) jumping high in the air with joy, arms stretched up, huge smiles: one in a cyan T-shirt and jeans, one in a yellow T-shirt and green trousers.', { sz: 'sq', v: 2, uniform: 1 }),
      K('girls-jumping', 'בנות קופצות משמחה', ['קופצות', 'שמחה', 'שמחות', 'התלהבות', 'אנרגיה', 'תוססת'],
      'Two girls (only girls) jumping high in the air with joy, arms stretched up, huge smiles: one in an orange top and a straight knee-length denim skirt, one in a purple top and a straight knee-length denim skirt, both with long sleeves down to the wrists. Both girls wear opaque tights (not socks), and their straight denim skirts stay covering their knees. Only these two girls — nobody else.', { sz: 'sq', v: 4, uniform: 1 }),
      O('party-popper', 'מפוצץ קונפטי', ['הפתעה', 'הפתעות', 'אירוע', 'אירועים', 'מסיבה'],
        'a cardboard party popper cone bursting with colorful confetti and streamers.', { h: 0.1 }),
      O('birthday-cake', 'עוגת יום הולדת', ['יום הולדת', 'ימי הולדת', '^עוגה', 'עוגות'],
        'a two-layer birthday cake with colorful sprinkles and lit candles.', { h: 0.11 }),
      S('rainbow', 'קשת בענן', ['קשת בענן', '^קשת', 'תקווה', 'אופטימיות', 'אופטימי', 'אופטימית'],
        'a bright rainbow arching between two fluffy white clouds.', { h: 0.13 }),
      S('sun', 'שמש', ['^שמש', 'שמשי', 'בוקר טוב', '^חמימות', 'חיובי', 'חיובית', 'חיוביות'],
        'a bright smiling yellow-orange sun with wavy rays.'),
      S('kite', 'עפיפון', ['עפיפון', 'חופש', 'חופשי', 'חופשית', '^רוח'],
        'a colorful diamond-shaped kite with a long ribbon tail of little bows, flying.'),
      S('hot-air-balloon', 'כדור פורח', ['כדור פורח', '^חלום', '^חלומות', 'לחלום', 'שאיפה', 'שאיפות', '^לשאוף', 'לעוף', 'גבהים', 'לגבהים'],
        'a hot-air balloon with colorful vertical stripes (cyan, yellow, pink, lime) and a little wicker basket.', { h: 0.15 }),
      K('girl-waving', 'ילדה מנופפת בשמחה', ['מחייכים', 'מחייכות', '^חיוך', 'אוהבות לבוא'],
        'ONE girl waving with both hands above her head, laughing joyfully. Long curly red hair, lime-green top with long sleeves down to the wrists, a straight knee-length navy skirt. She wears opaque tights (not socks) and her straight denim skirt stays covering her knees. ONE girl only — nobody else in the image, no boys, no other people.', { v: 4, uniform: 1 }),
    ] },

  // ───────────── לב, אנשים וקהילה ─────────────
  { id: 'heart', domain: 'climate', he: 'רגשי־חברתי', topic: 'heart',
    kw: ['רגשי', 'רגשית', 'רגשות', 'חברתי', 'חברתית', '^חברות', '^חברים', '^חברה', 'אהבת ישראל', 'אהבה', '^לב', 'מהלב', '^אכפת', 'אכפתיות', 'יחסים', 'אקלים', '^שייכות', 'רווחה', '^חום', '^חם', '^חמה', '^חמים', 'חיבוק', 'עוטף', 'עוטפת', 'הקשבה', 'מקשיבים', 'אהוב', 'אהובים', 'רגישות', 'שייך', 'שייכת', 'שייכים', 'מרגיש', 'מרגישה', 'מרגישים', '^חיבור', '^מחובר', '^מחוברים', '^מחוברת'],
    items: [
      O('big-heart', 'לב גדול', ['אהבה', '^לב', 'מהלב', 'אהבת ישראל', 'אהוב', 'אהובים'],
        'a big puffy raspberry-pink heart made of layered cardboard.', { h: 0.12 }),
      K('girls-hug', 'חברות מתחבקות', ['חיבוק', 'חברות', 'חברה', 'חברות טובות'],
        'Two girls hugging each other warmly and laughing: one with a long dark braid in a cyan top and a straight knee-length denim skirt, one with blond curls in a raspberry top and a straight knee-length denim skirt.', { sz: 'sq', v: 2, uniform: 1 }),
      K('boys-friends', 'חברים צוחקים', ['^חברים', 'חברות', 'חבר', 'חברתי'],
        'Two boys standing arm in arm, one whispering a joke and both laughing. One with spiky black hair in an orange T-shirt, one with sandy hair and glasses in a green T-shirt.', { sz: 'sq', v: 2, uniform: 1 }),
      O('friendship-bench', 'ספסל חברות', ['ספסל', 'ספסל חברות', 'שיחות אישיות', 'הקשבה', 'מקשיבים'],
        'a colorful cardboard park bench painted cyan and yellow with two small hearts painted on its backrest.', { zone: 'side', sz: 'wide', h: 0.12 }),
      O('teddy', 'דובי מחבק', ['^חום', '^חם', '^חמים', 'עוטף', 'עוטפת', 'חיבוק', 'רווחה'],
        'a soft cuddly teddy bear made of cardboard and felt, hugging a small pink heart.', { h: 0.11 }),
      K('girls-circle', 'בנות מחזיקות ידיים', ['אחדות', 'ביחד', '^יחד', 'מגובש', 'מגובשות', 'גיבוש', '^כולנו', 'משפחה אחת', 'אחדות ישראל', 'עם אחד', 'שייכות', 'שייך'],
      'Four girls (only girls) of different heights standing in a row holding hands, all laughing and looking at each other, each in a different bright top with three-quarter sleeves covering the elbows and a straight knee-length denim skirt or dress below the knee.', { sz: 'wide', v: 3, logo: 1, uniform: 1 }),
      K('boys-circle', 'בנים ידיים על הכתפיים', ['אחדות', 'ביחד', '^יחד', 'מגובש', 'מגובשים', 'גיבוש', '^כולנו', 'משפחה אחת', 'אחדות ישראל', 'עם אחד', 'שייכות', 'שייך', 'שייכים'],
      'Four boys (only boys) of different heights standing in a row with their arms around each other on the shoulders, all laughing, each in a different bright T-shirt.', { sz: 'wide', v: 2, uniform: 1 }),
      S('heart-balloons', 'בלוני לבבות', ['אהבה', 'אוהבים', 'אוהבות', 'מאוהבים'],
        'three heart-shaped balloons in pink, red and purple with curly strings.'),
    ] },

  { id: 'calm', domain: 'climate', he: 'רוגע, חוסן ומוגנות', topic: 'heart',
    kw: ['רוגע', '^רגוע', '^רגועה', '^שקט', 'שלווה', '^חוסן', '^ויסות', 'רגיעה', 'ביטחון', 'בטחון', 'מוגנות', '^מוגן', '^מוגנים', '^בטוח', '^בטוחה', 'בטיחות', '^שמירה', 'אלימות', '^חרם', 'בריונות', 'נפשי', 'חוסן נפשי'],
    items: [
      O('calm-corner', 'פינה רגועה', ['פינה רגועה', 'פינת רגיעה', 'ויסות', 'רגיעה', 'מרחב רגשי', 'מרחב מוגן'],
        'a cozy calm corner: a soft lavender beanbag with a cushion, a small potted plant and a warm glowing lamp, all made of cardboard and felt.', { zone: 'side', h: 0.13 }),
      O('shield', 'מגן', ['מוגנות', 'ביטחון', 'בטחון', 'הגנה', '^מוגן', 'שמירה', 'בטיחות', 'אלימות', '^חרם', 'בריונות'],
        'a sturdy cardboard shield painted cyan with a golden star in the center and orange trim.', { h: 0.12 }),
      S('dove', 'יונת שלום', ['^שלום', 'שלווה', 'רוגע', '^שקט', 'שלום בין חברים', 'שלום בית'],
        'a white dove with spread wings carrying a small green olive branch.'),
      O('umbrella', 'מטרייה עוטפת', ['עוטף', 'עוטפת', 'מגן', 'מחבק', 'מחבקת', '^מטריה', 'מטרייה'],
        'a big open umbrella with colorful panels (cyan, yellow, pink, lime) standing upright.', { h: 0.14 }),
      K('girl-calm', 'ילדה רגועה עם אוזניות', ['^רגוע', '^רגועה', 'רוגע', 'שלווה', '^שקט'],
        'ONE girl sitting cross-legged with her eyes closed and a peaceful smile, hands resting on her knees, soft headphones around her neck. Dark brown hair in a low bun, lavender top with three-quarter sleeves covering the elbows, a straight knee-length grey skirt. ONE girl only — nobody else in the image, no boys, no other people.', { sz: 'sq', h: 0.2, v: 3, uniform: 1 }),
    ] },

  { id: 'everychild', domain: 'climate', he: 'כל ילד ויחידתו', topic: 'everychild',
    kw: ['כל תלמיד', 'כל ילד', 'כל תלמידה', 'כל ילדה', 'כל אחד', 'כל אחת', 'שילוב', 'הכלה', '^מכיל', '^מכילה', 'חינוך מיוחד', 'פרטני', 'פרטנית', '^אישי', '^אישית', 'מותאם', 'מותאמת', 'התאמה', 'התאמות', 'לקויות', 'מתקשים', 'מתקשות', '^קשב', 'פוטנציאל', 'ייחודי', 'ייחודית', 'ייחודיות', 'מחוננים', 'מחוננות', 'מענה', 'שונות', 'מגוון'],
    items: [
      O('puzzle', 'חלקי פאזל', ['שילוב', 'הכלה', 'כל אחד', 'כל אחת', 'משתלב', 'משתלבים', 'מקום לכל'],
        'four interlocking jigsaw puzzle pieces in cyan, yellow, pink and lime, fitting together.', { h: 0.1 }),
      K('wheelchair-kids', 'ילד בכיסא גלגלים וחבר', ['נגישות', 'שילוב', 'חינוך מיוחד', 'צרכים מיוחדים', 'מוגבלות', 'הכלה'],
      'A laughing boy in a colorful wheelchair giving a high five to his friend, another boy walking beside him (only boys). One in a cyan T-shirt, one in a yellow T-shirt.', { sz: 'sq', v: 2, uniform: 1 }),
      O('magnifier', 'זכוכית מגדלת', ['לראות כל ילד', 'לראות כל תלמיד', 'רואים אותו', 'רואים אותה', 'רואים את כל', 'רואה כל', 'לזהות', 'תשומת לב', 'אבחון', 'לגלות'],
        'a big magnifying glass with a cardboard handle, a tiny glowing golden star visible through the lens.', { h: 0.11 }),
      K('mentor-kids', 'גדול עוזר לקטן', ['חונכות', 'חונכים', 'חונך', 'חונכת', 'בוגרים', 'צעירים', 'אח גדול', 'אחות גדולה', '^ליווי', 'מלווה', 'מלווים'],
        'An older boy (about 11, purple T-shirt) kneeling to help a younger boy (about 6, orange T-shirt, big backpack) tie his sneaker, both smiling.', { sz: 'sq', v: 2, uniform: 1 }),
      O('diverse-flowers', 'עציץ פרחים שונים', ['שונות', 'שונים', 'מגוון', 'גיוון', 'ייחודיות', 'כל פרח', 'כל אחד אחר'],
        'a pot with many different flowers, each a different color and shape: a sunflower, a tulip, a daisy, a rose and a bluebell.', { h: 0.13 }),
      K('girl-hand-up', 'ילדה מצביעה', ['שואלים', 'שואלות', 'שאלות', 'השתתפות', 'משתתפים', 'פעיל', 'פעילים', 'פעילה', 'מעורבות תלמידים', 'סקרנות', 'סקרנים', 'סקרניות'],
        'ONE girl eagerly raising her hand high, ready to answer, a big bright smile. Short dark curly hair with a yellow clip, cyan top with long sleeves down to the wrists, a straight knee-length denim skirt.', { v: 3, uniform: 1 }),
      S('star-shine', 'כוכב מנצנץ', ['^לזרוח', 'לנצוץ', 'כל ילד כוכב', 'מיוחד', 'מיוחדת'],
        'one big sparkling golden star with little twinkles around it.'),
    ] },

  { id: 'parents', domain: 'management', he: 'הורים וקהילה', topic: 'parents',
    kw: ['הורים', '^הורה', 'משפחה', 'משפחות', 'משפחתי', 'משפחתית', 'קשר עם הבית', 'שותפות', 'שותפים', 'מעורבות הורים', '^אבות', '^אמהות', '^אמא', '^אבא', 'קהילה', 'קהילתי', 'קהילתית', 'קהילות'],
    items: [
      K('family-mom', 'אמא ובנותיה', ['הורים', 'משפחה', 'משפחות', 'מעורבות הורים', 'שותפות', '^אמא', '^אמהות'],
      'A modern Israeli mother in a modest trendy style — a long denim skirt, a top with long sleeves down to the wrists, a fashionable head scarf — walking with her TWO DAUGHTERS — both are girls in straight knee-length denim skirts, opaque tights and long-sleeved tops (only girls, no boys at all) — who carry school backpacks, all waving and smiling.', { sz: 'sq', h: 0.29, v: 3, uniform: 1 }),
      K('family-dad', 'אבא ובניו', ['הורים', 'משפחה', 'משפחות', 'מעורבות הורים', 'שותפות', '^אבא', '^אבות'],
      'A modern Israeli father with a short trimmed beard, a black kippah, a casual button shirt and jeans, walking with his two sons who carry school backpacks, all waving and smiling.', { sz: 'sq', h: 0.29, v: 2, uniform: 1 }),
      O('house-heart', 'בית עם לב', ['קשר עם הבית', 'בית חם', 'משפחתיות', 'הבית', 'כמו בית'],
        'a small cardboard house painted yellow with an orange roof and a pink heart on the door.', { h: 0.12 }),
      K('grandpa', 'סבא ונכד', ['^סבא', '^סבים', 'דורות', '^דור', 'יום המשפחה'],
      'A smiling grandfather with a white beard, a black kippah and a cardigan, holding hands with his young grandson who wears a backpack.', { sz: 'sq', h: 0.29, v: 2, uniform: 1 }),
      K('grandma', 'סבתא ונכדה', ['^סבתא', 'סבתות', 'דורות', '^דור', 'יום המשפחה'],
      'A smiling grandmother with a modest hat, a long skirt and a warm cardigan, holding hands with her young granddaughter who wears a backpack.', { sz: 'sq', h: 0.29, v: 2, uniform: 1 }),
      O('phone', 'טלפון עם עדכונים', ['עדכונים', 'קבוצת הורים', 'וואטסאפ', 'ווטסאפ', 'אפליקציה', 'תקשורת עם ההורים', 'קשר רציף', 'שקיפות'],
        'a cardboard smartphone with colorful app tiles on its screen and a glowing pink heart notification bubble popping out.', { h: 0.11 }),
      O('open-door', 'דלת פתוחה', ['בית פתוח', 'דלת פתוחה', 'דלתות פתוחות', 'ברוכים הבאים', 'מזמין', 'מזמינה', 'פתוח לקהילה', 'קהילה'],
        'a freestanding cardboard front door painted cyan, opened wide with warm golden light pouring out and a little welcome doormat in front (no text).', { zone: 'side', h: 0.15 }),
      K('mom-hug', 'אמא מחבקת בשער', ['^אמא', '^אמהות', 'פרידה'],
        'A mother in a modern modest style (long skirt, blouse with three-quarter sleeves covering the elbows, stylish head scarf) kneeling to hug her young daughter who wears a backpack, both smiling.', { sz: 'sq', h: 0.27, v: 2, uniform: 1 }),
    ] },

  { id: 'chesed', domain: 'heritage', he: 'חסד ונתינה', topic: 'mivtzaim',
    kw: ['חסד', 'גמילות חסד', 'גמילות חסדים', 'התנדבות', 'מתנדבים', 'מתנדבות', 'נתינה', '^לתת', 'נותנים', 'עזרה לזולת', '^זולת', 'קשישים', 'בית אבות', 'מעשים טובים'],
    items: [
      K('kids-volunteer', 'בנות מחלקות חבילות', ['חלוקת מזון', 'סלי מזון', 'חבילות', 'התנדבות', 'מתנדבות'],
      'Two girls (only girls) carrying together a cardboard box full of food packages and smiling: one in a sunflower-yellow top, one in a cyan top, both with three-quarter sleeves covering the elbows and straight knee-length denim skirts.', { sz: 'sq', v: 2, uniform: 1 }),
      K('boys-volunteer', 'בנים סוחבים ארגז חסד', ['חלוקת מזון', 'סלי מזון', 'חבילות', 'התנדבות', 'מתנדבים'],
      'Two boys (only boys) carrying together a cardboard box full of food packages and smiling: one in an orange T-shirt, one in a purple T-shirt.', { sz: 'sq', v: 2, uniform: 1 }),
      O('gift', 'מתנה', ['מתנה', 'מתנות', 'הפתעה', 'פרס', 'פרסים'],
        'a wrapped gift box in raspberry pink with a big lime-green ribbon bow.', { h: 0.1 }),
      O('heart-hands', 'ידיים מחזיקות לב', ['נתינה', '^לתת', 'נותנים', 'חסד', 'מעשים טובים', 'מעשה טוב'],
        'two cupped cardboard hands holding a glowing red heart.', { h: 0.11 }),
      K('girl-elderly', 'ילדה מבקרת סבתא', ['קשישים', 'בית אבות', 'ביקור חולים', 'כיבוד הורים'],
        'ONE girl holding a bouquet of flowers and a handmade card, walking beside a smiling elderly woman with a cane (modest dress, head covering).', { sz: 'sq', h: 0.27, v: 2, uniform: 1 }),
    ] },

  { id: 'staff', domain: 'management', he: 'צוות מוביל', topic: 'staff',
    kw: ['מורה', 'מורות', 'מורים', 'צוות', 'צוות חינוכי', 'מחנכת', 'מחנכות', '^מחנך', 'השתלמות', 'השתלמויות', 'פיתוח מקצועי', 'הכשרה', 'מקצועיות', 'מקצועי', 'הוראה', 'פדגוגיה', 'פדגוגי', 'למידת עמיתים', 'חדר מורות', 'אנשי חינוך', 'גננות'],
    items: [
      K('teacher', 'מורה מסבירה', ['מורה', 'מורות', 'מחנכת', 'מחנכות', 'הוראה', 'מלמדת'],
        'A warm young teacher — a modern Israeli woman in a modest trendy style: a long straight skirt, a blouse with three-quarter sleeves covering the elbows, a stylish head scarf — pointing at a small cardboard whiteboard on an easel with colorful shapes, smiling. She is the only person in the image — nobody else at all.', { h: 0.3, v: 4, uniform: 1 }),
      O('apple-books', 'תפוח על ספרים', ['מורה', 'מורות', 'צוות', 'הוראה'],
        'a shiny red apple on top of two stacked books.', { h: 0.1 }),
      O('coffee-mug', 'ספל קפה של חדר המורות', ['חדר מורות', 'צוות מגובש', 'ישיבת צוות', 'ישיבות צוות', 'אווירה בצוות', 'גיבוש צוות'],
        'a big cheerful coffee mug painted yellow with a pink heart, steam rising, beside a small potted plant.', { h: 0.09 }),
      O('grad-cap', 'כובע סיום', ['השתלמות', 'השתלמויות', 'הכשרה', 'תואר', 'פיתוח מקצועי', 'צמיחה מקצועית', 'למידה מתמדת', 'מצוינות בהוראה'],
        'a black graduation cap with a golden tassel resting on a rolled diploma tied with a red ribbon.', { h: 0.09 }),
      O('school-bell', 'פעמון בית הספר', ['צלצול', 'פעמון', 'סדר יום', 'לוח זמנים'],
        'a shiny brass school hand bell with a wooden handle.', { h: 0.09 }),
      O('clock', 'שעון', ['^זמן', '^זמנים', 'דייקנות', 'דייקן', 'בזמן', 'שעון', 'ניהול זמן'],
        'a big round cardboard wall clock with a cyan frame, colorful dots instead of numbers and orange hands.', { h: 0.11 }),
      K('teacher-kids', 'מורה קוראת עם תלמידות', ['מחנכת', 'קשר אישי', 'קשר עם המורה', 'מורה אוהבת'],
      'A kind teacher in a modest style (long skirt, blouse with three-quarter sleeves covering the elbows, head scarf) sitting on a low cardboard bench with two girls on either side, reading a picture book to them, all smiling.', { sz: 'wide', h: 0.25, v: 2, uniform: 1 }),
    ] },

  // ───────────── הישגים וצמיחה ─────────────
  { id: 'excellence', domain: 'early', he: 'מצוינות', topic: 'excellence',
    kw: ['מצוינות', 'מצויינות', 'מצוין', 'מצוינים', 'הישגים', '^הישג', 'הצטיינות', 'מצטיינים', 'מצטיינות', 'ציונים', '^ציון', 'מבחנים', '^מבחן', 'מיצב', 'הצלחה', 'הצלחות', 'להצליח', 'מצליחים', 'מצליחות', '^איכות', 'רמה גבוהה', 'אלופים', 'אלופות', 'מקום ראשון'],
    items: [
      O('trophy', 'גביע', ['גביע', 'אליפות', 'אלופים', 'אלופות', 'ניצחון', 'מנצחים'],
        'a golden trophy cup covered in shiny gold foil on a purple base.', { h: 0.13 }),
      O('medal', 'מדליית זהב', ['מדליה', 'מדליות', 'הצטיינות', 'מצטיינים', 'מצטיינות'],
        'a shiny gold medal on a cyan and orange ribbon.', { h: 0.1 }),
      B('podium', 'פודיום מנצחים', ['פודיום', 'מקום ראשון', 'תחרות', 'תחרויות', 'זכייה'],
        'a three-step cardboard winners\' podium painted gold, silver and bronze with big numbers 1, 2, 3.', { zone: 'yard', sz: 'wide', h: 0.14 }),
      O('certificate', 'תעודת הצטיינות', ['תעודה', 'תעודות', 'תעודת הצטיינות', 'הוקרה'],
        'a rolled certificate scroll tied with a red ribbon and a golden seal.', { h: 0.08 }),
      O('check-star', 'וי ומדבקת כוכב', ['^מבחן', 'מבחנים', 'בחינות', '^ציון', 'ציונים', 'מיצב', '100'],
        'a big glossy green check mark next to a shiny gold star sticker.', { h: 0.1 }),
      S('stars', 'כוכבים נוצצים', ['^כוכב', '^כוכבים', 'מבריקים', 'מבריקות', 'לזרוח', 'זוהרים'],
        'a cluster of three yellow stars of different sizes with sparkle lines.'),
      K('kid-trophy', 'ילדה מניפה גביע', ['הצלחה', 'הצלחות', 'להצליח', 'מצליחים', 'מצליחות', 'הישגים'],
        'ONE girl lifting a golden trophy above her head with both hands, cheering. Long wavy brown hair, raspberry top with long sleeves down to the wrists, a straight knee-length denim skirt.', { v: 3, uniform: 1 }),
    ] },

  { id: 'growth', domain: 'management', he: 'צמיחה ושיפור', topic: 'excellence',
    kw: ['צמיחה', 'לצמוח', 'צומח', 'צומחת', 'צומחים', 'שיפור', 'לשפר', 'משתפר', 'משתפרת', 'משתפרים', 'התקדמות', 'להתקדם', 'מתקדמים', '^עלייה', '^מגמה', 'התפתחות', 'להתפתח', 'מתפתח', '^גדילה', '^לגדול', 'קפיצת דרך', '^זינוק', '^מטרה', 'מטרות', '^יעד', 'יעדים'],
    items: [
      O('growth-chart', 'גרף עולה', ['גרף', 'נתונים', 'תוצאות', 'מדדים', '^עלייה', '^מגמה', 'שיפור'],
        'a cardboard bar chart with rising colorful bars (cyan, yellow, orange, pink) and a lime-green arrow shooting upward.', { h: 0.12 }),
      O('sprout', 'נבט צומח', ['^זרע', '^זרעים', '^נבט', 'לשתול', 'שתילה', 'להצמיח', 'צמיחה', 'לצמוח'],
        'a small green sprout with two fresh leaves growing out of a cardboard pot of soil.', { h: 0.09 }),
      O('ladder', 'סולם עם כוכב', ['^סולם', 'לטפס', 'לעלות', 'להעפיל', '^מדרגה', '^מדרגות', '^שלב', '^שלבים'],
        'a colorful cardboard ladder with rungs painted in rainbow colors and a shiny gold star at the top.', { h: 0.16, sz: 'tall' }),
      B('mountain-flag', 'הר עם דגל בפסגה', ['פסגה', '^הר', '^הרים', 'אתגר', 'אתגרים', 'להתמודד', 'התמודדות', '^שיא', '^שיאים'],
        'a cardboard mountain with layered green and purple slopes and a little orange flag planted on its snowy peak.'),
      O('target', 'מטרה וחץ', ['^מטרה', 'מטרות', '^יעד', 'יעדים', 'ממוקד', 'ממוקדת', 'מיקוד', 'פוקוס'],
        'a round cardboard target with colorful rings and a dart right in the bullseye.', { h: 0.11 }),
    ] },

  // ───────────── מרחבים וסביבה ─────────────
  { id: 'nature', domain: 'pedagogy', he: 'טבע וגינה', topic: 'nature',
    kw: ['^טבע', '^סביבה', 'איכות הסביבה', '^ירוק', '^ירוקה', '^ירוקים', 'אקולוגיה', 'אקולוגי', 'קיימות', '^צמחים', 'צמחייה', '^עצים', '^עץ', '^פרחים', '^פרח', '^פורח', '^פורחת', '^לפרוח', 'גינה', 'גינות', 'גינון', 'חקלאות', '^ירקות'],
    items: [
      B('tree', 'עץ', ['^עץ', '^עצים', 'נטיעה', 'נטיעות', 'צל', 'טו בשבט'],
        'a lush cardboard tree with layered green leaf clusters, a kraft-brown trunk and a few red apples.', { sz: 'tall', h: 0.34 }),
      B('garden-bed', 'ערוגת ירקות', ['גינה', 'גינת ירק', 'גינה לימודית', 'ערוגה', 'ערוגות', '^ירקות', 'חקלאות', 'גידול'],
        'a raised cardboard vegetable garden bed with lettuce, carrots, red tomatoes on stakes and a little blank wooden sign.', { zone: 'yard', sz: 'wide', h: 0.14 }),
      O('flower-pot', 'עציץ פרחים', ['^פרחים', '^פרח', '^פורח', '^פורחת', '^לפרוח', 'פריחה'],
        'a cardboard flower pot painted orange with bright pink, yellow and purple flowers.', { h: 0.11 }),
      K('girl-watering', 'ילדה משקה צמחים', ['השקיה', 'להשקות', 'מטפחים', 'טיפוח', 'לטפח', 'גינון'],
        'ONE girl watering a small potted plant with a cyan watering can, smiling gently. Light-brown hair in two buns, lime-green top with three-quarter sleeves covering the elbows, a straight knee-length denim skirt.', { v: 2, uniform: 1 }),
      K('boy-planting', 'ילד שותל', ['שתילה', 'לשתול', 'נטיעה', 'נוטעים', 'גינה'],
        'ONE boy kneeling and planting a small seedling with his hands in a cardboard planter box, a little trowel beside him, proud smile. Black hair, orange T-shirt, jeans.', { sz: 'sq', h: 0.2, v: 2, uniform: 1 }),
      S('butterflies', 'פרפרים', ['פרפר', 'פרפרים', 'שינוי', 'התחדשות'],
        'three colorful butterflies in cyan, pink and yellow fluttering.'),
      S('birds', 'ציפורים', ['ציפור', 'ציפורים', 'שירת ציפורים'],
        'two small colorful birds (one cyan, one yellow) flying together.', { h: 0.09 }),
      O('bunny', 'פינת חי', ['פינת חי', '^ארנב', '^ארנבון', 'בעלי חיים', '^חיות', '^אוגר'],
        'a cute white bunny sitting next to a bright orange carrot on a small patch of cardboard grass.', { h: 0.09 }),
      B('recycling', 'פחי מיחזור', ['מיחזור', 'מחזור', '^פחים', '^ניקיון', '^נקי', '^נקייה', '^נקיה', '^לכלוך', 'שומרים על הסביבה'],
        'three colorful cardboard recycling bins (blue, yellow, green) with recycling arrow symbols on them.', { zone: 'yard', sz: 'wide', h: 0.13 }),
      R('wind-turbine', 'טורבינת רוח', ['אנרגיה ירוקה', 'אנרגיה סולארית', '^סולארי', '^חשמל', 'קיימות', 'חיסכון באנרגיה'],
        'a cardboard wind turbine with three white blades on a tall white tower.', { sz: 'tall', h: 0.16 }),
    ] },

  { id: 'campus', domain: 'pedagogy', he: 'מבנה ומרחבי למידה', topic: 'nature',
    kw: ['מבנה', 'מבני', '^בניין', 'בניין חדש', '^אגף', 'כיתות חדשות', 'שיפוץ', 'שיפוצים', '^בנייה', 'הרחבה', 'תשתיות', '^מרחב', '^מרחבים', 'מרחבי למידה', 'מעוצב', 'מעוצבת', 'אסתטי', 'אסתטית', 'מטופח', 'מטופחת', 'מקושט', 'מקושטת', 'קישוטים', 'הסעה', 'הסעות', '^טיול', '^טיולים'],
    items: [
      B('crane', 'מנוף בנייה', ['^בנייה', 'שיפוץ', 'שיפוצים', '^אגף', 'בניין חדש', 'כיתות חדשות', 'הרחבה', '^בונים', 'מבנה חדש'],
        'a tall yellow cardboard construction crane lifting a colorful cardboard building block on a hook.', { sz: 'tall', h: 0.38 }),
      B('pergola', 'כיתת חוץ', ['כיתת חוץ', 'למידה בחוץ', 'למידה בטבע', 'למידה מחוץ לכיתה', 'פרגולה', 'הצללה', 'מרחבי למידה'],
        'an outdoor classroom: a cardboard pergola covered with green vines shading three small colorful benches.', { zone: 'yard', sz: 'wide', h: 0.2 }),
      B('school-bus', 'אוטובוס טיולים', ['הסעה', 'הסעות', '^אוטובוס', '^טיול', '^טיולים', 'יציאה לטיול', 'סיורים'],
        'a cheerful yellow cardboard school bus with round black wheels and big windows (no text).', { zone: 'yard', sz: 'wide', h: 0.15 }),
      S('bunting', 'שרשרת דגלונים', ['קישוטים', 'מקושט', 'מקושטת', 'חגיגי', 'חגיגית', 'ססגוני'],
        'a curving string of colorful triangle bunting flags (cyan, yellow, orange, pink, lime, purple).', { sz: 'wide', h: 0.08 }),
      O('modern-chairs', 'ריהוט מעוצב', ['ריהוט', 'כיסאות', 'כיתה מעוצבת', 'מעוצב', 'מעוצבת', 'אסתטי', 'נוח'],
        'two modern colorful school chairs (cyan and orange) and a small round table, designer style.', { zone: 'side', h: 0.11 }),
    ] },

  { id: 'israel', domain: 'heritage', he: 'ארץ ישראל ושורשים', topic: 'torah',
    kw: ['ארץ ישראל', '^ירושלים', '^כותל', '^מולדת', 'הכרת הארץ', '^שורשים', '^מורשת', '^מסורת', 'דורות', '^מסע', '^מסעות'],
    items: [
      B('kotel', 'הכותל המערבי', ['^כותל', '^ירושלים', 'עיר הקודש', 'הכותל המערבי'],
        'a cardboard model of ONLY the Western Wall (the Kotel) in Jerusalem: a long, tall wall of large golden-beige stone blocks with small green plants growing between the stones and a small stone plaza in front. NO domes, NO golden dome, NO mosques, NO towers, NO minarets, no other buildings at all.', { zone: 'yard', sz: 'wide', h: 0.2, v: 2 }),
      K('kids-hike', 'בנים בטיול', ['^טיול', '^טיולים', '^מסע', 'סיור', 'הכרת הארץ', 'מסלול'],
      'Two boys (only boys) hiking with small backpacks and water bottles, one pointing ahead excitedly, the other holding a folded map; green and orange T-shirts, cargo trousers, hiking sneakers.', { sz: 'sq', v: 2, uniform: 1 }),
      O('map', 'מפת אוצר', ['^מפה', '^הרפתקה', '^גילוי', '^לגלות', 'גילויים', '^אוצר', '^אוצרות'],
        'a rolled-out old treasure map with a dotted path, little hills and a red X mark.', { sz: 'wide', h: 0.1 }),
      O('roots-tree', 'עץ עם שורשים', ['^שורשים', '^מורשת', '^מסורת', 'דורות', 'מסורת אבות', 'יציבות'],
        'a small sturdy tree with green leaves, its deep golden roots visible spreading below it.', { h: 0.15 }),
    ] },

  { id: 'vision', domain: 'management', he: 'חזון וכיוון', topic: 'vision', weight: 0.5,
    kw: ['^חזון', '^עתיד', '^העתיד', '^קדימה', '^כיוון', '^דרך', 'ייעוד', 'השראה', 'מעורר השראה', 'רעיון', 'רעיונות', 'חשיבה', 'מחשבה', '^הבנה', 'העמקה', '^עומק', 'יוזמה', 'יוזמות', 'הזדמנויות', 'הזדמנות', '^אפשרויות'],
    items: [
      O('compass', 'מצפן', ['^כיוון', '^דרך', 'ייעוד', '^מצפן', 'ניווט', 'ערכים', 'ערכי'],
        'a cardboard compass with a cyan rim and a golden needle pointing north.', { h: 0.1 }),
      O('lightbulb', 'נורת רעיון', ['רעיון', 'רעיונות', 'השראה', 'המצאה', 'יצירתיות', 'הברקה'],
        'a glowing lightbulb with a bright yellow paper glow around it.', { h: 0.11 }),
      O('brain', 'מוח חושב', ['חשיבה', 'חשיבה מסדר גבוה', '^מוח', '^הבנה', 'העמקה', '^עומק', '^לחשוב', 'חושבים', 'מחשבה'],
        'a pink cardboard brain with small colorful gears turning on top of it.', { h: 0.1 }),
      S('paper-plane', 'מטוס נייר', ['יוזמה', 'יוזמות', 'להעז', 'אומץ', 'מעוף'],
        'a white paper airplane with a dashed flight trail looping behind it.'),
      O('future-door', 'דלת לעתיד', ['הזדמנויות', 'הזדמנות', '^אפשרויות', '^עתיד', '^העתיד', 'פתח'],
        'an open cardboard door standing on its own with bright light and little stars pouring out of it.', { h: 0.15 }),
      S('plane', 'מטוס', ['טיסה', 'לטוס', 'טסים', 'למרחקים'],
        'a cheerful blue and cyan airplane flying, with a white propeller.'),
    ] },

  { id: 'middot', domain: 'climate', he: 'מידות ודרך ארץ', topic: 'middot',
    kw: ['מידות', 'מידות טובות', 'דרך ארץ', '^נימוס', '^נימוסים', 'מנומס', 'מנומסים', '^כבוד', '^מכבד', '^מכבדים', '^ערכים', 'התנהגות', '^משמעת', '^סדר', '^ענווה', '^סבלנות', '^אדיבות', '^תודה', 'הכרת הטוב', '^אחריות', '^יושר', '^אמת', '^צדק', '^עזרה', '^לעזור', 'עוזרים', 'עוזרות', 'עוזר', 'עוזרת'],
    items: [
      K('door-holding', 'ילד מחזיק דלת', ['דרך ארץ', '^נימוס', 'מנומס', 'מנומסים', '^כבוד', '^מכבד', '^מכבדים', '^אדיבות'],
        'ONE boy politely holding open a freestanding cardboard door with a welcoming gesture and a kind smile. Neat dark hair, white polo shirt, navy trousers.', { v: 2, uniform: 1 }),
      K('help-pencils', 'ילדה עוזרת לקטנה', ['^עזרה', '^לעזור', 'עוזרים', 'עוזרות', 'עוזר', 'עוזרת', 'רגישות', 'אכפתיות'],
      'An older girl kneeling to help a younger girl pick up colorful pencils she dropped, both smiling (only girls). The older girl in a purple top with three-quarter sleeves covering the elbows and a straight knee-length denim skirt; the younger in a cyan top with three-quarter sleeves covering the elbows, a straight knee-length denim skirt and a small backpack.', { sz: 'sq', h: 0.22, v: 2, uniform: 1 }),
      K('boy-flower', 'ילד מגיש פרח תודה', ['^תודה', 'הכרת הטוב', 'הוקרה', 'הערכה', 'להעריך'],
        'ONE boy holding out a single flower with both hands, a shy happy smile, as a thank-you gift. Curly light-brown hair, sunflower-yellow T-shirt, beige trousers.', { v: 2, uniform: 1 }),
      O('broom', 'מטאטא ויעה', ['^סדר', 'ניקיון', 'תורנות', 'תורנויות', 'שומרים על הכיתה'],
        'a small colorful broom and dustpan, painted lime and orange.', { h: 0.12 }),
      O('golden-key', 'מפתח זהב', ['^מפתח', '^אחריות', '^אמון', 'עצמאות', '^עצמאי', '^עצמאית', '^עצמאיים'],
        'a big shiny golden key with an ornate heart-shaped handle.', { h: 0.08 }),
      O('scales', 'מאזניים', ['^יושר', '^אמת', '^צדק', 'הגינות', '^הוגן', '^הוגנת'],
        'a balanced pair of golden scales with two round pans.', { h: 0.11 }),
      O('handshake', 'לחיצת יד', ['^סליחה', '^פיוס', 'גישור', 'לגשר', '^מחלוקת', 'כבוד הדדי', '^שלום'],
        'two cardboard hands in a friendly handshake, one cyan and one orange.', { h: 0.09 }),
    ] },

  // ───────────── נושאים שנוספו לפי 6 תחומי האחריות ─────────────
  { id: 'diverse', domain: 'pedagogy', he: 'למידה מגוונת', topic: 'science',
    kw: ['למידה מגוונת', 'פדגוגיה', 'פדגוגית', 'פדגוגי', 'דרכי למידה', 'דרכי הוראה', 'הוראה מגוונת', 'למידה חווייתית', 'למידה חוויתית', 'למידה פעילה', 'למידה שיתופית', 'למידה בקבוצות', 'עבודה בקבוצות', 'תחנות', 'אינטליגנציות', 'למידה מבוססת', 'פרויקט', 'פרויקטים', 'למידה משמעותית', 'למידה בתנועה', 'למידה עצמאית', 'כיתה הפוכה', 'מגוונת', 'מגוונים'],
    items: [
      O('flower-3d', 'פרח האינטליגנציות', ['פרח האינטליגנציות', 'אינטליגנציות', 'אינטליגנציות מרובות', 'כל תלמיד וצבע', 'צבע השלהבת', 'כל תלמיד'],
        'a 3D sculpture made of corrugated cardboard of the flower emblem in the reference image: a flower with 8 rounded petals around a center, each petal painted a different bright color (cyan, sunflower yellow, orange, raspberry pink, lime green, purple, navy, teal) and carrying the same small white line icon as in the reference (music notes with hearts, a running figure, chess pieces, a handshake, a heart with a key, an open book with a speech bubble, a butterfly, a paint palette). No text, no letters.', { h: 0.16, ref: 'flower', v: 2 }),
      B('learning-stations', 'תחנות למידה', ['תחנות', 'תחנות למידה', 'למידה בתחנות', 'למידה בקבוצות'],
        'three small colorful cardboard learning-station tables side by side, each with different hands-on materials: building blocks, a stack of picture books, a small cardboard tablet; a little pennant flag on each table.', { zone: 'yard', sz: 'wide', h: 0.15 }),
      K('boys-group-learning', 'בנים לומדים בקבוצה', ['למידה בקבוצות', 'למידה שיתופית', 'עבודה בקבוצות', 'לומדים יחד', 'שיתוף פעולה'],
        'Three boys (only boys) standing around a small cardboard table, building a colorful cardboard bridge model together, one pointing, all excited and discussing.', { sz: 'wide', v: 2, uniform: 1 }),
      K('girls-group-learning', 'בנות לומדות בקבוצה', ['למידה בקבוצות', 'למידה שיתופית', 'עבודה בקבוצות', 'לומדות יחד', 'שיתוף פעולה'],
        'Three girls (only girls) standing around a small cardboard table, solving a big colorful jigsaw-puzzle map together, one pointing, all smiling and discussing; tops with long sleeves, straight knee-length denim skirts.', { sz: 'wide', v: 2, uniform: 1 }),
      K('boy-project', 'ילד מציג פרויקט', ['פרויקט', 'פרויקטים', 'למידה מבוססת פרויקטים', 'תוצר', 'תוצרים', 'הצגת עבודות'],
        'ONE boy proudly presenting a cardboard model of a little colorful town with houses and trees on a low stand, one hand gesturing toward it. Black wavy hair, cyan T-shirt, beige trousers.', { v: 2, uniform: 1 }),
      K('girl-project', 'ילדה מציגה פרויקט', ['פרויקט', 'פרויקטים', 'למידה מבוססת פרויקטים', 'תוצר', 'תוצרים', 'הצגת עבודות', 'חקר'],
        'ONE girl proudly presenting a tri-fold cardboard poster board covered with colorful drawings and diagrams (no readable text), pointing at it. Brown braid, orange top with three-quarter sleeves covering the elbows, a straight knee-length denim skirt.', { v: 2, uniform: 1 }),
      K('boy-number-path', 'ילד קופץ על מסלול', ['למידה בתנועה', '^תנועה', 'למידה פעילה', 'משחק לימודי'],
        'ONE boy hopping joyfully along a path of colorful cardboard floor squares, each square marked with a different number of dots. Ginger hair, purple T-shirt, jeans.', { sz: 'sq', h: 0.24, v: 2, uniform: 1 }),
    ] },

  { id: 'dialogue', domain: 'climate', he: 'שיח ומניעת אלימות', topic: 'heart',
    kw: ['^שיח', 'שיח מכבד', 'דיאלוג', 'מעגל שיח', 'מעגלי שיח', 'תקשורת מקרבת', 'שפה מכבדת', 'שפה נקייה', 'מילים טובות', 'מניעת אלימות', 'אלימות', 'אקלים מיטבי', 'אקלים', 'גישור', 'קונפליקט', 'קונפליקטים', 'הקשבה', '^אמון', 'שיח רגשי', 'שיחה'],
    items: [
      K('girls-talk-circle', 'בנות במעגל שיח', ['מעגל שיח', 'מעגלי שיח', '^שיח', 'שיתוף', 'הקשבה'],
        'Four girls (only girls) sitting cross-legged on colorful cardboard cushions in a circle, talking and listening warmly; one girl holds a soft yellow talking-ball while the others listen. Long-sleeved tops, straight knee-length denim skirts, tights.', { sz: 'wide', h: 0.2, v: 2, uniform: 1 }),
      K('boys-talk-circle', 'בנים במעגל שיח', ['מעגל שיח', 'מעגלי שיח', '^שיח', 'שיתוף', 'הקשבה'],
        'Four boys (only boys) sitting cross-legged on colorful cardboard cushions in a circle, talking and listening warmly; one boy holds a soft yellow talking-ball while the others listen.', { sz: 'wide', h: 0.2, v: 2, uniform: 1 }),
      K('boys-makeup', 'בנים משלימים', ['^פיוס', 'להתפייס', 'מתפייסים', 'גישור', '^סליחה', 'מניעת אלימות', 'פתרון קונפליקטים'],
        'Two boys (only boys) making up after an argument: shaking hands and smiling at each other, one with a friendly hand on the other one\'s shoulder.', { sz: 'sq', v: 2, uniform: 1 }),
      O('feelings-board', 'לוח רגשות', ['רגשות', 'שיח רגשי', 'זיהוי רגשות', 'מד רגשות'],
        'a cardboard board on a small stand with five big round colorful faces showing different feelings: happy, calm, sad, surprised and excited (no text).', { h: 0.14 }),
      S('kind-words', 'מילים טובות', ['מילים טובות', 'שפה טובה', 'שפה מכבדת', 'שפה נקייה', 'תקשורת מקרבת', 'דיבור נעים'],
        'a speech bubble from which colorful little hearts, stars and flowers flow out.'),
      O('talking-ball', 'כדור שיח', ['דיאלוג', 'שיחה', 'תורות דיבור'],
        'a soft yellow cardboard-and-felt ball with a smiling face and little colorful speech bubbles around it.', { h: 0.09 }),
    ] },

  { id: 'chayalei', domain: 'heritage', he: 'חיילי האור ומורשת', topic: 'mivtzaim',
    kw: ['חיילי האור', 'חייל האור', 'חיילת האור', 'חיילות האור', 'חיילי אור', 'צבא האור', 'שומרים על ערכים', 'ערכים ודרך ארץ', '^מורשת', 'תוכנית מורשת', 'מורשת ישראל'],
    items: [
      O('chayalei-shield', 'מגן חיילי האור', ['חיילי האור', 'חייל האור', 'חיילת האור', 'צבא האור', 'שומרים על ערכים'],
        'a 3D sculpture made of corrugated cardboard of the emblem in the reference image: the teal and navy shield with a gold border and the spread teal wings on both sides; in the center of the shield, instead of any lettering, a glowing golden flame. No text, no letters.', { h: 0.16, ref: 'chayalei', v: 2 }),
      K('boy-chayal', 'ילד חייל האור', ['חייל האור', 'חיילי האור', 'שומרים על ערכים'],
        'ONE proud boy standing tall like a little hero, holding up a cardboard shield shaped like the emblem in the reference (teal shield with a gold border, wings and a golden flame in the middle, no letters), big confident smile. Dark curly hair, navy T-shirt, jeans.', { ref: 'chayalei', v: 3, logo: 1, uniform: 1 }),
      K('girl-chayelet', 'ילדה חיילת האור', ['חיילת האור', 'חיילות האור', 'חיילי האור', 'להאיר'],
        'ONE proud girl holding a glowing cardboard lantern high, a small teal shield badge with golden wings (like the emblem in the reference, no letters) pinned on her top, confident smile. Long brown hair with a teal headband, purple top with long sleeves, a straight knee-length navy skirt.', { ref: 'chayalei', v: 3, logo: 1, uniform: 1 }),
      O('moreshet-sign', 'שלט מורשת', ['^מורשת', 'תוכנית מורשת', 'מורשת ישראל', 'שיעורי מורשת'],
        'a 3D cardboard sign that reproduces exactly the logo in the reference image (the purple band with its lettering and the colorful M-O-R-E letters with the candles, the heart and the scroll), standing on two small cardboard legs.', { sz: 'wide', h: 0.1, ref: 'moreshet', v: 2 }),
    ] },

  { id: 'management', domain: 'management', he: 'ניהול מיטבי', topic: 'staff',
    kw: ['ניהול', 'ניהול מיטבי', 'מנהלת', 'הנהלה', 'מקצועיות', 'מקצועית', 'תכנון', 'תוכנית עבודה', 'תכנית עבודה', 'בקרה', 'מעקב', 'נהלים', 'ארגון', '^מאורגן', '^מאורגנת', '^מסודר', '^מסודרת', 'תהליכים', 'הובלה', 'מנהיגות חינוכית', 'למידת צוות', 'קהילה מקצועית', 'עבודת צוות', 'שיתוף פעולה', 'צוות מוביל', 'אחריות משותפת'],
    items: [
      K('principal', 'מנהלת', ['מנהלת', 'המנהלת', 'הנהלה', 'ניהול', 'מנהיגות חינוכית', 'הובלה'],
        'A confident, warm school principal — a modern Israeli woman in a modest elegant style: a long straight skirt reaching mid-calf, a long-sleeved blazer over a blouse, a stylish head scarf — holding a tablet against her arm and smiling, standing tall. She is the only person in the image — nobody else at all.', { h: 0.3, v: 3, uniform: 1 }),
      K('team-meeting', 'ישיבת צוות', ['ישיבת צוות', 'ישיבות צוות', 'למידת צוות', 'קהילה מקצועית', 'עבודת צוות'],
        'Three women teachers in a modest style (long skirts, long-sleeved blouses, stylish head scarves) sitting around a small round cardboard table with notebooks, a laptop and coffee mugs, discussing and smiling. Only these three women are in the image — nobody else at all.', { sz: 'wide', h: 0.24, v: 3, uniform: 1 }),
      O('gears', 'גלגלי שיניים', ['תהליכים', 'מערכת', 'ניהול', 'ארגון', 'עובד כמו שעון'],
        'three interlocking colorful cardboard gears (cyan, orange and purple) turning together.', { h: 0.12 }),
      O('planner', 'לוח תכנון', ['תכנון', 'תוכנית עבודה', 'תכנית עבודה', 'לוח זמנים', 'גאנט', 'מעקב'],
        'a cardboard wall planner board on a small stand, with a grid of colorful sticky notes, pushpins and a few check marks (no text).', { h: 0.13 }),
      O('clipboard', 'רשימת משימות', ['משימות', 'בקרה', 'נהלים', '^מסודר', '^מסודרת', 'סדר וארגון'],
        'a cardboard clipboard holding a checklist with colorful check marks and lines (no readable text), a pencil clipped to it.', { h: 0.11 }),
      O('team-hands', 'ידיים ביחד', ['עבודת צוות', 'שיתוף פעולה', 'צוות מגובש', 'אחריות משותפת'],
        'several cardboard hands in different colors stacked together in the middle, one on top of the other, as a teamwork gesture.', { h: 0.11 }),
    ] },

  { id: 'early', domain: 'early', he: 'מצוינות בכיתות א–ב', topic: 'reading',
    kw: ['כיתה א', 'כיתה ב', 'כיתות א', 'כיתות ב', 'כיתות אב', 'כיתות א-ב', 'א-ב', 'ראשית קריאה', 'קריאה ראשונית', 'רכישת קריאה', 'רכישת הקריאה', 'שטף קריאה', '^שטף', '^ניקוד', 'מסיבת סידור', 'חגיגת סידור', 'קבלת סידור', 'חגיגת חומש', 'קבלת חומש', 'מסיבת חומש', 'ראשית כתיבה', 'הצעירים', 'כיתות נמוכות', 'שכבה א', 'שכבת א', 'מצוינות בכיתה'],
    items: [
      K('boy-first-reader', 'ילד בכיתה א קורא', ['ראשית קריאה', 'קריאה ראשונית', 'רכישת קריאה', 'שטף קריאה', 'כיתה א'],
        'ONE small first-grade boy (about 6 years old) reading his first word from a big cardboard card with a picture of a red apple, his finger under the word, beaming with pride. Short blond hair, orange T-shirt, jeans.', { v: 2, uniform: 1 }),
      K('girl-first-reader', 'ילדה בכיתה א קוראת', ['ראשית קריאה', 'קריאה ראשונית', 'רכישת קריאה', 'שטף קריאה', 'כיתה א'],
        'ONE small first-grade girl (about 6 years old) holding an open early-reader book with big pictures, reading aloud with her finger under the line, beaming with pride. Two dark pigtails, pink top with long sleeves, a straight knee-length navy skirt. ONE girl only — nobody else in the image, no boys, no other people.', { v: 3, uniform: 1 }),
      K('girls-siddur-party', 'בנות במסיבת סידור', ['מסיבת סידור', 'חגיגת סידור', 'קבלת סידור', 'סידור ראשון'],
        'Two first-grade girls (only girls, about 6) wearing golden paper crowns, proudly holding up their brand-new prayer books decorated with colorful ribbons, overjoyed. Long-sleeved tops, straight knee-length denim skirts.', { sz: 'sq', v: 2, uniform: 1 }),
      K('boys-siddur-party', 'בנים במסיבת סידור', ['מסיבת סידור', 'חגיגת סידור', 'קבלת סידור', 'סידור ראשון'],
        'Two first-grade boys (only boys, about 6) wearing golden paper crowns over their kippot, proudly holding up their brand-new prayer books decorated with colorful ribbons, overjoyed.', { sz: 'sq', v: 2, uniform: 1 }),
      K('boys-chumash-party', 'בנים בחגיגת חומש', ['חגיגת חומש', 'קבלת חומש', 'מסיבת חומש', 'חומש ראשון', 'כיתה ב'],
        'Two second-grade boys (only boys, about 7) proudly hugging their brand-new holy books with shiny gold-edged covers, festive paper garlands around their necks, huge smiles.', { sz: 'sq', v: 2, uniform: 1 }),
      K('girls-chumash-party', 'בנות בחגיגת חומש', ['חגיגת חומש', 'קבלת חומש', 'מסיבת חומש', 'חומש ראשון', 'כיתה ב'],
        'Two second-grade girls (only girls, about 7) proudly hugging their brand-new holy books with shiny gold-edged covers, festive flower crowns on their heads, huge smiles. Long-sleeved tops, straight knee-length denim skirts.', { sz: 'sq', v: 2, uniform: 1 }),
      B('alef-bet-train', 'רכבת אותיות', ['אותיות', 'אלף בית', 'ראשית קריאה', '^ניקוד'],
        'a cheerful cardboard toy train with an engine and four wagons, each wagon carrying one big chunky Hebrew letter: א, ב, ג, ד.', { zone: 'yard', sz: 'wide', h: 0.13 }),
      O('first-backpack', 'ילקוט ראשון', ['ילקוט', 'עולים לכיתה א', 'יום ראשון בכיתה א', 'קלמר'],
        'a brand-new colorful school backpack in cyan and pink with a matching pencil case and a few colored pencils peeking out.', { h: 0.11 }),
    ] },

  // ───────────── ילדים כלליים — כשאין התאמה, או "עוד ילדים" ─────────────
  { id: 'kids', he: 'עוד ילדים', topic: 'joy', weight: 0.5,
    kw: ['תלמידים', '^תלמיד', '^תלמידה', '^ילדים', '^ילד', '^ילדה', 'הרשמה', 'נרשמים', 'כיתות מלאות', 'גידול במספר', 'עוד תלמידים', 'מלא ילדים', 'מלא תלמידים', 'כיתה א'],
    items: [
      K('boy-backpack', 'ילד עם תיק', ['כיתה א', 'עולים לכיתה', 'שנה חדשה'],
        'ONE small first-grade boy with an oversized colorful backpack, giving a big thumbs up. Blond spiky hair, cyan T-shirt, jeans.', { v: 2, uniform: 1 }),
      K('girl-backpack', 'ילדה עם תיק', ['תלמידה', 'תלמידות'],
        'ONE girl walking happily with a pink backpack, waving one hand. Long dark ponytail, sunflower-yellow top with three-quarter sleeves covering the elbows, a straight knee-length navy skirt.', { v: 2, uniform: 1 }),
      K('boy-scooter', 'ילד על קורקינט', ['קורקינט', 'מגיעים', 'מגיעות'],
        'ONE boy riding a kick scooter toward the viewer, a backpack on his back, grinning. Brown curly hair, orange T-shirt, jeans.', { v: 2, uniform: 1 }),
      K('siblings', 'אחיות', ['אחים', 'אחיות', 'משפחתי'],
      'An older sister holding hands with her little sister, both wearing backpacks and smiling (only girls). Older sister in a lime-green top and a straight knee-length denim skirt; little sister in a red top and a straight knee-length denim skirt; both with three-quarter sleeves covering the elbows.', { sz: 'sq', v: 2, uniform: 1 }),
      K('kids-walking', 'בנות הולכות לבית הספר', ['^ילדות', 'תלמידות', 'עוד תלמידות', 'כיתות מלאות', 'הרשמה'],
      'Three girls (only girls) walking together toward school, chatting and laughing, carrying backpacks: one in an orange top and a straight knee-length denim skirt, one in a cyan top and a straight knee-length denim skirt, a smaller one in a yellow dress; all sleeves cover the elbows.', { sz: 'wide', v: 2, uniform: 1 }),
      K('boys-walking', 'בנים הולכים לבית הספר', ['^ילדים', 'תלמידים', 'עוד תלמידים', 'כיתות מלאות', 'הרשמה'],
      'Three boys (only boys) walking together toward school, chatting and laughing, carrying backpacks: one in a purple T-shirt, one in a red T-shirt, a smaller one in a cyan T-shirt.', { sz: 'wide', v: 2, uniform: 1 }),
      K('girl-skip', 'ילדה מקפצת', ['קופצת', 'קלילות', 'שמחה'],
        'ONE girl skipping happily mid-step with her braids flying and a small backpack bouncing. Two blond braids, raspberry top with long sleeves down to the wrists, a straight knee-length denim skirt. She wears opaque tights (not socks) and her straight denim skirt stays covering her knees. ONE girl only — nobody else in the image, no boys, no other people.', { v: 4, uniform: 1 }),
      K('boy-wave', 'ילד מנופף', ['^שלום', 'ברוכים הבאים', 'מקבלים'],
        'ONE boy waving with a huge open-mouthed smile. Black curly hair, round glasses, sunflower-yellow T-shirt, navy trousers.', { v: 2, uniform: 1 }),
      K('boy-run', 'ילד רץ לבית הספר', ['רצים', 'אוהבים לבוא', 'ממהרים'],
        'ONE boy running joyfully toward the viewer with arms open wide. Ginger hair, freckles, grass-green T-shirt, jeans.', { v: 2, uniform: 1 }),
    ] },
];

// ───────────── שטוח + עזרים ─────────────
// מין הדמויות בתמונה (b = בנים, g = בנות) — כדי שבאיור המשותף בנים ובנות יעמדו בצדדים נפרדים. חפצים בלי מין.
const GIRLY = /\b(girls?|daughters?|granddaughter|sisters?|mother|woman|grandmother|teacher)\b/i, BOYISH = /\b(boys?|sons?|grandson|father|grandfather)\b/i;
const genderOf = it => it.kind !== 'kid' ? undefined : GIRLY.test(it.p) ? 'g' : BOYISH.test(it.p) ? 'b' : undefined;
export const ITEMS = GROUPS.flatMap(g => g.items.map(it => ({ ...it, group: g.id, topic: g.topic, domain: g.domain, g: it.g ?? genderOf(it) })));
const GW = Object.fromEntries(GROUPS.map(g => [g.id, g.weight]));
export const ITEM = Object.fromEntries(ITEMS.map(it => [it.id, it]));
export const itemFile = it => `${it.id}${it.v > 1 ? '_v' + it.v : ''}.png`;
export const itemSrc = (it, base = '../images/items/') => base + itemFile(it);

const FINALS = { 'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ' };
export function normalize(s) {
  return ' ' + String(s || '').toLowerCase()
    .replace(/[֑-ׇ]/g, '')
    .replace(/["'״׳`]/g, '')
    .replace(/[ךםןףץ]/g, c => FINALS[c])
    .replace(/[^א-תa-z0-9 \-]+/g, ' ')
    .replace(/\s+/g, ' ') + ' ';
}

// ביטויים שגורים שמוסרים מהתשובה לפני ההתאמה (למשל "כל הזמן" לא אמור להוסיף שעון)
const IDIOMS = ['כל הזמן', 'בית הספר', 'בית ספר', 'ביהס', 'בעזרת השם', 'בעזרת ה', 'בעזה', 'בסד', 'אני רואה', 'אנחנו רואים', 'בשנה הבאה', 'השנה הבאה', 'שנה הבאה', 'לשנה הבאה'].map(w => normalize(w));
function clean(answer) { let a = normalize(answer); for (const w of IDIOMS) a = a.split(w).join(' '); return a; }

const CACHE = new Map();
function rx(kw) {
  if (CACHE.has(kw)) return CACHE.get(kw);
  let r;
  if (kw[0] === '^') r = new RegExp(`(^|\\s)[והבל]{0,3}${normalize(kw.slice(1)).trim()}(?=\\s)`);
  else if (kw[0] === '=') r = new RegExp(`(^|\\s)[והבלכמשד]{0,3}${normalize(kw.slice(1)).trim()}(?=\\s)`);
  else r = normalize(kw).trim();
  CACHE.set(kw, r);
  return r;
}
function hit(text, kw) { const r = rx(kw); return typeof r === 'string' ? text.includes(r) : r.test(text); }

// ניקוד לכל פריט: מילה של הפריט = 3 (+1 לכל מילה נוספת בביטוי), מילה של הקבוצה = 1 (כפול משקל הקבוצה)
export function scoreItems(answer) {
  const a = clean(answer), out = [];
  for (const g of GROUPS) {
    const gHits = g.kw.filter(k => hit(a, k));
    const gs = gHits.length * (g.weight ?? 1);
    for (const it of g.items) {
      const own = it.kw.filter(k => hit(a, k));
      // ביטוי של כמה מילים ספציפי יותר ממילה בודדת: 3 נקודות + 1 לכל מילה נוספת
      const s = own.reduce((t, k) => t + 3 + k.trim().split(/\s+/).length - 1, 0) * (g.weight ?? 1) + gs;
      if (s > 0) out.push({ id: it.id, group: g.id, s, own, gHits });
    }
  }
  return out.sort((x, y) => y.s - x.s);
}

// בוחר מה להוסיף לאיור עבור תשובה אחת.
// used = Set של מזהי פריטים שכבר באיור. מחזיר 1–max פריטים, לכל היותר אחד מכל קבוצה.
// filter = מסנן פריטים (למשל רק ילדים: it => it.kind === 'kid', או רק חפצים: it => it.kind !== 'kid').
export function pickItems(answer, { used = new Set(), max = 3, rand = Math.random, filter = () => true } = {}) {
  const scored = scoreItems(answer).filter(x => filter(ITEM[x.id])).map(x => ({ ...x, k: x.s - (used.has(x.id) ? 3.5 : 0) + rand() * 0.4 }))
    .sort((x, y) => y.k - x.k);
  const groups = new Set(scored.map(x => x.group));
  const ownItems = scored.filter(x => x.own.length).length;
  const n = Math.max(1, Math.min(max, Math.max(groups.size, ownItems)));
  // שלושה סבבים: (1) פריט אחד מכל נושא שיש לו מילה משלו, (2) פריט שני חזק מאותו נושא, (3) נושאים שנתפסו רק במילה כללית
  const picked = [], perG = {};
  const take = x => { perG[x.group] = (perG[x.group] || 0) + 1; picked.push(ITEM[x.id]); };
  for (const x of scored) if (picked.length < n && x.own.length && !perG[x.group]) take(x);
  for (const x of scored) if (picked.length < n && x.own.length && perG[x.group] === 1 && (GW[x.group] ?? 1) >= 1 && !picked.includes(ITEM[x.id])) take(x);
  for (const x of scored) if (picked.length < n && !perG[x.group]) take(x);
  if (!picked.length) { // אין שום התאמה — ילד כללי שעוד לא באיור; אם הסינון לא מאפשר ילדים — משהו משמח (שמחה / חזון)
    let pool = GROUPS.find(g => g.id === 'kids').items.map(it => ITEM[it.id]).filter(filter);
    if (!pool.length) pool = ITEMS.filter(it => (it.group === 'joy' || it.group === 'vision') && filter(it));
    if (!pool.length) pool = ITEMS.filter(filter);
    const free = pool.filter(it => !used.has(it.id));
    const from = free.length ? free : pool;
    if (from.length) picked.push(ITEM[from[Math.floor(rand() * from.length)].id]);
  }
  return picked;
}
