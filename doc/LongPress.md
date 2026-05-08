# 長按觸發編輯模式 — 開發規格

## 使用情境

平板以下尺寸（`< 1024px`）的使用者長按 DaysPage 的任一行程卡片，即進入編輯模式（`editMode = true`）。

---

## 為什麼不用 mousedown / touchstart？

文件舊版混用 `mousedown` + `touchstart`。觸控裝置在 `touchstart` 之後瀏覽器還會補發 `mousedown`，計時器會被觸發兩次。

改用 **Pointer Events API**，理由與 DnD 相同：
- 一個 API 統一處理滑鼠、觸控、stylus
- 不會雙發事件
- `pointermove` 可偵測手指移動，超過閾值就取消長按（避免 scroll 誤觸）

---

## 實作：`useLongPress` composable

路徑：`src/composables/useLongPress.js`

```js
// src/composables/useLongPress.js
import { onUnmounted } from 'vue'

export function useLongPress(callback, { delay = 500, moveThreshold = 8 } = {}) {
  let timer = null
  let startX = 0
  let startY = 0

  function onPointerDown(e) {
    if (e.button !== undefined && e.button !== 0) return  // 只處理左鍵/觸控

    startX = e.clientX
    startY = e.clientY

    timer = setTimeout(() => {
      timer = null
      callback(e)
    }, delay)

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', cancel)
    window.addEventListener('pointercancel', cancel)
  }

  function onPointerMove(e) {
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    if (Math.sqrt(dx * dx + dy * dy) > moveThreshold) cancel()
  }

  function cancel() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', cancel)
    window.removeEventListener('pointercancel', cancel)
  }

  onUnmounted(cancel)

  return { onPointerDown }
}
```

**關鍵設計：**
| 細節 | 說明 |
|---|---|
| `moveThreshold = 8px` | 手指稍微抖動不取消，但明顯滑動（準備 scroll）就取消 |
| `window` 監聽 move/up | 手指稍微移出元素範圍也能正確取消 |
| `onUnmounted` cleanup | 元件卸載時確保沒有懸掛的監聽器 |
| `e.button !== 0` guard | 忽略滑鼠右鍵、中鍵 |

---

## 在 DaysPage.vue 中使用

長按觸發對象：timeline 的每張卡片（`tablet 以下`，用 `$q.screen.lt.md` 判斷）。

```js
// script setup
import { useLongPress } from 'src/composables/useLongPress'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const { onPointerDown: longPressDown } = useLongPress(() => {
  if ($q.screen.lt.md) enterEditMode()
})
```

```  
<!-- 每張 timeline-card 加上 pointerdown handler -->
<div
  class="glass-strong timeline-card"
  @pointerdown="longPressDown"
  ...
>

```

> 桌面（md+）保留右上角鉛筆按鈕入口，不觸發長按。

---

## 與 DnD 的相容性

長按進入 `editMode` 後，使用者才能拖拉卡片。DnD 的 `onPointerDown` 掛在 `.drag-handle` 上，兩者觸發元素不同，不會衝突。

流程：
```
長按卡片（500ms）→ editMode = true → 出現 drag-handle
→ 使用者按住 drag-handle → DnD startDrag
```

---

## 需要的 API

| API | 用途 |
|---|---|
| `pointerdown` | 長按計時開始 |
| `pointermove` (window) | 偵測手指移動，超過閾值取消 |
| `pointerup / pointercancel` (window) | 手指放開，取消計時 |
| `$q.screen.lt.md` | 限制長按只在平板以下生效 |
