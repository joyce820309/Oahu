<template>
  <q-page class="q-pb-xl" style="background: transparent; position: relative;">
    TRIPPPP：{{ itineraryData }}
    <!-- Hero -->
    <div class="trip-hero">
      <div class="trip-hero-bg" />

      <div class="trip-hero-text fade-up">
        <div class="t-mono-cap" style="color: rgba(255,255,255,0.75); margin-bottom: 6px;">
          {{ t('trip_hero_title') }}
        </div>
        <div class="t-display trip-greeting">{{ t('trip_greeting') }}</div>
        <div style="font-size: 13px; margin-top: 4px; color: rgba(255,255,255,0.85);">
          {{ t('trip_hero_subtitle') }}
        </div>
      </div>

      <!-- Floating glass countdown card -->
      <div class="glass-strong trip-countdown-card fade-up">
        <div class="row justify-between items-start">
          <div>
            <div class="t-mono-cap">{{ t('trip_plan_title') }}</div>
            <div style="font-size: 16px; font-weight: 600; margin-top: 4px; color: var(--ink);">
              {{ t('trip_plan_date') }}
            </div>
            <div style="font-size: 12px; color: var(--ink-mute); margin-top: 2px;">{{ t('trip_companions') }}</div>
          </div>
          <div style="text-align: right;">
            <div class="t-display" style="font-size: 56px; color: var(--accent); line-height: 1;">
              {{ daysToGo }}
            </div>
            <div class="t-mono-cap" style="margin-top: 2px;">{{ t('trip_days_to_go') }}</div>
          </div>
        </div>
        <!-- Progress bar -->
        <div style="margin-top: 16px;">
          <div class="row justify-between" style="font-size: 11px; color: var(--ink-mute); margin-bottom: 6px;">
            <span>{{ t('trip_packing_label') }}</span><span>{{ packingPct }}%</span>
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
        <span class="quick-action-label">{{ t(a.labelKey) }}</span>
      </button>
    </div>

    <!-- Up next -->
    <div style="padding: 24px 16px 0;">
      <div class="section-head">
        <div>
          <div class="t-mono-cap">{{ t('trip_next_section') }}</div>
          <div class="section-title">{{ t('trip_next_subtitle') }}</div>
        </div>
        <button class="section-action" @click="goToDay(1)">→</button>
      </div>
      <div class="glass-strong up-next-card" @click="goToDay(1)">
        <div class="up-next-img">
          <div class="up-next-img-bg" />
          <div class="up-next-tag">{{ t('trip_next_tag') }}</div>
        </div>
        <div style="padding: 14px 16px;">
          <div style="font-size: 16px; font-weight: 600; color: var(--ink);">{{ t('trip_next_title') }}</div>
          <div style="font-size: 12px; color: var(--ink-mute); margin-top: 3px;">{{ t('trip_next_hint') }}</div>
        </div>
      </div>
    </div>

    <!-- Day mini timeline -->
    <div style="padding: 24px 0 0;">
      <div class="section-head" style="padding: 0 16px;">
        <div>
          <div class="t-mono-cap">{{ t('trip_overview_section') }}</div>
          <div class="section-title">{{ t('trip_overview_subtitle') }}</div>
        </div>
      </div>
      <div class="day-scroll-row">
        <button v-for="d in itineraryData" :key="d.day" class="glass day-mini-card" @click="goToDay(d.day)">
          <div class="t-mono-cap">Day {{ d.day }}</div>
          <div class="day-mini-title">{{ loc(d, 'title') }}</div>
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
          <div class="t-mono-cap">{{ t('trip_tips_section') }}</div>
          <div class="section-title">{{ t('trip_tips_title') }}</div>
        </div>
      </div>
      <div class="glass-strong" style="padding: 14px 16px; display: flex; flex-direction: column; gap: 12px;">
        <div v-for="tip in tips" :key="tip.key" class="tip-row">
          <div class="tip-icon" :style="{ background: tip.bg, color: tip.fg }">
            <q-icon :name="tip.icon" size="16px" />
          </div>
          <div style="font-size: 13px; color: var(--ink-soft); line-height: 1.5;">{{ t(tip.key) }}</div>
        </div>
      </div>
    </div>

  </q-page>
</template>

<script setup>
const { t } = useI18n()
const router = useRouter()
const itineraryData = inject('itineraryData')
const selectDay = inject('selectDay')
const loc = inject('loc')

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
  { key: 'days', icon: 'event', labelKey: 'nav_days', bg: 'var(--accent-soft)', fg: 'var(--accent-deep)', action: () => router.push('/days') },
  { key: 'booking', icon: 'confirmation_number', labelKey: 'trip_booking', bg: 'var(--lagoon-soft)', fg: 'var(--lagoon)' },
  { key: 'pack', icon: 'backpack', labelKey: 'nav_pack', bg: 'var(--warm-soft)', fg: 'var(--warm)', action: () => router.push('/pack') },
  { key: 'explore', icon: 'travel_explore', labelKey: 'nav_explore', bg: 'var(--hibiscus-soft)', fg: 'var(--hibiscus)', action: () => router.push('/explore') },
]

const tips = [
  { key: 'tip_reef_sunscreen', icon: 'wb_sunny', bg: 'var(--warm-soft)', fg: 'var(--warm)' },
  { key: 'tip_hanauma', icon: 'waves', bg: 'var(--lagoon-soft)', fg: 'var(--lagoon)' },
  { key: 'tip_utv', icon: 'directions_car', bg: 'var(--hibiscus-soft)', fg: 'var(--hibiscus)' },
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
    radial-gradient(ellipse at 80% 15%, rgba(255, 255, 255, 0.18) 0%, transparent 55%),
    radial-gradient(ellipse at 15% 75%, rgba(255, 183, 92, 0.22) 0%, transparent 50%);
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
  background: rgba(255, 255, 255, 0.85);
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

.day-scroll-row::-webkit-scrollbar {
  display: none;
}

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
