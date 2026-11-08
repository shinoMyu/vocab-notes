import { useState } from "react";
import {
  frequencyOptions,
  getLanguageMeta,
  partOfSpeechOptions,
} from "../vocabularyMeta";
import useVocabularyForm, {
  buildCleanPayload,
  createFormFromEntry,
} from "../hooks/useVocabularyForm";

import DetailSection from "./DetailSection";
import "./VocabularyDetail.css";

function VocabularyDetailEditor({ entry, onSave, onCancel }) {
  const meta = getLanguageMeta(entry.language);
  const posOptions = partOfSpeechOptions[entry.language] ?? partOfSpeechOptions.en;

  const {
    form,
    handleChange,
    updateField,
    togglePartOfSpeech,
    addCollocation,
    updateCollocation,
    removeCollocation,
    addExample,
    updateExample,
    removeExample,
    moveItem,
  } = useVocabularyForm(() => createFormFromEntry(entry));

  // 拖曳排序狀態：field 區分搭配詞 / 例句兩個清單
  const [dragging, setDragging] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);

  function handleDragStart(field, id) {
    return (event) => {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData(
        "text/plain",
        JSON.stringify({ field, id })
      );
      setDragging({ field, id });
    };
  }

  function handleDragEnd() {
    setDragging(null);
    setDropTarget(null);
  }

  // 拖放目標列要擋同清單以外的拖曳物件
  function rowDragProps(field, id) {
    return {
      onDragOver: (event) => {
        if (!dragging || dragging.field !== field || dragging.id === id) {
          return;
        }

        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        setDropTarget({ field, id });
      },
      onDragLeave: () => {
        setDropTarget((current) =>
          current && current.field === field && current.id === id
            ? null
            : current
        );
      },
      onDrop: (event) => {
        event.preventDefault();

        try {
          const data = JSON.parse(event.dataTransfer.getData("text/plain"));

          if (data.field === field) moveItem(field, data.id, id);
        } catch {
          // 非本表單產生的拖曳物件，忽略
        }

        setDragging(null);
        setDropTarget(null);
      },
    };
  }

  function dragClassName(field, id, baseClass) {
    const classes = [baseClass];

    if (dragging && dragging.field === field && dragging.id === id) {
      classes.push("is-dragging");
    }

    if (dropTarget && dropTarget.field === field && dropTarget.id === id) {
      classes.push("is-drop-target");
    }

    return classes.join(" ");
  }

  const dragHandleProps = (field, id) => ({
    className: "detail-edit-drag",
    title: "拖曳排序",
    draggable: true,
    onDragStart: handleDragStart(field, id),
    onDragEnd: handleDragEnd,
  });

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.term.trim() || !form.chineseExplanation.trim()) return;

    onSave(
      buildCleanPayload(form, {
        skipCollocations: !meta.hasCollocations,
        skipEtymology: !meta.hasEtymology,
      })
    );
  }

  return (
    <form
      className="vocabulary-detail detail-edit-form"
      onSubmit={handleSubmit}
    >
      <div className="detail-actions">
        <span className="language-badge">{meta.badge}</span>

        <div className="detail-action-buttons">
          <button
            type="button"
            className="secondary-button"
            onClick={onCancel}
          >
            取消
          </button>
          <button type="submit" className="primary-button">
            儲存
          </button>
        </div>
      </div>

      <header className="detail-word-heading">
        <input
          className="detail-edit-term"
          name="term"
          value={form.term}
          onChange={handleChange}
          placeholder={meta.termPlaceholder}
          aria-label="單字"
          required
        />

        <input
          className="detail-edit-pronunciation"
          name="pronunciation"
          value={form.pronunciation}
          onChange={handleChange}
          placeholder={meta.pronunciationEditPlaceholder}
          aria-label="發音"
        />

        <div className="detail-edit-group">
          <span className="detail-edit-group-label">
            {meta.posLabel}
            <small>可複選</small>
          </span>

          <div className="detail-edit-pos">
            {posOptions.map((option) => {
              const checked = form.partOfSpeech.includes(option.value);

              return (
                <label
                  key={option.value}
                  className={`detail-tag detail-edit-tag ${checked ? "is-checked" : ""
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => togglePartOfSpeech(option.value)}
                  />
                  {option.value}
                  {option.label !== option.value && (
                    <span>{option.label}</span>
                  )}
                </label>
              );
            })}
          </div>
        </div>

        <div className="detail-edit-group">
          <span className="detail-edit-group-label">
            ネイティブが会話で使用する頻度
          </span>

          <div className="detail-edit-frequency">
            {frequencyOptions.map((option) => (
              <label
                key={option.value}
                className={`detail-edit-freq-option ${form.frequencyLevel === option.value
                  ? "is-selected"
                  : ""
                  }`}
              >
                <input
                  type="radio"
                  name="frequencyLevel"
                  value={option.value}
                  checked={form.frequencyLevel === option.value}
                  onChange={() =>
                    updateField("frequencyLevel", option.value)
                  }
                />
                {option.label}
                <span>{option.range}</span>
              </label>
            ))}
          </div>
        </div>

        <label className="detail-edit-related">
          <span>{meta.counterpartLabel}</span>
          <input
            name="relatedTerm"
            value={form.relatedTerm}
            onChange={handleChange}
          />
        </label>
      </header>

      <div className="detail-sections">
        <DetailSection id="meaning" jaLabel="意味" zhLabel="中文解釋">
          <textarea
            className="detail-edit-textarea"
            name="chineseExplanation"
            value={form.chineseExplanation}
            onChange={handleChange}
            rows={3}
            aria-label="中文解釋"
            required
          />
        </DetailSection>

        {meta.hasEtymology && (
          <DetailSection id="etymology" jaLabel="語源" zhLabel="字源與構詞">
            <textarea
              className="detail-edit-textarea"
              name="etymology"
              value={form.etymology}
              onChange={handleChange}
              rows={3}
              placeholder="記錄單字的來源、字根或構詞方式（選填）"
              aria-label="語源"
            />
          </DetailSection>
        )}

        {meta.hasCollocations && (
          <DetailSection
            id="collocation"
            jaLabel="Collocation"
            zhLabel="常見搭配"
          >
            <div className="detail-edit-list">
              {form.collocations.map((item, index) => (
                <div
                  className={dragClassName("collocations", item.id, "detail-edit-row")}
                  key={item.id}
                  {...rowDragProps("collocations", item.id)}
                >
                  <span {...dragHandleProps("collocations", item.id)}>⋮⋮</span>

                  <input
                    className="detail-edit-input"
                    value={item.phrase}
                    onChange={(event) =>
                      updateCollocation(item.id, "phrase", event.target.value)
                    }
                    placeholder={`搭配詞 ${index + 1}`}
                    aria-label={`搭配詞 ${index + 1}`}
                  />
                  <input
                    className="detail-edit-input"
                    value={item.explanation}
                    onChange={(event) =>
                      updateCollocation(
                        item.id,
                        "explanation",
                        event.target.value
                      )
                    }
                    placeholder="中文說明（選填）"
                    aria-label={`搭配詞 ${index + 1} 的中文說明`}
                  />
                  <button
                    type="button"
                    className="detail-edit-remove"
                    onClick={() => removeCollocation(item.id)}
                    aria-label={`刪除搭配詞 ${index + 1}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="detail-edit-add"
              onClick={() => addCollocation()}
            >
              + 新增搭配詞
            </button>
          </DetailSection>
        )}

        <DetailSection id="example" jaLabel="例文" zhLabel="例句與翻譯">
          <div className="detail-edit-list">
            {form.examples.map((item, index) => (
              <div
                className={dragClassName("examples", item.id, "detail-edit-example")}
                key={item.id}
              >
                <div
                  className="detail-edit-example-heading"
                  {...rowDragProps("examples", item.id)}
                >
                  <span {...dragHandleProps("examples", item.id)}>⋮⋮</span>
                  <span>例句 {index + 1}</span>
                  <button
                    type="button"
                    className="detail-edit-remove-text"
                    onClick={() => removeExample(item.id)}
                  >
                    刪除
                  </button>
                </div>

                <textarea
                  className="detail-edit-textarea"
                  value={item.sentence}
                  onChange={(event) =>
                    updateExample(item.id, "sentence", event.target.value)
                  }
                  rows={2}
                  placeholder={meta.examplePlaceholder}
                  aria-label={`例句 ${index + 1}`}
                />

                <textarea
                  className="detail-edit-textarea detail-edit-translation"
                  value={item.translation}
                  onChange={(event) =>
                    updateExample(
                      item.id,
                      "translation",
                      event.target.value
                    )
                  }
                  rows={2}
                  placeholder="中文翻譯（選填）"
                  aria-label={`翻譯 ${index + 1}`}
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            className="detail-edit-add"
            onClick={() => addExample()}
          >
            + 新增例句
          </button>
        </DetailSection>

        <DetailSection
          id="notes"
          jaLabel="自由記述"
        >
          <textarea
            className="detail-edit-textarea"
            name="usageNotes"
            value={form.usageNotes}
            onChange={handleChange}
            rows={3}
            placeholder="使用時的注意事項、相似表達或其他補充內容（選填）"
            aria-label="其他重要事項"
          />
        </DetailSection>
      </div>
    </form>
  );
}

export default VocabularyDetailEditor;
