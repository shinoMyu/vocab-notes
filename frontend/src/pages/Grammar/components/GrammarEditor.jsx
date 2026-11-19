import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EditorContent, useEditor } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import {
  ArrowLeft,
  Check,
  Link2,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import EditorToolbar from "./EditorToolbar";
import {
  GRAMMAR_CATEGORIES,
  LANGUAGE_LABELS,
  MOCK_VOCAB,
  formatUpdatedAt,
  getCategoryTone,
} from "../grammarData";

import "./GrammarEditor.css";

function sameVocab(a, b) {
  return a.term === b.term && a.language === b.language;
}

function GrammarEditor({
  draft,
  mode,
  isDirty,
  onChange,
  onSave,
  onDelete,
  onBack,
}) {
  const navigate = useNavigate();
  const pickerRef = useRef(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerKeyword, setPickerKeyword] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "寫下這個文法的用法、例句，或容易混淆的地方…",
      }),
    ],
    content: draft.content,
    shouldRerenderOnTransaction: true,
    editorProps: {
      attributes: {
        class: "grammar-prose",
        "aria-label": "文法筆記內容",
      },
    },
    onUpdate: ({ editor: instance }) => {
      onChange({ content: instance.getHTML() });
    },
  });

  useEffect(() => {
    if (!isPickerOpen) return undefined;

    function handlePointerDown(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsPickerOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);

    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isPickerOpen]);

  function toggleCategory(item) {
    const categories = draft.categories.includes(item)
      ? draft.categories.filter((category) => category !== item)
      : [...draft.categories, item];

    onChange({ categories });
  }

  function toggleRelated(item) {
    const isRelated = draft.relatedVocab.some((related) =>
      sameVocab(related, item)
    );

    onChange({
      relatedVocab: isRelated
        ? draft.relatedVocab.filter((related) => !sameVocab(related, item))
        : [...draft.relatedVocab, { term: item.term, language: item.language }],
    });
  }

  function openVocab(item) {
    if (isDirty && !onSave()) return;

    navigate(
      item.language === "ja" ? "/vocabulary/japanese" : "/vocabulary/english",
      { state: { entryTerm: item.term } }
    );
  }

  const relatedOptions = MOCK_VOCAB.filter((item) => {
    const searchableText = `${item.term} ${item.meaning}`.toLowerCase();

    return searchableText.includes(pickerKeyword.trim().toLowerCase());
  });

  return (
    <div className="grammar-editor">
      <div className="grammar-editor-top">
        <div className="grammar-editor-top-left">
          <button type="button" className="grammar-back-button" onClick={onBack}>
            <ArrowLeft size={16} strokeWidth={1.9} />
            文法筆記
          </button>

          <span className="grammar-editor-top-divider" aria-hidden="true" />

          <span
            className={`grammar-editor-status ${isDirty ? "is-dirty" : ""}`}
          >
            {mode === "create"
              ? "新筆記"
              : isDirty
                ? "尚未儲存"
                : `已儲存 · ${formatUpdatedAt(draft.updatedAt)}`}
          </span>
        </div>

        <div className="grammar-editor-actions">
          {mode === "note" &&
            (isDeleteConfirmOpen ? (
              <div className="grammar-delete-confirm">
                <span>確定刪除？</span>

                <button
                  type="button"
                  className="grammar-button-danger"
                  onClick={onDelete}
                >
                  刪除
                </button>

                <button
                  type="button"
                  className="grammar-button-secondary"
                  onClick={() => setIsDeleteConfirmOpen(false)}
                >
                  取消
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="grammar-icon-text-button"
                onClick={() => setIsDeleteConfirmOpen(true)}
              >
                <Trash2 size={15} strokeWidth={1.8} />
                刪除
              </button>
            ))}

          <button
            type="button"
            className="grammar-button-primary"
            disabled={!isDirty}
            onClick={onSave}
          >
            {mode === "create" ? "建立筆記" : "儲存"}
          </button>
        </div>
      </div>

      <input
        className="grammar-title-input"
        type="text"
        value={draft.title}
        placeholder="輸入文法標題，例如「〜てしまう」"
        aria-label="文法標題"
        autoFocus={mode === "create"}
        onChange={(event) => onChange({ title: event.target.value })}
      />

      <div className="grammar-meta">
        <div className="grammar-meta-group">
          <span className="grammar-meta-label">語言</span>

          <span
            className={`grammar-lang-badge grammar-language-value ${draft.language}`}
          >
            {LANGUAGE_LABELS[draft.language]}
          </span>
        </div>

        <div className="grammar-meta-group grammar-meta-grow">
          <span className="grammar-meta-label">分類</span>

          <div className="grammar-category-options">
            {GRAMMAR_CATEGORIES.map((item) => {
              const isActive = draft.categories.includes(item);

              return (
                <button
                  key={item}
                  type="button"
                  className={`grammar-category-chip grammar-tone-${getCategoryTone(item)} ${isActive ? "is-active" : ""}`}
                  aria-pressed={isActive}
                  onClick={() => toggleCategory(item)}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <EditorToolbar editor={editor} />

      <EditorContent editor={editor} />

      <section className="grammar-related">
        <div className="grammar-related-heading">
          <div>
            <span className="grammar-related-title">相關單字</span>

            <span className="grammar-related-count">
              {draft.relatedVocab.length}
            </span>
          </div>

          <div className="grammar-related-picker" ref={pickerRef}>
            <button
              type="button"
              className="grammar-related-add"
              aria-expanded={isPickerOpen}
              onClick={() => setIsPickerOpen((previous) => !previous)}
            >
              <Plus size={14} strokeWidth={2} />
              加入單字
            </button>

            {isPickerOpen && (
              <div className="grammar-related-popover">
                <div className="grammar-related-search">
                  <Search size={15} strokeWidth={1.8} />

                  <input
                    type="text"
                    value={pickerKeyword}
                    placeholder="搜尋單字…"
                    aria-label="搜尋單字"
                    autoFocus
                    onChange={(event) =>
                      setPickerKeyword(event.target.value)
                    }
                  />
                </div>

                <div className="grammar-related-options">
                  {relatedOptions.map((item) => {
                    const isActive = draft.relatedVocab.some((related) =>
                      sameVocab(related, item)
                    );

                    return (
                      <button
                        key={`${item.language}-${item.term}`}
                        type="button"
                        className={`grammar-related-option ${isActive ? "is-active" : ""}`}
                        onClick={() => toggleRelated(item)}
                      >
                        <span className="grammar-related-option-term">
                          {item.term}
                        </span>

                        <span className="grammar-related-option-meta">
                          {LANGUAGE_LABELS[item.language]} · {item.meaning}
                        </span>

                        {isActive && <Check size={15} strokeWidth={2} />}
                      </button>
                    );
                  })}
                </div>

                {relatedOptions.length === 0 && (
                  <p className="grammar-related-empty">
                    找不到符合的單字。
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {draft.relatedVocab.length > 0 ? (
          <div className="grammar-related-list">
            {draft.relatedVocab.map((item) => (
              <span
                key={`${item.language}-${item.term}`}
                className={`grammar-related-chip ${item.language}`}
              >
                <button
                  type="button"
                  className="grammar-related-chip-term"
                  title={`前往${LANGUAGE_LABELS[item.language]}單字`}
                  onClick={() => openVocab(item)}
                >
                  {item.term}
                  <Link2 size={12} strokeWidth={2} />
                </button>

                <button
                  type="button"
                  className="grammar-related-chip-remove"
                  aria-label={`移除 ${item.term}`}
                  onClick={() => toggleRelated(item)}
                >
                  <X size={12} strokeWidth={2} />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="grammar-related-empty-state">
            尚未連結單字。把這個文法和相關詞彙連起來，之後就能互相跳轉。
          </p>
        )}
      </section>
    </div>
  );
}

export default GrammarEditor;
