# 行程 Drag & Drop 編輯功能 — 開發規格

本文件描述如何在 `/days` 頁面實作以拖拉方式重新排序行程 events 的功能。

---

## 為什麼不用 HTML5 drag-and-drop API？

HTML5 `dragstart / dragover / drop` 會產生瀏覽器自製的「漂浮影子」，位置無法精確控制，在 mobile 上也有相容性問題。

改用 **Pointer Events API**：
- 被拖動的卡片直接 `transform: translate()` 跟著游標，位置即所見即所得
- 同一套 API 在滑鼠、觸控、stylus 都有效
- 不需要安裝任何第三方套件

---

## 使用情境

```
DaysPage.vue 的 Timeline
│
├─ [Event Card] Day 1 · 10:40 抵達檀香山   ← 可拖拉
├─ [Event Card] Day 1 · 11:30 機場取車     ← 可拖拉
├─ [Event Card] Day 1 · 12:30 午餐         ← 可拖拉
└─ ...
```

使用者長按（或滑鼠按住）一張 event 卡片，拖到另一個位置後放開，兩筆資料交換順序，並寫回 Firestore。

---

## 架構三層

### 1. 共享狀態 — `useDayDnd.js`

路徑：`src/composables/useDayDnd.js`

用 Vue `provide / inject` 模式，在 `DaysPage.vue` 呼叫 `provideDayDnd()`，timeline 內的子元件用 `useDayDnd()` 取得同一個 context。

```js
// 狀態欄位
source        // { dayIndex, eventIndex } | null — 正在被拖的 event
target        // { dayIndex, eventIndex } | null — 游標目前懸停的目標位置
pointer       // { x, y } — 即時游標位置（viewport 座標）
startPointer  // { x, y } — 拖動起點（算 translate 偏移量用）
isDragging    // Boolean
```

```js
// 對外方法
startDrag(source, pointerEvent)   // pointerdown 時呼叫
reset()                           // pointerup / Escape 時呼叫
```

### 2. 生命週期管理 — `DaysPage.vue`

DnD 主引擎掛在頁面層，因為它需要監聽全域的 `pointermove` / `pointerup`：

| 事件 | 動作 |
|---|---|
| `pointerdown` on 卡片 | `dnd.startDrag(source, event)` |
| `window pointermove` | 更新 `pointer`、做 hit-testing 找目標位置 |
| `window pointerup` | commit（交換資料、存 Firestore）或 snap-back |
| `window keydown Escape` | cancel，觸發 snap-back |

**監聽器只在 `dnd.isDragging === true` 時掛載，`reset()` 後立即移除**（用 `watch` 管理）。

**Hit-testing 技巧**：用 `document.elementsFromPoint(x, y)` 走 DOM stack，找有 `data-event-index` 屬性的元素，不自己計算格子座標。

**Snap-back 動畫**：用雙層 `requestAnimationFrame` 先設定偏移量再清為零，讓 CSS `transition` 接手動畫：

```js
function snapBack() {
  ghost.style.transform = `translate(${offsetX}px, ${offsetY}px)`
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      ghost.style.transform = ''  // CSS transition 接手
    })
  })
}
```

### 3. 拖動中的 Ghost 元素

被拖的卡片本身維持在原位（佔位），另外用 `<Teleport to="body">` 渲染一個 `position: fixed` 的漂浮副本（ghost），追蹤 `dnd.pointer`。

```vue
<!-- DaysPage.vue 內 -->
<Teleport to="body">
  <div
    v-if="dnd.isDragging"
    class="dnd-ghost"
    :style="{
      position: 'fixed',
      top: dnd.pointer.y + 'px',
      left: dnd.pointer.x + 'px',
      pointerEvents: 'none',   // 不擋住 hit-testing
      zIndex: 9999,
    }"
  >
    <!-- 卡片內容的輕量副本 -->
  </div>
</Teleport>
```

---

## 必要 CSS

```css
/* 拖動容器 */
.timeline {
  touch-action: none;    /* 避免 mobile pointermove 被瀏覽器攔截去 scroll */
  user-select: none;     /* 拖動中不選到文字 */
}

/* 被拖動的卡片原位半透明 */
.timeline-card.is-dragging-source {
  opacity: 0.35;
}

/* 目標放置區高亮 */
.timeline-card.is-drop-target {
  outline: 2px solid var(--accent);
  background: var(--accent-soft);
}

/* Ghost */
.dnd-ghost {
  transition: none;
  pointer-events: none;
  opacity: 0.85;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
}
```

---

## 資料寫回 Firestore

排序完成後，更新受影響 events 的 `order` 欄位（event 用 `order` 數字排序）：

```js
// trip-store.js 新增 action
async function reorderEvents(dayId, reorderedEvents) {
  const batch = writeBatch(db)
  reorderedEvents.forEach((event, idx) => {
    const ref = doc(db, 'trips', 'oahu-2026', 'days', dayId)
    // events 是 inline array，整個陣列一起寫回
    batch.update(ref, { events: reorderedEvents })
  })
  await batch.commit()
}
```

> 因為 events 是內嵌 array（非子集合），只需要 `update` 整個 `events` 欄位，不需要逐筆操作。

---

## 實作順序

1. `src/composables/useDayDnd.js` — 建立共享狀態與 `startDrag` / `reset`
2. `DaysPage.vue` — 掛載 `window` 事件監聽、hit-testing、`<Teleport>` ghost
3. Timeline 卡片 — 加上 `data-event-index`、`pointerdown` handler、`is-dragging-source` / `is-drop-target` class
4. `trip-store.js` — 新增 `reorderEvents()` action
5. 存回 Firestore 並樂觀更新本地 `days` state（先改 UI，再等非同步完成）

---

## 需要的瀏覽器 API

| API | 說明 |
|---|---|
| Pointer Events | `pointerdown / pointermove / pointerup / pointercancel` |
| `document.elementsFromPoint` | Hit-testing，找游標下的 DOM 元素 |
| `requestAnimationFrame`（雙層） | Snap-back CSS transition 正確觸發 |
| Vue `provide / inject` | 跨元件共享拖動狀態 |
| Vue `<Teleport>` | Ghost 元素脫離 stacking context 蓋在最上層 |
| Firestore `writeBatch` | 批次寫回排序結果 |

---

## 何時才值得改用第三方套件？

目前場景（單一天的 events 清單排序）**自製最合適**，理由：
- events 數量少（每天 4–6 筆），不需要虛擬化
- 有特殊的手機長按需求，自製更好控制觸發閾值
- 不需要跨 list 拖放

若未來需要「跨天拖移 event」，可評估 `vue-draggable-plus`（基於 SortableJS，支援跨 list）。
