# `src/stores/` 撰寫規範

本專案使用 **Pinia** 作為狀態管理庫，搭配 Vue 3 Composition API 的 Setup Store 寫法。
**所有 Firebase / Firestore API 呼叫都必須集中在 store 內**，元件與 layout 只消費 store 回傳的 state 與 action。

---

## 目前結構（2026-05）

```
src/stores/
├── index.js          # Pinia 初始化（Quasar boot 入口，勿修改）
├── example-store.js  # UI 狀態：sidebar 開關 / 折疊
└── trip-store.js     # 行程資料：Firestore 即時訂閱 + 靜態備援
```

---

## 核心原則

- 一律使用 **Setup Store**（`() => { ... }` 函式形式），不用 Options Store
- Store ID 使用簡短語意名稱（如 `"ui"`、`"trip"`）
- 回傳物件只暴露外部需要的 state / action，內部 helper 不 return
- **Firebase / Firestore 呼叫只能在 store 內發起**，不在元件或 layout 直接 import `firebase/firestore`
- Firestore 訂閱（`onSnapshot`）在 store 內建立，並在 store 被 GC 前以 `onUnmounted` 或回傳的 `unsubscribe` 清理
- 提供靜態備援資料（`_staticData`）作為 Firestore 載入中時的 fallback，避免畫面空白

---

## 標準模板（純 UI state）

```js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useXxxStore = defineStore('xxx', () => {
  // --- state ---
  const someState = ref(defaultValue)

  // --- actions ---
  function doSomething() {
    someState.value = newValue
  }

  return { someState, doSomething }
})
```

---

## Firebase Store 模板

適用於需要即時訂閱 Firestore 的 store（如行程、清單資料）：

```js
import { defineStore } from 'pinia'
import { ref, computed, onUnmounted } from 'vue'
import { db } from 'src/firebase'
import { collection, query, orderBy, onSnapshot, getDocs } from 'firebase/firestore'

export const useTripStore = defineStore('trip', () => {
  // --- state ---
  const days = ref([])
  const loading = ref(true)

  // --- 靜態備援（Firestore 載入前顯示） ---
  const _staticDays = [ /* ... */ ]

  // --- computed ---
  const displayDays = computed(() =>
    loading.value ? _staticDays : days.value
  )

  // --- Firestore 訂閱 ---
  const daysRef = collection(db, 'trips', 'oahu-2026', 'days')
  const unsubscribe = onSnapshot(query(daysRef, orderBy('day')), async (snap) => {
    days.value = await Promise.all(
      snap.docs.map(async (doc) => {
        const data = doc.data()
        const eventsSnap = await getDocs(query(collection(doc.ref, 'events'), orderBy('order')))
        data.events = eventsSnap.docs.map((e) => e.data())
        return data
      })
    )
    loading.value = false
  })

  // 元件卸載時取消訂閱
  onUnmounted(unsubscribe)

  return { displayDays, loading }
})
```

---

## 使用方式

在元件或 layout 的 `<script setup>` 內：

```js
import { useTripStore } from 'src/stores/trip-store'
import { storeToRefs } from 'pinia'

const tripStore = useTripStore()
// 解構 ref 需用 storeToRefs 保留響應性
const { displayDays, loading } = storeToRefs(tripStore)
```

> **禁止**在元件 / layout 內直接 `import { db } from 'src/firebase'` 或呼叫任何 Firestore API。

---

## 現有 Store 說明

### `useUiStore`（`example-store.js`）

| 名稱 | 類型 | 說明 |
|---|---|---|
| `sidebarOpen` | `ref(true)` | 控制 drawer 是否顯示 |
| `sidebarCollapsed` | `ref(false)` | 控制 drawer 是否折疊 |
| `toggleSidebar()` | action | 切換 `sidebarOpen` |
| `toggleCollapse()` | action | 切換 `sidebarCollapsed` |

### `useTripStore`（`trip-store.js`）

| 名稱 | 類型 | 說明 |
|---|---|---|
| `displayDays` | `computed` | 行程天數陣列（loading 中回傳靜態備援） |
| `loading` | `ref(true)` | Firestore 是否仍在載入 |
| `dispose()` | action | 手動取消 Firestore 訂閱（通常不需呼叫） |

資料來源：Firestore `trips/oahu-2026/days`，依 `day` 排序，子集合 `events` 依 `order` 排序。
