<template>
  <q-layout view="lHh Lpr lFf" class="q-layout">

    <q-header class="app-header" elevated>
      <q-toolbar>
        <!-- 漢堡選單：sm 平板才顯示（xs 用底部導覽，md+ 抽屜自動展開） -->
        <q-btn flat dense round icon="menu" aria-label="Menu" class="gt-xs lt-md" @click="toggleLeftDrawer" />

        <q-toolbar-title class="row items-center no-wrap">
          <q-icon name="beach_access" size="xs" class="q-mr-xs" />
          <span class="text-weight-bold">Hele</span>
          <span class="text-caption q-ml-sm gt-xs" style="opacity:0.8">{{ t('trip_hero_title') }}</span>
        </q-toolbar-title>

        <q-btn flat dense round @click="toggleLocale"
          style="font-size: 11px; font-weight: 700; letter-spacing: 0.02em; min-width: 36px;">
          {{ locale === 'zh-TW' ? 'EN' : '中' }}
        </q-btn>
        <q-btn flat dense round :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'" @click="$q.dark.toggle()" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="app-drawer flex column" :width="280">
      <q-scroll-area class="fit">

        <!-- 頁面導覽 -->
        <q-list padding class="q-px-sm q-pb-xs">
          <q-item-label header class="text-caption text-weight-bold drawer-section-label">{{ t('drawer_pages')
            }}</q-item-label>
          <q-item v-for="page in navPages" :key="page.to" clickable v-ripple :to="page.to" :exact="page.exact"
            active-class="app-drawer-active" class="q-mb-xs rounded-borders app-drawer-item"
            @click="closeDrawerOnSmall">
            <q-item-section avatar>
              <q-icon :name="page.icon" size="sm" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium app-drawer-label">{{ t(page.labelKey) }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <template v-if="route.path === '/days'">
          <q-separator class="q-mx-md q-my-sm" />

          <!-- 行程天數 -->
          <q-list padding class="q-px-sm">
            <q-item-label header class="text-caption text-weight-bold drawer-section-label">{{ t('drawer_itinerary')
              }}</q-item-label>
            <q-item v-for="d in days" :key="d.day" clickable v-ripple :active="activeDay === d.day"
              active-class="app-drawer-active" class="q-mb-sm rounded-borders transition-generic app-drawer-item"
              @click="goToDay(d.day)">
              <q-item-section>
                <q-item-label overline class="text-weight-bold app-drawer-sublabel">
                  DAY {{ d.day }} · {{ d.date }}
                </q-item-label>
                <q-item-label class="text-subtitle2 text-weight-medium app-drawer-label">
                  {{ loc(d, 'title') }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </template>

      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </q-page-container>

    <!-- 底部導覽列：僅手機 (xs < 600px) -->
    <q-footer class="lt-sm bottom-nav-bar">
      <div class="bottom-nav-glass">
        <router-link v-for="tab in navPages" :key="tab.to" :to="tab.to" custom
          v-slot="{ isExactActive, isActive, navigate }">
          <button class="bottom-nav-tab" :class="{ active: tab.exact ? isExactActive : isActive }" @click="navigate">
            <div class="bottom-nav-pill">
              <q-icon :name="tab.icon" size="18px" />
            </div>
            <span>{{ t(tab.labelKey) }}</span>
          </button>
        </router-link>
      </div>
    </q-footer>

  </q-layout>
</template>

<script setup>
import { useTripStore } from 'src/stores/trip-store'
import { storeToRefs } from 'pinia'

const router = useRouter()
const route = useRoute()
const { locale, t } = useI18n()
locale.value = 'zh-TW'

const toggleLocale = () => {
  locale.value = locale.value === 'zh-TW' ? 'en-US' : 'zh-TW'
}

// Pick the right language field from a bilingual object.
// Falls back to the other language if the requested one is empty.
const loc = (obj, field) => {
  const bilingual = obj[field]
  if (!bilingual || typeof bilingual !== 'object') return bilingual ?? ''
  const lang = locale.value === 'zh-TW' ? 'zh' : 'en'
  return bilingual[lang] || bilingual.zh || bilingual.en || ''
}

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
  { to: '/', labelKey: 'nav_trip', icon: 'home', exact: true },
  { to: '/days', labelKey: 'nav_days', icon: 'event', exact: false },
  { to: '/booking', labelKey: 'nav_booking', icon: 'confirmation_number', exact: false },
  { to: '/explore', labelKey: 'nav_explore', icon: 'travel_explore', exact: false },
  { to: '/pack', labelKey: 'nav_pack', icon: 'backpack', exact: false },
  { to: '/me', labelKey: 'nav_me', icon: 'person', exact: false },
]

const tripStore = useTripStore()
const { days, loading: firestoreLoading } = storeToRefs(tripStore)
tripStore.fetchDays()

const activeData = computed(() =>
  days.value.find((d) => d.day === activeDay.value) || days.value[0] || {},
)

provide('activeDay', activeDay)
provide('activeData', activeData)
provide('selectDay', selectDay)
provide('itineraryData', days)
provide('locale', locale)
provide('loc', loc)
provide('firestoreLoading', firestoreLoading)
</script>

<style scoped>
.transition-generic {
  transition: all 0.3s ease;
}
</style>
