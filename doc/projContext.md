你現在是一位資深的前端工程師，精通 Vue 3 (Composition API) 與 Quasar Framework (Vite 版本)。
我的目標是建立一個名為 Oahu 的夏威夷旅遊行程 PWA (Progressive Web App)，並準備將其部署到 Vercel。我已經準備好了一份核心的 UI 程式碼。

請依照以下 Phase 1 到 Phase 4 的步驟，一步步幫我完成專案的初始化與重構。每完成一個 Phase，請向我確認後再進行下一步。
---
### Phase 1: 專案初始化與 PWA 模式啟用

請在當前目錄下，使用 Quasar CLI 初始化一個全新的專案。

- 專案名稱：Oahu
- 建置工具：Quasar CLI with Vite
- 框架：Vue 3 (Composition API)
- 樣式處理：不需要額外的 CSS 預處理器，使用 Quasar 預設- 即可。
- 狀態管理/路由：可以用 Pinia 或簡單的 Vue Router 區分架構
- 進入專案目錄 (cd Oahu)，安裝所有 npm 依賴套件

- 執行指令 quasar mode add pwa，為此專案注入 PWA 相關目錄 (src-pwa) 與配置
---
### Phase 2: 整合現有 UI 程式碼

1. 請檢查 quasar.config.js，確保 extras 陣列中已經啟用了 material-icons & font-awesome 7（因為我的 UI 會大量使用到 Icons）。

2. 我有一段寫好的 Vue 3 + Quasar UI 程式碼（包含 q-layout, q-drawer, q-timeline 等）。請將預設的 src/layouts/MainLayout.vue 與 src/pages/IndexPage.vue 的內容清空或整合，並將我的這段程式碼作為應用程式的主要進入點與佈局。
(提示 Agent：此處我會將前面寫好的 Oahu.vue 程式碼貼給你，請以此覆蓋)

3. 我會先在web端開發，請提供一個localhost port，讓我可以看到畫面
---
### Phase 3: UI 細節調整

#### 設定夏威夷色彩主題 (明/暗雙模)：

請在 src/css/quasar.variables.scss 中設定明亮模式：`Primary`, `Secondary`, `Accent`。

設定暗色模式專用的背景色：將 $dark 設為 #1D2426

在 Layout Header 中加入一個切換按鈕，綁定 `$q.dark.toggle()` 讓使用者能手動切換日夜模式，並根據當前狀態切換 `light_mode` 與 `dark_mode icon`。

顏色設定請參考 `ColorTheme.md`

#### 實作 RWD (響應式設計)：

我的目標設備為 iPhone (xs)、iPad (sm/md)、13吋 MacBook (md/lg)。請全面檢查 UI，確保使用 Quasar 的 Grid 系統與響應式類別（如 lt-md, gt-sm, col-xs-12, col-md-8 等）來控制版面。

- iPhone (xs): 側邊欄 (Drawer) 預設必須隱藏，透過 Header 的漢堡選單喚出；主內容滿版。

- iPad & MacBook (sm/md/lg): 側邊欄應固定在左側顯示，不遮擋主內容 (使用 show-if-above)；主內容區塊應置中且限制最大寬度 (例如 max-width: 900px)，避免文字過度拉長。
---
### Phase 4: PWA 細節設定與優化

請修改 src-pwa/custom-service-worker.js 或相關設定，確保基本的靜態資源（HTML, JS, CSS, 圖示）都能被 Workbox 快取，以支援離線瀏覽。

幫我修改 quasar.config.js 裡面的 PWA 設定：

- manifest.name: "夏威夷慵懶行"
- manifest.short_name: "Oahu Trip"
- manifest.theme_color: "#00695c" (Quasar teal-9 的顏色)

- manifest.background_color: "#ffffff"

- manifest.display: "standalone"
---
### Phase 5: Vercel 部署準備

在專案根目錄建立一個 vercel.json 檔案（如果需要的話），確保 Vercel 在路由重定向時能正確指向 index.html。

準備一份 .gitignore，確保 node_modules, dist, .quasar 等編譯檔案不會被加入 Git。

提供給我一份簡單的 Readme 指南，告訴我如何在 Vercel 上正確設定 Build Command (npx quasar build -m pwa) 與 Output Directory (dist/pwa)。