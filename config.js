// Royale - Wedding Invitation Configuration for Shaziyabanu & Mohammed Fahim
(function () {
  const params = new URLSearchParams(location.search);
  const mode = params.has('edit') ? 'edit' : params.has('preview') ? 'preview' : 'view';
  const trial = false;
  const TRIAL_EDITABLE = ['invocation.religion', 'brideName', 'groomName'];
  const STORAGE_KEY = 'royaleConfig_ShaziyabanuFahim_v4';

  const SYMBOLS = [
    { id: 'islamic', label: 'Bismillah & Crescent', src: 'symbols/_islamic.svg' },
    { id: 'ganesha', label: 'Ganesha', src: 'symbols/_ganesha.svg' },
    { id: 'buddha', label: 'Buddha', src: 'symbols/_buddha.svg' },
    { id: 'sindhi', label: 'Jhulelal', src: 'symbols/_sindhi.svg' },
    { id: 'sikh', label: 'Ik Onkar', src: 'symbols/_sikh.svg' },
    { id: 'jain', label: 'Ahimsa symbol', src: 'symbols/_jain.svg' },
    { id: 'buddhist', label: 'Dharma wheel', src: 'symbols/_buddhist.svg' },
    { id: 'parsi', label: 'Faravahar', src: 'symbols/_parsi.svg' },
    { id: 'christian', label: 'Cross', src: 'symbols/_christian.svg' },
    { id: 'none', label: 'None', src: '' },
  ];

  const INVOCATIONS = {
    islamic: {
      label: 'Islamic',
      english: 'In the name of Allah, the Most Beneficent, the Most Merciful',
      scripts: {
        arabic: { label: 'Arabic (Bismillah)', text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', font: 'Amiri', rtl: true },
        quranic: { label: 'Qur\'an Verse (30:21)', text: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً', font: 'Amiri', rtl: true },
        urdu: { label: 'Urdu', text: 'شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے', font: 'Noto Naskh Arabic', rtl: true },
      },
    },
    hindu: {
      label: 'Hindu',
      english: 'Shri Ganeshaya Namah',
      scripts: {
        devanagari: { label: 'Devanagari (Hindi/Marathi/Sanskrit/Nepali)', text: 'श्री गणेशाय नमः', font: 'Tiro Devanagari Sanskrit' },
        gujarati: { label: 'Gujarati', text: 'શ્રી ગણેશાય નમઃ', font: 'Noto Sans Gujarati' },
      },
    },
    sikh: {
      label: 'Sikh',
      english: 'Ik Onkar, Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh',
      scripts: {
        gurmukhi: { label: 'Gurmukhi', text: 'ੴ ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖ਼ਾਲਸਾ, ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਹਿ', font: 'Noto Sans Gurmukhi' },
      },
    },
    jain: {
      label: 'Jain',
      english: 'Namo Arihantanam',
      scripts: {
        devanagari: { label: 'Devanagari', text: 'नमो अरिहंताणं', font: 'Tiro Devanagari Sanskrit' },
      },
    },
  };

  function symbolById(id) {
    for (let i = 0; i < SYMBOLS.length; i++) if (SYMBOLS[i].id === id) return SYMBOLS[i];
    return SYMBOLS[0];
  }

  function invocationLines(inv) {
    const sel = inv && inv.script;
    if (sel === 'custom') {
      return {
        religion: (inv && inv.religion) || 'islamic', script: 'custom',
        text: (inv && inv.custom) || '', font: '', rtl: false, isEnglish: false, isCustom: true,
      };
    }
    if (sel === 'blank') {
      return {
        religion: (inv && inv.religion) || 'islamic', script: 'blank',
        text: '', font: '', rtl: false, isEnglish: false, isBlank: true,
      };
    }
    const religion = INVOCATIONS[(inv && inv.religion)] ? inv.religion : 'islamic';
    const rel = INVOCATIONS[religion];
    const scriptKeys = Object.keys(rel.scripts);
    let chosen;
    if (sel === 'english') chosen = 'english';
    else if (sel && rel.scripts[sel]) chosen = sel;
    else chosen = scriptKeys.length ? scriptKeys[0] : 'english';

    if (chosen === 'english') {
      return { religion: religion, script: 'english', text: rel.english || '', font: '', rtl: false, isEnglish: true };
    }
    const scr = rel.scripts[chosen];
    return { religion: religion, script: chosen, text: scr.text, font: scr.font, rtl: !!scr.rtl, isEnglish: false };
  }

  const NIKAH_ISO = '2026-12-23';

  const GALLERY_STARTERS = [
    { type: 'portrait', image: '1.png', placeholder: false, caption: '#howitstarted', hang: 118 },
    { type: 'landscape', image: '2.png', placeholder: false, caption: '#adventures', hang: 150 },
    { type: 'story', text: '“And He placed between you affection and mercy.” — Qur’an (30:21)\nSome stories begin with grand blessings. Ours started with a simple, pure connection.', hang: 86 },
    { type: 'portrait', image: '3.png', placeholder: false, caption: '#thelittlethings', hang: 132 },
    { type: 'landscape', image: '4.png', placeholder: false, caption: '#everyday', hang: 100 },
    { type: 'story', text: "With trust in Allah and love in our hearts, we realized life's most precious moments are the ones we share together.", hang: 120 },
    { type: 'portrait', image: '5.png', placeholder: false, caption: '#foreverbegins', hang: 150 },
    { type: 'landscape', image: '6.png', placeholder: false, caption: '#usforever', hang: 92 },
  ];

  const DEFAULTS = {
    version: 1,
    finalized: true,

    invocation: { symbol: 'islamic', religion: 'islamic', script: 'arabic', custom: '' },

    brideName: 'Shaziyabanu',
    groomName: 'Mohammed Fahim',
    title: 'Shaziyabanu & Mohammed Fahim',
    hostNames: ['Shaziyabanu', 'Mohammed Fahim'],

    introNote: 'With hearts full of gratitude to Allah, Mrs. Raziya Khatoon (W/o Late Jamil Ahmed Siddiqui) requests the pleasure of your presence and blessings on the joyous occasion of the Nikah of her beloved granddaughter…',

    eventISO: NIKAH_ISO,
    revealButton: 'Reveal the Date',
    revealAfter: 'Save the Date',

    groomFamily: {
      enabled: true,
      name: 'Mohammed Fahim',
      relLabel: 'Beloved Son of',
      parentA: 'Mr. Zamirul Hasan',
      parentB: 'Mrs. Zamirul Hasan',
      grandLabel: 'With Blessings of',
      grandA: 'Family Elders',
      grandB: 'Near & Dear Ones',
    },
    brideFamily: {
      enabled: true,
      name: 'Shaziyabanu Siddiqui',
      relLabel: 'Beloved Daughter of',
      parentA: 'Mr. Shakeel Ahmed Siddiqui',
      parentB: 'Mrs. Shakeel Ahmed Siddiqui',
      grandLabel: 'Beloved Granddaughter of',
      grandA: 'Late Jamil Ahmed Siddiqui',
      grandB: 'Mrs. Raziya Khatoon',
    },

    gallery: {
      enabled: true,
      items: GALLERY_STARTERS,
    },

    ceremonies: [
      {
        name: 'Haldi Ceremony',
        art: 'media/haldi.webp',
        date: '2026-12-22',
        time: '16:00',
        venue: 'House no. 42, Anwar Park Society, Behind Hariyali Society, Ahmedabad 380055',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=House+no.+42%2C+Anwar+Park+Society%2C+Behind+Hariyali+Society%2C+Ahmedabad+380055',
        enabled: true
      },
      {
        name: 'Nikah',
        art: 'media/nikah.png',
        date: '2026-12-23',
        time: '19:00',
        venue: 'HG FARM, Piplaj - Pirana Road, Near Calico Mills, Behrampura, Ahmedabad, Gujarat - 382405',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=HG+FARM%2C+Piplaj+-+Pirana+Road%2C+Near+Calico+Mills%2C+Behrampura%2C+Ahmedabad%2C+Gujarat+-+382405',
        enabled: true
      },
      {
        name: 'Dawat-e-Nikah',
        art: 'media/reception.webp',
        date: '2026-12-23',
        time: '20:00',
        venue: 'HG FARM, Piplaj - Pirana Road, Near Calico Mills, Behrampura, Ahmedabad, Gujarat - 382405',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=HG+FARM%2C+Piplaj+-+Pirana+Road%2C+Near+Calico+Mills%2C+Behrampura%2C+Ahmedabad%2C+Gujarat+-+382405',
        enabled: true
      },
      {
        name: 'Rukhsati (Vidai)',
        art: 'media/rukhsati.png',
        date: '2026-12-24',
        time: '15:30',
        venue: 'House no. 42, Anwar Park Society, Behind Hariyali Society, Ahmedabad 380055',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=House+no.+42%2C+Anwar+Park+Society%2C+Behind+Hariyali+Society%2C+Ahmedabad+380055',
        enabled: true
      }
    ],

    compliments: {
      enabled: true,
      lead: 'With Best Compliments From:',
      lines: [
        'With the blessings of Late Jamil Ahmed Siddiqui',
        'Mrs. Raziya Khatoon (W/o Late Jamil Ahmed Siddiqui)',
        'Mr. & Mrs. Shakeel Ahmed Siddiqui',
        'Near & Dear Ones · Siddiqui & Hasan Families',
        'Contact: +91 94284 18285',
      ],
    },

    note: {
      enabled: true,
      lead: 'A Verse From The Holy Qur’an',
      text: '“And He placed between you affection and mercy.” — Qur\'an (30:21)\n\nWith hearts full of gratitude to Allah, Mrs. Raziya Khatoon (W/o Late Jamil Ahmed Siddiqui) requests the pleasure of your presence and blessings on the joyous occasion of the Nikah of her beloved granddaughter Shaziyabanu with Mohammed Fahim.',
    },

    farewell: { line: 'Your Duas & Presence Mean the World to Us' },

    social: { instagram: false, instagramUrl: '' },

    music: { enabled: true, src: 'music/Khwaja Mere Khwaja.mp3', volume: 0.65 },
  };

  function deepMerge(base, over) {
    if (Array.isArray(base) || Array.isArray(over)) return over !== undefined ? over : base;
    if (typeof base !== 'object' || base === null) return over !== undefined ? over : base;
    if (typeof over !== 'object' || over === null) return base;
    const out = {};
    Object.keys(base).forEach((k) => { out[k] = deepMerge(base[k], over[k]); });
    Object.keys(over).forEach((k) => { if (!(k in base)) out[k] = over[k]; });
    return out;
  }

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved) return deepMerge(DEFAULTS, saved);
    } catch (_) {}
    return deepMerge(DEFAULTS, {});
  }

  function syncDerived() {
    const cfg = window.Royale.config;
    const bride = (cfg.brideName || '').trim();
    const groom = (cfg.groomName || '').trim();
    cfg.title = bride && groom ? bride + ' & ' + groom : (bride || groom || 'Our Wedding');
    cfg.hostNames = [bride, groom].filter(Boolean);
  }

  function save() {
    syncDerived();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(window.Royale.config));
      return true;
    } catch (_) {
      return false;
    }
  }

  function reset() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
  }

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]
  ));

  const nl2br = (s) => esc(s).replace(/\n/g, '<br />');

  function guestName() {
    return (params.get('to') || 'Family & Friends').trim().slice(0, 80);
  }

  function fmtDate(iso) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    if (!m) return '';
    const d = new Date(+m[1], +m[2] - 1, +m[3]);
    return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  }

  function fmtTime(hhmm) {
    const m = /^(\d{1,2}):(\d{2})$/.exec(String(hhmm || ''));
    if (!m) return '';
    return new Date(2000, 0, 1, +m[1], +m[2])
      .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  function mapLink(c) {
    const own = ((c && c.mapUrl) || '').trim();
    if (own) return own;
    const venue = ((c && c.venue) || '').trim();
    return venue ? 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(venue) : '';
  }

  const CUSTOM_CEREMONY_MAX = 5;
  const CEREMONY_ZOOM_MIN = 0.3;

  function ceremonyLive(c) {
    if (!c || c.enabled === false) return false;
    if (!c.custom) return true;
    return !!((c.art || '').trim() && (c.name || '').trim());
  }

  function ceremoniesByDate(list) {
    const when = (c) => (/^\d{4}-\d{2}-\d{2}$/.test(c.date || '') ? c.date : '9999-99-99') + ' ' + (c.time || '');
    return (Array.isArray(list) ? list : []).slice().sort((a, b) => when(a).localeCompare(when(b)));
  }

  function addDaysISO(iso, days) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    if (!m) return iso;
    const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
    d.setUTCDate(d.getUTCDate() + days);
    return d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0') + '-' + String(d.getUTCDate()).padStart(2, '0');
  }

  window.Royale = {
    mode,
    trial: false,
    TRIAL_EDITABLE,
    canEdit: function (path) { return mode === 'edit'; },
    config: load(),
    DEFAULTS,
    SYMBOLS,
    INVOCATIONS,
    symbolById,
    invocationLines,
    STORAGE_KEY,
    addDaysISO,
    save,
    reset,
    syncDerived,
    esc,
    nl2br,
    guestName,
    fmtDate,
    fmtTime,
    mapLink,
    CUSTOM_CEREMONY_MAX,
    CEREMONY_ZOOM_MIN,
    ceremonyLive,
    ceremoniesByDate,
  };

  if (mode === 'edit') document.body.classList.add('is-editing');
  if (mode === 'preview') document.body.classList.add('is-previewing');
})();
