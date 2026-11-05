import React from "react";
import {
  FaHome,
  FaStickyNote,
  FaPlus,
  FaCalendarAlt,
  FaArchive,
  FaTrash,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";
import "./Sidebar.css";

/**
 * Collapsible sidebar for the notes dashboard.
 *
 * Props
 *  - collapsed:  boolean, true = icons only, false = icons + labels
 *  - onToggle:   called when the collapse / expand button is clicked
 *  - activeView: "home" | "all" | "new"  (which item is highlighted)
 *  - onHome, onAllNotes, onNewNote: navigation callbacks
 */
const Sidebar = ({
  collapsed,
  onToggle,
  activeView,
  onHome,
  onAllNotes,
  onNewNote,
}) => {
  // Items that work today.
  const mainItems = [
    { key: "home", label: "Home", icon: <FaHome />, onClick: onHome },
    { key: "all", label: "All Notes", icon: <FaStickyNote />, onClick: onAllNotes },
    { key: "new", label: "New Note", icon: <FaPlus />, onClick: onNewNote },
  ];

  // Items that are planned but not built yet (shown disabled).
  const upcomingItems = [
    { key: "calendar", label: "Calendar", icon: <FaCalendarAlt /> },
    { key: "archive", label: "Archive", icon: <FaArchive /> },
    { key: "trash", label: "Trash", icon: <FaTrash /> },
  ];

  return (
    <aside
      className={`app-sidebar ${collapsed ? "is-collapsed" : ""}`}
      aria-label="Main navigation"
    >
      <div className="sidebar-header">
        <span className="sidebar-title sidebar-label">Menu</span>
        <button
          type="button"
          className="sidebar-toggle"
          onClick={onToggle}
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
        </button>
      </div>

      <nav>
        <p className="sidebar-section sidebar-label">Notes</p>
        <ul className="sidebar-list">
          {mainItems.map((item) => (
            <li key={item.key}>
              <button
                type="button"
                className={`sidebar-item ${
                  activeView === item.key ? "is-active" : ""
                }`}
                onClick={item.onClick}
                title={collapsed ? item.label : undefined}
                aria-label={item.label}
                aria-current={activeView === item.key ? "page" : undefined}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="sidebar-divider" />

        <p className="sidebar-section sidebar-label">Coming soon</p>
        <ul className="sidebar-list">
          {upcomingItems.map((item) => (
            <li key={item.key}>
              <button
                type="button"
                className="sidebar-item"
                disabled
                title={collapsed ? `${item.label} (coming soon)` : "Coming soon"}
                aria-label={`${item.label} (coming soon)`}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
