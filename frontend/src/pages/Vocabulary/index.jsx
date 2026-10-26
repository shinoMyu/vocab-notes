import { useLocation } from "react-router-dom";

function Vocabulary() {
  const location = useLocation();
  const isJapanese = location.pathname.includes("japanese");

  const title = isJapanese ? "日文單字" : "英文單字";
  const subtitle = isJapanese
    ? "Japanese Vocabulary"
    : "English Vocabulary";

  return (
    <div className="vocabulary-page">
      <h1>{title}</h1>
      <p className="page-subtitle">{subtitle}</p>

      <div className="page-placeholder">
        單字內容將會顯示在這裡。
      </div>
    </div>
  );
}

export default Vocabulary;