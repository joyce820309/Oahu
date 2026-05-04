<template>
  <q-page class="q-pa-lg">
    <div class="text-overline q-mb-xs" style="opacity:0.55">DISCOVER O'AHU</div>
    <div class="text-h4 text-weight-bolder q-mb-lg" style="color:#56C6CC">Explore</div>

    <div class="row q-gutter-sm q-mb-lg">
      <q-chip v-for="tag in tags" :key="tag" clickable color="primary" text-color="white" class="q-px-md">
        {{ tag }}
      </q-chip>
    </div>

    <q-card flat bordered class="q-pa-xl text-center" style="border-radius:16px">
      <q-icon name="travel_explore" size="3rem" color="primary" />
      <div class="text-h6 q-mt-md">地圖功能即將推出</div>
      <div class="text-body2 q-mt-sm" style="opacity:0.6">探索 O'ahu 的海灘、美食與文化景點</div>
    </q-card>
  </q-page>
</template>

<script setup>
const tags = ['All', 'Beaches', 'Hikes', 'Eats', 'Culture']
</script>
