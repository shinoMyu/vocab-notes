import { NavLink } from "react-router-dom";
import {
  House,
  Languages,
  BookOpen,
  Code2,
  NotebookPen,
  Search,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";

import "./sidebar.css";

const navigation = [
  {
    title: "工作空間",
    items: [
      {
        label: "總覽",
        subtitle: "Overview",
        path: "/",
        icon: House,
      },
    ],
  },
  {
    title: "語言學習",
    items: [
      {
        label: "英文單字",
        subtitle: "English Vocabulary",
        path: "/vocabulary/english",
        icon: Languages,
      },
      {
        label: "日文單字",
        subtitle: "Japanese Vocabulary",
        path: "/vocabulary/japanese",
        icon: Languages,
      },
      {
        label: "英文文法",
        subtitle: "English Grammar",
        path: "/grammar/english",
        icon: BookOpen,
      },
      {
        label: "日文文法",
        subtitle: "Japanese Grammar",
        path: "/grammar/japanese",
        icon: BookOpen,
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
        icon: Code2,
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
        icon: NotebookPen,
      },
    ],
  },
  {
    title: "系統",
    items: [
      {
        label: "搜尋",
        subtitle: "Search",
        path: "/search",
        icon: Search,
      },
      {
        label: "設定",
        subtitle: "Settings",
        path: "/settings",
        icon: Settings,
      },
    ],
  },
];

function Sidebar({
  isCollapsed,
  onToggle,
  isMobileOpen,
  onClose,
  onNavigate,
}) {
  const toggleState = isMobileOpen
    ? { icon: X, label: "關閉選單", action: onClose }
    : isCollapsed
      ? { icon: PanelLeftOpen, label: "展開側邊欄", action: onToggle }
      : { icon: PanelLeftClose, label: "收合側邊欄", action: onToggle };

  const ToggleIcon = toggleState.icon;

  return (
    <aside
      className={`sidebar ${isCollapsed ? "collapsed" : ""} ${isMobileOpen ? "mobile-open" : ""}`}
    >
      <div className="sidebar-top">
        {!isCollapsed && (
          <div className="brand">
            <div className="brand-logo">K</div>
            <span className="brand-name">Knowledge Space</span>
          </div>
        )}

        <button
          className="sidebar-toggle"
          onClick={toggleState.action}
          title={toggleState.label}
          aria-label={toggleState.label}
        >
          <ToggleIcon size={19} strokeWidth={1.8} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {navigation.map((group) => (
          <div className="nav-group" key={group.title}>
            {!isCollapsed && (
              <p className="nav-heading">{group.title}</p>
            )}

            {group.items.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  title={isCollapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? "active" : ""}`
                  }
                  onClick={onNavigate}
                >
                  <span className="nav-icon">
                    <Icon size={19} strokeWidth={1.8} />
                  </span>

                  {!isCollapsed && (
                    <span className="nav-label">
                      {item.label}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;