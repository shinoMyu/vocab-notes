import { NavLink } from "react-router-dom";
import { PanelLeftClose, PanelLeftOpen, X } from "lucide-react";

import { sidebarNavigation as navigation } from "../../data/navigationData";
import "./sidebar.css";

function Sidebar({
  isCollapsed,
  onToggle,
  isMobileOpen,
  onClose,
  onNavigate,
}) {

  const isExpanded = !isCollapsed || isMobileOpen;

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
        {isExpanded && (
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
            {isExpanded && (
              <p className="nav-heading">{group.title}</p>
            )}

            {group.items.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  title={isExpanded ? undefined : item.label}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? "active" : ""}`
                  }
                  onClick={onNavigate}
                >
                  <span className="nav-icon">
                    <Icon size={19} strokeWidth={1.8} />
                  </span>

                  {isExpanded && (
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