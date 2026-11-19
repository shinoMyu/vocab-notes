import { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { ArrowLeft, Trash2 } from "lucide-react";

import EditorToolbar from "./EditorToolbar";
import { formatUpdatedAt } from "../../utils/noteStorage";

import "./note-editor.css";

function NoteEditor({
  draft,
  mode,
  isDirty,
  onChange,
  onSave,
  onDelete,
  onBack,
  backLabel,
  titleLabel,
  titlePlaceholder,
  contentPlaceholder,
  proseLabel,
  meta,
}) {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: contentPlaceholder,
      }),
    ],
    content: draft.content,
    shouldRerenderOnTransaction: true,
    editorProps: {
      attributes: {
        class: "note-prose",
        "aria-label": proseLabel,
      },
    },
    onUpdate: ({ editor: instance }) => {
      onChange({ content: instance.getHTML() });
    },
  });

  return (
    <div className="note-editor">
      <div className="note-editor-top">
        <div className="note-editor-top-left">
          <button type="button" className="note-back-button" onClick={onBack}>
            <ArrowLeft size={16} strokeWidth={1.9} />
            {backLabel}
          </button>

          <span className="note-editor-top-divider" aria-hidden="true" />

          <span className={`note-editor-status ${isDirty ? "is-dirty" : ""}`}>
            {mode === "create"
              ? "新筆記"
              : isDirty
                ? "尚未儲存"
                : `已儲存 · ${formatUpdatedAt(draft.updatedAt)}`}
          </span>
        </div>

        <div className="note-editor-actions">
          {mode === "note" &&
            (isDeleteConfirmOpen ? (
              <div className="note-delete-confirm">
                <span>確定刪除？</span>

                <button
                  type="button"
                  className="note-button-danger"
                  onClick={onDelete}
                >
                  刪除
                </button>

                <button
                  type="button"
                  className="note-button-secondary"
                  onClick={() => setIsDeleteConfirmOpen(false)}
                >
                  取消
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="note-icon-text-button"
                onClick={() => setIsDeleteConfirmOpen(true)}
              >
                <Trash2 size={15} strokeWidth={1.8} />
                刪除
              </button>
            ))}

          <button
            type="button"
            className="note-button-primary"
            disabled={!isDirty}
            onClick={onSave}
          >
            {mode === "create" ? "建立筆記" : "儲存"}
          </button>
        </div>
      </div>

      <input
        className="note-title-input"
        type="text"
        value={draft.title}
        placeholder={titlePlaceholder}
        aria-label={titleLabel}
        autoFocus={mode === "create"}
        onChange={(event) => onChange({ title: event.target.value })}
      />

      {meta}

      <EditorToolbar editor={editor} />

      <EditorContent editor={editor} />
    </div>
  );
}

export default NoteEditor;
