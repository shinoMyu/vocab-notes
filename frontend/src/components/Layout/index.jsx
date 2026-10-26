import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../Sidebar";
import Header from "../Header";

import "./Layout.css";

function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div className={`app-layout ${isCollapsed ? "sidebar-collapsed" : ""}`}>
      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={toggleSidebar}
      />

      <div className="main-area">
        <Header />

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;