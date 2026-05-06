<template>
  <q-page class="q-pa-lg">
    <div class="text-h5 text-weight-bold q-mb-lg">Me</div>

    <q-card flat bordered class="q-mb-md" style="border-radius:16px">
      <q-item>
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white" size="52px">L</q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-h6 text-weight-bold">Lin</q-item-label>
          <q-item-label caption>2 travelers · O'ahu 2026</q-item-label>
        </q-item-section>
      </q-item>
    </q-card>

    <q-list bordered separator style="border-radius:16px; overflow:hidden">
      <q-item v-for="item in menuItems" :key="item.label" clickable v-ripple>
        <q-item-section avatar>
          <q-icon :name="item.icon" color="primary" />
        </q-item-section>
        <q-item-section>{{ item.label }}</q-item-section>
        <q-item-section side>
          <q-icon name="chevron_right" style="opacity:0.35" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
const menuItems = [
  { label: 'Trip settings', icon: 'settings' },
  { label: 'Notifications', icon: 'notifications' },
  { label: 'Currency', icon: 'attach_money' },
  { label: 'About Hele', icon: 'info' },
]
</script>
