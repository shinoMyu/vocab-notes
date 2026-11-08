import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import SearchBar from "../../components/SearchBar";
import { homeCategories as knowledgeCategories } from "../../data/navigationData";

import "./index.css";

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
                  <h3>{category.label}</h3>

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
