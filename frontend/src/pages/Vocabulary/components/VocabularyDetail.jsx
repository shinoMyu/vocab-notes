import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import VocabularyDetailEditor from "./VocabularyDetailEditor";
import DetailSection from "./DetailSection";
import {
  FREQUENCY_META,
  getLanguageMeta,
  getPartOfSpeechLabel,
} from "../vocabularyMeta";
import { getDerivedTag, getTagColorStyle } from "../tagUtils";
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

function VocabularyDetail({
  entry,
  tagColors,
  isEditing,
  onSave,
  onCancel,
  onEdit,
  onOpenRelated,
  onDelete,
  onClose,
}) {
  const [confirmingId, setConfirmingId] = useState(null);
  const isConfirmingDelete = confirmingId === entry.id;

  const collocationListRef = useRef(null);

  useEffect(() => {
    const list = collocationListRef.current;
    if (!list) return;

    // 超過半欄寬的搭配自動佔滿整列，讓片語與解釋排在同一行
    function updateSpans() {
      const halfWidth = list.clientWidth / 2 - 10;

      for (const item of list.children) {
        // 暫時禁止折行，量出片語與解釋排在同一行所需的寬度
        const previousWrap = item.style.flexWrap;
        item.style.flexWrap = "nowrap";

        const phrase = item.querySelector(":scope > strong");
        const explanation = item.querySelector(":scope > span");

        const naturalWidth =
          (phrase?.offsetWidth ?? 0) +
          (explanation ? explanation.offsetWidth + 8 : 0);

        item.style.flexWrap = previousWrap;
        item.style.gridColumn = naturalWidth > halfWidth ? "1 / -1" : "";
      }
    }

    updateSpans();

    const observer = new ResizeObserver(updateSpans);
    observer.observe(list);

    return () => observer.disconnect();
  }, [entry.id, isEditing]);

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

  const meta = getLanguageMeta(entry.language);

  const frequency = entry.frequencyLevel
    ? FREQUENCY_META[entry.frequencyLevel]
    : null;

  const derivedTag = getDerivedTag(entry.frequencyLevel);

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
      // 語源是補充資訊，預設收合，點標題展開
      collapsible: true,
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
          <ul className="collocation-list" ref={collocationListRef}>
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
      jaLabel: "自由記述",
      content: entry.usageNotes ? (
        <p className="detail-body">{entry.usageNotes}</p>
      ) : null,
    },
  ];

  return (
    <article className="vocabulary-detail">
      <div className="detail-actions">
        <span className="language-badge">{meta.badge}</span>

        <div className="detail-action-buttons">
          {isConfirmingDelete ? (
            <div className="detail-delete-confirm" role="alert">
              <span>確定刪除這個單字？</span>
              <button
                type="button"
                className="secondary-button"
                onClick={() => setConfirmingId(null)}
              >
                取消
              </button>
              <button
                type="button"
                className="delete-button"
                onClick={() => onDelete(entry.id)}
              >
                刪除
              </button>
            </div>
          ) : (
            <>
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
                onClick={() => setConfirmingId(entry.id)}
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
            </>
          )}
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
              {meta.counterpartShortBadge}｜{entry.relatedTerm} ↗
            </button>
          )}

          {derivedTag && (
            <span
              className="detail-tag-chip"
              style={getTagColorStyle(tagColors, derivedTag)}
              title="依使用頻度自動分類"
            >
              {derivedTag}
            </span>
          )}
        </div>
      </header>

      <div className="detail-sections">
        {sections.map((section) => {
          if (!section.content) return null;

          if (section.collapsible) {
            return (
              <details
                key={section.id}
                className={`detail-section section-${section.id} is-collapsible`}
              >
                <summary className="detail-section-title">
                  <ChevronDown
                    size={18}
                    className="detail-section-caret"
                    aria-hidden="true"
                  />
                  <span className="section-label-ja">{section.jaLabel}</span>
                  <span className="section-label-zh">{section.zhLabel}</span>
                </summary>
                {section.content}
              </details>
            );
          }

          return (
            <DetailSection
              key={section.id}
              id={section.id}
              jaLabel={section.jaLabel}
              zhLabel={section.zhLabel}
            >
              {section.content}
            </DetailSection>
          );
        })}
      </div>
    </article>
  );
}

export default VocabularyDetail;
