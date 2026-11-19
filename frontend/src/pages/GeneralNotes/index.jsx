import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import SearchBar from "../../components/SearchBar";
import { formatUpdatedAt } from "../../utils/noteStorage";
import { loadGeneralNotes, persistGeneralNotes } from "./noteData";

import "./index.css";

function GeneralNotes() {
  const [notes, setNotes] = useState(loadGeneralNotes);
  const [keyword, setKeyword] = useState("");
  const [confirmingId, setConfirmingId] = useState(null);
  const [focusId, setFocusId] = useState(null);

  const normalizedKeyword = keyword.trim().toLowerCase();

  const visibleNotes = notes.filter((note) => {
    if (!normalizedKeyword) return true;

    return `${note.title} ${note.content}`
      .toLowerCase()
      .includes(normalizedKeyword);
  });

  function saveNotes(nextNotes) {
    setNotes(nextNotes);
    persistGeneralNotes(nextNotes);
  }

  function addNote() {
    const note = {
      id: crypto.randomUUID(),
      title: "",
      content: "",
      updatedAt: new Date().toISOString(),
    };

    saveNotes([note, ...notes]);
    setFocusId(note.id);
    setConfirmingId(null);
  }

  function updateNote(id, patch) {
    saveNotes(
      notes.map((note) =>
        note.id === id
          ? { ...note, ...patch, updatedAt: new Date().toISOString() }
          : note
      )
    );
  }

  function deleteNote(id) {
    saveNotes(notes.filter((note) => note.id !== id));
    setConfirmingId(null);
  }

  return (
    <div className="general-notes">
      <header className="general-notes-heading">
        <div className="general-notes-heading-info">
          <p className="general-notes-eyebrow">GENERAL NOTES</p>

          <h1>一般筆記</h1>

          {notes.length > 0 && (
            <span className="general-notes-count">
              共 {notes.length} 篇筆記
            </span>
          )}
        </div>

        <button
          type="button"
          className="note-button-primary"
          onClick={addNote}
        >
          <Plus size={16} strokeWidth={2} />
          新增筆記
        </button>
      </header>

      <div className="general-notes-toolbar">
        <div className="general-notes-search">
          <SearchBar
            value={keyword}
            onChange={setKeyword}
            placeholder="搜尋標題或內容…"
            ariaLabel="搜尋一般筆記"
            onSubmit={(value) => setKeyword(value)}
          />
        </div>

        <span className="general-notes-autosave">自動儲存</span>
      </div>

      {notes.length === 0 ? (
        <div className="general-notes-empty">
          <p>還沒有任何筆記。記錄一個想法或待辦吧。</p>

          <button
            type="button"
            className="note-button-primary"
            onClick={addNote}
          >
            新增第一篇筆記
          </button>
        </div>
      ) : visibleNotes.length === 0 ? (
        <div className="general-notes-empty">
          <p>沒有符合的筆記，試試其他關鍵字。</p>

          <button type="button" onClick={() => setKeyword("")}>
            清除搜尋
          </button>
        </div>
      ) : (
        <div className="general-notes-list">
          {visibleNotes.map((note) => (
            <article className="general-note-card" key={note.id}>
              <div className="general-note-card-top">
                <input
                  className="general-note-title"
                  type="text"
                  value={note.title}
                  placeholder="筆記標題"
                  aria-label="筆記標題"
                  autoFocus={note.id === focusId}
                  onChange={(event) =>
                    updateNote(note.id, { title: event.target.value })
                  }
                />

                <span className="general-note-time">
                  {formatUpdatedAt(note.updatedAt)}
                </span>

                {confirmingId === note.id ? (
                  <div className="general-note-delete-confirm">
                    <span>確定刪除？</span>

                    <button
                      type="button"
                      className="general-note-delete"
                      onClick={() => deleteNote(note.id)}
                    >
                      刪除
                    </button>

                    <button
                      type="button"
                      className="general-note-cancel"
                      onClick={() => setConfirmingId(null)}
                    >
                      取消
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="general-note-delete-trigger"
                    aria-label="刪除筆記"
                    title="刪除筆記"
                    onClick={() => setConfirmingId(note.id)}
                  >
                    <Trash2 size={15} strokeWidth={1.8} />
                  </button>
                )}
              </div>

              <textarea
                className="general-note-body"
                value={note.content}
                rows={3}
                placeholder="寫下想法、清單或待辦…"
                aria-label={`${note.title || "未命名筆記"}的內容`}
                onChange={(event) =>
                  updateNote(note.id, { content: event.target.value })
                }
              />
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default GeneralNotes;
