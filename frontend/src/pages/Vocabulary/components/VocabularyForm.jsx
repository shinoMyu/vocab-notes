import { useState } from "react";
import {
  frequencyOptions,
  partOfSpeechOptions,
} from "../vocabularyMeta";

import "./VocabularyForm.css";

const emptyEntry = {
  term: "",
  chineseExplanation: "",
  partOfSpeech: [],
  pronunciation: "",
  frequencyLevel: "",
  etymology: "",
  collocations: [],
  examples: [],
  usageNotes: "",
  relatedTerm: "",
};

function createId() {
  return crypto.randomUUID();
}

function createCollocation() {
  return { id: createId(), phrase: "", explanation: "" };
}

function createExample() {
  return { id: createId(), sentence: "", translation: "" };
}

function VocabularyForm({ language, onSave, onCancel }) {
  const isEnglish = language === "en";
  const posOptions = partOfSpeechOptions[language] ?? partOfSpeechOptions.en;
  const [form, setForm] = useState(() => ({
    ...emptyEntry,
    collocations: isEnglish ? [createCollocation()] : [],
    examples: [createExample()],
  }));

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
    updateField("collocations", [...form.collocations, createCollocation()]);
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
    updateField("examples", [...form.examples, createExample()]);
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

    const cleanedForm = {
      ...form,
      language,
      term: form.term.trim(),
      chineseExplanation: form.chineseExplanation.trim(),
      pronunciation: form.pronunciation.trim(),
      relatedTerm: form.relatedTerm.trim() || null,
      usageNotes: form.usageNotes.trim(),
      partOfSpeech: form.partOfSpeech,
      frequencyLevel: form.frequencyLevel,
      etymology: isEnglish ? form.etymology.trim() : "",
      collocations: isEnglish
        ? form.collocations
          .filter((item) => item.phrase.trim())
          .map(({ phrase, explanation }) => ({
            phrase: phrase.trim(),
            explanation: explanation.trim(),
          }))
        : [],
      examples: form.examples
        .filter((item) => item.sentence.trim())
        .map(({ sentence, translation }) => ({
          sentence: sentence.trim(),
          translation: translation.trim(),
        })),
    };

    onSave(cleanedForm);
  }

  return (
    <section className="vocab-form-page">
      <header className="vocab-form-header">
        <div>
          <p className="vocab-form-eyebrow">
            {isEnglish ? "ENGLISH VOCABULARY" : "JAPANESE VOCABULARY"}
          </p>
          <h2>新增單字</h2>
          <p className="vocab-form-intro">
            {isEnglish
              ? "記錄單字的意思、使用方式，以及實際對話中的例句。"
              : "記錄日文單字的意思、品詞、使用頻率與例句。"}
          </p>
        </div>

        <button
          type="button"
          className="vocab-form-back"
          onClick={onCancel}
          aria-label="返回單字列表"
        >
          ←
        </button>
      </header>

      <form className="vocab-form" onSubmit={handleSubmit}>
        {/* 基本資訊 */}
        <section className="vocab-form-section">
          <div className="vocab-form-section-heading">
            <span className="vocab-form-section-number">01</span>
            <div>
              <h3>基本資訊</h3>
            </div>
          </div>

          <div className="vocab-form-fields  vocab-form-basic-row">
            <label className="vocab-form-field">
              <span>
                {isEnglish ? "英文單字" : "日文單字"}
                <b>*</b>
              </span>
              <input
                name="term"
                value={form.term}
                onChange={handleChange}
                placeholder={isEnglish ? "輸入英文單字" : "輸入日文單字"}
                required
              />
            </label>

            <label className="vocab-form-field">
              <span>
                {isEnglish ? "日文對應單字" : "英文對應單字"}
                <small>選填，只需填寫對應單字</small>
              </span>
              <input
                name="relatedTerm"
                value={form.relatedTerm}
                onChange={handleChange}
                placeholder={isEnglish ? "例如：維持する" : "例如：maintain"}
              />
            </label>

            <label className="vocab-form-field">
              <span>
                {isEnglish ? "發音" : "讀音"}
                <small>選填</small>
              </span>
              <input
                name="pronunciation"
                value={form.pronunciation}
                onChange={handleChange}
                placeholder={
                  isEnglish ? "例如：/meɪnˈteɪn/" : "輸入假名讀音"
                }
              />
            </label>

            <fieldset className="vocab-form-field vocab-form-fieldset">
              <legend>
                {isEnglish ? "詞性" : "品詞"} <small>可複選</small>
              </legend>

              <div className="vocab-choice-list">
                {posOptions.map((option) => (
                  <label className="vocab-choice" key={option.value}>
                    <input
                      type="checkbox"
                      checked={form.partOfSpeech.includes(option.value)}
                      onChange={() => togglePartOfSpeech(option.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        </section>

        {/* 中文解釋 */}
        <section className="vocab-form-section">
          <div className="vocab-form-section-heading">
            <span className="vocab-form-section-number">02</span>
            <div>
              <h3>意味</h3>
              <p>
                中文解釋<b>*</b>
              </p>
            </div>
          </div>

          <div className="vocab-form-field">
            <textarea
              name="chineseExplanation"
              value={form.chineseExplanation}
              onChange={handleChange}
              rows={3}
              aria-label="中文解釋"
              required
            />
          </div>
        </section>

        {/* 使用頻率 */}
        <section className="vocab-form-section">
          <div className="vocab-form-section-heading">
            <span className="vocab-form-section-number">03</span>
            <div>
              <h3>ネイティブが会話で使用する頻度</h3>
              <p>母語人士在日常對話中的使用頻率</p>
            </div>
          </div>

          <div className="vocab-frequency-list">
            {frequencyOptions.map((option) => (
              <label
                key={option.value}
                className={`vocab-frequency-option ${form.frequencyLevel === option.value ? "selected" : ""
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
                <span className="vocab-frequency-label">
                  {option.label}
                </span>
                <span className="vocab-frequency-range">
                  頻度 {option.range}
                </span>
              </label>
            ))}
          </div>
        </section>

        {isEnglish && (
          <>
            <section className="vocab-form-section">
              <div className="vocab-form-section-heading">
                <span className="vocab-form-section-number">04</span>
                <div>
                  <h3>語源</h3>
                  <p>記錄詞源、構詞方式與語意演變</p>
                </div>
              </div>

              <label className="vocab-form-field">
                <textarea
                  name="etymology"
                  value={form.etymology}
                  onChange={handleChange}
                  rows={3}
                  placeholder="記錄單字的來源、字根或構詞方式。"
                />
              </label>
            </section>

            <section className="vocab-form-section">
              <div className="vocab-form-section-heading">
                <span className="vocab-form-section-number">05</span>
                <div>
                  <h3>collocation</h3>
                  <p>常見搭配詞，可新增多筆</p>
                </div>
              </div>

              <div className="vocab-repeatable-list vocab-collocation-list">
                {form.collocations.map((item, index) => (
                  <div className="vocab-repeatable-item" key={item.id}>
                    <div className="vocab-repeatable-heading">
                      <span>搭配詞 {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeCollocation(item.id)}
                      >
                        刪除
                      </button>
                    </div>
                    <input
                      value={item.phrase}
                      onChange={(event) =>
                        updateCollocation(item.id, "phrase", event.target.value)
                      }
                      aria-label={`搭配詞 ${index + 1}`}
                    />
                    <input
                      value={item.explanation}
                      onChange={(event) =>
                        updateCollocation(
                          item.id,
                          "explanation",
                          event.target.value
                        )
                      }
                      placeholder="中文補充說明（選填）"
                      aria-label={`搭配詞 ${index + 1} 的中文說明`}
                    />
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="vocab-add-item"
                onClick={addCollocation}
              >
                + 新增搭配詞
              </button>
            </section>
          </>
        )}

        <section className="vocab-form-section">
          <div className="vocab-form-section-heading">
            <span className="vocab-form-section-number">
              {isEnglish ? "06" : "04"}
            </span>
            <div>
              <h3>例文</h3>
              <p>例句與翻譯可新增多筆</p>
            </div>
          </div>

          <div className="vocab-repeatable-list">
            {form.examples.map((item, index) => (
              <div className="vocab-repeatable-item" key={item.id}>
                <div className="vocab-repeatable-heading">
                  <span>例句 {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeExample(item.id)}
                  >
                    刪除
                  </button>
                </div>
                <textarea
                  value={item.sentence}
                  onChange={(event) =>
                    updateExample(item.id, "sentence", event.target.value)
                  }
                  rows={2}
                  placeholder={isEnglish ? "輸入英文例句" : "輸入日文例句"}
                  aria-label={`${isEnglish ? "英文" : "日文"}例句 ${index + 1}`}
                />
                <textarea
                  value={item.translation}
                  onChange={(event) =>
                    updateExample(
                      item.id,
                      "translation",
                      event.target.value
                    )
                  }
                  rows={2}
                  placeholder="輸入對應的中文翻譯（選填）"
                  aria-label={`翻譯 ${index + 1}`}
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            className="vocab-add-item"
            onClick={addExample}
          >
            + 新增例句
          </button>
        </section>

        {/* 補充說明 */}
        <section className="vocab-form-section">
          <div className="vocab-form-section-heading">
            <span className="vocab-form-section-number">
              {isEnglish ? "07" : "05"}
            </span>
            <div>
              <h3>この他重要事項</h3>
              <p>使用時的注意事項、相似表達或其他補充內容</p>
            </div>
          </div>

          <label className="vocab-form-field">
            <textarea
              name="usageNotes"
              value={form.usageNotes}
              onChange={handleChange}
              rows={4}
            />
          </label>
        </section>

        <footer className="vocab-form-actions">
          <button
            type="button"
            className="vocab-form-cancel"
            onClick={onCancel}
          >
            取消
          </button>
          <button type="submit" className="vocab-form-submit">
            新增單字
          </button>
        </footer>
      </form>
    </section>
  );
}

export default VocabularyForm;
