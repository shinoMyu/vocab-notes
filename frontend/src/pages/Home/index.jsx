import { Link } from "react-router-dom";
import "./index.css";

const knowledgeCategories = [
  {
    title: "英文單字",
    subtitle: "English Vocabulary",
    description: "整理英文詞彙、意思與實際使用方式。",
    path: "/vocabulary/english",
    icon: "Aa",
  },
  {
    title: "日文單字",
    subtitle: "Japanese Vocabulary",
    description: "整理日文詞彙、讀音與詳細解釋。",
    path: "/vocabulary/japanese",
    icon: "あ",
  },
  {
    title: "程式與技術筆記",
    subtitle: "Programming",
    description: "保存程式知識、技術文件與開發紀錄。",
    path: "/programming",
    icon: "</>",
  },
  {
    title: "英文文法",
    subtitle: "English Grammar",
    description: "記錄英文文法規則與使用情境。",
    path: "/grammar/english",
    icon: "文",
  },
  {
    title: "日文文法",
    subtitle: "Japanese Grammar",
    description: "整理日文助詞、句型與文法知識。",
    path: "/grammar/japanese",
    icon: "文",
  },
  {
    title: "一般筆記",
    subtitle: "General Notes",
    description: "記錄靈感、閱讀心得與其他想法。",
    path: "/notes",
    icon: "▤",
  },
];

function Home() {
  return (
    <div className="home-page">
      <section className="home-intro">
        <p className="home-eyebrow">PERSONAL KNOWLEDGE SPACE</p>

        <h1>我的知識庫</h1>

        <p className="home-description">
          整理知識、記錄想法，建立自己的學習空間。
        </p>
      </section>

      <section className="home-section">
        <div className="section-heading">
          <div>
            <h2>知識分類</h2>
            <p>Knowledge Library</p>
          </div>
        </div>

        <div className="category-grid">
          {knowledgeCategories.map((category) => (
            <Link
              to={category.path}
              className="category-card"
              key={category.path}
            >
              <div className="category-card-top">
                <span className="category-icon">
                  {category.icon}
                </span>

                <span className="category-arrow">↗</span>
              </div>

              <h3>{category.title}</h3>

              <p className="category-subtitle">
                {category.subtitle}
              </p>

              <p className="category-description">
                {category.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section recent-section">
        <div className="section-heading">
          <div>
            <h2>最近更新</h2>
            <p>Recently Updated</p>
          </div>
        </div>

        <div className="recent-empty">
          <p>目前還沒有筆記</p>
          <span>建立第一篇筆記後，就會顯示在這裡。</span>
        </div>
      </section>
    </div>
  );
}

export default Home;