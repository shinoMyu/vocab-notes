import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function useNoteSession({
  noteId,
  indexPath,
  loadNotes,
  persistNotes,
  createDraft,
  createDraftFromState,
  titleRequiredMessage,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const isNew = noteId === "new";

  const [notes, setNotes] = useState(loadNotes);
  const [draft, setDraft] = useState(() => {
    const note = notes.find((item) => item.id === noteId);

    if (note) return createDraft(note);

    if (!isNew) return null;

    return createDraftFromState
      ? createDraftFromState(location.state)
      : createDraft(null);
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
      setError(titleRequiredMessage);
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

      persistNotes(nextNotes);
      setNotes(nextNotes);
      setDraft(createDraft(savedNote));
      setIsDirty(false);
      setError("");

      return savedNote;
    }

    const savedNote = { ...draft, title, updatedAt };
    const nextNotes = notes.map((note) =>
      note.id === savedNote.id ? savedNote : note
    );

    persistNotes(nextNotes);
    setNotes(nextNotes);
    setDraft(createDraft(savedNote));
    setIsDirty(false);
    setError("");

    return savedNote;
  }

  function handleSave() {
    const savedNote = commitDraft();

    if (savedNote && isNew) {
      navigate(`${indexPath}/${savedNote.id}`, { replace: true });
    }

    return Boolean(savedNote);
  }

  function handleBack() {
    if (isDirty) {
      setIsLeaveConfirmOpen(true);
      return;
    }

    navigate(indexPath);
  }

  function handleSaveAndLeave() {
    if (!commitDraft()) return;

    setIsLeaveConfirmOpen(false);
    navigate(indexPath);
  }

  function handleDiscardAndLeave() {
    setIsLeaveConfirmOpen(false);
    navigate(indexPath);
  }

  function handleDelete() {
    if (!draft?.id) return;

    persistNotes(notes.filter((note) => note.id !== draft.id));
    navigate(indexPath, { replace: true });
  }

  return {
    draft,
    isNew,
    isDirty,
    error,
    setError,
    isLeaveConfirmOpen,
    setIsLeaveConfirmOpen,
    updateDraft,
    handleSave,
    handleBack,
    handleSaveAndLeave,
    handleDiscardAndLeave,
    handleDelete,
  };
}

export default useNoteSession;
