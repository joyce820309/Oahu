/**
 * One-time seed script: uploads itinerary data to Firestore.
 *
 * Run once from the project root:
 *   node scripts/seed-firestore.mjs
 *
 * Structure written:
 *   trips/oahu-2026                          { title, startDate, endDate }
 *   trips/oahu-2026/days/day-1               { day, date, title, events: [...] }
 *   trips/oahu-2026/days/day-2               { day, date, title, events: [...] }
 *   ...
 *
 * events is an inline array on the day document — no subcollection needed.
 */

import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc } from 'firebase/firestore'


const firebaseConfig = {
  apiKey: 'AIzaSyBJQ5-sRSnJKgrdD_-5MMxogYam1LnKFL8',
  authDomain: 'hawaii-app-4fe27.firebaseapp.com',
  projectId: 'hawaii-app-4fe27',
  storageBucket: 'hawaii-app-4fe27.firebasestorage.app',
  messagingSenderId: '68447221865',
  appId: '1:68447221865:web:bddc3ff54919a3ae064af8',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const itineraryData = [
  {
    day: 1,
    date: '2026.07.18 (六)',
    title: { zh: '抵達阿羅哈！飯店 Check-in 與沙灘初體驗', en: 'Aloha! Hotel Check-in & First Beach Experience' },
    events: [
      { time: '10:40', icon: 'flight',         title: { zh: '抵達檀香山 (HNL)',                    en: 'Arrive at Honolulu (HNL)' },                      desc: { zh: '班機抵達，準備感受夏威夷的陽光！',                                                                       en: 'Flight lands — get ready to feel the Hawaiian sunshine!' },                                                   location: { zh: '檀香山國際機場 (HNL)',        en: 'Honolulu International Airport (HNL)' }, url: '' },
      { time: '11:30', icon: 'directions_car', title: { zh: '機場取車',                             en: 'Pick Up Rental Car' },                             desc: { zh: '前往租車中心辦理取車手續，開始自駕之旅。',                                                               en: 'Head to the rental car center and start your self-drive adventure.' },                                         location: { zh: '機場租車中心',                en: 'Airport Rental Car Center' },            url: '' },
      { time: '12:30', icon: 'restaurant',     title: { zh: "午餐：Nico's Pier 38",                 en: "Lunch: Nico's Pier 38" },                          desc: { zh: '順路前往漁港旁的熱門餐廳，品嚐新鮮的夏威夷生魚片飯 (Poke Bowl)。',                                      en: 'Stop at this popular harborside restaurant for fresh Hawaiian poke bowls.' },                                  location: { zh: '1133 N Nimitz Hwy, Honolulu', en: '1133 N Nimitz Hwy, Honolulu' },          url: 'https://nicospier38.com' },
      { time: '15:00', icon: 'apartment',      title: { zh: '入住：Alohilani Resort Waikiki Beach', en: 'Check-in: Alohilani Resort Waikiki Beach' },       desc: { zh: '辦理入住。這間飯店有無邊際泳池和超大水族箱，大廳非常漂亮。',                                             en: 'Check in. The resort features an infinity pool and a massive aquarium in the lobby.' },                        location: { zh: '2490 Kalakaua Ave, Waikiki',  en: '2490 Kalakaua Ave, Waikiki' },           url: 'https://alohilaniresort.com' },
      { time: '16:00', icon: 'beach_access',   title: { zh: '沙灘耍廢 (1/2)：Waikiki Beach',        en: 'Beach Time (1/2): Waikiki Beach' },                desc: { zh: '【願望達成】飯店過馬路就是威基基海灘！換上泳裝，租個躺椅，享受夏威夷的第一個傍晚。',                        en: "[Wish fulfilled] Cross the street and you're at Waikiki Beach! Put on your swimsuit, rent a lounge chair, and enjoy your first Hawaiian evening." }, location: { zh: 'Waikiki Beach, Honolulu', en: 'Waikiki Beach, Honolulu' }, url: '' },
      { time: '18:30', icon: 'restaurant',     title: { zh: "晚餐：Duke's Waikiki",                 en: "Dinner: Duke's Waikiki" },                         desc: { zh: '沙灘旁的經典美式夏威夷餐廳，氣氛輕鬆熱鬧，吃飽可以在威基基大街散步。',                                   en: 'A classic American-Hawaiian restaurant on the beach. Lively atmosphere — stroll Kalakaua Ave after dinner.' }, location: { zh: '2335 Kalakaua Ave, Waikiki',  en: '2335 Kalakaua Ave, Waikiki' },           url: 'https://www.dukeswaikiki.com' },
    ],
  },
  {
    day: 2,
    date: '2026.07.19 (日)',
    title: { zh: '朝聖侏儸紀與北岸悠閒時光', en: 'Jurassic Valley Pilgrimage & North Shore Chill' },
    events: [
      { time: '09:00', icon: 'local_cafe',     title: { zh: '悠閒早餐',               en: 'Leisurely Breakfast' },              desc: { zh: '在飯店附近享用 Acai Bowl (巴西莓果碗)。',                                                                en: 'Grab an acai bowl near the hotel.' },                                                                          location: { zh: 'Waikiki 周邊',                  en: 'Around Waikiki' },                 url: '' },
      { time: '10:30', icon: 'photo_camera',   title: { zh: '古蘭尼牧場：UTV 越野車', en: 'Kualoa Ranch: UTV Off-Road Tour' }, desc: { zh: '【願望達成】自己駕駛越野車穿梭在侏儸紀山谷中，非常刺激好玩，記得帶換洗衣物。',                              en: '[Wish fulfilled] Drive your own UTV through the Jurassic Valley — thrilling fun! Remember to bring a change of clothes.' }, location: { zh: '49-560 Kamehameha Hwy, Kaaawa', en: '49-560 Kamehameha Hwy, Kaaawa' }, url: 'https://www.kualoa.com' },
      { time: '13:30', icon: 'restaurant',     title: { zh: "午餐：北岸蝦飯 Giovanni's", en: "Lunch: Giovanni's Shrimp Truck" }, desc: { zh: '玩完越野車換洗後往北岸開，品嚐超人氣的經典蒜香奶油蝦飯。',                                                en: 'After cleaning up, drive to the North Shore for the legendary garlic butter shrimp plate.' },                  location: { zh: '56-505 Kamehameha Hwy, Kahuku', en: '56-505 Kamehameha Hwy, Kahuku' }, url: '' },
      { time: '15:00', icon: 'place',          title: { zh: 'Haleiwa 哈雷瓦小鎮',     en: 'Haleiwa Town' },                    desc: { zh: "充滿衝浪文化的慵懶小鎮。可以逛逛特色小店，必吃 Matsumoto 巨型彩虹冰。",                                    en: "A laid-back surf town. Browse the shops and don't miss Matsumoto's giant shave ice." },                        location: { zh: 'Haleiwa, North Shore',          en: 'Haleiwa, North Shore' },           url: '' },
      { time: '17:00', icon: 'directions_car', title: { zh: '開車返回市區',           en: 'Drive Back to Waikiki' },           desc: { zh: '沿著海岸線自駕回威基基，享受沿途風景。',                                                                 en: 'Scenic coastal drive back to Waikiki.' },                                                                      location: { zh: '',                              en: '' },                               url: '' },
      { time: '19:00', icon: 'restaurant',     title: { zh: '晚餐：隨性安排',         en: 'Dinner: Your Choice' },             desc: { zh: '可以吃飯店附近的丸龜製麵或是特色居酒屋。',                                                               en: 'Try Marugame Udon or a local izakaya near the hotel.' },                                                        location: { zh: 'Waikiki 周邊',                  en: 'Around Waikiki' },                 url: '' },
    ],
  },
  {
    day: 3,
    date: '2026.07.20 (一)',
    title: { zh: '上帝視角與血拼購物日', en: "God's Eye View & Shopping Day" },
    events: [
      { time: '09:00', icon: 'flight',       title: { zh: '直升機環島體驗',          en: 'Island Helicopter Tour' },    desc: { zh: '【願望達成】參加直升機之旅，從高空俯瞰鑽石角、珍珠港與神聖瀑布。',                    en: '[Wish fulfilled] Aerial tour over Diamond Head, Pearl Harbor, and Sacred Falls.' },                  location: { zh: 'Honolulu Airport（集合地點依業者）',         en: 'Honolulu Airport (check operator for meet point)' }, url: 'https://www.bluehawaiian.com' },
      { time: '12:00', icon: 'restaurant',   title: { zh: '午餐：Ala Moana Center', en: 'Lunch: Ala Moana Center' },   desc: { zh: '前往夏威夷最大的購物中心，在美食街或人氣餐廳用餐。',                                  en: "Head to Hawaii's largest mall for lunch at the food court or a popular restaurant." },               location: { zh: '1450 Ala Moana Blvd, Honolulu',              en: '1450 Ala Moana Blvd, Honolulu' },                url: 'https://www.alamoanacenter.com' },
      { time: '13:30', icon: 'shopping_bag', title: { zh: '血拼時間：美系彩妝大採購', en: 'Shopping: US Beauty Haul' }, desc: { zh: '【願望達成】Ala Moana 內有各大百貨與 Sephora，是買美系化妝品的最佳戰場！',              en: '[Wish fulfilled] Ala Moana has every major department store and a Sephora — the ultimate US beauty shopping battlefield!' }, location: { zh: "Ala Moana Center — Sephora / Macy's / Nordstrom", en: "Ala Moana Center — Sephora / Macy's / Nordstrom" }, url: '' },
      { time: '16:00', icon: 'apartment',    title: { zh: '回飯店放戰利品',          en: 'Drop Bags at Hotel' },        desc: { zh: '把滿滿的化妝品放回房間，換上稍微正式一點的服裝準備吃晚餐。',                            en: 'Drop off your haul and change into something slightly fancier for dinner.' },                         location: { zh: 'Alohilani Resort',                            en: 'Alohilani Resort' },                             url: '' },
      { time: '17:30', icon: 'wb_twilight',  title: { zh: "日落晚餐：Michel's",      en: "Sunset Dinner: Michel's" },   desc: { zh: '【願望達成】夏威夷最浪漫的餐廳之一，緊鄰沙灘看夕陽吃法式料理。',                        en: "[Wish fulfilled] One of Hawaii's most romantic restaurants — French cuisine with a beachside sunset view." }, location: { zh: '2895 Kalakaua Ave, Honolulu',            en: '2895 Kalakaua Ave, Honolulu' },               url: 'https://michelshawaii.com' },
    ],
  },
  {
    day: 4,
    date: '2026.07.21 (二)',
    title: { zh: '恐龍灣浮潛與天堂海灘', en: 'Hanauma Bay Snorkeling & Paradise Beach' },
    events: [
      { time: '08:30', icon: 'waves',          title: { zh: '恐龍灣浮潛 (Hanauma Bay)',     en: 'Snorkeling at Hanauma Bay' },          desc: { zh: '【願望達成】夏威夷最著名的浮潛聖地！這裡有受保護的珊瑚礁和豐富熱帶魚。需提前預約。', en: "[Wish fulfilled] Hawaii's most famous snorkeling spot — protected coral reef teeming with tropical fish. Reservations required." }, location: { zh: '100 Hanauma Bay Rd, Honolulu',  en: '100 Hanauma Bay Rd, Honolulu' },  url: 'https://hanaumabaystatepark.com' },
      { time: '11:30', icon: 'directions_car', title: { zh: '東海岸絕美公路自駕',           en: 'East Coast Scenic Drive' },             desc: { zh: '沿著72號公路開，途經噴泉洞與 Makapuu Point，風景超級無敵！',                          en: 'Drive Hwy 72, passing Halona Blowhole and Makapuu Point — breathtaking scenery!' },                  location: { zh: 'HI-72 Kalanianaole Hwy',        en: 'HI-72 Kalanianaole Hwy' },        url: '' },
      { time: '12:30', icon: 'restaurant',     title: { zh: '午餐：Kailua 小鎮',            en: 'Lunch: Kailua Town' },                  desc: { zh: "前往 Kailua 小鎮，推薦吃 Boots & Kimo's 的夏威夷豆鬆餅。",                           en: "Head to Kailua Town — try Boots & Kimo's famous macadamia nut pancakes." },                          location: { zh: '151 Hekili St, Kailua',         en: '151 Hekili St, Kailua' },         url: '' },
      { time: '14:30', icon: 'beach_access',   title: { zh: '沙灘耍廢 (2/2)：Lanikai Beach', en: 'Beach Time (2/2): Lanikai Beach' },    desc: { zh: '【願望達成】全美最美海灘之一。沙子像麵粉，帶個野餐墊在這裡徹底放空。',                en: "[Wish fulfilled] One of America's most beautiful beaches. Powdery sand — bring a mat and completely unwind." }, location: { zh: 'Mokulua Dr, Kailua',            en: 'Mokulua Dr, Kailua' },            url: '' },
      { time: '17:00', icon: 'shopping_bag',   title: { zh: '返回威基基',                   en: 'Return to Waikiki' },                   desc: { zh: '回程順路去 Whole Foods Market 買點零食飲料。',                                        en: 'Stop by Whole Foods Market on the way back for snacks and drinks.' },                                 location: { zh: 'Whole Foods — 388 Kamakee St',  en: 'Whole Foods — 388 Kamakee St' },  url: '' },
      { time: '18:30', icon: 'restaurant',     title: { zh: '晚餐：Waikiki 街頭尋寶',       en: 'Dinner: Waikiki Explorer' },            desc: { zh: "想吃牛排的話可以選擇 Ruth's Chris 或 Wolfgang's。",                                  en: "Craving steak? Try Ruth's Chris or Wolfgang's Steakhouse." },                                         location: { zh: 'Waikiki 周邊',                  en: 'Around Waikiki' },                url: '' },
    ],
  },
  {
    day: 5,
    date: '2026.07.22 (三)',
    title: { zh: '飯店廢人模式與自由探索', en: 'Hotel Lazy Day & Free Exploration' },
    events: [
      { time: '10:00', icon: 'wb_sunny',     title: { zh: '睡到自然醒 / 飯店泳池',           en: 'Sleep In / Hotel Pool' },                    desc: { zh: '今天不排行程！好好享受飯店設施，在無邊際泳池畔點杯調酒看海。',                  en: 'No schedule today! Enjoy the resort — order a cocktail by the infinity pool and watch the ocean.' }, location: { zh: 'Alohilani Resort 無邊際泳池',          en: 'Alohilani Resort Infinity Pool' }, url: '' },
      { time: '12:30', icon: 'local_cafe',   title: { zh: '午餐：Heavenly Island Lifestyle', en: 'Lunch: Heavenly Island Lifestyle' },          desc: { zh: '超有氣氛的夏威夷有機網美早午餐。',                                              en: 'A beautifully aesthetic Hawaiian organic brunch spot.' },                                              location: { zh: '342 Seaside Ave, Waikiki',             en: '342 Seaside Ave, Waikiki' },       url: '' },
      { time: '14:00', icon: 'shopping_bag', title: { zh: '威基基大街最後補給',              en: 'Last Souvenir Run on Kalakaua Ave' },         desc: { zh: '逛逛 Kalakaua 大街，買夏威夷豆巧克力、鳳梨造型餅乾當伴手禮。',                  en: 'Browse Kalakaua Ave for macadamia nut chocolates and pineapple cookies as gifts.' },                  location: { zh: 'Kalakaua Ave, Waikiki',                en: 'Kalakaua Ave, Waikiki' },          url: '' },
      { time: '18:00', icon: 'restaurant',   title: { zh: '晚餐：House Without A Key',       en: 'Dinner: House Without A Key' },              desc: { zh: '露天餐廳有現場夏威夷音樂與草裙舞表演，用道地方式度過夜晚。',                    en: 'Open-air restaurant with live Hawaiian music and hula dancing — end the night in style.' },            location: { zh: 'Halekulani Hotel, 2199 Kalia Rd',      en: 'Halekulani Hotel, 2199 Kalia Rd' }, url: 'https://www.halekulani.com/dining/house-without-a-key' },
    ],
  },
  {
    day: 6,
    date: '2026.07.23 (四)',
    title: { zh: '馬背上的夏威夷與午後時光', en: 'Horseback Hawaii & Afternoon Leisure' },
    events: [
      { time: '09:00', icon: 'place',       title: { zh: '海濱/山谷騎馬體驗',     en: 'Coastal / Valley Horseback Ride' }, desc: { zh: '【願望達成】前往北岸體驗騎馬。沿著海岸線或原始森林漫步，超級放鬆。',          en: '[Wish fulfilled] Head to the North Shore for a horseback ride along the coast or through pristine forest — incredibly relaxing.' }, location: { zh: 'Turtle Bay Resort / Gunstock Ranch, North Shore', en: 'Turtle Bay Resort / Gunstock Ranch, North Shore' }, url: 'https://www.turtlebayhawaii.com' },
      { time: '12:30', icon: 'restaurant', title: { zh: '午餐：沿途景觀餐廳',    en: 'Lunch: Scenic Restaurant Nearby' }, desc: { zh: '騎馬結束後，在附近找間看海的餐廳悠閒吃頓午餐。',                             en: 'After the ride, find a restaurant with an ocean view for a leisurely lunch.' },          location: { zh: 'North Shore 周邊',                                en: 'Around North Shore' },                             url: '' },
      { time: '15:00', icon: 'local_cafe', title: { zh: '海濱下午茶 / 飯店休息', en: 'Beachside Café / Hotel Rest' },     desc: { zh: '回到市區，找間海景咖啡廳享受夏威夷的微風。',                                  en: 'Back in the city, find an ocean-view café and enjoy the Hawaiian breeze.' },             location: { zh: 'Waikiki 周邊',                                    en: 'Around Waikiki' },                                 url: '' },
      { time: '18:30', icon: 'restaurant', title: { zh: '晚餐：歡送晚宴',        en: 'Farewell Dinner' },                 desc: { zh: '選一間這幾天覺得不錯的餐廳，好好犒賞自己。',                                  en: 'Pick a favorite from this trip and treat yourself to a proper farewell meal.' },         location: { zh: 'Waikiki 周邊',                                    en: 'Around Waikiki' },                                 url: '' },
    ],
  },
  {
    day: 7,
    date: '2026.07.24 (五)',
    title: { zh: '帶著美好回憶，阿羅哈！', en: 'Aloha — Until We Meet Again!' },
    events: [
      { time: '08:00', icon: 'beach_access',   title: { zh: '飯店早餐與散步',    en: 'Hotel Breakfast & Morning Walk' }, desc: { zh: '在威基基海灘做最後的巡禮。',                              en: 'One last stroll along Waikiki Beach.' },                                                    location: { zh: 'Waikiki Beach',               en: 'Waikiki Beach' },                                  url: '' },
      { time: '09:30', icon: 'directions_car', title: { zh: '辦理退房，前往機場', en: 'Check Out & Head to Airport' },    desc: { zh: '確認行李與護照，準備前往 HNL 機場。',                    en: 'Double-check luggage and passport, then head to HNL.' },                                   location: { zh: 'Alohilani Resort → HNL',      en: 'Alohilani Resort → HNL' },                         url: '' },
      { time: '10:00', icon: 'apartment',      title: { zh: '機場還車',          en: 'Return Rental Car' },              desc: { zh: '將愛車還回租車中心，搭乘接駁車前往航廈。',                en: 'Return the car at the rental center and take the shuttle to the terminal.' },              location: { zh: '檀香山機場租車中心',          en: 'Honolulu Airport Rental Car Center' },             url: '' },
      { time: '10:40', icon: 'flight',         title: { zh: '機場報到',          en: 'Airport Check-in' },              desc: { zh: '準備搭乘班機返回臺北 (TPE)。預計 7/26 15:35 抵達。',    en: 'Board your flight back to Taipei (TPE). Estimated arrival 7/26 at 15:35.' },              location: { zh: '檀香山國際機場 (HNL)',        en: 'Honolulu International Airport (HNL)' },          url: '' },
    ],
  },
]

async function seed() {
  const tripRef = doc(db, 'trips', 'oahu-2026')
  await setDoc(tripRef, {
    title: { zh: '夏威夷慵懶行 2026', en: 'Hawaii Lazy Trip 2026' },
    startDate: '2026-07-18',
    endDate: '2026-07-24',
  })
  console.log('✅ Trip document written')

  for (const dayData of itineraryData) {
    const dayRef = doc(db, 'trips', 'oahu-2026', 'days', `day-${dayData.day}`)
    await setDoc(dayRef, dayData)
    console.log(`✅ Day ${dayData.day} written (${dayData.events.length} events)`)
  }

  console.log('\n🎉 Seed complete! All data uploaded to Firestore.')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
