import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import VocabularyList from "./components/VocabularyList";
import VocabularyDetail from "./components/VocabularyDetail";
import VocabularyForm from "./components/VocabularyForm";

import {
  createVocabulary,
  deleteVocabulary,
  getVocabulary,
  updateVocabulary,
} from "../../api/vocabulary";

import "./index.css";

function toRequest(formData, language) {
  return {
    language,
    term: formData.term,
    chineseExplanation: formData.chineseExplanation,
    pronunciation: formData.pronunciation,
    partOfSpeech: formData.partOfSpeech,
    frequencyLevel: formData.frequencyLevel,
    etymology: formData.etymology,
    usageNotes: formData.usageNotes,
    collocations: formData.collocations,
    examples: formData.examples,
  };
}

function VocabularyWorkspace({ language, initialEntryId }) {
  const navigate = useNavigate();
  const isEnglish = language === "en";

  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [reloadToken, setReloadToken] = useState(0);
  const [pageMode, setPageMode] = useState(
    initialEntryId ? "detail" : "list"
  );
  const [selectedId, setSelectedId] = useState(initialEntryId);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getVocabulary(language)
      .then((data) => {
        if (cancelled) return;

        setEntries(data);
        setLoadError("");
      })
      .catch((requestError) => {
        if (cancelled) return;

        setEntries([]);
        setLoadError(requestError.message);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [language, reloadToken]);

  const selectedEntry =
    entries.find((entry) => entry.id === selectedId) || null;

  function handleRetry() {
    setIsLoading(true);
    setLoadError("");
    setReloadToken((value) => value + 1);
  }

  function handleAdd() {
    setActionError("");
    setPageMode("create");
  }

  function handleSelect(entry) {
    if (pageMode === "edit") return;

    setActionError("");

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

    setActionError("");
    setPageMode("edit");
  }

  function handleOpenRelated() {
    if (!selectedEntry?.relatedEntryId) return;

    navigate(
      language === "en" ? "/vocabulary/japanese" : "/vocabulary/english",
      { state: { entryId: selectedEntry.relatedEntryId } }
    );
  }

  function handleCancel() {
    setPageMode(pageMode === "edit" ? "detail" : "list");
  }

  async function handleSave(formData) {
    if (isSaving) return;

    setIsSaving(true);
    setActionError("");

    try {
      if (pageMode === "create") {
        const savedEntry = await createVocabulary(
          toRequest(formData, language)
        );

        setEntries((previous) => [...previous, savedEntry]);
        setSelectedId(savedEntry.id);
      } else if (selectedEntry) {
        const savedEntry = await updateVocabulary(
          selectedEntry.id,
          toRequest(formData, language)
        );

        setEntries((previous) =>
          previous.map((entry) =>
            entry.id === savedEntry.id ? savedEntry : entry
          )
        );
        setSelectedId(savedEntry.id);
      }

      setPageMode("detail");
    } catch (requestError) {
      setActionError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id) {
    setActionError("");

    try {
      await deleteVocabulary(id);

      setEntries((previous) =>
        previous.filter((entry) => entry.id !== id)
      );

      setSelectedId(null);
      setPageMode("list");
    } catch (requestError) {
      setActionError(requestError.message);
    }
  }

  return (
    <div className={`vocabulary-workspace ${pageMode}`}>
      {actionError && (
        <div className="vocabulary-error" role="alert">
          <span>{actionError}</span>
          <button
            type="button"
            onClick={() => setActionError("")}
            aria-label="關閉錯誤訊息"
          >
            ×
          </button>
        </div>
      )}

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

              {!isLoading && !loadError && entries.length > 0 && (
                <span className="vocab-count">
                  共 {entries.length} 個單字
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
          {isLoading ? (
            <section className="vocabulary-empty">
              <div className="vocabulary-empty-content">
                <span className="vocabulary-empty-label">LOADING</span>
                <p>正在載入單字…</p>
              </div>
            </section>
          ) : loadError ? (
            <section className="vocabulary-empty">
              <div className="vocabulary-empty-content">
                <span className="vocabulary-empty-label">
                  CONNECTION ERROR
                </span>

                <h2>無法載入單字</h2>

                <p>{loadError}</p>

                <button
                  type="button"
                  className="secondary-button vocabulary-retry"
                  onClick={handleRetry}
                >
                  重新載入
                </button>
              </div>
            </section>
          ) : entries.length === 0 ? (
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
                  entries={entries}
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

function Vocabulary() {
  const location = useLocation();

  const language = location.pathname.includes("japanese")
    ? "ja"
    : "en";

  return (
    <VocabularyWorkspace
      key={language}
      language={language}
      initialEntryId={location.state?.entryId ?? null}
    />
  );
}

export default Vocabulary;
