<template>
  <q-page class="q-pb-xl" style="background: transparent;">


    <!-- Day chip selector: phones only -->
    <div class="day-chips-wrap lt-sm">
      <div class="day-chips-row">
        <button v-for="d in itineraryData" :key="d.day" class="day-chip" :class="{ active: activeDay === d.day }"
          @click="selectDay(d.day)">
          Day {{ d.day }}
        </button>
      </div>
    </div>

    <!-- Itinerary tab bar: tablet only (sm, drawer hidden but not yet open) -->
    <div class="itinerary-bar gt-xs lt-md">
      <div class="itinerary-bar-inner">
        <button v-for="d in itineraryData" :key="d.day" class="itinerary-tab" :class="{ active: activeDay === d.day }"
          @click="selectDay(d.day)">
          <span class="itinerary-tab-day">DAY {{ d.day }}</span>
          <span class="itinerary-tab-date">{{ d.date.replace('2026.', '').replace(/\s*\(.\)/, '') }}</span>
          <span class="itinerary-tab-title">{{ loc(d, 'title') }}</span>
        </button>
      </div>
    </div>

    <!-- Day Hero -->
    <div class="q-pa-lg text-center relative-position overflow-hidden day-hero">
      <div class="text-h5 text-weight-bolder q-mb-xs relative-position" style="z-index:1; color: #fff;">
        {{ loc(activeData, 'title') }}
      </div>
      <div class="text-subtitle2 text-weight-medium relative-position" style="z-index:1; opacity:0.82; color: #fff;">
        Day {{ activeDay }} · {{ activeData.date }}
      </div>
      <!-- Edit pencil button -->
      <button v-if="!editMode" class="edit-fab" @click="enterEditMode" :aria-label="t('days_edit_hint')">
        <q-icon name="edit" size="18px" />
      </button>
    </div>

    <!-- Edit mode banner -->
    <Transition name="edit-banner">
      <div v-if="editMode" class="edit-banner">
        <div class="edit-banner-left">
          <q-icon name="drag_indicator" size="18px" style="opacity:0.7;" />
          <span>{{ t('days_edit_hint') }}</span>
        </div>
        <button class="edit-done-btn" @click="exitEditMode">
          {{ t('days_edit_done') }}
        </button>
      </div>
    </Transition>

    <!-- Timeline -->
    <div style="padding: 16px; max-width: 800px; margin: 0 auto;">

      <VueDraggable v-model="localEvents" :disabled="!editMode" :animation="180" ghost-class="dnd-ghost-row"
        chosen-class="dnd-chosen-row" class="timeline" :class="{ 'timeline-edit': editMode }">
        <div v-for="(event, idx) in localEvents" :key="event.time" class="timeline-row">

          <!-- Time column -->
          <div class="timeline-time" :class="{ 'timeline-time-edit': editMode }">
            <div style="font-size: 12px; font-weight: 600; color: var(--ink);">{{ event.time }}</div>
          </div>

          <!-- Dot -->
          <div class="timeline-dot-col">
            <div class="timeline-line" v-if="idx < localEvents.length - 1" />
            <div class="timeline-dot">
              <q-icon :name="event.icon" size="14px" style="color: var(--accent-deep);" />
            </div>
          </div>

          <!-- Card -->
          <div class="glass-strong timeline-card" :class="{ expanded: expandedIdx === idx && !editMode }"
            @click="!editMode && toggleExpand(idx)" @pointerdown="longPressDown">
            <div class="card-collapsed">
              <div class="card-title">{{ loc(event, 'title') }}</div>
              <div v-if="loc(event, 'location')" class="card-location">
                <q-icon name="place" size="12px" style="margin-right: 3px; flex-shrink: 0;" />
                {{ loc(event, 'location') }}
              </div>
            </div>

            <div v-if="expandedIdx === idx && !editMode" class="card-expanded">
              <div class="card-divider" />
              <div class="card-desc">{{ loc(event, 'desc') }}</div>
              <a v-if="event.url" :href="event.url" target="_blank" rel="noopener" class="card-url" @click.stop>
                <q-icon name="open_in_new" size="12px" style="margin-right: 4px;" />
                {{ t('days_official_site') }}
              </a>
            </div>

            <div v-if="!editMode" class="card-chevron">
              <q-icon :name="expandedIdx === idx ? 'expand_less' : 'expand_more'" size="16px"
                style="color: var(--ink-faint);" />
            </div>
          </div>
        </div>
      </VueDraggable>

      <!-- Day 2：UTV 注意事項 -->
      <div v-if="activeDay === 2" class="tip-card tip-card-orange q-mt-lg">
        <div class="tip-card-header">
          <div class="tip-icon-circle" style="background: var(--warm-soft); color: var(--warm);">
            <q-icon name="info" size="18px" />
          </div>
          <span style="font-size: 16px; font-weight: 700; color: var(--ink);">{{ t('day2_tip_title') }}</span>
        </div>
        <div style="font-size: 13px; color: var(--ink-soft); line-height: 1.6;">
          <p style="margin: 0 0 8px;">{{ t('day2_tip_intro') }}</p>
          <ul style="margin: 0; padding-left: 16px;">
            <li class="q-mb-xs"><strong>{{ t('day2_tip_1_label') }}</strong> {{ t('day2_tip_1') }}</li>
            <li class="q-mb-xs"><strong>{{ t('day2_tip_2_label') }}</strong> {{ t('day2_tip_2') }}</li>
            <li class="q-mb-xs"><strong>{{ t('day2_tip_3_label') }}</strong> {{ t('day2_tip_3') }}</li>
          </ul>
          <div style="font-size: 11px; color: var(--warm); margin-top: 8px; font-weight: 500;">
            {{ t('day2_tip_note') }}
          </div>
        </div>
      </div>

      <!-- Day 3：美妝攻略 -->
      <div v-if="activeDay === 3" class="tip-card tip-card-pink q-mt-lg">
        <div class="tip-card-header">
          <div class="tip-icon-circle" style="background: var(--hibiscus-soft); color: var(--hibiscus);">
            <q-icon name="shopping_bag" size="18px" />
          </div>
          <span style="font-size: 16px; font-weight: 700; color: var(--ink);">{{ t('day3_tip_title') }}</span>
        </div>
        <div style="font-size: 13px; color: var(--ink-soft); line-height: 1.6;">
          <p style="margin: 0 0 8px;">{{ t('day3_tip_intro') }}</p>
          <ul style="margin: 0; padding-left: 16px;">
            <li class="q-mb-xs"><strong>{{ t('day3_tip_1_label') }}</strong> {{ t('day3_tip_1') }}</li>
            <li class="q-mb-xs"><strong>{{ t('day3_tip_2_label') }}</strong> {{ t('day3_tip_2') }}</li>
          </ul>
          <div style="font-size: 11px; color: var(--hibiscus); margin-top: 8px; font-weight: 500;">
            {{ t('day3_tip_note') }}
          </div>
        </div>
      </div>

      <!-- Day 4：浮潛 + 沙灘 -->
      <div v-if="activeDay === 4" class="column q-gutter-y-md q-mt-lg">
        <div class="tip-card tip-card-blue">
          <div class="tip-card-header">
            <div class="tip-icon-circle" style="background: var(--lagoon-soft); color: var(--lagoon);">
              <q-icon name="waves" size="18px" />
            </div>
            <span style="font-size: 16px; font-weight: 700; color: var(--ink);">{{ t('day4_tip1_title') }}</span>
          </div>
          <div style="font-size: 13px; color: var(--ink-soft); line-height: 1.6;">
            <ul style="margin: 0; padding-left: 16px;">
              <li class="q-mb-xs"><strong>{{ t('day4_tip1_1_label') }}</strong> {{ t('day4_tip1_1') }}</li>
              <li class="q-mb-xs"><strong>{{ t('day4_tip1_2_label') }}</strong> {{ t('day4_tip1_2') }}</li>
              <li class="q-mb-xs"><strong>{{ t('day4_tip1_3_label') }}</strong> {{ t('day4_tip1_3') }}</li>
            </ul>
          </div>
        </div>
        <div class="tip-card tip-card-blue">
          <div class="tip-card-header">
            <div class="tip-icon-circle" style="background: var(--lagoon-soft); color: var(--lagoon);">
              <q-icon name="beach_access" size="18px" />
            </div>
            <span style="font-size: 16px; font-weight: 700; color: var(--ink);">{{ t('day4_tip2_title') }}</span>
          </div>
          <div style="font-size: 13px; color: var(--ink-soft); line-height: 1.6;">
            <p style="margin: 0 0 6px;">{{ t('day4_tip2_waikiki') }}</p>
            <p style="margin: 0;">{{ t('day4_tip2_lanikai') }}</p>
          </div>
        </div>
      </div>

      <!-- Day 6：騎馬 -->
      <div v-if="activeDay === 6" class="tip-card tip-card-green q-mt-lg">
        <div class="tip-card-header">
          <div class="tip-icon-circle" style="background: var(--leaf-soft); color: var(--leaf);">
            <q-icon name="place" size="18px" />
          </div>
          <span style="font-size: 16px; font-weight: 700; color: var(--ink);">{{ t('day6_tip_title') }}</span>
        </div>
        <div style="font-size: 13px; color: var(--ink-soft); line-height: 1.6;">
          <ul style="margin: 0; padding-left: 16px;">
            <li class="q-mb-xs"><strong>{{ t('day6_tip_1_label') }}</strong> {{ t('day6_tip_1') }}</li>
            <li class="q-mb-xs"><strong>{{ t('day6_tip_2_label') }}</strong> {{ t('day6_tip_2') }}</li>
          </ul>
          <div style="font-size: 11px; color: var(--leaf); margin-top: 8px; font-weight: 500;">
            {{ t('day6_tip_note') }}
          </div>
        </div>
      </div>

    </div>


  </q-page>
</template>

<script setup>
import { useTripStore } from 'src/stores/trip-store'
import { useLongPress } from 'src/composables/useLongPress'
import { useQuasar } from 'quasar'
import { VueDraggable } from 'vue-draggable-plus'

const { t } = useI18n()
const $q = useQuasar()

const activeDay = inject('activeDay')
const activeData = inject('activeData')
const selectDay = inject('selectDay')
const itineraryData = inject('itineraryData')
const loc = inject('loc')

const tripStore = useTripStore()

// ── Expand ────────────────────────────────────────────────
const expandedIdx = ref(null)
const toggleExpand = (idx) => {
  expandedIdx.value = expandedIdx.value === idx ? null : idx
}
watch(activeDay, () => { expandedIdx.value = null })

// ── Edit mode ─────────────────────────────────────────────
const editMode = ref(false)
// Working copy of events for the current day (reset when day changes or edit starts)
const localEvents = ref([])

watch(
  activeData,
  (data) => {
    localEvents.value = data.events ? [...data.events] : []
  },
  { immediate: true, deep: true },
)

function enterEditMode() {
  if (editMode.value) return
  localEvents.value = activeData.value.events ? [...activeData.value.events] : []
  editMode.value = true
}

const { onPointerDown: longPressDown } = useLongPress(() => {
  if ($q.screen.lt.md) enterEditMode()
})

async function exitEditMode() {
  editMode.value = false
  const dayId = activeData.value.id
  if (!dayId) return
  await tripStore.reorderEvents(dayId, localEvents.value)
}
</script>

<style scoped>
/* ── Itinerary tab bar (tablet) ── */
.itinerary-bar {
  position: sticky;
  top: 50px;
  z-index: 10;
  background: var(--bg);
  border-bottom: 1px solid var(--surface-stroke);
  padding: 10px 0 8px;
}

.itinerary-bar-inner {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding: 0 20px;
  scrollbar-width: none;
}

.itinerary-bar-inner::-webkit-scrollbar {
  display: none;
}

.itinerary-tab {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: 8px 14px;
  border-radius: 14px;
  border: 1px solid var(--surface-stroke);
  cursor: pointer;
  flex-shrink: 0;
  min-width: 110px;
  max-width: 160px;
  transition: all 0.22s;
  background: var(--surface-translucent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  text-align: left;
  font-family: var(--font-sans);
}

.itinerary-tab.active {
  background: var(--accent-soft);
  border-color: var(--accent);
}

.itinerary-tab-day {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--ink-mute);
  text-transform: uppercase;
}

.itinerary-tab.active .itinerary-tab-day {
  color: var(--accent-deep);
}

.itinerary-tab-date {
  font-size: 11px;
  font-weight: 500;
  color: var(--ink-mute);
}

.itinerary-tab.active .itinerary-tab-date {
  color: var(--accent-deep);
}

.itinerary-tab-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--ink);
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ── Day chip selector (phones) ── */
.day-chips-wrap {
  position: sticky;
  top: 50px;
  z-index: 10;
  background: var(--bg);
  padding: 8px 0 6px;
}

.day-chips-row {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding: 0 16px;
  scrollbar-width: none;
}

.day-chips-row::-webkit-scrollbar {
  display: none;
}

.day-chip {
  padding: 8px 14px;
  border-radius: 999px;
  border: 0.5px solid var(--surface-stroke);
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.25s;
  background: var(--surface-translucent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: var(--ink-soft);
  font-size: 12px;
  font-weight: 600;
  font-family: var(--font-sans);
  letter-spacing: 0.02em;
}

.day-chip.active {
  background: var(--ink);
  color: var(--bg);
  border-color: var(--ink);
}

/* ── Edit FAB ── */
.edit-fab {
  position: absolute;
  bottom: 12px;
  right: 14px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.38);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: background 0.18s;
  z-index: 2;
}

.edit-fab:active {
  background: rgba(255, 255, 255, 0.35);
}

/* ── Edit mode banner ── */
.edit-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: var(--accent-soft);
  border-bottom: 1px solid var(--accent);
  gap: 12px;
}

.edit-banner-left {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--ink-soft);
}

.edit-done-btn {
  flex-shrink: 0;
  padding: 6px 18px;
  border-radius: 999px;
  background: var(--accent);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  font-family: var(--font-sans);
  transition: opacity 0.15s;
}

.edit-done-btn:active {
  opacity: 0.8;
}

.edit-banner-enter-active,
.edit-banner-leave-active {
  transition: all 0.22s ease;
}

.edit-banner-enter-from,
.edit-banner-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* ── Timeline ── */
.timeline {
  position: relative;
  padding: 8px 0;
}

.timeline-edit {
  touch-action: none;
  user-select: none;
}

.timeline-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  position: relative;
  transition: opacity 0.15s;
}

/* SortableJS ghost (placeholder left in list while dragging) */
.dnd-ghost-row {
  opacity: 0.35;
}

/* SortableJS chosen (the item being dragged) */
.dnd-chosen-row {
  outline: 2px solid var(--accent);
  border-radius: 16px;
  background: var(--accent-soft);
}

.timeline-time {
  flex-shrink: 0;
  width: 46px;
  text-align: right;
  padding-top: 14px;
}

.timeline-time-edit {
  width: 36px;
}

.timeline-dot-col {
  flex-shrink: 0;
  width: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 14px;
  position: relative;
}

.timeline-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--accent-soft);
  border: 2px solid var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  flex-shrink: 0;
}

.timeline-line {
  position: absolute;
  top: 42px;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
  background: var(--surface-stroke);
}

.timeline-card {
  flex: 1;
  padding: 12px 14px 10px;
  text-align: left;
  cursor: pointer;
  position: relative;
  transition: box-shadow 0.2s;
}

.timeline-edit .timeline-card {
  cursor: grab;
}

.timeline-edit .timeline-card:active {
  cursor: grabbing;
}

.timeline-card.expanded {
  box-shadow: 0 4px 20px rgba(255, 157, 92, 0.18);
}

/* ── Drag handle ── */
.drag-handle {
  flex-shrink: 0;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  touch-action: none;
}

.drag-handle:active {
  cursor: grabbing;
}


.card-collapsed {
  padding-right: 20px;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 4px;
  line-height: 1.4;
}

.card-location {
  display: flex;
  align-items: center;
  font-size: 11px;
  color: var(--ink-mute);
  line-height: 1.3;
}

.card-divider {
  height: 1px;
  background: var(--surface-stroke);
  margin: 10px 0;
}

.card-desc {
  font-size: 13px;
  color: var(--ink-soft);
  line-height: 1.6;
  margin-bottom: 10px;
}

.card-url {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--accent-deep);
  text-decoration: none;
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--accent-soft);
  transition: opacity 0.15s;
}

.card-url:active {
  opacity: 0.7;
}

.card-chevron {
  position: absolute;
  top: 12px;
  right: 10px;
}

/* ── Tip cards ── */
.tip-card {
  border-radius: 22px;
  padding: 16px;
  backdrop-filter: blur(var(--blur)) saturate(150%);
  -webkit-backdrop-filter: blur(var(--blur)) saturate(150%);
}

.tip-card-orange {
  background: var(--warm-soft);
}

.tip-card-pink {
  background: var(--hibiscus-soft);
}

.tip-card-blue {
  background: var(--lagoon-soft);
}

.tip-card-green {
  background: var(--leaf-soft);
}

.tip-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.tip-icon-circle {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
</style>
