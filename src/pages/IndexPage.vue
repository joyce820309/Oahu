<template>
  <q-page class="q-pb-xl">
    
    <div class="bg-teal-1 q-pa-xl text-center relative-position overflow-hidden day-hero">
      <div class="text-h4 text-teal-9 text-weight-bolder q-mb-sm relative-position" style="z-index: 1;">
        {{ activeData.title }}
      </div>
      <div class="text-subtitle1 text-teal-7 text-weight-medium relative-position" style="z-index: 1;">
        Day {{ activeDay }} | {{ activeData.date }}
      </div>
    </div>

    <div class="q-pa-md q-pa-md-xl" style="max-width: 800px; margin: 0 auto;">
      
      <q-timeline color="teal-6" layout="dense" class="q-mb-xl q-ml-sm">
        <q-timeline-entry
          v-for="(event, idx) in activeData.events"
          :key="idx"
          :icon="event.icon"
          :title="event.title"
          :subtitle="event.time"
        >
          <q-card flat bordered class="q-mt-sm bg-white">
            <q-card-section class="text-body1 text-grey-8">
              {{ event.desc }}
            </q-card-section>
          </q-card>
        </q-timeline-entry>
      </q-timeline>

      <q-card v-if="activeDay === 2" flat bordered class="bg-orange-1 border-orange-2 q-mt-lg">
        <q-card-section>
          <div class="text-h6 text-orange-9 flex items-center q-mb-sm">
            <q-icon name="info" class="q-mr-sm" /> UTV 越野車之旅注意事項
          </div>
          <div class="text-body2 text-orange-10">
            <p>你選擇了最熱門刺激的 UTV Raptor Tour！請務必注意以下事項：</p>
            <ul class="q-pl-md">
              <li class="q-mb-xs"><strong>一定會弄髒：</strong> 會有紅土灰塵，千萬不要穿白衣服或新鞋子。</li>
              <li class="q-mb-xs"><strong>攜帶備品：</strong> 建議帶一套乾淨的衣服和濕紙巾，結束後換上再去吃蝦飯。</li>
              <li class="q-mb-xs"><strong>必備防護：</strong> 出發前塗好防曬，並將貴重物品放在置物櫃。</li>
            </ul>
            <div class="text-caption text-orange-8 q-mt-sm">
              *UTV 行程極度搶手，請務必在出發前至少 1.5 到 2 個月在官網預訂完成！
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card v-if="activeDay === 3" flat bordered class="bg-pink-1 border-pink-2 q-mt-lg">
        <q-card-section>
          <div class="text-h6 text-pink-9 flex items-center q-mb-sm">
            <q-icon name="shopping_bag" class="q-mr-sm" /> 美系彩妝購物攻略
          </div>
          <div class="text-body2 text-pink-10">
            <p>來美國買美系彩妝非常划算，推薦兩個必去的地方：</p>
            <ul class="q-pl-md">
              <li class="q-mb-xs"><strong>百貨公司：</strong> Ala Moana 內的 Macy's 或 Nordstrom 百貨專櫃常有獨家折扣或滿額贈。</li>
              <li class="q-mb-xs"><strong>Sephora：</strong> 這裡也有一家很大的 Sephora，想一次試用各大品牌最方便。</li>
            </ul>
            <div class="text-caption text-pink-8 q-mt-sm">
              💡 提醒：夏威夷州稅僅約 4.712%，全美最低之一！買專櫃絕對比台灣便宜。
            </div>
          </div>
        </q-card-section>
      </q-card>

      <div v-if="activeDay === 4" class="q-mt-lg column q-gutter-y-md">
        <q-card flat bordered class="bg-light-blue-1 border-light-blue-2">
          <q-card-section>
            <div class="text-h6 text-light-blue-9 flex items-center q-mb-sm">
              <q-icon name="waves" class="q-mr-sm" /> 恐龍灣 (Hanauma Bay) 預約戰略
            </div>
            <div class="text-body2 text-light-blue-10">
              <ul class="q-pl-md">
                <li class="q-mb-xs"><strong>預約時間：</strong> 必須在入園前 <strong>2 天的夏威夷早上 7:00</strong> (台灣時間隔天凌晨 1:00) 搶票，通常5分鐘內秒殺！</li>
                <li class="q-mb-xs"><strong>防曬規定：</strong> 只能使用「海洋友善」防曬乳，建議穿長袖水母衣。</li>
                <li class="q-mb-xs"><strong>裝備：</strong> 現場可租借浮潛面罩和蛙鞋。</li>
              </ul>
            </div>
          </q-card-section>
        </q-card>

        <q-card flat bordered class="bg-light-blue-1 border-light-blue-2">
          <q-card-section>
            <div class="text-h6 text-light-blue-9 flex items-center q-mb-sm">
              <q-icon name="beach_access" class="q-mr-sm" /> 沙灘耍廢地點差異
            </div>
            <div class="text-body2 text-light-blue-10">
              <p class="q-mb-sm">🏖️ <strong>Day 1 威基基海灘 (Waikiki)：</strong> 飯店正前方。熱鬧、方便，適合喝杯飲料看熱鬧。</p>
              <p class="q-mb-none">🏝️ <strong>Day 4 蘭尼凱海灘 (Lanikai)：</strong> 隱藏在高級住宅區旁。無商業設施，有最細白沙和清澈海水，適合「極度安靜耍廢」。</p>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <q-card v-if="activeDay === 6" flat bordered class="bg-green-1 border-green-2 q-mt-lg">
        <q-card-section>
          <div class="text-h6 text-green-9 flex items-center q-mb-sm">
            <q-icon name="place" class="q-mr-sm" /> 騎馬體驗小建議
          </div>
          <div class="text-body2 text-green-10">
            <ul class="q-pl-md">
              <li class="q-mb-xs"><strong>Turtle Bay Resort：</strong> 沿著絕美的海岸線騎乘，聽著海浪聲，非常浪漫。</li>
              <li class="q-mb-xs"><strong>Gunstock Ranch：</strong> 提供山林與海景結合的騎馬路線，適合初學者。</li>
            </ul>
            <div class="text-caption text-green-8 q-mt-sm">
              💡 提醒：需穿著包鞋（運動鞋）和長褲避免摩擦受傷，並做好防曬措施。
            </div>
          </div>
        </q-card-section>
      </q-card>

    </div>
  </q-page>
</template>

<script setup>
import { inject } from 'vue'

// 從 MainLayout 注入狀態
const activeDay = inject('activeDay')
const activeData = inject('activeData')
</script>
