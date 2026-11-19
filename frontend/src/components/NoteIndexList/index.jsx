import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, FileText, Plus } from "lucide-react";

import { formatUpdatedAt } from "../../utils/noteStorage";

import "./note-index.css";

function NoteIndexList({ groups, basePath, createPath, renderSubtitle }) {
  const [collapsedKeys, setCollapsedKeys] = useState([]);

  function toggleGroup(key) {
    setCollapsedKeys((previous) =>
      previous.includes(key)
        ? previous.filter((item) => item !== key)
        : [...previous, key]
    );
  }

  return (
    <div className="note-index-groups">
      {groups.map((group) => {
        const isCollapsed = collapsedKeys.includes(group.key);

        return (
          <section className="note-index-group" key={group.key}>
            {group.label && (
              <div className="note-index-group-header">
                <button
                  type="button"
                  className="note-index-group-toggle"
                  aria-expanded={!isCollapsed}
                  onClick={() => toggleGroup(group.key)}
                >
                  <ChevronDown
                    size={15}
                    strokeWidth={2}
                    className={`note-index-group-chevron ${isCollapsed ? "is-collapsed" : ""}`}
                  />

                  <span
                    className={`note-index-group-chip note-tone-${group.tone ?? "slate"}`}
                  >
                    {group.label}
                  </span>

                  <span className="note-index-group-count">
                    {group.notes.length} 篇
                  </span>
                </button>

                {group.createState && (
                  <Link
                    to={createPath}
                    state={group.createState}
                    className="note-index-group-add"
                    aria-label={`在「${group.label}」新增筆記`}
                    title={`在「${group.label}」新增筆記`}
                  >
                    <Plus size={15} strokeWidth={2} />
                  </Link>
                )}
              </div>
            )}

            {!isCollapsed && (
              <div className="note-index-rows">
                {group.notes.map((note) => (
                  <Link
                    to={`${basePath}/${note.id}`}
                    className="note-index-row"
                    key={note.id}
                  >
                    <span className="note-index-row-icon">
                      <FileText size={16} strokeWidth={1.7} />
                    </span>

                    <span className="note-index-row-main">
                      <span className="note-index-row-title">
                        {note.title || "未命名筆記"}
                      </span>

                      {renderSubtitle?.(note)}
                    </span>

                    <span className="note-index-row-date">
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
  );
}

export default NoteIndexList;
