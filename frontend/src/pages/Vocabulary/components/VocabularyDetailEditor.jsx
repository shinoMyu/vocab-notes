import { useState } from "react";
import {
  frequencyOptions,
  partOfSpeechOptions,
} from "../vocabularyMeta";

import "./VocabularyDetail.css";

function createId() {
  return crypto.randomUUID();
}

function createForm(entry) {
  return {
    term: entry.term ?? "",
    chineseExplanation: entry.chineseExplanation ?? "",
    partOfSpeech: entry.partOfSpeech ?? [],
    pronunciation: entry.pronunciation ?? "",
    frequencyLevel: entry.frequencyLevel ?? "",
    etymology: entry.etymology ?? "",
    collocations: (entry.collocations ?? []).map((item) => ({
      ...item,
      id: item.id ?? createId(),
    })),
    examples: (entry.examples ?? []).map((item) => ({
      ...item,
      id: item.id ?? createId(),
    })),
    usageNotes: entry.usageNotes ?? "",
    relatedTerm: entry.relatedTerm ?? "",
  };
}

function EditSection({ id, jaLabel, zhLabel, children }) {
  return (
    <section className={`detail-section section-${id}`}>
      <h3 className="detail-section-title">
        <span className="section-label-ja">{jaLabel}</span>
        <span className="section-label-zh">{zhLabel}</span>
      </h3>
      {children}
    </section>
  );
}

function VocabularyDetailEditor({ entry, onSave, onCancel }) {
  const isEnglish = entry.language === "en";
  const posOptions = partOfSpeechOptions[entry.language] ?? partOfSpeechOptions.en;
  const [form, setForm] = useState(() => createForm(entry));

  function updateField(name, value) {
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function handleChange(event) {
    updateField(event.target.name, event.target.value);
  }

  function togglePartOfSpeech(value) {
    const current = form.partOfSpeech;

    updateField(
      "partOfSpeech",
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  }

  function addCollocation() {
    updateField("collocations", [
      ...form.collocations,
      { id: createId(), phrase: "", explanation: "" },
    ]);
  }

  function updateCollocation(id, field, value) {
    updateField(
      "collocations",
      form.collocations.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }

  function removeCollocation(id) {
    updateField(
      "collocations",
      form.collocations.filter((item) => item.id !== id)
    );
  }

  function addExample() {
    updateField("examples", [
      ...form.examples,
      { id: createId(), sentence: "", translation: "" },
    ]);
  }

  function updateExample(id, field, value) {
    updateField(
      "examples",
      form.examples.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }

  function removeExample(id) {
    updateField(
      "examples",
      form.examples.filter((item) => item.id !== id)
    );
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.term.trim() || !form.chineseExplanation.trim()) return;

    onSave({
      term: form.term.trim(),
      chineseExplanation: form.chineseExplanation.trim(),
      partOfSpeech: form.partOfSpeech,
      pronunciation: form.pronunciation.trim(),
      frequencyLevel: form.frequencyLevel,
      etymology: form.etymology.trim(),
      collocations: form.collocations
        .filter((item) => item.phrase.trim())
        .map(({ phrase, explanation }) => ({
          phrase: phrase.trim(),
          explanation: explanation.trim(),
        })),
      examples: form.examples
        .filter((item) => item.sentence.trim())
        .map(({ sentence, translation }) => ({
          sentence: sentence.trim(),
          translation: translation.trim(),
        })),
      usageNotes: form.usageNotes.trim(),
      relatedTerm: form.relatedTerm.trim() || null,
    });
  }

  return (
    <form
      className="vocabulary-detail detail-edit-form"
      onSubmit={handleSubmit}
    >
      <div className="detail-actions">
        <span className="language-badge">
          {entry.language === "ja" ? "JAPANESE" : "ENGLISH"}
        </span>

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
          placeholder={isEnglish ? "輸入英文單字" : "輸入日文單字"}
          aria-label="單字"
          required
        />

        <input
          className="detail-edit-pronunciation"
          name="pronunciation"
          value={form.pronunciation}
          onChange={handleChange}
          placeholder={isEnglish ? "輸入發音（選填）" : "輸入讀音（選填）"}
          aria-label="發音"
        />

        <div className="detail-edit-group">
          <span className="detail-edit-group-label">
            {isEnglish ? "詞性" : "品詞"}
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
          <span>{isEnglish ? "日文對應單字" : "英文對應單字"}</span>
          <input
            name="relatedTerm"
            value={form.relatedTerm}
            onChange={handleChange}
          />
        </label>
      </header>

      <div className="detail-sections">
        <EditSection id="meaning" jaLabel="意味" zhLabel="中文解釋">
          <textarea
            className="detail-edit-textarea"
            name="chineseExplanation"
            value={form.chineseExplanation}
            onChange={handleChange}
            rows={3}
            aria-label="中文解釋"
            required
          />
        </EditSection>

        <EditSection id="etymology" jaLabel="語源" zhLabel="字源與構詞">
          <textarea
            className="detail-edit-textarea"
            name="etymology"
            value={form.etymology}
            onChange={handleChange}
            rows={3}
            placeholder="記錄單字的來源、字根或構詞方式（選填）"
            aria-label="語源"
          />
        </EditSection>

        <EditSection
          id="collocation"
          jaLabel="Collocation"
          zhLabel="常見搭配"
        >
          <div className="detail-edit-list">
            {form.collocations.map((item, index) => (
              <div className="detail-edit-row" key={item.id}>
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
            onClick={addCollocation}
          >
            + 新增搭配詞
          </button>
        </EditSection>

        <EditSection id="example" jaLabel="例文" zhLabel="例句與翻譯">
          <div className="detail-edit-list">
            {form.examples.map((item, index) => (
              <div className="detail-edit-example" key={item.id}>
                <div className="detail-edit-example-heading">
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
                  placeholder={isEnglish ? "輸入英文例句" : "輸入日文例句"}
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
            onClick={addExample}
          >
            + 新增例句
          </button>
        </EditSection>

        <EditSection
          id="notes"
          jaLabel="この他重要事項"
          zhLabel="其他重要事項"
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
        </EditSection>
      </div>
    </form>
  );
}

export default VocabularyDetailEditor;
