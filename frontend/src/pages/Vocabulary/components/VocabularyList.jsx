import { useState } from "react";
import { ChevronDown, List, LayoutGrid } from "lucide-react";

import SearchBar from "../../../components/SearchBar";
import { FREQUENCY_META } from "../vocabularyMeta";
import { getDerivedTag, getTagColorStyle } from "../tagUtils";
import "./VocabularyList.css";

const DERIVED_TAGS = ["超使える", "使える"];

function VocabularyList({
  entries,
  selectedId,
  tagColors,
  onSelect,
  onImport,
}) {
  const [keyword, setKeyword] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [collapsedGroups, setCollapsedGroups] = useState({});

  // null 代表「全部」
  const [activeTag, setActiveTag] = useState(null);

  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState("");
  const [importResult, setImportResult] = useState(null);
  const [isImporting, setIsImporting] = useState(false);

  const filteredEntries = entries
    .filter(
      (entry) =>
        !activeTag || getDerivedTag(entry.frequencyLevel) === activeTag
    )
    .filter((entry) => {
      const text = `${entry.term} ${entry.chineseExplanation}`;

      return text.toLowerCase().includes(keyword.trim().toLowerCase());
    });

  // 分組檢視：依頻度標籤歸組，沒有標籤的單字收進「未標籤」
  const groupMap = new Map(DERIVED_TAGS.map((tag) => [tag, []]));
  const untaggedEntries = [];

  for (const entry of filteredEntries) {
    const tag = getDerivedTag(entry.frequencyLevel);

    if (tag) {
      groupMap.get(tag).push(entry);
    } else {
      untaggedEntries.push(entry);
    }
  }

  const groups = [...groupMap.entries()]
    .filter(([, list]) => list.length > 0)
    .map(([tag, list]) => ({ tag, list }));

  if (untaggedEntries.length > 0) {
    groups.push({ tag: "未標籤", list: untaggedEntries });
  }

  function toggleGroup(tag) {
    setCollapsedGroups((previous) => ({
      ...previous,
      [tag]: !previous[tag],
    }));
  }

  function handleCardKeyDown(event, entry) {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    onSelect(entry);
  }

  function handleToggleFilter(tag) {
    setActiveTag((previous) => (previous === tag ? null : tag));
  }

  function closeImportModal() {
    setIsImportOpen(false);
    setImportError("");
    setImportResult(null);
  }

  async function handleImportSubmit() {
    setImportError("");
    setImportResult(null);

    let items;

    try {
      items = JSON.parse(importText);
    } catch {
      setImportError("JSON 格式不正確，請檢查是否為陣列格式。");
      return;
    }

    if (!Array.isArray(items) || items.length === 0) {
      setImportError("請貼上至少一筆單字資料（JSON 陣列）。");
      return;
    }

    setIsImporting(true);

    try {
      const result = await onImport(items);
      setImportResult(result);
    } catch {
      // 失敗時 workspace 上方會顯示錯誤訊息
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <div className="vocab-panel">
      <div className="vocab-panel-toolbar">
        <SearchBar
          value={keyword}
          onChange={setKeyword}
          placeholder="搜尋單字或解釋…"
          ariaLabel="搜尋單字"
          onSubmit={(value) => setKeyword(value)}
        />

        <div className="vocab-toolbar-actions">
          <div className="vocab-view-toggle" role="group" aria-label="檢視方式">
            <button
              type="button"
              className={viewMode === "list" ? "is-active" : ""}
              aria-label="清單檢視"
              aria-pressed={viewMode === "list"}
              title="清單檢視"
              onClick={() => setViewMode("list")}
            >
              <LayoutGrid size={17} strokeWidth={1.8} />
            </button>

            <button
              type="button"
              className={viewMode === "groups" ? "is-active" : ""}
              aria-label="分組檢視"
              aria-pressed={viewMode === "groups"}
              title="分組檢視"
              onClick={() => setViewMode("groups")}
            >
              <List size={17} strokeWidth={1.8} />
            </button>
          </div>

          <button
            type="button"
            className="vocab-toolbar-button"
            onClick={() => setIsImportOpen(true)}
          >
            匯入
          </button>
        </div>
      </div>

      {viewMode === "list" && (
        <div className="vocab-panel-controls">
          <div className="vocab-filter-bar">
            <button
              type="button"
              className={`vocab-filter-chip ${activeTag === null ? "is-active" : ""}`}
              onClick={() => setActiveTag(null)}
            >
              全部
            </button>

            {DERIVED_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`vocab-filter-chip ${activeTag === tag ? "is-active" : ""}`}
                style={getTagColorStyle(tagColors, tag)}
                title="依使用頻度自動分類"
                onClick={() => handleToggleFilter(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredEntries.length > 0 && viewMode === "groups" && (
        <div className="vocab-groups">
          {groups.map((group) => {
            const isCollapsed = Boolean(collapsedGroups[group.tag]);

            return (
              <section key={group.tag} className="vocab-group">
                <button
                  type="button"
                  className="vocab-group-header"
                  aria-expanded={!isCollapsed}
                  onClick={() => toggleGroup(group.tag)}
                >
                  <ChevronDown
                    size={16}
                    className={`vocab-group-caret ${isCollapsed ? "is-collapsed" : ""}`}
                    aria-hidden="true"
                  />

                  <span
                    className="vocab-group-chip"
                    style={getTagColorStyle(tagColors, group.tag)}
                  >
                    {group.tag}
                  </span>

                  <span className="vocab-group-count">
                    {group.list.length} 個單字
                  </span>
                </button>

                {!isCollapsed && (
                  <div className="vocab-group-body">
                    {group.list.map((entry) => {
                      const frequency = entry.frequencyLevel
                        ? FREQUENCY_META[entry.frequencyLevel]
                        : null;

                      return (
                        <button
                          key={entry.id}
                          type="button"
                          className={`vocab-group-row ${selectedId === entry.id ? "selected" : ""
                            }`}
                          onClick={() => onSelect(entry)}
                        >
                          <span className="vocab-group-row-term">
                            {entry.term}
                          </span>

                          <span className="vocab-group-row-meta">
                            {(entry.partOfSpeech ?? []).join(" ")}
                          </span>

                          {frequency && (
                            <span
                              className={`vocab-card-freq ${frequency.className}`}
                              title={`${entry.frequencyLevel}（頻度 ${frequency.range}）`}
                            >
                              <i />
                              {frequency.score}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}

      {filteredEntries.length > 0 && viewMode === "list" && (
        <div className="vocab-grid" role="list">
          {filteredEntries.map((entry) => {
            const frequency = entry.frequencyLevel
              ? FREQUENCY_META[entry.frequencyLevel]
              : null;

            return (
              <div
                key={entry.id}
                role="listitem"
                tabIndex={0}
                className={`vocab-card ${selectedId === entry.id ? "selected" : ""
                  }`}
                onClick={() => onSelect(entry)}
                onKeyDown={(event) => handleCardKeyDown(event, entry)}
              >
                <span className="vocab-card-term">{entry.term}</span>

                <span className="vocab-card-meta">
                  {(entry.partOfSpeech ?? []).length > 0 && (
                    <span className="vocab-card-pos">
                      {(entry.partOfSpeech ?? []).join(" ")}
                    </span>
                  )}

                  {frequency && (
                    <span
                      className={`vocab-card-freq ${frequency.className}`}
                      title={`${entry.frequencyLevel}（頻度 ${frequency.range}）`}
                    >
                      <i />
                      {frequency.score}
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {filteredEntries.length === 0 && (
        <div className="list-empty">
          <p>找不到符合的單字，試試其他關鍵字。</p>
        </div>
      )}

      {isImportOpen && (
        <div className="vocab-import-overlay" onClick={closeImportModal}>
          <div
            className="vocab-import-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="批次匯入"
            onClick={(event) => event.stopPropagation()}
          >
            <h3>批次匯入</h3>

            <p className="vocab-import-hint">
              貼上單字 JSON 陣列（欄位與「新增單字」相同，語言會自動代入目前頁面）。
              已存在的單字會自動跳過，不影響其他資料。
            </p>

            <textarea
              className="vocab-import-textarea"
              value={importText}
              onChange={(event) => setImportText(event.target.value)}
              placeholder='[{"term":"persuade","pronunciation":"/pərˈsweɪd/","partOfSpeech":["v."],"chineseExplanation":"說服；勸說。","frequencyLevel":"そこそこ使う","etymology":"源自拉丁語 persuadere……","collocations":[{"phrase":"persuade someone to do something","explanation":"說服某人做某事"}],"examples":[{"sentence":"I finally persuaded him to come with us.","translation":"我終於說服他跟我們一起來了。"}],"usageNotes":"……"}]'
            />

            {importError && (
              <p className="vocab-import-error" role="alert">
                {importError}
              </p>
            )}

            {importResult && (
              <p className="vocab-import-result">
                匯入完成：新增 {importResult.created} 筆
                {importResult.skipped.length > 0 &&
                  `，跳過 ${importResult.skipped.length} 筆（${importResult.skipped.join("、")}）`}
                。
                {importResult.failed.length > 0 &&
                  ` 失敗 ${importResult.failed.length} 筆：${importResult.failed.join("；")}`}
              </p>
            )}

            <div className="vocab-import-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={closeImportModal}
              >
                關閉
              </button>

              <button
                type="button"
                className="primary-button"
                disabled={isImporting}
                onClick={handleImportSubmit}
              >
                {isImporting ? "匯入中…" : "開始匯入"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VocabularyList;
