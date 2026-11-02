import VocabularyDetailEditor from "./VocabularyDetailEditor";
import { FREQUENCY_META, getPartOfSpeechLabel } from "../vocabularyMeta";
import "./VocabularyDetail.css";

// 在例句中把目標單字標示出來
function highlightTerm(sentence, term) {
  if (!term || !sentence) return sentence;

  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`(${escaped})`, "gi");
  const parts = sentence.split(pattern);

  if (parts.length === 1) return sentence;

  return parts.map((part, index) =>
    part.toLowerCase() === term.toLowerCase() ? (
      <mark key={index}>{part}</mark>
    ) : (
      part
    )
  );
}

function DetailSection({ id, jaLabel, zhLabel, children }) {
  if (!children) return null;

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

function VocabularyDetail({
  entry,
  isEditing,
  onSave,
  onCancel,
  onEdit,
  onOpenRelated,
  onDelete,
  onClose,
}) {
  if (isEditing) {
    return (
      <VocabularyDetailEditor
        key={entry.id}
        entry={entry}
        onSave={onSave}
        onCancel={onCancel}
      />
    );
  }

  const frequency = entry.frequencyLevel
    ? FREQUENCY_META[entry.frequencyLevel]
    : null;

  const sections = [
    {
      id: "meaning",
      jaLabel: "意味",
      zhLabel: "中文解釋",
      content: entry.chineseExplanation ? (
        <p className="detail-body detail-body-primary">
          {entry.chineseExplanation}
        </p>
      ) : null,
    },
    {
      id: "etymology",
      jaLabel: "語源",
      zhLabel: "字源與構詞",
      content: entry.etymology ? (
        <p className="detail-body">{entry.etymology}</p>
      ) : null,
    },
    {
      id: "collocation",
      jaLabel: "Collocation",
      zhLabel: "常見搭配詞",
      content:
        (entry.collocations ?? []).length > 0 ? (
          <ul className="collocation-list">
            {entry.collocations.map((item, index) => (
              <li
                className="collocation-item"
                key={item.id ?? `${item.phrase}-${index}`}
              >
                <strong>{item.phrase}</strong>
                {item.explanation && <span>{item.explanation}</span>}
              </li>
            ))}
          </ul>
        ) : null,
    },
    {
      id: "example",
      jaLabel: "例文",
      zhLabel: "例句與翻譯",
      content:
        (entry.examples ?? []).length > 0 ? (
          <div className="example-list">
            {entry.examples.map((item, index) => (
              <div
                className="example-item"
                key={item.id ?? `${item.sentence}-${index}`}
              >
                <p className="example-text-line">
                  <span className="example-text">
                    {highlightTerm(item.sentence, entry.term)}
                  </span>
                </p>
                {item.translation && (
                  <p className="example-translation">{item.translation}</p>
                )}
              </div>
            ))}
          </div>
        ) : null,
    },
    {
      id: "notes",
      jaLabel: "この他重要事項",
      zhLabel: "其他重要事項",
      content: entry.usageNotes ? (
        <p className="detail-body">{entry.usageNotes}</p>
      ) : null,
    },
  ];

  return (
    <article className="vocabulary-detail">
      <div className="detail-actions">
        <span className="language-badge">
          {entry.language === "ja" ? "JAPANESE" : "ENGLISH"}
        </span>

        <div className="detail-action-buttons">
          <button
            type="button"
            className="secondary-button"
            onClick={onEdit}
          >
            編輯
          </button>
          <button
            type="button"
            className="delete-button"
            onClick={() => onDelete(entry.id)}
          >
            刪除
          </button>
          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="關閉詳情"
          >
            ×
          </button>
        </div>
      </div>

      <header className="detail-word-heading">
        <h2 className="detail-word">{entry.term}</h2>

        {entry.pronunciation && (
          <p className="detail-pronunciation">{entry.pronunciation}</p>
        )}

        <div className="detail-heading-meta">
          {(entry.partOfSpeech ?? []).length > 0 && (
            <span className="detail-tags">
              {entry.partOfSpeech.map((pos) => {
                const label = getPartOfSpeechLabel(entry.language, pos);

                return (
                  <span key={pos} className="detail-tag">
                    {pos}
                    {label !== pos && (
                      <span className="detail-tag-label">{label}</span>
                    )}
                  </span>
                );
              })}
            </span>
          )}

          {frequency && (
            <span
              className={`detail-freq ${frequency.className}`}
              title={`頻度 ${frequency.range}`}
            >
              <i />
              {entry.frequencyLevel}
              <em className="freq-range">{frequency.range}</em>
            </span>
          )}

          {entry.relatedTerm && (
            <button
              type="button"
              className="related-chip"
              onClick={onOpenRelated}
              title={`前往 ${entry.relatedTerm}`}
            >
              {entry.language === "ja" ? "EN" : "JP"}｜{entry.relatedTerm} ↗
            </button>
          )}
        </div>
      </header>

      <div className="detail-sections">
        {sections.map(
          (section) =>
            section.content && (
              <DetailSection
                key={section.id}
                id={section.id}
                jaLabel={section.jaLabel}
                zhLabel={section.zhLabel}
              >
                {section.content}
              </DetailSection>
            )
        )}
      </div>
    </article>
  );
}

export default VocabularyDetail;
