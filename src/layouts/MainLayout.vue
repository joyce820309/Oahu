<template>
  <q-layout view="lHh Lpr lFf" class="q-layout">

    <q-header class="app-header" elevated>
      <q-toolbar>
        <!-- 漢堡選單：sm 平板才顯示（xs 用底部導覽，md+ 抽屜自動展開） -->
        <q-btn flat dense round icon="menu" aria-label="Menu" class="gt-xs lt-md" @click="toggleLeftDrawer" />

        <q-toolbar-title class="row items-center no-wrap">
          <q-icon name="beach_access" size="xs" class="q-mr-xs" />
          <span class="text-weight-bold">Hele</span>
          <span class="text-caption q-ml-sm gt-xs" style="opacity:0.8">夏威夷慵懶行 2026</span>
        </q-toolbar-title>

        <q-btn flat dense round :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'" @click="$q.dark.toggle()" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="app-drawer flex column" :width="280">
      <q-scroll-area class="fit">

        <!-- 頁面導覽 -->
        <q-list padding class="q-px-sm q-pb-xs">
          <q-item-label header class="text-caption text-weight-bold drawer-section-label">PAGES</q-item-label>
          <q-item
            v-for="page in navPages"
            :key="page.to"
            clickable v-ripple
            :to="page.to"
            :exact="page.exact"
            active-class="app-drawer-active"
            class="q-mb-xs rounded-borders app-drawer-item"
            @click="closeDrawerOnSmall"
          >
            <q-item-section avatar>
              <q-icon :name="page.icon" size="sm" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium app-drawer-label">{{ page.label }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <q-separator class="q-mx-md q-my-sm" />

        <!-- 行程天數 -->
        <q-list padding class="q-px-sm">
          <q-item-label header class="text-caption text-weight-bold drawer-section-label">ITINERARY</q-item-label>
          <q-item
            v-for="d in itineraryData"
            :key="d.day"
            clickable v-ripple
            :active="activeDay === d.day"
            active-class="app-drawer-active"
            class="q-mb-sm rounded-borders transition-generic app-drawer-item"
            @click="goToDay(d.day)"
          >
            <q-item-section>
              <q-item-label overline class="text-weight-bold app-drawer-sublabel">
                DAY {{ d.day }} · {{ d.date }}
              </q-item-label>
              <q-item-label class="text-subtitle2 text-weight-medium app-drawer-label">
                {{ d.title }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- 底部導覽列：僅手機 (xs < 600px) -->
    <q-footer class="lt-sm bottom-nav-bar">
      <div class="bottom-nav-glass">
        <router-link
          v-for="tab in bottomTabs"
          :key="tab.to"
          :to="tab.to"
          :exact="tab.exact"
          custom
          v-slot="{ isActive, navigate }"
        >
          <button
            class="bottom-nav-tab"
            :class="{ active: isActive }"
            @click="navigate"
          >
            <div class="bottom-nav-pill">
              <q-icon :name="tab.icon" size="18px" />
            </div>
            <span>{{ tab.label }}</span>
          </button>
        </router-link>
      </div>
    </q-footer>

  </q-layout>
</template>

<script setup>
import { ref, provide, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeDay = ref(1)
const leftDrawerOpen = ref(false)

const closeDrawerOnSmall = () => {
  if (window.innerWidth < 1024) leftDrawerOpen.value = false
}

const selectDay = (day) => {
  activeDay.value = day
  closeDrawerOnSmall()
}

const goToDay = (day) => {
  selectDay(day)
  router.push('/days')
}

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const navPages = [
  { to: '/', label: 'Trip', icon: 'home', exact: true },
  { to: '/days', label: 'Days', icon: 'event', exact: false },
  { to: '/explore', label: 'Explore', icon: 'travel_explore', exact: false },
  { to: '/pack', label: 'Pack', icon: 'backpack', exact: false },
  { to: '/me', label: 'Me', icon: 'person', exact: false },
]

const bottomTabs = navPages

// 行程資料
const itineraryData = [
  {
    day: 1,
    date: '2026.07.18 (六)',
    title: '抵達阿羅哈！飯店Check-in與沙灘初體驗',
    events: [
      { time: '10:40', title: '抵達檀香山 (HNL)', desc: '班機抵達，準備感受夏威夷的陽光！', icon: 'flight' },
      { time: '11:30', title: '機場取車', desc: '前往租車中心辦理取車手續，開始自駕之旅。', icon: 'directions_car' },
      { time: '12:30', title: '午餐：Nico\'s Pier 38', desc: '順路前往漁港旁的熱門餐廳，品嚐新鮮的夏威夷生魚片飯 (Poke Bowl)。', icon: 'restaurant' },
      { time: '15:00', title: '入住：Alohilani Resort Waikiki Beach', desc: '辦理入住。這間飯店有無邊際泳池和超大水族箱，大廳非常漂亮。', icon: 'apartment' },
      { time: '16:00', title: '沙灘耍廢 (1/2)：Waikiki Beach', desc: '【願望達成】飯店過馬路就是威基基海灘！換上泳裝，租個躺椅，享受夏威夷的第一個傍晚。', icon: 'beach_access' },
      { time: '18:30', title: '晚餐：Duke\'s Waikiki', desc: '沙灘旁的經典美式夏威夷餐廳，氣氛輕鬆熱鬧，吃飽可以在威基基大街散步。', icon: 'restaurant' }
    ]
  },
  {
    day: 2,
    date: '2026.07.19 (日)',
    title: '朝聖侏儸紀與北岸悠閒時光',
    events: [
      { time: '09:00', title: '悠閒早餐', desc: '在飯店附近享用 Acai Bowl (巴西莓果碗)。', icon: 'local_cafe' },
      { time: '10:30', title: '古蘭尼牧場：UTV 越野車', desc: '【願望達成】自己駕駛越野車穿梭在侏儸紀山谷中，非常刺激好玩，記得帶換洗衣物。', icon: 'photo_camera' },
      { time: '13:30', title: '午餐：北岸蝦飯 Giovanni\'s', desc: '玩完越野車換洗後往北岸開，品嚐超人氣的經典蒜香奶油蝦飯。', icon: 'restaurant' },
      { time: '15:00', title: 'Haleiwa 哈雷瓦小鎮', desc: '充滿衝浪文化的慵懶小鎮。可以逛逛特色小店，必吃 Matsumoto 巨型彩虹冰。', icon: 'place' },
      { time: '17:00', title: '開車返回市區', desc: '沿著海岸線自駕回威基基，享受沿途風景。', icon: 'directions_car' },
      { time: '19:00', title: '晚餐：隨性安排', desc: '可以吃飯店附近的丸龜製麵或是特色居酒屋。', icon: 'restaurant' }
    ]
  },
  {
    day: 3,
    date: '2026.07.20 (一)',
    title: '上帝視角與血拼購物日',
    events: [
      { time: '09:00', title: '直升機環島體驗', desc: '【願望達成】參加直升機之旅，從高空俯瞰鑽石角、珍珠港與神聖瀑布。', icon: 'flight' },
      { time: '12:00', title: '午餐：Ala Moana Center', desc: '前往夏威夷最大的購物中心，在美食街或人氣餐廳用餐。', icon: 'restaurant' },
      { time: '13:30', title: '血拼時間：美系彩妝大採購', desc: '【願望達成】Ala Moana 內有各大百貨與 Sephora，是買美系化妝品的最佳戰場！', icon: 'shopping_bag' },
      { time: '16:00', title: '回飯店放戰利品', desc: '把滿滿的化妝品放回房間，換上稍微正式一點的服裝準備吃晚餐。', icon: 'apartment' },
      { time: '17:30', title: '日落晚餐：Michel\'s', desc: '【願望達成】夏威夷最浪漫的餐廳之一，緊鄰沙灘看夕陽吃法式料理。', icon: 'wb_twilight' }
    ]
  },
  {
    day: 4,
    date: '2026.07.21 (二)',
    title: '恐龍灣浮潛與天堂海灘',
    events: [
      { time: '08:30', title: '恐龍灣浮潛 (Hanauma Bay)', desc: '【願望達成】夏威夷最著名的浮潛聖地！這裡有受保護的珊瑚礁和豐富熱帶魚。需提前預約。', icon: 'waves' },
      { time: '11:30', title: '東海岸絕美公路自駕', desc: '沿著72號公路開，途經噴泉洞與 Makapuu Point，風景超級無敵！', icon: 'directions_car' },
      { time: '12:30', title: '午餐：Kailua 小鎮', desc: '前往 Kailua 小鎮，推薦吃 Boots & Kimo\'s 的夏威夷豆鬆餅。', icon: 'restaurant' },
      { time: '14:30', title: '沙灘耍廢 (2/2)：Lanikai Beach', desc: '【願望達成】全美最美海灘之一。沙子像麵粉，帶個野餐墊在這裡徹底放空。', icon: 'beach_access' },
      { time: '17:00', title: '返回威基基', desc: '回程順路去 Whole Foods Market 買點零食飲料。', icon: 'shopping_bag' },
      { time: '18:30', title: '晚餐：Waikiki 街頭尋寶', desc: '想吃牛排的話可以選擇 Ruth\'s Chris 或 Wolfgang\'s。', icon: 'restaurant' }
    ]
  },
  {
    day: 5,
    date: '2026.07.22 (三)',
    title: '飯店廢人模式與自由探索',
    events: [
      { time: '10:00', title: '睡到自然醒 / 飯店泳池', desc: '今天不排行程！好好享受飯店設施，在無邊際泳池畔點杯調酒看海。', icon: 'wb_sunny' },
      { time: '12:30', title: '午餐：Heavenly Island Lifestyle', desc: '超有氣氛的夏威夷有機網美早午餐。', icon: 'local_cafe' },
      { time: '14:00', title: '威基基大街最後補給', desc: '逛逛 Kalakaua 大街，買夏威夷豆巧克力、鳳梨造型餅乾當伴手禮。', icon: 'shopping_bag' },
      { time: '18:00', title: '晚餐：House Without A Key', desc: '露天餐廳有現場夏威夷音樂與草裙舞表演，用道地方式度過夜晚。', icon: 'restaurant' }
    ]
  },
  {
    day: 6,
    date: '2026.07.23 (四)',
    title: '馬背上的夏威夷與午後時光',
    events: [
      { time: '09:00', title: '海濱/山谷騎馬體驗', desc: '【願望達成】前往北岸體驗騎馬。沿著海岸線或原始森林漫步，超級放鬆。', icon: 'place' },
      { time: '12:30', title: '午餐：沿途景觀餐廳', desc: '騎馬結束後，在附近找間看海的餐廳悠閒吃頓午餐。', icon: 'restaurant' },
      { time: '15:00', title: '海濱下午茶 / 飯店休息', desc: '回到市區，找間海景咖啡廳享受夏威夷的微風。', icon: 'local_cafe' },
      { time: '18:30', title: '晚餐：歡送晚宴', desc: '選一間這幾天覺得不錯的餐廳，好好犒賞自己。', icon: 'restaurant' }
    ]
  },
  {
    day: 7,
    date: '2026.07.24 (五)',
    title: '帶著美好回憶，阿羅哈！',
    events: [
      { time: '08:00', title: '飯店早餐與散步', desc: '在威基基海灘做最後的巡禮。', icon: 'beach_access' },
      { time: '09:30', title: '辦理退房，前往機場', desc: '確認行李與護照，準備前往 HNL 機場。', icon: 'directions_car' },
      { time: '10:00', title: '機場還車', desc: '將愛車還回租車中心，搭乘接駁車前往航廈。', icon: 'apartment' },
      { time: '10:40', title: '機場報到', desc: '準備搭乘班機返回臺北 (TPE)。預計 7/26 15:35 抵達。', icon: 'flight' }
    ]
  }
]

// 計算當前選擇天數的資料
const activeData = computed(() => {
  return itineraryData.find(d => d.day === activeDay.value) || itineraryData[0]
})

provide('activeDay', activeDay)
provide('activeData', activeData)
provide('selectDay', selectDay)
provide('itineraryData', itineraryData)
</script>

<style scoped>
.transition-generic {
  transition: all 0.3s ease;
}
</style>
