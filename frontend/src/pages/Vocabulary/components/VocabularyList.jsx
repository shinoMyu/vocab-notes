import { useState } from "react";
import SearchBar from "../../../components/SearchBar";
import { FREQUENCY_META } from "../vocabularyMeta";
import "./VocabularyList.css";

function VocabularyList({ entries, selectedId, onSelect }) {
  const [keyword, setKeyword] = useState("");

  const filteredEntries = entries.filter((entry) => {
    const text = [
      entry.term,
      entry.chineseExplanation,
      ...(entry.partOfSpeech ?? []),
      ...(entry.collocations ?? []).map((item) => item.phrase),
    ].join(" ");

    return text.toLowerCase().includes(keyword.trim().toLowerCase());
  });

  return (
    <div className="vocab-panel">
      <div className="vocab-panel-toolbar">
        <SearchBar
          value={keyword}
          onChange={setKeyword}
          placeholder="搜尋單字或解釋…"
          ariaLabel="搜尋單字"
          onSubmit={(value) => setKeyword(value)}
        />
      </div>

      {filteredEntries.length > 0 && (
        <div className="vocab-grid" role="list">
          {filteredEntries.map((entry) => {
            const frequency = entry.frequencyLevel
              ? FREQUENCY_META[entry.frequencyLevel]
              : null;

            return (
              <button
                key={entry.id}
                type="button"
                role="listitem"
                className={`vocab-card ${selectedId === entry.id ? "selected" : ""
                  }`}
                onClick={() => onSelect(entry)}
              >
                <span className="vocab-card-term">{entry.term}</span>

                <span className="vocab-card-meta">
                  {(entry.partOfSpeech ?? []).length > 0 && (
                    <span className="vocab-card-pos">
                      {(entry.partOfSpeech ?? []).join(" ")}
                    </span>
                  )}

                  {frequency && (
                    <span
                      className={`vocab-card-freq ${frequency.className}`}
                      title={`${entry.frequencyLevel}（頻度 ${frequency.range}）`}
                    >
                      <i />
                      {frequency.score}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}


      {filteredEntries.length === 0 && (
        <div className="list-empty">
          <p>找不到符合的單字，試試其他關鍵字。</p>
        </div>
      )}
    </div>
  );
}

export default VocabularyList;