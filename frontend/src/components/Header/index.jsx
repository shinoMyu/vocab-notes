import "./Header.css";

function Header() {
  return (
    <header className="top-header">
      <div className="header-left">
        <span className="breadcrumb">我的知識庫</span>
        <span className="breadcrumb-divider">/</span>
        <span className="breadcrumb-current">總覽</span>
      </div>

      <div className="header-right">
        <button className="search-trigger">
          <span className="search-icon">⌕</span>
          <span>搜尋知識與筆記...</span>
          <kbd>Ctrl K</kbd>
        </button>
      </div>
    </header>
  );
}

export default Header;