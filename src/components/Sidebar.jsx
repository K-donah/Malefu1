import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ links = [] }) {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [hideTimer, setHideTimer] = useState(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Show sidebar when cursor is within 50px of left edge
      if (e.clientX <= 50) {
        setIsVisible(true);
        // Clear any existing hide timer when sidebar becomes visible
        if (hideTimer) {
          clearTimeout(hideTimer);
          setHideTimer(null);
        }
      } else {
        // Set timer to hide sidebar after 50 seconds when cursor moves away
        if (isVisible && !hideTimer) {
          const timer = setTimeout(() => {
            setIsVisible(false);
            setHideTimer(null);
          }, 50000); // 50 seconds
          setHideTimer(timer);
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (hideTimer) {
        clearTimeout(hideTimer);
      }
    };
  }, [isVisible, hideTimer]);

  const getIconForLabel = (label) => {
    const iconMap = {
      "Update Profile / Documents": "👤",
      "Apply for Courses": "📝",
      "Admissions Results": "🎓",
      "Job Postings": "💼",
      "Upload Transcripts / Certificates": "📄",
      "My Applications": "📋",
      "Course Catalog": "📚",
      "Career Assessment": "🎯",
      "Messages": "💬",
      "Settings": "⚙️",
      "Help & Support": "❓",
      "Logout": "🚪"
    };
    return iconMap[label] || "📄";
  };

  return (
    <aside className={`sidebar-container ${isVisible ? 'visible' : ''}`}>
      {/* Rest of your existing JSX code remains exactly the same */}
      <div className="sidebar-header">
        <div className="header-content">
          <div className="user-info">
            <div className="user-avatar">
              <span>👨‍🎓</span>
            </div>
            <div className="user-details">
              <h3>Student Portal</h3>
              <p>Navigation Menu</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="action-btn" title="Settings">
              ⚙️
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="sidebar-stats">
        <div className="stat-item">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <span className="stat-number">5</span>
            <span className="stat-label">Applications</span>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <span className="stat-number">2</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          <h4 className="section-title">Main Menu</h4>
          <ul className="nav-links">
            {links.slice(0, 5).map((link) => {
              const isActive = location.pathname === link.to;
              const icon = getIconForLabel(link.label);

              return (
                <li key={link.to} className="nav-item">
                  <Link
                    to={link.to}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                  >
                    <span className="nav-icon">{icon}</span>
                    <span className="nav-label">{link.label}</span>
                    {isActive && <div className="active-indicator"></div>}
                    {link.badge && <span className="nav-badge">{link.badge}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="nav-section">
          <h4 className="section-title">Resources</h4>
          <ul className="nav-links">
            {[
              { to: "/student/courses", label: "Course Catalog", badge: "New" },
              { to: "/student/career-assessment", label: "Career Assessment" },
              { to: "/student/messages", label: "Messages", badge: "3" }
            ].map((link) => {
              const isActive = location.pathname === link.to;
              const icon = getIconForLabel(link.label);

              return (
                <li key={link.to} className="nav-item">
                  <Link
                    to={link.to}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                  >
                    <span className="nav-icon">{icon}</span>
                    <span className="nav-label">{link.label}</span>
                    {isActive && <div className="active-indicator"></div>}
                    {link.badge && <span className="nav-badge">{link.badge}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <div className="footer-actions">
          <Link to="/settings" className="footer-link">
            <span>⚙️</span>
            Settings
          </Link>
          <Link to="/help" className="footer-link">
            <span>❓</span>
            Help
          </Link>
        </div>
        <div className="user-profile">
          <div className="profile-avatar">S</div>
          <div className="profile-info">
            <span className="profile-name">Student User</span>
            <span className="profile-role">Active</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .sidebar-container {
          width: 300px;
          height: 100vh;
          background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
          color: white;
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
          box-shadow: 5px 0 30px rgba(0, 0, 0, 0.3);
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          z-index: 1000;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
        }

        .sidebar-container.visible {
          transform: translateX(0);
        }

        /* Rest of your existing CSS remains exactly the same */
        .sidebar-header {
          padding: 30px 25px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .user-details h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 700;
          color: white;
        }

        .user-details p {
          margin: 0;
          font-size: 0.8rem;
          color: #94a3b8;
        }

        .action-btn {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 8px;
          padding: 8px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .action-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }

        .sidebar-stats {
          padding: 20px 25px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 15px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .stat-item:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .stat-icon {
          font-size: 1.2rem;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-number {
          font-size: 1.3rem;
          font-weight: 800;
          color: white;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #94a3b8;
        }

        .sidebar-nav {
          flex: 1;
          padding: 20px 0;
          overflow-y: auto;
        }

        .nav-section {
          margin-bottom: 25px;
        }

        .section-title {
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 0 25px 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .nav-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .nav-item {
          margin: 4px 15px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 15px;
          text-decoration: none;
          color: #cbd5e1;
          border-radius: 10px;
          transition: all 0.3s ease;
          position: relative;
          border: 1px solid transparent;
        }

        .nav-link:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateX(5px);
        }

        .nav-link.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .nav-icon {
          font-size: 1.1rem;
          width: 20px;
          text-align: center;
        }

        .nav-label {
          flex: 1;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .active-indicator {
          width: 4px;
          height: 20px;
          background: white;
          border-radius: 2px;
          margin-left: auto;
        }

        .nav-badge {
          background: linear-gradient(135deg, #f093fb, #f5576c);
          color: white;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 0.7rem;
          font-weight: 600;
          animation: pulse 2s infinite;
        }

        .sidebar-footer {
          padding: 20px 25px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.2);
        }

        .footer-actions {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        .footer-link {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          text-decoration: none;
          color: #94a3b8;
          font-size: 0.8rem;
          transition: all 0.3s ease;
        }

        .footer-link:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 15px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .profile-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #4facfe, #00f2fe);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: white;
        }

        .profile-info {
          flex: 1;
        }

        .profile-name {
          display: block;
          font-size: 0.9rem;
          font-weight: 600;
          color: white;
        }

        .profile-role {
          font-size: 0.75rem;
          color: #10b981;
        }

        /* Scrollbar Styling */
        .sidebar-nav::-webkit-scrollbar {
          width: 4px;
        }

        .sidebar-nav::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }

        .sidebar-nav::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
        }

        .sidebar-nav::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        /* Animations */
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .sidebar-container {
            width: 280px;
          }
        }

        @media (max-width: 480px) {
          .sidebar-container {
            width: 100%;
          }
        }
      `}</style>
    </aside>
  );
}