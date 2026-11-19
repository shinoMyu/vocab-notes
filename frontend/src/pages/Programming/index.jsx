import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import SearchBar from "../../components/SearchBar";
import NoteIndexList from "../../components/NoteIndexList";
import {
  PROGRAMMING_CATEGORIES,
  getCategoryTone,
  loadProgrammingNotes,
  sortByUpdatedAt,
} from "./noteData";
import { toPlainText } from "../../utils/noteStorage";

function buildGroups(notes) {
  const groups = PROGRAMMING_CATEGORIES.filter((category) =>
    notes.some((note) => note.categories.includes(category))
  ).map((category) => ({
    key: category,
    label: category,
    tone: getCategoryTone(category),
    notes: notes.filter((note) => note.categories.includes(category)),
    createState: { category },
  }));

  const uncategorized = notes.filter((note) => note.categories.length === 0);

  if (uncategorized.length > 0) {
    groups.push({
      key: "uncategorized",
      label: "未分類",
      tone: "slate",
      notes: uncategorized,
      createState: {},
    });
  }

  return groups;
}

function Programming() {
  const [notes] = useState(loadProgrammingNotes);
  const [keyword, setKeyword] = useState("");

  const normalizedKeyword = keyword.trim().toLowerCase();

  const filteredNotes = sortByUpdatedAt(notes).filter((note) => {
    if (!normalizedKeyword) return true;

    const searchableText = [
      note.title,
      ...note.categories,
      toPlainText(note.content),
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedKeyword);
  });

  const groups = buildGroups(filteredNotes);

  return (
    <div className="note-index">
      <header className="note-index-heading">
        <div className="note-index-heading-info">
          <p className="note-index-eyebrow">PROGRAMMING NOTES</p>

          <h1>程式與技術筆記</h1>

          {notes.length > 0 && (
            <span className="note-index-count">共 {notes.length} 篇筆記</span>
          )}
        </div>

        <Link to="/programming/new" className="note-button-primary">
          <Plus size={16} strokeWidth={2} />
          新增筆記
        </Link>
      </header>

      <div className="note-index-toolbar">
        <div className="note-index-search">
          <SearchBar
            value={keyword}
            onChange={setKeyword}
            placeholder="搜尋標題、分類或內容…"
            ariaLabel="搜尋程式筆記"
            onSubmit={(value) => setKeyword(value)}
          />
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="note-index-empty">
          <p>還沒有任何筆記。先把一個技術主題記下來吧。</p>

          <Link to="/programming/new" className="note-button-primary">
            新增第一篇筆記
          </Link>
        </div>
      ) : groups.length === 0 ? (
        <div className="note-index-empty">
          <p>沒有符合的筆記，試試其他關鍵字。</p>

          <button type="button" onClick={() => setKeyword("")}>
            清除搜尋
          </button>
        </div>
      ) : (
        <NoteIndexList
          groups={groups}
          basePath="/programming"
          createPath="/programming/new"
        />
      )}
    </div>
  );
}

export default Programming;
