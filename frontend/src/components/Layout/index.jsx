import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Sidebar from "../Sidebar";
import "./layout.css";

function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  const handleNavigate = () => {
    setIsMobileOpen(false);
    setIsCollapsed(true);
  };

  return (
    <div className="app-layout">
      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={toggleSidebar}
        isMobileOpen={isMobileOpen}
        onClose={closeMobileSidebar}
        onNavigate={handleNavigate}
      />

      {isMobileOpen && (
        <button
          className="sidebar-backdrop"
          onClick={closeMobileSidebar}
          aria-label="關閉選單"
        />
      )}

      <div className="main-area">
        <button
          className="mobile-menu-button"
          onClick={() => setIsMobileOpen((prev) => !prev)}
          aria-label={isMobileOpen ? "關閉選單" : "開啟選單"}
        >
          {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;