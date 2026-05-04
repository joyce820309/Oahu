/* global React */

// ─── i18n strings ───────────────────────────────────────────────
const STRINGS = {
  en: {
    appName: 'Hele',
    tagline: 'Hawaiian for "go, travel"',
    tabs: { trip: 'Trip', days: 'Days', explore: 'Explore', pack: 'Pack', me: 'Me' },
    home: {
      greeting: 'Aloha, Lin',
      subtitle: 'Your Oʻahu adventure starts in',
      countdown: 'days',
      tripTitle: 'Oʻahu, 7 days',
      tripDates: 'Jun 14 – Jun 20, 2026',
      pax: '2 travelers',
      progress: 'Trip ready',
      quickActions: 'Quick actions',
      addPlace: 'Add place',
      booking: 'Bookings',
      notes: 'Notes',
      weather: 'Weather',
      upNext: 'Up next',
      upNextSub: 'Day 1 · Arrival',
      timeline: 'Timeline',
      tipsTitle: 'Local tips',
    },
    days: {
      title: 'Day-by-day',
      addStop: 'Add a stop',
      empty: 'Drop something here',
      reorderHint: 'Hold and drag cards to reorder',
    },
    explore: {
      title: 'Explore',
      list: 'List',
      map: 'Map',
      filters: ['All', 'Beaches', 'Hikes', 'Eats', 'Culture'],
      saved: 'Saved',
    },
    detail: {
      addToDay: 'Add to itinerary',
      hours: 'Hours',
      open: 'Open until 5:30 pm',
      crowd: 'Best at sunrise',
      drive: '32 min drive',
      about: 'About',
      reviews: 'Reviews',
      similar: 'You might like',
    },
    pack: {
      title: 'Packing list',
      progress: 'packed',
      categories: ['Essentials', 'Beach', 'Hikes', 'Evenings'],
      addItem: 'Add item',
    },
  },
  zh: {
    appName: 'Hele',
    tagline: '夏威夷語：去、旅行',
    tabs: { trip: '行程', days: '每日', explore: '探索', pack: '打包', me: '我' },
    home: {
      greeting: 'Aloha，林先生',
      subtitle: '距離你的 Oʻahu 旅程還有',
      countdown: '天',
      tripTitle: 'Oʻahu 7 天 6 夜',
      tripDates: '2026 年 6 月 14 – 20 日',
      pax: '2 位旅人',
      progress: '行程已就緒',
      quickActions: '快速動作',
      addPlace: '新增地點',
      booking: '訂單',
      notes: '筆記',
      weather: '天氣',
      upNext: '即將出發',
      upNextSub: '第 1 天 · 抵達',
      timeline: '時間軸',
      tipsTitle: '當地小提醒',
    },
    days: {
      title: '每日行程',
      addStop: '加入景點',
      empty: '把卡片拖到這裡',
      reorderHint: '長按卡片可拖拉重排',
    },
    explore: {
      title: '探索',
      list: '列表',
      map: '地圖',
      filters: ['全部', '海灘', '健行', '美食', '文化'],
      saved: '已收藏',
    },
    detail: {
      addToDay: '加入行程',
      hours: '營業時間',
      open: '開放至 17:30',
      crowd: '日出時段最佳',
      drive: '車程 32 分鐘',
      about: '關於這裡',
      reviews: '旅人評論',
      similar: '你可能也喜歡',
    },
    pack: {
      title: '打包清單',
      progress: '已打包',
      categories: ['必備', '海灘', '健行', '夜晚'],
      addItem: '新增項目',
    },
  },
};

// ─── Trip data ──────────────────────────────────────────────────
const TRIP = {
  destination: 'Oʻahu',
  start: '2026-06-14',
  end: '2026-06-20',
  travelers: 2,
  days: [
    {
      n: 1, dateLabel: { en: 'Sun, Jun 14', zh: '6/14 週日' },
      title: { en: 'Arrival & Waikīkī', zh: '抵達 · 威基基' },
      hue: 'sunset',
      stops: [
        { id: 's1', time: '14:30', dur: '1h', title: { en: 'Honolulu Airport (HNL)', zh: '檀香山機場 (HNL)' }, type: 'transit', icon: '✈' },
        { id: 's2', time: '16:00', dur: '30m', title: { en: 'Hotel check-in', zh: '飯店入住' }, sub: { en: 'The Surfjack', zh: 'The Surfjack' }, type: 'stay', icon: '◉' },
        { id: 's3', time: '17:30', dur: '1.5h', title: { en: 'Waikīkī Beach sunset', zh: '威基基海灘日落' }, sub: { en: 'Walk · 6 min', zh: '步行 6 分鐘' }, type: 'beach', icon: '◐' },
        { id: 's4', time: '19:30', dur: '1.5h', title: { en: 'Dinner — Marugame Udon', zh: '晚餐 — 丸龜烏龍麵' }, sub: { en: 'Casual · $', zh: '輕鬆 · $' }, type: 'food', icon: '☷' },
      ],
    },
    {
      n: 2, dateLabel: { en: 'Mon, Jun 15', zh: '6/15 週一' },
      title: { en: 'Diamond Head & North Shore', zh: '鑽石頭山 · 北岸' },
      hue: 'ocean',
      stops: [
        { id: 's5', time: '06:30', dur: '2h', title: { en: 'Diamond Head sunrise hike', zh: '鑽石頭山日出健行' }, sub: { en: 'Easy · 1.6 mi', zh: '簡易 · 1.6 英里' }, type: 'hike', icon: '△' },
        { id: 's6', time: '10:00', dur: '1h', title: { en: 'Leonard\u2019s malasadas', zh: 'Leonard\u2019s 葡式甜甜圈' }, type: 'food', icon: '☷' },
        { id: 's7', time: '12:30', dur: '2h', title: { en: 'Hālona Blowhole + Lanikai', zh: '鯨魚噴泉 + Lanikai' }, type: 'beach', icon: '◐' },
        { id: 's8', time: '16:00', dur: '2h', title: { en: 'Hale\u02bbiwa town stroll', zh: 'Haleʻiwa 小鎮散步' }, type: 'culture', icon: '◇' },
      ],
    },
    {
      n: 3, dateLabel: { en: 'Tue, Jun 16', zh: '6/16 週二' },
      title: { en: 'Snorkel at Hanauma', zh: '恐龍灣浮潛' }, hue: 'ocean',
      stops: [
        { id: 's9', time: '07:00', dur: '4h', title: { en: 'Hanauma Bay snorkel', zh: '恐龍灣浮潛' }, type: 'beach', icon: '◐' },
        { id: 's10', time: '13:00', dur: '1h', title: { en: 'Poke at Ono Seafood', zh: 'Ono Seafood 生魚飯' }, type: 'food', icon: '☷' },
        { id: 's11', time: '16:00', dur: '2h', title: { en: 'Kakaʻako murals', zh: 'Kakaʻako 街頭壁畫' }, type: 'culture', icon: '◇' },
      ],
    },
    {
      n: 4, dateLabel: { en: 'Wed, Jun 17', zh: '6/17 週三' },
      title: { en: 'Pearl Harbor & downtown', zh: '珍珠港 · 市區' }, hue: 'sand',
      stops: [
        { id: 's12', time: '08:00', dur: '4h', title: { en: 'USS Arizona Memorial', zh: '亞利桑那號紀念館' }, type: 'culture', icon: '◇' },
        { id: 's13', time: '13:30', dur: '2h', title: { en: 'Chinatown lunch crawl', zh: '中國城午餐' }, type: 'food', icon: '☷' },
        { id: 's14', time: '17:00', dur: '1h', title: { en: 'ʻIolani Palace', zh: 'ʻIolani 王宮' }, type: 'culture', icon: '◇' },
      ],
    },
    {
      n: 5, dateLabel: { en: 'Thu, Jun 18', zh: '6/18 週四' },
      title: { en: 'Kailua kayak day', zh: 'Kailua 獨木舟' }, hue: 'ocean', stops: [],
    },
    {
      n: 6, dateLabel: { en: 'Fri, Jun 19', zh: '6/19 週五' },
      title: { en: 'Lūʻau & last sunset', zh: '盧奧晚宴 · 最後一晚' }, hue: 'sunset', stops: [],
    },
    {
      n: 7, dateLabel: { en: 'Sat, Jun 20', zh: '6/20 週六' },
      title: { en: 'Departure', zh: '離開' }, hue: 'sand', stops: [],
    },
  ],
};

// ─── Explore POIs ───────────────────────────────────────────────
const POIS = [
  { id: 'p1', name: { en: 'Lanikai Beach', zh: 'Lanikai 海灘' }, kind: 'beach', area: { en: 'Windward', zh: '迎風海岸' }, rating: 4.9, mins: 32, x: 78, y: 38, blurb: { en: 'Powdery white sand and twin offshore islands.', zh: '細白沙灘配上海面雙島，明信片般的景致。' } },
  { id: 'p2', name: { en: 'Diamond Head', zh: '鑽石頭山' }, kind: 'hike', area: { en: 'South shore', zh: '南岸' }, rating: 4.7, mins: 12, x: 60, y: 62, blurb: { en: 'Volcanic crater hike with sweeping Waikīkī views.', zh: '火山口健行，眺望整個威基基海岸。' } },
  { id: 'p3', name: { en: 'Hanauma Bay', zh: '恐龍灣' }, kind: 'beach', area: { en: 'East O\u02bbahu', zh: '東 Oʻahu' }, rating: 4.8, mins: 28, x: 70, y: 70, blurb: { en: 'A protected nature preserve and snorkel sanctuary.', zh: '受保護的自然海灣，浮潛聖地。' } },
  { id: 'p4', name: { en: 'Hale\u02bbiwa Town', zh: 'Haleʻiwa 小鎮' }, kind: 'culture', area: { en: 'North shore', zh: '北岸' }, rating: 4.6, mins: 58, x: 38, y: 18, blurb: { en: 'Laid-back surf town with shave-ice institutions.', zh: '悠閒的衝浪小鎮，刨冰名店林立。' } },
  { id: 'p5', name: { en: 'Helena\u2019s Hawaiian Food', zh: 'Helena 夏威夷家常菜' }, kind: 'food', area: { en: 'Kalihi', zh: 'Kalihi' }, rating: 4.7, mins: 18, x: 48, y: 50, blurb: { en: 'James Beard classic since 1946.', zh: '1946 年創立、James Beard 殿堂級小館。' } },
  { id: 'p6', name: { en: 'Bishop Museum', zh: 'Bishop 博物館' }, kind: 'culture', area: { en: 'Kalihi', zh: 'Kalihi' }, rating: 4.6, mins: 20, x: 50, y: 44, blurb: { en: 'Largest collection of Polynesian cultural artifacts.', zh: '館藏全球最豐富的玻里尼西亞文化文物。' } },
  { id: 'p7', name: { en: 'Mānoa Falls', zh: 'Mānoa 瀑布' }, kind: 'hike', area: { en: 'Mānoa Valley', zh: 'Mānoa 谷' }, rating: 4.5, mins: 22, x: 56, y: 54, blurb: { en: 'Lush rainforest trail to a 150-ft waterfall.', zh: '雨林步道盡頭一道 150 呎瀑布。' } },
  { id: 'p8', name: { en: 'Marukame Udon', zh: '丸龜烏龍麵' }, kind: 'food', area: { en: 'Waikīkī', zh: '威基基' }, rating: 4.5, mins: 6, x: 64, y: 66, blurb: { en: 'Hand-pulled udon, the line is part of the ritual.', zh: '手打烏龍麵，排隊本身就是體驗。' } },
];

// ─── Packing list ───────────────────────────────────────────────
const PACK = {
  Essentials: [
    { id: 'e1', label: { en: 'Passport', zh: '護照' }, done: true },
    { id: 'e2', label: { en: 'Driver\u2019s license (rental)', zh: '駕照（租車用）' }, done: true },
    { id: 'e3', label: { en: 'Reef-safe sunscreen', zh: '友善珊瑚的防曬乳' }, done: false, note: { en: 'Required by HI law', zh: '夏威夷法規要求' } },
    { id: 'e4', label: { en: 'Reusable water bottle', zh: '環保水瓶' }, done: false },
  ],
  Beach: [
    { id: 'b1', label: { en: 'Swimsuits ×2', zh: '泳衣 ×2' }, done: true },
    { id: 'b2', label: { en: 'Snorkel mask', zh: '浮潛面鏡' }, done: false },
    { id: 'b3', label: { en: 'Quick-dry towel', zh: '快乾毛巾' }, done: false },
    { id: 'b4', label: { en: 'Beach sandals', zh: '海灘涼鞋' }, done: true },
  ],
  Hikes: [
    { id: 'h1', label: { en: 'Trail runners', zh: '越野鞋' }, done: false },
    { id: 'h2', label: { en: 'Daypack', zh: '單日背包' }, done: false },
    { id: 'h3', label: { en: 'Bug spray', zh: '防蚊液' }, done: true },
  ],
  Evenings: [
    { id: 'v1', label: { en: 'Light jacket', zh: '薄外套' }, done: false },
    { id: 'v2', label: { en: 'Aloha shirt', zh: 'Aloha 襯衫' }, done: true },
  ],
};

Object.assign(window, { STRINGS, TRIP, POIS, PACK });
