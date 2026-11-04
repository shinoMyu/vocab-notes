import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Languages,
  BookOpen,
  Code2,
  NotebookPen,
} from "lucide-react";

import SearchBar from "../../components/SearchBar";

import "./index.css";

const knowledgeCategories = [
  {
    title: "英文單字",
    subtitle: "English Vocabulary",
    description: "整理英文詞彙、語源、常見搭配與實際用法。",
    path: "/vocabulary/english",
    icon: Languages,
  },
  {
    title: "日文單字",
    subtitle: "Japanese Vocabulary",
    description: "整理日文詞彙、讀音與詳細解釋。",
    path: "/vocabulary/japanese",
    icon: Languages,
  },
  {
    title: "文法筆記",
    subtitle: "Grammar Notes",
    description: "整理英文與日文文法、句型及使用規則。",
    path: "/grammar",
    icon: BookOpen,
  },
  {
    title: "程式與技術筆記",
    subtitle: "Programming & Technology",
    description: "保存程式知識、技術文件與開發紀錄。",
    path: "/programming",
    icon: Code2,
  },
  {
    title: "一般筆記",
    subtitle: "General Notes",
    description: "記錄靈感與其他想法。",
    path: "/notes",
    icon: NotebookPen,
  },
];

function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (keyword) => {
    navigate(`/search?q=${encodeURIComponent(keyword)}`);
  };

  return (
    <div className="home-page">
      <section className="home-intro">
        <p className="home-eyebrow">
          PERSONAL KNOWLEDGE SPACE
        </p>

        <h1>我的知識庫</h1>

        <p className="home-description">
          整理知識、記錄想法，建立自己的學習空間。
        </p>
      </section>

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="搜尋單字、文法、程式與技術筆記..."
        ariaLabel="搜尋知識內容"
        onSubmit={handleSearch}
      />

      <section className="home-section">
        <div className="section-heading">
          <h2>知識分類</h2>
          <p>Knowledge Library</p>
        </div>

        <div className="category-grid">
          {knowledgeCategories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                to={category.path}
                className="category-card"
                key={category.path}
              >
                <div className="category-icon">
                  <Icon size={22} strokeWidth={1.8} />
                </div>

                <div className="category-content">
                  <h3>{category.title}</h3>

                  <span className="category-subtitle">
                    {category.subtitle}
                  </span>

                  <p>{category.description}</p>
                </div>

                <span className="category-arrow">
                  →
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default Home;
