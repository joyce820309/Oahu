# Firebase Architecture — Hele 夏威夷行程 PWA

## 技術選型

| 服務 | 用途 |
|---|---|
| **Firebase Authentication** | Google / Email 登入，管理 user 身份 |
| **Cloud Firestore** | 主要資料庫（行程、事件、打包清單） |
| **Firebase Hosting** *(optional)* | 靜態部署備選（目前主力用 Vercel） |

---

## Firestore 資料結構

```
trips/
  {tripId}/                          ← 一趟旅程
    title: "夏威夷慵懶行 2026"
    destination: "O'ahu, Hawaii"
    startDate: Timestamp              ← 2026-07-18
    endDate:   Timestamp              ← 2026-07-24
    coverColor: "#56C6CC"             ← hero 漸層色（可選）
    travelers: ["uid-joyce", ...]     ← 有存取權的 user uid 陣列
    ownerId: "uid-joyce"
    createdAt: Timestamp
    updatedAt: Timestamp

    days/                            ← subcollection
      {dayId}/                       ← 每一天
        day: 1                       ← 第幾天（排序用）
        date: "2026-07-18"
        title: "抵達阿羅哈！"
        createdAt: Timestamp
        updatedAt: Timestamp

        events/                      ← subcollection
          {eventId}/                 ← 每個行程項目
            sortOrder: 0             ← 拖曳排序用
            time: "10:40"
            title: "抵達檀香山 (HNL)"
            location: "檀香山機場 (HNL)"
            url: "https://www.google.com/"
            desc:  "班機抵達..."
            icon:  "flight"
            tag:   "transport"       ← 分類標籤（可選）
            note:  ""                ← 使用者備註（可選）
            createdAt: Timestamp
            updatedAt: Timestamp

    packingLists/                    ← subcollection
      {listId}/                      ← 分組（Essentials / Beach / ...）
        label: "Essentials"
        sortOrder: 0

        items/                       ← subcollection
          {itemId}/
            name: "Passport"
            done: false
            note: ""                 ← 例：Required by HI law
            sortOrder: 0
            updatedAt: Timestamp

users/
  {uid}/                             ← Firebase Auth uid
    displayName: "Joyce Lin"
    email: "joyce820309@gmail.com"
    photoURL: ""
    role: "user"                     ← "user" | "admin"（預留）
    createdAt: Timestamp
    lastSeenAt: Timestamp
    settings/                        ← subcollection（個人偏好）
      preferences/
        locale: "zh-TW"
        darkMode: false
```

---

## 存取控制（Firestore Security Rules）

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ── users ──────────────────────────────────────────
    match /users/{uid} {
      // 只能讀寫自己的 profile
      allow read, write: if request.auth.uid == uid;

      match /settings/{doc} {
        allow read, write: if request.auth.uid == uid;
      }
    }

    // ── trips ──────────────────────────────────────────
    match /trips/{tripId} {
      // travelers 陣列內的 uid 才能讀取
      allow read: if request.auth.uid in resource.data.travelers;

      // 只有 owner 能新增 / 修改 / 刪除
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.ownerId;

      // days subcollection：同 trip 規則
      match /days/{dayId} {
        allow read:   if request.auth.uid in get(/databases/$(database)/documents/trips/$(tripId)).data.travelers;
        allow write:  if request.auth.uid == get(/databases/$(database)/documents/trips/$(tripId)).data.ownerId;

        match /events/{eventId} {
          allow read:   if request.auth.uid in get(/databases/$(database)/documents/trips/$(tripId)).data.travelers;
          allow write:  if request.auth.uid == get(/databases/$(database)/documents/trips/$(tripId)).data.ownerId;
        }
      }

      // packing list：travelers 都能更新 done 狀態（共用打包清單）
      match /packingLists/{listId} {
        allow read:  if request.auth.uid in get(/databases/$(database)/documents/trips/$(tripId)).data.travelers;
        allow write: if request.auth.uid == get(/databases/$(database)/documents/trips/$(tripId)).data.ownerId;

        match /items/{itemId} {
          allow read: if request.auth.uid in get(/databases/$(database)/documents/trips/$(tripId)).data.travelers;
          // travelers 可以更新 done / note，但不能刪除項目
          allow update: if request.auth.uid in get(/databases/$(database)/documents/trips/$(tripId)).data.travelers
                        && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['done','note','updatedAt']);
          allow create, delete: if request.auth.uid == get(/databases/$(database)/documents/trips/$(tripId)).data.ownerId;
        }
      }
    }
  }
}
```

---

## 角色設計

| 角色 | 說明 | 目前實作 |
|---|---|---|
| `owner` | 建立行程的人，完整 CRUD | ✅ |
| `traveler` | 被邀請的旅伴，可讀取行程、更新打包勾選 | ✅（`travelers` 陣列） |
| `admin` | 可跨 trip 管理所有資料（預留） | ⬜ 未來 admin 畫面再啟用 |

---

## 前端整合規劃

### 套件安裝
```bash
pnpm add firebase
```

### 初始化（`src/boot/firebase.js`）
```js
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  // 從 Firebase Console > Project Settings 取得
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
```

敏感值存放在 `.env.local`（已列入 `.gitignore`），Vercel 部署時在 Environment Variables 設定同名的 `VITE_*` 變數。

### Pinia Store 建議結構
```
src/stores/
  auth.js        ← 登入狀態、currentUser
  trip.js        ← 當前 trip 資料、itineraryData（從 Firestore 即時監聽）
  packing.js     ← packingLists（即時監聽，支援離線寫入）
```

---

## 初始化操作流程

### 第一步：上傳資料到 Firestore（只跑一次）

在終端機執行：

```bash
node scripts/seed-firestore.mjs
```

成功後會看到：

```
✅ Trip document written
✅ Day 1 written (6 events)
✅ Day 2 written (6 events)
...
🎉 Seed complete!
```

### 第二步：在 Firebase Console 設定 Security Rules（無 Auth 的暫時版本）

前往 Firebase Console → Firestore → **Rules**，把預設規則改成允許讀取：

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /trips/{tripId}/{document=**} {
      allow read: if true;   // 任何人可讀
      allow write: if false; // 暫時禁止寫入（之後加 Auth 再開）
    }
  }
}
```

### 運作方式

```
App 啟動
  ↓
onSnapshot 訂閱 Firestore
  ↓
Firestore 資料載入 → itineraryData.value 更新 → 頁面自動更新
  ↓
任何裝置修改 Firestore 資料
  ↓
所有訂閱裝置立即收到推送 → 頁面 realtime 更新 ✅
```

載入期間會顯示靜態備用資料（`_staticData`），資料到位後無縫切換，使用者不會看到空白畫面。

Firebase SDK 是純前端套件，已經打包在你的 Vue app 裡了。只要 npm run dev，app 啟動後就會自動透過 HTTPS 連到 Firebase 的雲端伺服器，不需要在本機另外跑任何 Firebase 指令。


你的瀏覽器
  ↕ HTTPS
Firebase 雲端（Google 伺服器）
firebase CLI 指令（firebase serve、firebase emulators:start）只有在你想要完全離線開發或部署到 Firebase Hosting 時才需要用到，你的情況都不需要。
---

## 遷移策略（現在 → Firebase）

| 階段 | 工作項目 |
|---|---|
| **Step 1** | 建立 Firebase 專案，設定 Auth（Google 登入）|
| **Step 2** | 寫一次性遷移腳本，將 `MainLayout.vue` 內的硬編碼 `itineraryData` 上傳至 Firestore |
| **Step 3** | 建立 `src/boot/firebase.js`，在 `quasar.config.js` 的 `boot` 陣列中加入 |
| **Step 4** | 建立 `src/stores/trip.js`，用 `onSnapshot` 監聽 `trips/{tripId}/days` 與 `events` |
| **Step 5** | 將 `MainLayout.vue` 的 `provide('itineraryData')` 改為從 store 取得 |
| **Step 6** | 建立行程編輯 UI（新增 / 修改 / 刪除 event，拖曳排序） |
| **Step 7** | *(未來)* Admin 管理頁面，角色驗證 |

---

## 注意事項

- **離線支援**：Firestore 預設開啟本地快取，PWA 的 Service Worker 搭配後可在無網路時讀取上次資料。
- **sortOrder**：`events` 使用 `sortOrder` 整數排序（而非依賴 Firestore 插入順序），以支援未來的拖曳重排功能。
- **tripId**：目前單趟旅程，`tripId` 可先硬編碼為固定值（如 `oahu-2026`）；未來多趟旅程時再改為動態路由 `/trips/:tripId/days`。
- **travelers**：存放 uid 陣列（非 email），避免使用者換信箱後失效。
