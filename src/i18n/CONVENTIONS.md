# `src/i18n/` 撰寫規範

本文件定義國際化字串的命名、雙語同步規則，以及目前的實作現況。
所有開發者、AI 在新增或修改 i18n 字串之前，必須先閱讀本規範。

---

## 目前結構（2026-05）

```
src/i18n/
  index.js          ← 彙整所有 locale，由 src/boot/i18n.js 引入
  en-US/
    index.json      ← 所有英文字串（flat object，字母排序）
  zh-TW/
    index.json      ← 所有中文字串（同上）
```

> 格式為 JSON（非 JS module），i18n-ally 才能正確解析並顯示翻譯提示。

---

## 核心原則

- **en-US 跟 zh-TW 必須同步**。新增 / 修改任何 key 必須兩邊一起動，不允許只動一邊
- **Key 用 snake_case，值用使用者語言**。Key 不會出現在 UI，是 i18n lookup 的內部代號
- **新增 key 請手動維持字母排序**（目前沒有自動排序 hook）
- **不在元件寫死中文 / 英文**。所有 UI 固定文字一律走 `t(...)`

---

## 行程資料的雙語欄位（`loc()`）

行程資料（`itineraryData`）的 `title`、`event.title`、`event.desc`、`event.location`  
不走 i18n key，而是直接在物件裡存雙語值：

```js
{
  title: { zh: '抵達阿羅哈！', en: 'Aloha! Arrival Day' },
  events: [
    {
      title:    { zh: '抵達檀香山', en: 'Arrive at Honolulu' },
      desc:     { zh: '班機抵達...', en: 'Flight lands...' },
      location: { zh: '檀香山國際機場', en: 'Honolulu International Airport' },
    }
  ]
}
```

若只填一種語言，另一邊留空字串 `''`，`loc()` 會自動 fallback 到有值的那邊。

在 template 中使用 `loc()` 取值（由 `MainLayout.vue` provide）：

```js
const loc = inject('loc')
// template: {{ loc(day, 'title') }}  或  {{ loc(event, 'desc') }}
```

---

## 在元件使用 UI 翻譯

```js
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
// template: {{ t('some_key') }}
```

切換語系（在 `src/layouts/MainLayout.vue` 管理）：

```js
const { locale } = useI18n()
locale.value = 'zh-TW'  // 或 'en-US'
```

---

## 新增 UI 翻譯 key

1. 在 `src/i18n/en-US/index.json` 新增 key（字母排序位置）
2. 在 `src/i18n/zh-TW/index.json` 新增對應 key（同順序）
3. 在元件改用 `t('your_key')` 取代硬寫的文字

---

## VSCode i18n-ally 設定

`.vscode/settings.json` 已設定：
- `localesPaths`: `src/i18n`
- `pathMatcher`: `{locale}/index.{ext}`
- `enabledParsers`: `json`

儲存後若警告未消失，執行 `Ctrl+Shift+P` → **Developer: Reload Window**。
