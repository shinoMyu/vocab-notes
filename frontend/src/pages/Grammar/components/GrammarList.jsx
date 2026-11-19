import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, FileText, Plus } from "lucide-react";

import SearchBar from "../../../components/SearchBar";
import {
  GRAMMAR_CATEGORIES,
  LANGUAGE_OPTIONS,
  formatUpdatedAt,
  getCategoryTone,
  sortGrammarNotes,
} from "../grammarData";

function buildCategoryGroups(notes) {
  const categories = [
    ...new Set([
      ...GRAMMAR_CATEGORIES,
      ...notes.flatMap((note) => note.categories),
    ]),
  ];

  return [
    ...categories.map((category) => ({
      key: category,
      label: category,
      tone: getCategoryTone(category),
      notes: notes.filter((note) => note.categories.includes(category)),
    })),
    {
      key: "uncategorized",
      label: "未分類",
      tone: "slate",
      isUncategorized: true,
      notes: notes.filter((note) => note.categories.length === 0),
    },
  ].filter((group) => group.notes.length > 0);
}

function GrammarList({ notes }) {
  const [keyword, setKeyword] = useState("");
  const [activeLanguage, setActiveLanguage] = useState(
    LANGUAGE_OPTIONS[0].value
  );
  const [collapsedKeys, setCollapsedKeys] = useState([]);

  const normalizedKeyword = keyword.trim().toLowerCase();
  const sortedNotes = sortGrammarNotes(notes);

  const visibleNotes = sortedNotes.filter((note) => {
    if (!normalizedKeyword) return true;

    const searchableText = [
      note.title,
      ...note.categories,
      ...note.relatedVocab.map((item) => item.term),
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedKeyword);
  });

  const sections = LANGUAGE_OPTIONS.map((option) => {
    const sectionNotes = visibleNotes.filter(
      (note) => note.language === option.value
    );

    return {
      ...option,
      notes: sectionNotes,
      groups: buildCategoryGroups(sectionNotes),
    };
  });

  const visibleSections = sections.filter(
    (section) => !normalizedKeyword || section.notes.length > 0
  );

  const displayLanguage = visibleSections.some(
    (section) => section.value === activeLanguage
  )
    ? activeLanguage
    : visibleSections[0]?.value;

  function toggleGroup(key) {
    setCollapsedKeys((previous) =>
      previous.includes(key)
        ? previous.filter((item) => item !== key)
        : [...previous, key]
    );
  }

  return (
    <div className="grammar-list">
      <div className="grammar-index-toolbar">
        <div className="grammar-index-search">
          <SearchBar
            value={keyword}
            onChange={setKeyword}
            placeholder="搜尋標題、分類或相關單字…"
            ariaLabel="搜尋文法筆記"
            onSubmit={(value) => setKeyword(value)}
          />
        </div>

        {visibleSections.length > 0 && (
          <div className="grammar-language-switch">
            {sections.map((section) => (
              <button
                key={section.value}
                type="button"
                className={
                  section.value === displayLanguage ? "is-active" : ""
                }
                aria-pressed={section.value === displayLanguage}
                disabled={normalizedKeyword && section.notes.length === 0}
                onClick={() => setActiveLanguage(section.value)}
              >
                {section.label}
                <span className="grammar-language-switch-count">
                  {section.notes.length}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {normalizedKeyword && visibleNotes.length === 0 ? (
        <div className="grammar-list-empty">
          <p>沒有符合的筆記，試試其他關鍵字。</p>

          <button type="button" onClick={() => setKeyword("")}>
            清除搜尋
          </button>
        </div>
      ) : (
        <div className="grammar-language-sections">
          {visibleSections.map((section) => (
            <section
              className={`grammar-language-section ${
                section.value === displayLanguage ? "is-active" : ""
              }`}
              key={section.value}
            >
                <div className="grammar-language-header">
                  <span
                    className={`grammar-lang-badge ${section.value}`}
                  >
                    {section.short}
                  </span>

                  <h2 className="grammar-language-title">
                    {section.label}文法
                  </h2>

                  <span className="grammar-language-count">
                    {section.notes.length} 篇
                  </span>

                  <Link
                    to="/grammar/new"
                    state={{ language: section.value }}
                    className="grammar-language-add"
                    aria-label={`新增${section.label}文法筆記`}
                    title={`新增${section.label}文法筆記`}
                  >
                    <Plus size={14} strokeWidth={2} />
                    新增
                  </Link>
                </div>

                {section.groups.length > 0 ? (
                  <div className="grammar-groups">
                    {section.groups.map((group) => {
                      const groupKey = `${section.value}:${group.key}`;
                      const isCollapsed = collapsedKeys.includes(groupKey);
                      const createState = group.isUncategorized
                        ? { language: section.value }
                        : {
                            language: section.value,
                            category: group.key,
                          };

                      return (
                        <section className="grammar-group" key={groupKey}>
                          <div className="grammar-group-header">
                            <button
                              type="button"
                              className="grammar-group-toggle"
                              aria-expanded={!isCollapsed}
                              onClick={() => toggleGroup(groupKey)}
                            >
                              <ChevronDown
                                size={15}
                                strokeWidth={2}
                                className={`grammar-group-chevron ${isCollapsed ? "is-collapsed" : ""}`}
                              />

                              <span
                                className={`grammar-group-chip grammar-tone-${group.tone}`}
                              >
                                {group.label}
                              </span>

                              <span className="grammar-group-count">
                                {group.notes.length} 篇
                              </span>
                            </button>

                            <Link
                              to="/grammar/new"
                              state={createState}
                              className="grammar-group-add"
                              aria-label={`在「${group.label}」新增筆記`}
                              title={`在「${group.label}」新增筆記`}
                            >
                              <Plus size={15} strokeWidth={2} />
                            </Link>
                          </div>

                          {!isCollapsed && (
                            <div className="grammar-group-rows">
                              {group.notes.map((note) => (
                                <Link
                                  to={`/grammar/${note.id}`}
                                  className="grammar-index-row"
                                  key={note.id}
                                >
                                  <span className="grammar-index-row-icon">
                                    <FileText
                                      size={16}
                                      strokeWidth={1.7}
                                    />
                                  </span>

                                  <span className="grammar-index-row-main">
                                    <span className="grammar-index-row-title">
                                      {note.title || "未命名筆記"}
                                    </span>                       
                                  </span>

                                  <span className="grammar-index-row-date">
                                    {formatUpdatedAt(note.updatedAt)}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          )}
                        </section>
                      );
                    })}
                  </div>
                ) : (
                  <p className="grammar-language-empty">
                    {normalizedKeyword
                      ? `沒有符合的${section.label}筆記。`
                      : `尚未有${section.label}文法筆記。`}
                  </p>
                )}
              </section>
            ))}
          </div>
      )}
    </div>
  );
}

export default GrammarList;
