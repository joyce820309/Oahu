## 各文件系統的用途與 maintain 優先級
你需要 maintain 給我（Claude Code）的

### 權重最高 — 必須維護
| 路徑                  | 用途                                   | 備註 |

| CLAUDE.md             | 每次對話都自動載入，是我的「工作說明書」  | 架構、指令、設計系統都在這 |
| src/*/CONVENTIONS.md  | 我在寫那個目錄的程式碼時會主動參考        | stores/、pages/、i18n/ 等各自的規範 |
| doc/*.md              | 背景知識（色系、Firebase 架構、專案脈絡） | 我不會自動載入，但你說「參考 doc/」我就會讀 |


### 給其他 LLM / 工具看的，你通常不需要手動 maintain

| 路徑	                         | 誰在用	                                 | 需要動嗎？ |
| .github/instructions/*.md 	 | GitHub Copilot — applyTo 決定哪些檔案觸發  |	只在 Copilot 規則要改時動
| .agents/skills/	             | Claude Code skill system 自動管理         |	不要手動編輯，由工具自動產生
| .claude/skills/	             | 同上，本地 skill 快取                      | 同上
| skills-lock.json	             | skill 版本鎖定	                          | 同上
| .claude/settings.local.json	 | 你自己的本地權限設定                        | 按需調整，不需為我維護


## 結論：你真正需要 maintain 的只有三層

- CLAUDE.md                     ← 最重要，架構異動必更新
- src/*/CONVENTIONS.md          ← 各模組規範，新增 store/頁面時更新
- doc/*.md                      ← 設計決策背景，大改動時更新

.github/instructions/ 只需在 Copilot 工作流程改變時調整
.agents/、.claude/skills/ 完全不需要手動碰。