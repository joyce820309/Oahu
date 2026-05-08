# `src/pages/` 撰寫規範



---

## 目前結構（2026-05）



---

## 核心原則
- 已使用套件 unplugin-auto-import
  不需要寫 import { useI18n } from 'vue-i18n'
  不需要寫 import { ref.... } from 'vue'



---


## 在元件使用

```js
const { t } = useI18n()
// template: {{ t('some_key') }}
```




