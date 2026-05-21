<template>
  <q-page class="q-pa-lg">
    <div class="text-overline q-mb-xs" style="opacity:0.55">DISCOVER O'AHU</div>
    <div class="text-h4 text-weight-bolder q-mb-lg" style="color:#56C6CC">Explore</div>

    <!-- Day selector -->
    <div class="day-chips-wrap q-mb-lg">
      <div class="day-chips-row">
        <button
          v-for="d in itineraryData"
          :key="d.day"
          class="day-chip"
          :class="{ active: localDay === d.day }"
          @click="localDay = d.day"
        >
          <span class="chip-day">Day {{ d.day }}</span>
          <span class="chip-date">{{ d.date.replace('2026.', '').replace(/\s*\(.\)/, '') }}</span>
        </button>
      </div>
    </div>

    <!-- Day title -->
    <div class="q-mb-md">
      <div class="text-caption text-weight-bold" style="opacity:0.55; letter-spacing:0.08em;">
        DAY {{ localDay }} · {{ localDayData.date }}
      </div>
      <div class="text-h6 text-weight-bold" style="color: var(--ink);">
        {{ loc(localDayData, 'title') }}
      </div>
    </div>

    <!-- Static Map -->
    <div class="map-card glass-strong q-mb-lg">
      <template v-if="!mapsApiKey">
        <div class="map-placeholder">
          <q-icon name="map" size="3rem" color="primary" />
          <div class="text-subtitle2 q-mt-md text-weight-bold">{{ t('explore_day_route') }}</div>
          <div class="text-caption q-mt-xs" style="opacity:0.6">設定 VITE_GOOGLE_MAPS_API_KEY 後顯示地圖</div>
        </div>
      </template>
      <template v-else-if="locationsForDay.length === 0">
        <div class="map-placeholder">
          <q-icon name="location_off" size="3rem" color="grey-5" />
          <div class="text-caption q-mt-md" style="opacity:0.6">{{ t('explore_no_location') }}</div>
        </div>
      </template>
      <template v-else>
        <img :src="staticMapUrl" :alt="`Day ${localDay} route map`" class="map-img" loading="lazy" />
        <a v-if="directionsUrl" :href="directionsUrl" target="_blank" rel="noopener" class="maps-link-overlay">
          <q-icon name="open_in_new" size="13px" style="margin-right:4px;" />
          {{ t('explore_open_maps') }}
        </a>
      </template>
    </div>

    <!-- Stop list -->
    <div class="section-label q-mb-sm">{{ t('explore_stops') }}</div>
    <div class="stop-list q-mb-xl">
      <div v-for="(stop, idx) in locationsForDay" :key="'stop-' + idx" class="stop-row">
        <div class="stop-index glass-strong">{{ idx + 1 }}</div>
        <div class="stop-dot-col">
          <div class="stop-line" v-if="idx < locationsForDay.length - 1" />
        </div>
        <div class="stop-info">
          <div class="stop-title">{{ loc(stop, 'title') }}</div>
          <div v-if="loc(stop, 'location')" class="stop-location">
            <q-icon name="place" size="11px" style="margin-right:3px; flex-shrink:0;" />
            {{ loc(stop, 'location') }}
          </div>
          <div class="stop-time">{{ stop.timeStart || stop.time || '' }}{{ stop.timeEnd ? ' – ' + stop.timeEnd : '' }}</div>
        </div>
        <a :href="`https://maps.google.com?q=${encodeURIComponent(getLocationEn(stop))}`"
          target="_blank" rel="noopener" class="stop-nav-btn" @click.stop>
          <q-icon name="navigation" size="14px" />
        </a>
      </div>
    </div>

    <!-- Transit list（directions_car 的行程） -->
    <template v-if="transitForDay.length > 0">
      <div class="section-label q-mb-sm">{{ t('explore_transit') }}</div>
      <div class="transit-list">
        <div v-for="(ev, idx) in transitForDay" :key="'transit-' + idx" class="transit-row glass-strong">
          <div class="transit-icon">
            <q-icon :name="ev.icon || 'directions_car'" size="16px" style="color: var(--ink-mute);" />
          </div>
          <div class="transit-info">
            <div class="transit-title">{{ loc(ev, 'title') }}</div>
            <div v-if="loc(ev, 'desc')" class="transit-desc">{{ loc(ev, 'desc') }}</div>
          </div>
          <div class="transit-time">{{ ev.timeStart || ev.time || '' }}</div>
        </div>
      </div>
    </template>

  </q-page>
</template>

<script setup>
const { t } = useI18n()

const activeDay = inject('activeDay')
const itineraryData = inject('itineraryData')
const loc = inject('loc')

const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''

const localDay = ref(activeDay.value)
watch(activeDay, (val) => { localDay.value = val })

const localDayData = computed(
  () => itineraryData.value.find((d) => d.day === localDay.value) || {}
)

const getLocationEn = (event) => {
  const l = event.location
  if (!l) return ''
  if (typeof l === 'object') return l.en || l.zh || ''
  return l
}

// 有地點的行程 → 地圖 + stop list
const locationsForDay = computed(() =>
  (localDayData.value.events || []).filter((e) => !!getLocationEn(e))
)

// 交通行程（directions_car icon）→ transit list
const TRANSIT_ICONS = ['directions_car', 'directions_bus', 'directions_transit', 'flight', 'flight_takeoff', 'local_taxi']
const transitForDay = computed(() =>
  (localDayData.value.events || []).filter((e) => TRANSIT_ICONS.includes(e.icon))
)

// Google Maps Static API — 不指定 zoom，讓 Google 自動 fit bounds
const staticMapUrl = computed(() => {
  if (!mapsApiKey || locationsForDay.value.length === 0) return ''
  const base = 'https://maps.googleapis.com/maps/api/staticmap'
  const size = '800x400'
  const markers = locationsForDay.value
    .map((e, i) => `markers=color:0x56C6CC%7Clabel:${i + 1}%7C${encodeURIComponent(getLocationEn(e))}`)
    .join('&')
  const pathPoints = locationsForDay.value.map((e) => encodeURIComponent(getLocationEn(e))).join('%7C')
  const path = locationsForDay.value.length > 1
    ? `path=color:0x56C6CCcc%7Cweight:3%7C${pathPoints}`
    : ''
  return `${base}?size=${size}&scale=2&${markers}${path ? '&' + path : ''}&key=${mapsApiKey}`
})

// Google Maps Directions URL（多點路線）
const directionsUrl = computed(() => {
  const locs = locationsForDay.value
  if (locs.length === 0) return ''
  if (locs.length === 1)
    return `https://maps.google.com?q=${encodeURIComponent(getLocationEn(locs[0]))}`
  const origin = encodeURIComponent(getLocationEn(locs[0]))
  const destination = encodeURIComponent(getLocationEn(locs[locs.length - 1]))
  const waypoints = locs.slice(1, -1).map((e) => encodeURIComponent(getLocationEn(e))).join('|')
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints ? '&waypoints=' + waypoints : ''}`
})
</script>

<style scoped>
.section-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-mute);
}

/* ── Day chip selector ── */
.day-chips-wrap { overflow: hidden; }

.day-chips-row {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;
}
.day-chips-row::-webkit-scrollbar { display: none; }

.day-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 14px;
  border-radius: 14px;
  border: 1px solid var(--surface-stroke);
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.22s;
  background: var(--surface-translucent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  font-family: var(--font-sans);
}
.day-chip.active {
  background: var(--accent-soft);
  border-color: var(--accent);
}
.chip-day {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--ink-mute);
  text-transform: uppercase;
}
.day-chip.active .chip-day { color: var(--accent-deep); }
.chip-date { font-size: 10px; color: var(--ink-mute); }

/* ── Map card ── */
.map-card {
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  min-height: 180px;
}
.map-img {
  width: 100%;
  display: block;
  object-fit: cover;
}
.map-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  text-align: center;
}
.maps-link-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--accent-deep);
  text-decoration: none;
  padding: 10px 16px;
  background: var(--accent-soft);
  transition: opacity 0.15s;
}
.maps-link-overlay:active { opacity: 0.7; }

/* ── Stop list ── */
.stop-list { display: flex; flex-direction: column; }

.stop-row {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  margin-bottom: 8px;
}
.stop-index {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: var(--accent-deep);
  margin-top: 10px;
}
.stop-dot-col { flex-shrink: 0; width: 0; position: relative; }
.stop-line {
  position: absolute;
  top: 36px;
  bottom: -8px;
  left: -6px;
  width: 1px;
  background: var(--surface-stroke);
}
.stop-info {
  flex: 1;
  padding: 10px 12px;
  background: var(--surface-translucent);
  border: 1px solid var(--surface-stroke);
  border-radius: 14px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.stop-title { font-size: 13px; font-weight: 600; color: var(--ink); margin-bottom: 3px; }
.stop-location {
  display: flex;
  align-items: center;
  font-size: 11px;
  color: var(--ink-mute);
  margin-bottom: 2px;
}
.stop-time { font-size: 11px; color: var(--ink-faint, var(--ink-mute)); }
.stop-nav-btn {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--lagoon-soft, rgba(86,198,204,0.12));
  color: var(--lagoon, #56C6CC);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  margin-top: 6px;
  transition: opacity 0.15s;
}
.stop-nav-btn:active { opacity: 0.7; }

/* ── Transit list ── */
.transit-list { display: flex; flex-direction: column; gap: 8px; }

.transit-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 14px;
}
.transit-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--surface-stroke);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}
.transit-info { flex: 1; }
.transit-title { font-size: 13px; font-weight: 600; color: var(--ink); margin-bottom: 3px; }
.transit-desc { font-size: 11px; color: var(--ink-mute); line-height: 1.5; }
.transit-time {
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 600;
  color: var(--ink-mute);
  padding-top: 2px;
}
</style>
