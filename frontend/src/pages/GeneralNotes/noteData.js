import { loadNotes, persistNotes } from "../../utils/noteStorage";

const STORAGE_KEY = "vocab-notes:general-notes:v1";

const SEED_NOTES = [
  {
    id: "notes-graduation-plan",
    title: "畢業研究接下來要做的事",
    updatedAt: "2026-11-13T18:10:00+09:00",
    content: `這一週先把可以動的功能補齊，再整理提交材料。

1. 完成程式筆記與一般筆記頁面
2. 補上英文與日文的真實筆記資料
3. 走一遍 demo 流程並截圖

材料以日文摘要與系統架構圖為主，功能截圖放在附錄。`,
  },
  {
    id: "notes-reading-list",
    title: "待讀清單",
    updatedAt: "2026-11-12T22:30:00+09:00",
    content: `- 《リーダブルコード》第 6 章
- Spring Data JPA 官方文件的 fetching 章節
- Notion 的 database 檢視設計筆記`,
  },
  {
    id: "notes-ui-ideas",
    title: "介面靈感：列表與筆記頁",
    updatedAt: "2026-11-10T12:45:00+09:00",
    content: `列表頁維持分組與搜尋，點進去才打開完整筆記，避免一次塞進太多資訊。
「瀏覽時像目錄，閱讀時像文件。」

行距、標題層級與側欄收合，是之後要再調整的地方。`,
  },
];

export function loadGeneralNotes() {
  return loadNotes(STORAGE_KEY, SEED_NOTES);
}

export function persistGeneralNotes(notes) {
  persistNotes(STORAGE_KEY, notes);
}
