import { useState } from "react";

import GrammarList from "./components/GrammarList";
import { loadGrammarNotes } from "./grammarData";

import "./shared.css";
import "./index.css";

function Grammar() {
  const [notes] = useState(loadGrammarNotes);

  return (
    <div className="grammar-index">
      <header className="grammar-page-heading">
        <div className="grammar-heading-info">
          <p className="grammar-eyebrow">GRAMMAR NOTES</p>

          <h1>文法筆記</h1>

          {notes.length > 0 && (
            <span className="grammar-count">共 {notes.length} 篇筆記</span>
          )}
        </div>
      </header>

      <GrammarList notes={notes} />
    </div>
  );
}

export default Grammar;
