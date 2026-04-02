# 🌺 Oahu - 夏威夷慵懶行

一個基於 Vue 3 + Quasar Framework 打造的夏威夷旅遊行程 Progressive Web App (PWA)。

## 📖 專案簡介

Oahu 是一個現代化的旅遊行程規劃應用程式，專為規劃夏威夷歐胡島 (Oahu) 旅程而設計。本專案採用 PWA 架構，支援離線瀏覽，並針對行動裝置進行優化，讓您隨時隨地都能查看旅遊計畫。

### ✨ 核心特色

- 📱 **響應式設計 (RWD)**: 完美支援 iPhone、iPad 和 MacBook
- 🌓 **明/暗模式**: 夏威夷主題色彩，支援日夜模式切換
- 📴 **離線優先**: PWA 架構，離線也能瀏覽行程
- 🎨 **精美 UI**: 基於 Quasar Framework 的 Material Design
- ⚡ **快速載入**: Vite 建置工具，極致效能

## 🛠️ 技術棧

- **前端框架**: Vue 3 (Composition API)
- **UI 框架**: Quasar Framework v2 (Vite)
- **狀態管理**: Pinia / Vue Router
- **建置工具**: Quasar CLI with Vite
- **PWA**: Service Worker + Workbox
- **部署平台**: Vercel

## 📁 專案結構

```
oahu/
├── src/
│   ├── assets/          # 靜態資源（圖片、字型等）
│   ├── components/      # Vue 組件
│   ├── css/            # 全域樣式
│   │   └── quasar.variables.scss  # Quasar 主題變數
│   ├── layouts/        # 佈局組件
│   │   └── MainLayout.vue
│   ├── pages/          # 頁面組件
│   │   └── IndexPage.vue
│   ├── router/         # Vue Router 配置
│   └── stores/         # Pinia stores
├── src-pwa/           # PWA 相關配置
│   ├── custom-service-worker.js
│   └── manifest.json
├── public/            # 公開靜態資源
├── dist/              # 編譯輸出目錄
├── quasar.config.js   # Quasar 配置檔案
├── vercel.json        # Vercel 部署配置
└── package.json
```

## 🚀 快速開始

### 環境需求

- Node.js >= 16.x
- npm >= 8.x 或 pnpm
- Quasar CLI

### 從 GitHub 同步並啟動

```bash
# 1. 克隆專案
git clone <your-repository-url>
cd oahu

# 2. 安裝 Quasar CLI（如尚未安裝）
npm install -g @quasar/cli

# 3. 安裝專案依賴
npm install

# 4. 啟動開發伺服器
quasar dev
```

開發伺服器預設會在 `http://localhost:9030` 啟動。

## 🎨 主題色彩

### 明亮模式
- **Primary**: `#00897B` (Teal 清新綠)
- **Secondary**: `#F4A261` (溫暖金橘)
- **Accent**: `#E07A5F` (珊瑚橙)

### 暗色模式
- **Background**: `#151E27` (深海藍灰)
- 其他主色保持一致

調整色彩請編輯 `src/css/quasar.variables.scss`。

## 📱 響應式斷點

- **xs** (< 600px): iPhone - 側邊欄隱藏，透過漢堡選單喚出
- **sm** (600px - 1023px): iPad - 側邊欄固定顯示
- **md/lg** (≥ 1024px): MacBook - 內容置中，最大寬度 900px

## 🧹 程式碼品質

### Lint 檢查

```bash
npm run lint
# 或
yarn lint
```

### 格式化程式碼

```bash
npm run format
# 或
yarn format
```

## 📦 建置正式版本

### 建置 PWA

```bash
quasar build -m pwa
```

編譯後的檔案會產生在 `dist/pwa` 目錄。

### 本地預覽正式版本

```bash
quasar serve dist/pwa
```

## 🚢 部署到 Vercel

### 方法一: 透過 Vercel CLI

1. 安裝 Vercel CLI：
```bash
npm install -g vercel
```

2. 登入 Vercel：
```bash
vercel login
```

3. 部署專案：
```bash
vercel
```

### 方法二: 透過 Vercel Dashboard

1. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
2. 點擊「Import Project」
3. 選擇您的 Git repository
4. 設定建置參數：
   - **Framework Preset**: Other
   - **Build Command**: `npx quasar build -m pwa`
   - **Output Directory**: `dist/pwa`
   - **Install Command**: `npm install`
5. 點擊「Deploy」

### Vercel 設定檔

專案已包含 `vercel.json`，確保 SPA 路由正常運作：

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## 📝 PWA 功能

- ✅ 離線快取：Service Worker 自動快取靜態資源
- ✅ 可安裝：支援「加入主畫面」功能
- ✅ 獨立視窗：以獨立 App 模式啟動
- ✅ 快速載入：預快取關鍵資源

### PWA 設定

編輯 `quasar.config.js` 中的 PWA 區塊來自訂：

```javascript
pwa: {
  workboxMode: 'generateSW',
  manifest: {
    name: '夏威夷慵懶行',
    short_name: 'Oahu Trip',
    theme_color: '#00695c',
    background_color: '#ffffff'
  }
}
```

## 🤝 開發指南

1. 遵循 Vue 3 Composition API 風格
2. 使用 Quasar 內建組件優先
3. 圖示使用 Material Icons 或 FontAwesome 7
4. 響應式設計優先 (Mobile First)
5. 保持程式碼簡潔，適時抽取可重用組件

## 📄 授權

本專案僅供個人旅遊使用。

## 🔗 相關連結

- [Quasar Framework 官方文件](https://quasar.dev/)
- [Vue 3 官方文件](https://vuejs.org/)
- [Vercel 部署文件](https://vercel.com/docs)

---

Made with ❤️ for a lazy Hawaiian trip 🏝️
