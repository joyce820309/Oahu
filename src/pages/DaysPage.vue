<template>
  <q-page class="q-pb-xl" style="background: transparent;">

    <!-- Day chip selector: phones only -->
    <div class="day-chips-wrap lt-sm">
      <div class="day-chips-row">
        <button
          v-for="d in itineraryData"
          :key="d.day"
          class="day-chip"
          :class="{ active: activeDay === d.day }"
          @click="selectDay(d.day)"
        >
          Day {{ d.day }}
        </button>
      </div>
    </div>

    <!-- Itinerary tab bar: tablet only (sm, drawer hidden but not yet open) -->
    <div class="itinerary-bar gt-xs lt-md">
      <div class="itinerary-bar-inner">
        <button
          v-for="d in itineraryData"
          :key="d.day"
          class="itinerary-tab"
          :class="{ active: activeDay === d.day }"
          @click="selectDay(d.day)"
        >
          <span class="itinerary-tab-day">DAY {{ d.day }}</span>
          <span class="itinerary-tab-date">{{ d.date.replace('2026.', '').replace(/\s*\(.\)/, '') }}</span>
          <span class="itinerary-tab-title">{{ d.title }}</span>
        </button>
      </div>
    </div>

    <!-- Day Hero -->
    <div class="q-pa-lg text-center relative-position overflow-hidden day-hero">
      <div class="text-h5 text-weight-bolder q-mb-xs relative-position" style="z-index:1; color: #fff;">
        {{ activeData.title }}
      </div>
      <div class="text-subtitle2 text-weight-medium relative-position" style="z-index:1; opacity:0.82; color: #fff;">
        Day {{ activeDay }} · {{ activeData.date }}
      </div>
    </div>

    <!-- Timeline -->
    <div style="padding: 16px; max-width: 800px; margin: 0 auto;">

      <!-- Custom timeline -->
      <div class="timeline">
        <div
          v-for="(event, idx) in activeData.events"
          :key="idx"
          class="timeline-row"
        >
          <!-- Time column -->
          <div class="timeline-time">
            <div style="font-size: 12px; font-weight: 600; color: var(--ink);">{{ event.time }}</div>
          </div>

          <!-- Dot -->
          <div class="timeline-dot-col">
            <div class="timeline-line" v-if="idx < activeData.events.length - 1" />
            <div class="timeline-dot">
              <q-icon :name="event.icon" size="14px" style="color: var(--accent-deep);" />
            </div>
          </div>

          <!-- Card -->
          <div class="glass-strong timeline-card">
            <div style="font-size: 14px; font-weight: 600; color: var(--ink); margin-bottom: 4px;">
              {{ event.title }}
            </div>
            <div style="font-size: 13px; color: var(--ink-mute); line-height: 1.5;">
              {{ event.desc }}
            </div>
          </div>
        </div>
      </div>

      <!-- Day 2：UTV 注意事項 -->
      <div v-if="activeDay === 2" class="tip-card tip-card-orange q-mt-lg">
        <div class="tip-card-header">
          <div class="tip-icon-circle" style="background: var(--warm-soft); color: var(--warm);">
            <q-icon name="info" size="18px" />
          </div>
          <span style="font-size: 16px; font-weight: 700; color: var(--ink);">UTV 越野車之旅注意事項</span>
        </div>
        <div style="font-size: 13px; color: var(--ink-soft); line-height: 1.6;">
          <p style="margin: 0 0 8px;">你選擇了最熱門刺激的 UTV Raptor Tour！請務必注意：</p>
          <ul style="margin: 0; padding-left: 16px;">
            <li class="q-mb-xs"><strong>一定會弄髒：</strong> 紅土灰塵，千萬不要穿白衣服或新鞋子。</li>
            <li class="q-mb-xs"><strong>攜帶備品：</strong> 帶一套乾淨衣服和濕紙巾，結束後換上再去吃蝦飯。</li>
            <li class="q-mb-xs"><strong>必備防護：</strong> 出發前塗好防曬，貴重物品放置物櫃。</li>
          </ul>
          <div style="font-size: 11px; color: var(--warm); margin-top: 8px; font-weight: 500;">
            *行程極度搶手，請至少提前 1.5–2 個月在官網預訂！
          </div>
        </div>
      </div>

      <!-- Day 3：美妝攻略 -->
      <div v-if="activeDay === 3" class="tip-card tip-card-pink q-mt-lg">
        <div class="tip-card-header">
          <div class="tip-icon-circle" style="background: var(--hibiscus-soft); color: var(--hibiscus);">
            <q-icon name="shopping_bag" size="18px" />
          </div>
          <span style="font-size: 16px; font-weight: 700; color: var(--ink);">美系彩妝購物攻略</span>
        </div>
        <div style="font-size: 13px; color: var(--ink-soft); line-height: 1.6;">
          <p style="margin: 0 0 8px;">來美國買美系彩妝非常划算，推薦兩個必去的地方：</p>
          <ul style="margin: 0; padding-left: 16px;">
            <li class="q-mb-xs"><strong>百貨公司：</strong> Ala Moana 內的 Macy's 或 Nordstrom 專櫃常有獨家折扣。</li>
            <li class="q-mb-xs"><strong>Sephora：</strong> 一次試用各大品牌最方便。</li>
          </ul>
          <div style="font-size: 11px; color: var(--hibiscus); margin-top: 8px; font-weight: 500;">
            夏威夷州稅僅約 4.712%，全美最低之一！
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
            <span style="font-size: 16px; font-weight: 700; color: var(--ink);">恐龍灣 (Hanauma Bay) 預約戰略</span>
          </div>
          <div style="font-size: 13px; color: var(--ink-soft); line-height: 1.6;">
            <ul style="margin: 0; padding-left: 16px;">
              <li class="q-mb-xs"><strong>預約時間：</strong> 入園前 2 天的夏威夷早上 7:00（台灣時間隔天凌晨 1:00）搶票，通常 5 分鐘秒殺！</li>
              <li class="q-mb-xs"><strong>防曬規定：</strong> 只能使用「海洋友善」防曬乳，建議穿長袖水母衣。</li>
              <li class="q-mb-xs"><strong>裝備：</strong> 現場可租借浮潛面罩和蛙鞋。</li>
            </ul>
          </div>
        </div>
        <div class="tip-card tip-card-blue">
          <div class="tip-card-header">
            <div class="tip-icon-circle" style="background: var(--lagoon-soft); color: var(--lagoon);">
              <q-icon name="beach_access" size="18px" />
            </div>
            <span style="font-size: 16px; font-weight: 700; color: var(--ink);">沙灘耍廢地點差異</span>
          </div>
          <div style="font-size: 13px; color: var(--ink-soft); line-height: 1.6;">
            <p style="margin: 0 0 6px;">🏖️ <strong>Day 1 威基基海灘：</strong> 熱鬧、方便，適合喝杯飲料看熱鬧。</p>
            <p style="margin: 0;">🏝️ <strong>Day 4 蘭尼凱海灘：</strong> 無商業設施，最細白沙和清澈海水，適合極度安靜耍廢。</p>
          </div>
        </div>
      </div>

      <!-- Day 6：騎馬 -->
      <div v-if="activeDay === 6" class="tip-card tip-card-green q-mt-lg">
        <div class="tip-card-header">
          <div class="tip-icon-circle" style="background: var(--leaf-soft); color: var(--leaf);">
            <q-icon name="place" size="18px" />
          </div>
          <span style="font-size: 16px; font-weight: 700; color: var(--ink);">騎馬體驗小建議</span>
        </div>
        <div style="font-size: 13px; color: var(--ink-soft); line-height: 1.6;">
          <ul style="margin: 0; padding-left: 16px;">
            <li class="q-mb-xs"><strong>Turtle Bay Resort：</strong> 沿著絕美海岸線騎乘，聽著海浪聲，非常浪漫。</li>
            <li class="q-mb-xs"><strong>Gunstock Ranch：</strong> 山林與海景結合的騎馬路線，適合初學者。</li>
          </ul>
          <div style="font-size: 11px; color: var(--leaf); margin-top: 8px; font-weight: 500;">
            需穿著包鞋（運動鞋）和長褲，並做好防曬措施。
          </div>
        </div>
      </div>

    </div>
  </q-page>
</template>

<script setup>
import { inject } from 'vue'

const activeDay = inject('activeDay')
const activeData = inject('activeData')
const selectDay = inject('selectDay')
const itineraryData = inject('itineraryData')
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
.itinerary-bar-inner::-webkit-scrollbar { display: none; }

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
.day-chips-row::-webkit-scrollbar { display: none; }

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

/* ── Timeline ── */
.timeline {
  position: relative;
  padding: 8px 0;
}

.timeline-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  position: relative;
}

.timeline-time {
  flex-shrink: 0;
  width: 46px;
  text-align: right;
  padding-top: 14px;
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
  padding: 14px;
  text-align: left;
}

/* ── Tip cards ── */
.tip-card {
  border-radius: 22px;
  padding: 16px;
  backdrop-filter: blur(var(--blur)) saturate(150%);
  -webkit-backdrop-filter: blur(var(--blur)) saturate(150%);
}

.tip-card-orange { background: var(--warm-soft); }
.tip-card-pink   { background: var(--hibiscus-soft); }
.tip-card-blue   { background: var(--lagoon-soft); }
.tip-card-green  { background: var(--leaf-soft); }

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
