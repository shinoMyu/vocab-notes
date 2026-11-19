import { Link, useParams } from "react-router-dom";

import NoteEditor from "../../components/NoteEditor";
import LeaveConfirmDialog from "../../components/NoteEditor/LeaveConfirmDialog";
import useNoteSession from "../../hooks/useNoteSession";
import {
  PROGRAMMING_CATEGORIES,
  createProgrammingDraft,
  createProgrammingDraftFromState,
  getCategoryTone,
  loadProgrammingNotes,
  persistProgrammingNotes,
} from "./noteData";

function ProgrammingNotePage({ noteId }) {
  const session = useNoteSession({
    noteId,
    indexPath: "/programming",
    loadNotes: loadProgrammingNotes,
    persistNotes: persistProgrammingNotes,
    createDraft: createProgrammingDraft,
    createDraftFromState: createProgrammingDraftFromState,
    titleRequiredMessage: "請先輸入筆記標題，再儲存筆記。",
  });

  if (!session.draft) {
    return (
      <div className="note-page">
        <div className="note-missing">
          <span className="note-eyebrow">NOTE NOT FOUND</span>

          <h1>找不到這篇筆記</h1>

          <p>它可能已經被刪除，或這個連結有誤。</p>

          <Link to="/programming" className="note-button-secondary">
            回到程式筆記
          </Link>
        </div>
      </div>
    );
  }

  function toggleCategory(category) {
    const categories = session.draft.categories.includes(category)
      ? session.draft.categories.filter((item) => item !== category)
      : [...session.draft.categories, category];

    session.updateDraft({ categories });
  }

  const meta = (
    <div className="note-meta">
      <div className="note-meta-group note-meta-grow">
        <span className="note-meta-label">分類</span>

        <div className="note-category-options">
          {PROGRAMMING_CATEGORIES.map((category) => {
            const isActive = session.draft.categories.includes(category);

            return (
              <button
                key={category}
                type="button"
                className={`note-category-chip note-tone-${getCategoryTone(category)} ${isActive ? "is-active" : ""}`}
                aria-pressed={isActive}
                onClick={() => toggleCategory(category)}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="note-page">
      {session.error && (
        <div className="note-error" role="alert">
          <span>{session.error}</span>

          <button
            type="button"
            onClick={() => session.setError("")}
            aria-label="關閉錯誤訊息"
          >
            ×
          </button>
        </div>
      )}

      <div className="note-page-surface">
        <NoteEditor
          draft={session.draft}
          mode={session.isNew ? "create" : "note"}
          isDirty={session.isDirty}
          onChange={session.updateDraft}
          onSave={session.handleSave}
          onDelete={session.handleDelete}
          onBack={session.handleBack}
          backLabel="程式筆記"
          titleLabel="筆記標題"
          titlePlaceholder="輸入技術主題，例如「React useEffect」"
          contentPlaceholder="寫下重點、做法、範例程式碼，或踩過的坑…"
          proseLabel="程式筆記內容"
          meta={meta}
        />
      </div>

      {session.isLeaveConfirmOpen && (
        <LeaveConfirmDialog
          onCancel={() => session.setIsLeaveConfirmOpen(false)}
          onDiscard={session.handleDiscardAndLeave}
          onSaveAndLeave={session.handleSaveAndLeave}
        />
      )}
    </div>
  );
}

function NoteRoute() {
  const { noteId } = useParams();

  return <ProgrammingNotePage key={noteId} noteId={noteId} />;
}

export default NoteRoute;
