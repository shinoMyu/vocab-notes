import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import GrammarEditor from "./components/GrammarEditor";
import {
  createGrammarDraft,
  loadGrammarNotes,
  persistGrammarNotes,
} from "./grammarData";

import "./shared.css";
import "./NotePage.css";

function GrammarNotePage({ noteId }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isNew = noteId === "new";

  const [notes, setNotes] = useState(loadGrammarNotes);
  const [draft, setDraft] = useState(() => {
    const note = notes.find((item) => item.id === noteId);

    if (note) return createGrammarDraft(note);

    if (!isNew) return null;

    const nextDraft = createGrammarDraft(null);
    const groupState = location.state;

    if (groupState?.language) {
      nextDraft.language = groupState.language;
    }

    if (groupState?.category) {
      nextDraft.categories = [groupState.category];
    }

    return nextDraft;
  });

  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState("");
  const [isLeaveConfirmOpen, setIsLeaveConfirmOpen] = useState(false);

  function updateDraft(patch) {
    setDraft((previous) => (previous ? { ...previous, ...patch } : previous));
    setIsDirty(true);
    setError("");
  }

  function commitDraft() {
    if (!draft) return null;

    const title = draft.title.trim();

    if (!title) {
      setError("請先輸入文法標題，再儲存筆記。");
      return null;
    }

    const updatedAt = new Date().toISOString();

    if (isNew) {
      const savedNote = {
        ...draft,
        id: crypto.randomUUID(),
        title,
        updatedAt,
      };
      const nextNotes = [savedNote, ...notes];

      persistGrammarNotes(nextNotes);
      setNotes(nextNotes);
      setDraft(createGrammarDraft(savedNote));
      setIsDirty(false);
      setError("");

      return savedNote;
    }

    const savedNote = { ...draft, title, updatedAt };
    const nextNotes = notes.map((note) =>
      note.id === savedNote.id ? savedNote : note
    );

    persistGrammarNotes(nextNotes);
    setNotes(nextNotes);
    setDraft(createGrammarDraft(savedNote));
    setIsDirty(false);
    setError("");

    return savedNote;
  }

  function handleSave() {
    const savedNote = commitDraft();

    if (savedNote && isNew) {
      navigate(`/grammar/${savedNote.id}`, { replace: true });
    }

    return Boolean(savedNote);
  }

  function handleBack() {
    if (isDirty) {
      setIsLeaveConfirmOpen(true);
      return;
    }

    navigate("/grammar");
  }

  function handleSaveAndLeave() {
    if (!commitDraft()) return;

    setIsLeaveConfirmOpen(false);
    navigate("/grammar");
  }

  function handleDiscardAndLeave() {
    setIsLeaveConfirmOpen(false);
    navigate("/grammar");
  }

  function handleDelete() {
    if (!draft?.id) return;

    const remaining = notes.filter((note) => note.id !== draft.id);

    persistGrammarNotes(remaining);
    navigate("/grammar", { replace: true });
  }

  if (!draft) {
    return (
      <div className="grammar-note-page">
        <div className="grammar-note-missing">
          <span className="grammar-eyebrow">NOTE NOT FOUND</span>

          <h1>找不到這篇筆記</h1>

          <p>它可能已經被刪除，或這個連結有誤。</p>

          <Link to="/grammar" className="grammar-button-secondary">
            回到文法筆記
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grammar-note-page">
      {error && (
        <div className="grammar-error" role="alert">
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            aria-label="關閉錯誤訊息"
          >
            ×
          </button>
        </div>
      )}

      <div className="grammar-note-surface">
        <GrammarEditor
          draft={draft}
          mode={isNew ? "create" : "note"}
          isDirty={isDirty}
          onChange={updateDraft}
          onSave={handleSave}
          onDelete={handleDelete}
          onBack={handleBack}
        />
      </div>

      {isLeaveConfirmOpen && (
        <div
          className="grammar-modal-overlay"
          onClick={() => setIsLeaveConfirmOpen(false)}
        >
          <div
            className="grammar-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="grammar-leave-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="grammar-leave-title">尚有未儲存的變更</h3>

            <p>要先儲存目前的內容，還是直接離開？</p>

            <div className="grammar-modal-actions">
              <button
                type="button"
                className="grammar-button-secondary"
                onClick={() => setIsLeaveConfirmOpen(false)}
              >
                取消
              </button>

              <button
                type="button"
                className="grammar-button-secondary"
                onClick={handleDiscardAndLeave}
              >
                捨棄並離開
              </button>

              <button
                type="button"
                className="grammar-button-primary"
                onClick={handleSaveAndLeave}
              >
                儲存並離開
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NoteRoute() {
  const { noteId } = useParams();

  return <GrammarNotePage key={noteId} noteId={noteId} />;
}

export default NoteRoute;
