<template>
  <q-page class="q-pb-xl" style="background: transparent; position: relative;">

    <!-- Hero -->
    <div class="trip-hero">
      <!-- Sky gradient -->
      <div class="trip-hero-bg" />

      <!-- Header text -->
      <div class="trip-hero-text fade-up">
        <div class="t-mono-cap" style="color: rgba(255,255,255,0.75); margin-bottom: 6px;">
          HELE · 夏威夷慵懶行 2026
        </div>
        <div class="t-display trip-greeting">Aloha, Lin 🌺</div>
        <div style="font-size: 13px; margin-top: 4px; color: rgba(255,255,255,0.85);">
          O'ahu · 7 天 6 夜
        </div>
      </div>

      <!-- Floating glass countdown card -->
      <div class="glass-strong trip-countdown-card fade-up">
        <div class="row justify-between items-start">
          <div>
            <div class="t-mono-cap">行程規劃</div>
            <div style="font-size: 16px; font-weight: 600; margin-top: 4px; color: var(--ink);">
              2026.07.18 – 07.24
            </div>
            <div style="font-size: 12px; color: var(--ink-mute); margin-top: 2px;">2 位旅伴</div>
          </div>
          <div style="text-align: right;">
            <div class="t-display" style="font-size: 56px; color: var(--accent); line-height: 1;">
              {{ daysToGo }}
            </div>
            <div class="t-mono-cap" style="margin-top: 2px;">DAYS TO GO</div>
          </div>
        </div>
        <!-- Progress bar -->
        <div style="margin-top: 16px;">
          <div class="row justify-between" style="font-size: 11px; color: var(--ink-mute); margin-bottom: 6px;">
            <span>行前準備進度</span><span>{{ packingPct }}%</span>
          </div>
          <div style="height: 4px; background: var(--surface-stroke); border-radius: 2px;">
            <div :style="{ width: packingPct + '%' }"
              style="height: 100%; background: var(--accent); border-radius: 2px; transition: width 0.4s ease;" />
          </div>
        </div>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="quick-grid">
      <button v-for="a in quickActions" :key="a.key" class="quick-action-btn glass" @click="a.action && a.action()">
        <div class="quick-action-icon" :style="{ background: a.bg, color: a.fg }">
          <q-icon :name="a.icon" size="18px" />
        </div>
        <span class="quick-action-label">{{ a.label }}</span>
      </button>
    </div>

    <!-- Up next -->
    <div style="padding: 24px 16px 0;">
      <div class="section-head">
        <div>
          <div class="t-mono-cap">即將出發</div>
          <div class="section-title">第一站行程</div>
        </div>
        <button class="section-action" @click="goToDay(1)">→</button>
      </div>
      <div class="glass-strong up-next-card" @click="goToDay(1)">
        <div class="up-next-img">
          <div class="up-next-img-bg" />
          <div class="up-next-tag">Day 1 · 16:00</div>
        </div>
        <div style="padding: 14px 16px;">
          <div style="font-size: 16px; font-weight: 600; color: var(--ink);">威基基海灘日落</div>
          <div style="font-size: 12px; color: var(--ink-mute); margin-top: 3px;">飯店步行 6 分鐘 · 帶薄外套</div>
        </div>
      </div>
    </div>

    <!-- Day mini timeline -->
    <div style="padding: 24px 0 0;">
      <div class="section-head" style="padding: 0 16px;">
        <div>
          <div class="t-mono-cap">行程總覽</div>
          <div class="section-title">7 天 6 夜</div>
        </div>
      </div>
      <div class="day-scroll-row">
        <button
          v-for="d in itineraryData"
          :key="d.day"
          class="glass day-mini-card"
          @click="goToDay(d.day)"
        >
          <div class="t-mono-cap">Day {{ d.day }}</div>
          <div class="day-mini-title">{{ d.title }}</div>
          <div style="font-size: 11px; color: var(--ink-mute);">{{ d.date.replace('2026.', '') }}</div>
          <div style="display: flex; gap: 3px; margin-top: 6px;">
            <div v-for="i in Math.min(d.events.length, 5)" :key="i"
              style="width: 14px; height: 3px; border-radius: 2px; background: var(--accent);" />
          </div>
        </button>
      </div>
    </div>

    <!-- Local tips -->
    <div style="padding: 24px 16px 0;">
      <div class="section-head">
        <div>
          <div class="t-mono-cap">出發提醒</div>
          <div class="section-title">行前小叮嚀</div>
        </div>
      </div>
      <div class="glass-strong" style="padding: 14px 16px; display: flex; flex-direction: column; gap: 12px;">
        <div v-for="tip in tips" :key="tip.text" class="tip-row">
          <div class="tip-icon" :style="{ background: tip.bg, color: tip.fg }">
            <q-icon :name="tip.icon" size="16px" />
          </div>
          <div style="font-size: 13px; color: var(--ink-soft); line-height: 1.5;">{{ tip.text }}</div>
        </div>
      </div>
    </div>

  </q-page>
</template>

<script setup>
import { computed, inject } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const itineraryData = inject('itineraryData')
const selectDay = inject('selectDay')

const goToDay = (day) => {
  selectDay(day)
  router.push('/days')
}

const daysToGo = computed(() => {
  const diff = new Date('2026-07-18') - new Date()
  return Math.max(0, Math.ceil(diff / 86400000))
})

const packingPct = 36

const quickActions = [
  { key: 'days',    icon: 'event',               label: '行程', bg: 'var(--accent-soft)',   fg: 'var(--accent-deep)', action: () => router.push('/days') },
  { key: 'booking', icon: 'confirmation_number',  label: '訂位', bg: 'var(--lagoon-soft)',   fg: 'var(--lagoon)' },
  { key: 'pack',    icon: 'backpack',             label: '打包', bg: 'var(--warm-soft)',     fg: 'var(--warm)',        action: () => router.push('/pack') },
  { key: 'explore', icon: 'travel_explore',       label: '探索', bg: 'var(--hibiscus-soft)', fg: 'var(--hibiscus)',    action: () => router.push('/explore') },
]

const tips = [
  { icon: 'wb_sunny',       bg: 'var(--warm-soft)',     fg: 'var(--warm)',     text: '只能使用「友善珊瑚」防曬乳，夏威夷州法律規定' },
  { icon: 'waves',          bg: 'var(--lagoon-soft)',   fg: 'var(--lagoon)',   text: 'Hanauma 灣需提前 48 小時搶票，通常 5 分鐘秒殺！' },
  { icon: 'directions_car', bg: 'var(--hibiscus-soft)', fg: 'var(--hibiscus)', text: 'UTV 越野車至少提前 1.5–2 個月在官網預訂' },
]
</script>

<style scoped>
.trip-hero {
  position: relative;
  height: 340px;
  margin-bottom: 56px;
}

.trip-hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(160deg, var(--sky-1) 0%, var(--sky-2) 28%, var(--sky-3) 62%, var(--sky-4) 100%);
}

.trip-hero-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 80% 15%, rgba(255,255,255,0.18) 0%, transparent 55%),
    radial-gradient(ellipse at 15% 75%, rgba(255,183,92,0.22) 0%, transparent 50%);
  pointer-events: none;
}

.trip-hero-text {
  position: absolute;
  top: 56px;
  left: 18px;
  right: 18px;
  color: #fff;
}

.trip-greeting {
  font-size: 44px;
  color: #fff;
  margin-top: 6px;
}

.trip-countdown-card {
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: -48px;
  padding: 18px 20px;
}

.quick-grid {
  padding: 0 16px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.quick-action-btn {
  padding: 14px 8px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  border: none;
  font-family: var(--font-sans);
}

.quick-action-icon {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quick-action-label {
  font-size: 11px;
  font-weight: 500;
  color: var(--ink-soft);
}

.section-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-title {
  font-size: 19px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--ink);
  margin-top: 4px;
}

.section-action {
  background: transparent;
  border: none;
  color: var(--accent-deep);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  font-family: var(--font-sans);
}

.up-next-card {
  overflow: hidden;
  cursor: pointer;
}

.up-next-img {
  position: relative;
  height: 130px;
}

.up-next-img-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--sky-1) 0%, var(--sky-3) 50%, var(--sky-4) 100%);
}

.up-next-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(8px);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #2E6962;
}

.day-scroll-row {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 0 16px;
  scrollbar-width: none;
}
.day-scroll-row::-webkit-scrollbar { display: none; }

.day-mini-card {
  min-width: 110px;
  flex-shrink: 0;
  padding: 14px 12px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
  border: none;
  font-family: var(--font-sans);
}

.day-mini-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--ink);
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tip-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.tip-icon {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}
</style>
