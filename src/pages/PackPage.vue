<template>
  <q-page class="q-pb-xl" style="background: transparent;">
    <div style="padding: 24px 16px 0;">

      <!-- Header -->
      <div class="t-mono-cap" style="margin-bottom: 4px;">BEFORE TAKEOFF</div>
      <div class="t-display" style="font-size: 40px; color: var(--accent); margin-bottom: 20px;">Packing list</div>

      <!-- Progress card -->
      <div class="glass-strong" style="padding: 16px 18px; margin-bottom: 24px;">
        <div class="row justify-between items-center">
          <div>
            <div style="font-size: 12px; color: var(--ink-mute);">{{ packedCount }} / {{ total }} packed</div>
            <div style="font-size: 22px; font-weight: 700; color: var(--ink); margin-top: 2px;">{{ pct }}%</div>
          </div>
          <!-- SVG circular progress -->
          <svg width="56" height="56" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="22" fill="none" stroke="var(--surface-stroke)" stroke-width="4"/>
            <circle cx="28" cy="28" r="22" fill="none" stroke="var(--accent)" stroke-width="4"
              :stroke-dasharray="`${(pct / 100) * 138.2} 138.2`"
              stroke-linecap="round" transform="rotate(-90 28 28)" style="transition: stroke-dasharray 0.4s ease;"/>
          </svg>
        </div>
      </div>

      <!-- Groups -->
      <div v-for="group in packGroups" :key="group.label" style="margin-bottom: 20px;">
        <div class="row justify-between items-center" style="margin-bottom: 10px;">
          <div style="font-size: 14px; font-weight: 700; color: var(--ink);">{{ group.label }}</div>
          <div style="font-size: 12px; color: var(--ink-mute);">
            {{ group.items.filter(i => i.done).length }}/{{ group.items.length }}
          </div>
        </div>
        <div class="glass-strong" style="padding: 4px 0;">
          <div
            v-for="item in group.items"
            :key="item.name"
            class="pack-item"
            @click="item.done = !item.done"
          >
            <div class="pack-check" :class="{ checked: item.done }">
              <q-icon v-if="item.done" name="check" size="12px" style="color: #fff;" />
            </div>
            <div style="flex: 1; min-width: 0;">
              <div :style="{ textDecoration: item.done ? 'line-through' : 'none', color: item.done ? 'var(--ink-mute)' : 'var(--ink)', fontSize: '14px', fontWeight: 500, transition: 'all 0.2s' }">
                {{ item.name }}
              </div>
              <div v-if="item.note" style="font-size: 11px; color: var(--accent); margin-top: 2px;">{{ item.note }}</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </q-page>
</template>

<script setup>
import { reactive, computed } from 'vue'

const packGroups = reactive([
  {
    label: 'Essentials',
    items: [
      { name: 'Passport', done: true },
      { name: "Driver's license (rental)", done: true },
      { name: 'Reef-safe sunscreen', done: false, note: 'Required by HI law' },
      { name: 'Reusable water bottle', done: false },
    ]
  },
  {
    label: 'Beach',
    items: [
      { name: 'Swimsuits ×2', done: true },
      { name: 'Snorkel mask', done: false },
      { name: 'Quick-dry towel', done: false },
      { name: 'Beach sandals', done: true },
    ]
  },
  {
    label: 'Clothing',
    items: [
      { name: 'Trail runners', done: false },
      { name: 'Light jacket', done: false },
      { name: 'Aloha shirt', done: false },
    ]
  }
])

const total = computed(() => packGroups.flatMap(g => g.items).length)
const packedCount = computed(() => packGroups.flatMap(g => g.items).filter(i => i.done).length)
const pct = computed(() => Math.round(packedCount.value / total.value * 100))
</script>

<style scoped>
.pack-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid var(--surface-stroke);
  transition: background 0.15s;
}

.pack-item:last-child { border-bottom: none; }

.pack-item:active { background: var(--surface-stroke); }

.pack-check {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 2px solid var(--surface-stroke);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
  background: transparent;
}

.pack-check.checked {
  background: var(--accent);
  border-color: var(--accent);
}
</style>
