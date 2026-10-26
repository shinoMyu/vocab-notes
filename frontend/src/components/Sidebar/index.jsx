import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const navigation = [
  {
    title: "工作空間",
    items: [
      { label: "總覽", subtitle: "Overview", path: "/", icon: "⌂" },
    ],
  },
  {
    title: "語言學習",
    items: [
      {
        label: "英文單字",
        subtitle: "English Vocabulary",
        path: "/vocabulary/english",
        icon: "Aa",
      },
      {
        label: "日文單字",
        subtitle: "Japanese Vocabulary",
        path: "/vocabulary/japanese",
        icon: "あ",
      },
      {
        label: "英文文法",
        subtitle: "English Grammar",
        path: "/grammar/english",
        icon: "文",
      },
      {
        label: "日文文法",
        subtitle: "Japanese Grammar",
        path: "/grammar/japanese",
        icon: "文",
      },
    ],
  },
  {
    title: "技術知識",
    items: [
      {
        label: "程式與技術筆記",
        subtitle: "Programming",
        path: "/programming",
        icon: "</>",
      },
    ],
  },
  {
    title: "個人筆記",
    items: [
      {
        label: "一般筆記",
        subtitle: "General Notes",
        path: "/notes",
        icon: "▤",
      },
    ],
  },
  {
    title: "系統",
    items: [
      { label: "搜尋", subtitle: "Search", path: "/search", icon: "⌕" },
      { label: "設定", subtitle: "Settings", path: "/settings", icon: "⚙" },
    ],
  },
];

function Sidebar({ isCollapsed, onToggle }) {
  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-top">
        <div className="brand">
          <div className="brand-logo">K</div>

          {!isCollapsed && (
            <span className="brand-name">Knowledge Space</span>
          )}
        </div>

        <button
          className="sidebar-toggle"
          onClick={onToggle}
          title={isCollapsed ? "展開側邊欄" : "收合側邊欄"}
          aria-label={isCollapsed ? "展開側邊欄" : "收合側邊欄"}
        >
          {isCollapsed ? "»" : "«"}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navigation.map((group) => (
          <div className="nav-group" key={group.title}>
            {!isCollapsed && (
              <p className="nav-heading">{group.title}</p>
            )}

            {group.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
              >
                <span className="nav-icon">{item.icon}</span>

                {!isCollapsed && (
                  <span className="nav-label">
                    {item.label}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;