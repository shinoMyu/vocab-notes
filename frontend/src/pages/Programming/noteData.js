import {
  loadNotes,
  persistNotes,
  sortByUpdatedAt,
} from "../../utils/noteStorage";

export const PROGRAMMING_CATEGORIES = [
  "前端",
  "後端",
  "資料庫",
  "工具",
  "架構",
];

export const CATEGORY_TONES = {
  前端: "blue",
  後端: "indigo",
  資料庫: "amber",
  工具: "teal",
  架構: "rose",
};

export function getCategoryTone(category) {
  return CATEGORY_TONES[category] ?? "slate";
}

const STORAGE_KEY = "vocab-notes:programming-notes:v1";

const SEED_NOTES = [
  {
    id: "programming-react-useeffect",
    title: "React useEffect 的依賴陣列",
    categories: ["前端"],
    updatedAt: "2026-11-13T16:40:00+09:00",
    content: `<p>useEffect 的依賴陣列決定副作用何時重跑；漏寫會每次渲染都執行，多寫則容易造成無限迴圈。</p>
<h2>基本規則</h2>
<ul>
  <li>空陣列：只在掛載後執行一次。</li>
  <li>有依賴：依賴值變更時重新執行。</li>
  <li>不寫：每次渲染後都執行。</li>
</ul>
<pre><code>useEffect(() =&gt; {
  const controller = new AbortController();
  fetchEntry(id, { signal: controller.signal });

  return () =&gt; controller.abort();
}, [id]);</code></pre>
<p>清理函式要處理掉上一次的請求，否則快速切換資料時會出現競態。</p>`,
  },
  {
    id: "programming-jpa-n-plus-one",
    title: "Spring Data JPA 的 N+1 查詢",
    categories: ["後端"],
    updatedAt: "2026-11-12T20:15:00+09:00",
    content: `<p>用 <code>@ManyToOne</code> 取清單時，每筆關聯各發一次查詢，就是典型的 N+1。</p>
<h2>解法</h2>
<ul>
  <li>在 repository 用 <code>@EntityGraph</code> 一次抓回關聯。</li>
  <li>或改用 JPQL 的 <code>join fetch</code>。</li>
</ul>
<pre><code>@EntityGraph(attributePaths = "tags")
List&lt;VocabularyEntry&gt; findAllByOrderByCreatedAtDesc();</code></pre>
<p>先用量測工具確認查詢次數，再決定是否最佳化。</p>`,
  },
  {
    id: "programming-sql-join-index",
    title: "SQL JOIN 與索引的基本檢查",
    categories: ["資料庫"],
    updatedAt: "2026-11-11T14:05:00+09:00",
    content: `<p>JOIN 效能取決於<strong>連結欄位有沒有索引</strong>，以及查詢是否用到複合索引的最左前綴。</p>
<h2>實務檢查</h2>
<ul>
  <li>用 <code>EXPLAIN</code> 確認是否走 index。</li>
  <li>複合索引 (language, term) 只能從 language 開始使用。</li>
</ul>
<pre><code>EXPLAIN SELECT v.term, t.name
FROM vocabulary_entry v
JOIN entry_tag et ON et.entry_id = v.id
JOIN tag t ON t.id = et.tag_id
WHERE v.language = 'en';</code></pre>
<p>資料量小時差異不明顯，但寫法要先正確。</p>`,
  },
  {
    id: "programming-git-rebase-merge",
    title: "Git rebase 與 merge 的取捨",
    categories: ["工具"],
    updatedAt: "2026-11-10T09:30:00+09:00",
    content: `<p>兩者差別在提交歷史的形狀：merge 保留分支事實，rebase 把提交重排成一直線。</p>
<ul>
  <li>共用分支：用 merge，不要改寫別人的歷史。</li>
  <li>自己的 feature 分支：rebase 後再開 PR，歷史較乾淨。</li>
</ul>
<pre><code>git fetch origin
git rebase origin/main</code></pre>
<p>rebase 衝突時逐筆解決，確認測試通過再繼續。</p>`,
  },
  {
    id: "programming-docker-compose",
    title: "用 Docker Compose 啟動開發環境",
    categories: ["工具"],
    updatedAt: "2026-11-09T18:20:00+09:00",
    content: `<p>把資料庫、後端、前端放進同一個 compose 檔，開發環境就能一行指令啟動。</p>
<pre><code>services:
  db:
    image: mysql:8.4
    ports: ["3306:3306"]
  api:
    build: .
    depends_on: [db]</code></pre>
<p>只在開發環境用 <code>ports</code> 對外；正式環境交給反向代理。</p>`,
  },
  {
    id: "programming-layered-architecture",
    title: "前後端分離的分層方式",
    categories: ["架構"],
    updatedAt: "2026-11-08T11:10:00+09:00",
    content: `<p>Controller 只處理 HTTP 邊界，Service 放商業邏輯，Repository 負責資料存取。</p>
<ul>
  <li><strong>Controller</strong>：驗證輸入、轉換 DTO。</li>
  <li><strong>Service</strong>：交易邊界與規則。</li>
  <li><strong>Repository</strong>：查詢與持久化。</li>
</ul>
<p>分層不是為了檔案數量，而是讓每一層只承擔一種變更原因。</p>`,
  },
];

export function loadProgrammingNotes() {
  return loadNotes(STORAGE_KEY, SEED_NOTES);
}

export function persistProgrammingNotes(notes) {
  persistNotes(STORAGE_KEY, notes);
}

export function createProgrammingDraft(note) {
  return {
    id: note?.id ?? null,
    title: note?.title ?? "",
    categories: [...(note?.categories ?? [])],
    content: note?.content ?? "",
    updatedAt: note?.updatedAt ?? null,
  };
}

export function createProgrammingDraftFromState(state) {
  const draft = createProgrammingDraft(null);

  if (state?.category) {
    draft.categories = [state.category];
  }

  return draft;
}

export { sortByUpdatedAt };
