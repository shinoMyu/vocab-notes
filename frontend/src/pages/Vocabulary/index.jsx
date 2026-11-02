import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import VocabularyList from "./components/VocabularyList";
import VocabularyDetail from "./components/VocabularyDetail";
import VocabularyForm from "./components/VocabularyForm";

import { demoEntries } from "../../data/vocabularyDemo";

import "./index.css";

function Vocabulary() {
  const location = useLocation();
  const navigate = useNavigate();

  const language = location.pathname.includes("japanese")
    ? "ja"
    : "en";

  const isEnglish = language === "en";

  const initialEntryId = location.state?.entryId ?? null;

  const [entries, setEntries] = useState(demoEntries);
  const [pageMode, setPageMode] = useState(
    initialEntryId ? "detail" : "list"
  );
  const [selectedId, setSelectedId] = useState(initialEntryId);

  const languageEntries = entries.filter(
    (entry) => entry.language === language
  );

  const selectedEntry =
    languageEntries.find((entry) => entry.id === selectedId) || null;

  function handleAdd() {
    setPageMode("create");
  }

  function handleSelect(entry) {
    if (pageMode === "edit") return;

    if (selectedId === entry.id) {
      setSelectedId(null);
      setPageMode("list");
      return;
    }

    setSelectedId(entry.id);
    setPageMode("detail");
  }

  function handleCloseDetail() {
    setSelectedId(null);
    setPageMode("list");
  }

  function handleEdit() {
    if (!selectedEntry) return;

    setPageMode("edit");
  }

  function handleOpenRelated() {
    if (!selectedEntry?.relatedTerm) return;

    const targetLanguage = language === "en" ? "ja" : "en";
    const target = entries.find(
      (entry) =>
        entry.language === targetLanguage &&
        (entry.id === selectedEntry.relatedEntryId ||
          entry.term === selectedEntry.relatedTerm)
    );

    if (!target) return;

    setSelectedId(target.id);
    setPageMode("detail");
    navigate(
      target.language === "ja"
        ? "/vocabulary/japanese"
        : "/vocabulary/english",
      { state: { entryId: target.id } }
    );
  }

  function handleCancel() {
    setPageMode(pageMode === "edit" ? "detail" : "list");
  }

  function handleSave(formData) {
    if (pageMode === "create") {
      const newEntry = {
        ...formData,
        id: crypto.randomUUID(),
        language,
      };

      setEntries((previous) => [...previous, newEntry]);
      setSelectedId(newEntry.id);
    } else if (pageMode === "edit" && selectedEntry) {
      setEntries((previous) =>
        previous.map((entry) =>
          entry.id === selectedEntry.id
            ? {
              ...formData,
              id: entry.id,
              language,
            }
            : entry
        )
      );

      setSelectedId(selectedEntry.id);
    }

    setPageMode("detail");
  }

  function handleDelete(id) {
    if (!window.confirm("確定要刪除這個單字嗎？")) {
      return;
    }

    setEntries((previous) =>
      previous.filter((entry) => entry.id !== id)
    );

    setSelectedId(null);
    setPageMode("list");
  }

  return (
    <div className={`vocabulary-workspace ${pageMode}`}>

      {(pageMode === "list" ||
        pageMode === "detail" ||
        pageMode === "edit") && (
        <>
          {/* Page Heading */}
          <header className="vocabulary-page-heading">
            <div className="vocabulary-heading-info">
              <p className="vocabulary-eyebrow">
                {isEnglish
                  ? "ENGLISH VOCABULARY"
                  : "JAPANESE VOCABULARY"}
              </p>

              <h1>{isEnglish ? "英文單字" : "日文單字"}</h1>

              {languageEntries.length > 0 && (
                <span className="vocab-count">
                  共 {languageEntries.length} 個單字
                </span>
              )}
            </div>

            <button
              className="primary-button"
              type="button"
              onClick={handleAdd}
            >
              新增單字
            </button>
          </header>

          {/* Content */}
          {languageEntries.length === 0 ? (
            <section className="vocabulary-empty">
              <div className="vocabulary-empty-content">
                <span className="vocabulary-empty-label">
                  YOUR COLLECTION
                </span>

                <h2>從第一個單字開始</h2>

                <p>
                  目前還沒有收錄任何{isEnglish ? "英文" : "日文"}單字，請點擊右上角「新增單字」，
                  <br/>將新的單字記錄下來，方便查閲與復習。
                </p>
              </div>
            </section>
          ) : (
            <div
              className={`vocabulary-browser ${selectedEntry ? "has-selection" : ""
                }`}
            >
              <section className="vocabulary-browser-sidebar">
                <VocabularyList
                  entries={languageEntries}
                  selectedId={selectedEntry?.id}
                  onSelect={handleSelect}
                />
              </section>

              {selectedEntry && (
                <section className="vocabulary-browser-content">
                  <VocabularyDetail
                    entry={selectedEntry}
                    isEditing={pageMode === "edit"}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    onEdit={handleEdit}
                    onOpenRelated={handleOpenRelated}
                    onDelete={handleDelete}
                    onClose={handleCloseDetail}
                  />
                </section>
              )}
            </div>
          )}
        </>
      )}

      {/* Create */}
      {pageMode === "create" && (
        <VocabularyForm
          key={language}
          language={language}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

    </div>
  );
}

export default Vocabulary;