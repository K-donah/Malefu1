import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const adminLinks = [
    { to: "/admin/institutions", label: "Manage Institutions" },
    { to: "/admin/faculties", label: "Manage Faculties" },
    { to: "/admin/courses", label: "Manage Courses" },
    { to: "/admin/companies", label: "Manage Companies" },
    { to: "/admin/reports", label: "Reports & Analytics" },
    { to: "/admin/admissions", label: "Publish Admissions" },
    { to: "/admin/users", label: "Monitor Users" },
  ];

  const dashboardStats = {
    institutions: 24,
    faculties: 156,
    courses: 842,
    companies: 89,
    students: 12500,
    applications: 3450,
    admissions: 1200,
    activeUsers: 13420
  };

  const recentActivities = [
    { id: 1, action: "New Institution", title: "Tech University registered", time: "2 hours ago", icon: "🏛️" },
    { id: 2, action: "Course Added", title: "AI Engineering course created", time: "5 hours ago", icon: "📚" },
    { id: 3, action: "Admissions Published", title: "Spring 2024 admissions", time: "1 day ago", icon: "🎓" },
    { id: 4, action: "Company Registered", title: "TechCorp joined platform", time: "2 days ago", icon: "🏢" }
  ];

  const quickActions = [
    { title: "Publish Admissions", path: "/admin/admissions", icon: "🎓", color: "#10b981", description: "Manage and publish student admissions" },
    { title: "Manage Institutions", path: "/admin/institutions", icon: "🏛️", color: "#3b82f6", description: "Oversee educational institutions" },
    { title: "Monitor Users", path: "/admin/users", icon: "👥", color: "#8b5cf6", description: "Track user activity and growth" },
    { title: "View Reports", path: "/admin/reports", icon: "📊", color: "#f59e0b", description: "Analytics and platform insights" },
    { title: "Manage Companies", path: "/admin/companies", icon: "🏢", color: "#ef4444", description: "Oversee company registrations" },
    { title: "Course Management", path: "/admin/courses", icon: "📚", color: "#06b6d4", description: "Manage academic courses" },
    { title: "Faculty Management", path: "/admin/faculties", icon: "🎯", color: "#84cc16", description: "Oversee faculty departments" },
    { title: "System Settings", path: "/admin/settings", icon: "⚙️", color: "#6b7280", description: "Platform configuration" }
  ];

  const AdminCard = ({ title, description, icon, path, color }) => (
    <Link to={path} style={{ textDecoration: "none", color: "inherit" }}>
      <div className="admin-card" style={{ borderLeft: `4px solid ${color}` }}>
        <div className="card-header">
          <div className="card-icon" style={{ backgroundColor: color + '20' }}>
            {icon}
          </div>
        </div>
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
        <div className="card-arrow">→</div>
      </div>
    </Link>
  );

  const StatCard = ({ title, value, change, icon, color }) => (
    <div className="stat-card" style={{ borderLeft: `4px solid ${color}` }}>
      <div className="stat-content">
        <div className="stat-icon" style={{ backgroundColor: color + '20', color: color }}>
          {icon}
        </div>
        <div className="stat-info">
          <span className="stat-value">{value.toLocaleString()}</span>
          <span className="stat-label">{title}</span>
          {change && <span className="stat-change">{change}</span>}
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => (
    <div className="activity-item">
      <div className="activity-icon">{activity.icon}</div>
      <div className="activity-content">
        <div className="activity-action">{activity.action}</div>
        <div className="activity-title">{activity.title}</div>
        <div className="activity-time">{activity.time}</div>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="admin-dashboard-container">
        <Sidebar links={adminLinks} />
        
        <main className="admin-dashboard-main">
          {/* Header Section */}
          <div className="dashboard-header">
            <div className="header-content">
              <div className="header-text">
                <h1>Admin Dashboard</h1>
                <p>Manage the entire platform and monitor system performance</p>
              </div>
              <div className="header-stats">
                <div className="stat-card main">
                  <div className="stat-icon">🚀</div>
                  <div className="stat-info">
                    <span className="stat-number">{dashboardStats.activeUsers}</span>
                    <span className="stat-label">Active Users</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="dashboard-tabs">
            <button 
              className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              <span className="tab-icon">📊</span>
              Overview
            </button>
            <button 
              className={`tab-button ${activeTab === "management" ? "active" : ""}`}
              onClick={() => setActiveTab("management")}
            >
              <span className="tab-icon">⚙️</span>
              Management
            </button>
            <button 
              className={`tab-button ${activeTab === "analytics" ? "active" : ""}`}
              onClick={() => setActiveTab("analytics")}
            >
              <span className="tab-icon">📈</span>
              Analytics
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <>
              {/* Key Metrics */}
              <div className="metrics-section">
                <h2 className="section-title">📈 Platform Overview</h2>
                <div className="metrics-grid">
                  <StatCard
                    title="Educational Institutions"
                    value={dashboardStats.institutions}
                    change="+12% this month"
                    icon="🏛️"
                    color="#3b82f6"
                  />
                  <StatCard
                    title="Academic Courses"
                    value={dashboardStats.courses}
                    change="+8% this month"
                    icon="📚"
                    color="#8b5cf6"
                  />
                  <StatCard
                    title="Registered Companies"
                    value={dashboardStats.companies}
                    change="+15% this month"
                    icon="🏢"
                    color="#10b981"
                  />
                  <StatCard
                    title="Student Applications"
                    value={dashboardStats.applications}
                    change="+23% this month"
                    icon="📝"
                    color="#f59e0b"
                  />
                </div>
              </div>

              {/* Quick Actions & Recent Activity */}
              <div className="overview-content">
                <div className="actions-section">
                  <h3 className="section-title">🚀 Quick Actions</h3>
                  <div className="actions-grid">
                    {quickActions.slice(0, 4).map((action, index) => (
                      <AdminCard key={index} {...action} />
                    ))}
                  </div>
                </div>

                <div className="activity-section">
                  <h3 className="section-title">📋 Recent Activity</h3>
                  <div className="activity-list">
                    {recentActivities.map(activity => (
                      <ActivityItem key={activity.id} activity={activity} />
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Management Tab */}
          {activeTab === "management" && (
            <div className="management-section">
              <div className="section-header">
                <h2>⚙️ Platform Management</h2>
                <p>Manage all aspects of the educational platform</p>
              </div>
              
              <div className="management-grid">
                {quickActions.map((action, index) => (
                  <AdminCard key={index} {...action} />
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="analytics-section">
              <div className="section-header">
                <h2>📊 Platform Analytics</h2>
                <p>Comprehensive insights and performance metrics</p>
              </div>

              <div className="analytics-grid">
                <div className="analytics-card">
                  <div className="analytics-header">
                    <h3>👥 User Growth</h3>
                    <span className="analytics-value">+34%</span>
                  </div>
                  <div className="analytics-content">
                    <p>Steady growth in user registrations over the past quarter</p>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="analytics-card">
                  <div className="analytics-header">
                    <h3>🎓 Admission Rate</h3>
                    <span className="analytics-value">68%</span>
                  </div>
                  <div className="analytics-content">
                    <p>Successful admission rate across all institutions</p>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="analytics-card">
                  <div className="analytics-header">
                    <h3>💼 Job Placement</h3>
                    <span className="analytics-value">42%</span>
                  </div>
                  <div className="analytics-content">
                    <p>Students placed through company partnerships</p>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '42%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="analytics-card">
                  <div className="analytics-header">
                    <h3>📈 Engagement</h3>
                    <span className="analytics-value">89%</span>
                  </div>
                  <div className="analytics-content">
                    <p>Platform engagement and active usage metrics</p>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '89%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="insights-section">
                <h3>💡 Key Insights</h3>
                <div className="insights-grid">
                  <div className="insight-card">
                    <div className="insight-icon">🚀</div>
                    <div className="insight-content">
                      <h4>Rapid Growth</h4>
                      <p>Platform usage increased by 45% this quarter</p>
                    </div>
                  </div>
                  <div className="insight-card">
                    <div className="insight-icon">🎯</div>
                    <div className="insight-content">
                      <h4>High Satisfaction</h4>
                      <p>92% user satisfaction rate reported</p>
                    </div>
                  </div>
                  <div className="insight-card">
                    <div className="insight-icon">📊</div>
                    <div className="insight-content">
                      <h4>Strong Partnerships</h4>
                      <p>89 companies actively recruiting</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* System Status */}
          <div className="system-status">
            <h3>🟢 System Status</h3>
            <div className="status-grid">
              <div className="status-item online">
                <div className="status-indicator"></div>
                <div className="status-info">
                  <span className="status-label">Platform</span>
                  <span className="status-value">Operational</span>
                </div>
              </div>
              <div className="status-item online">
                <div className="status-indicator"></div>
                <div className="status-info">
                  <span className="status-label">Database</span>
                  <span className="status-value">Healthy</span>
                </div>
              </div>
              <div className="status-item online">
                <div className="status-indicator"></div>
                <div className="status-info">
                  <span className="status-label">API Services</span>
                  <span className="status-value">Running</span>
                </div>
              </div>
              <div className="status-item online">
                <div className="status-indicator"></div>
                <div className="status-info">
                  <span className="status-label">Security</span>
                  <span className="status-value">Protected</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .admin-dashboard-container {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .admin-dashboard-main {
          flex: 1;
          padding: 30px;
          margin-left: 280px;
        }

        .dashboard-header {
          background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
          border-radius: 20px;
          padding: 40px;
          margin-bottom: 30px;
          color: white;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .header-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 40px;
          align-items: center;
        }

        .header-text h1 {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 10px;
          background: linear-gradient(135deg, #fff, #e2e8f0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header-text p {
          font-size: 1.1rem;
          opacity: 0.9;
          max-width: 500px;
        }

        .stat-card.main {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 25px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .stat-icon {
          font-size: 2rem;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 800;
          display: block;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .dashboard-tabs {
          display: flex;
          background: white;
          border-radius: 15px;
          padding: 10px;
          margin-bottom: 30px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }

        .tab-button {
          flex: 1;
          padding: 15px 20px;
          border: none;
          background: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #6b7280;
        }

        .tab-button:hover {
          background: #f8fafc;
          color: #374151;
        }

        .tab-button.active {
          background: #1f2937;
          color: white;
        }

        .tab-icon {
          font-size: 1.1rem;
        }

        .metrics-section {
          background: white;
          border-radius: 20px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }

        .section-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 20px;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .stat-card {
          background: white;
          border-radius: 15px;
          padding: 25px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }

        .stat-content {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .stat-info {
          flex: 1;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 800;
          color: #1f2937;
          display: block;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #6b7280;
          font-weight: 500;
          display: block;
          margin-bottom: 4px;
        }

        .stat-change {
          font-size: 0.8rem;
          color: #10b981;
          font-weight: 600;
        }

        .overview-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
          margin-bottom: 30px;
        }

        .actions-section, .activity-section {
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .admin-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .admin-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .card-header {
          margin-bottom: 15px;
        }

        .card-icon {
          width: 50px;
          height: 50px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
        }

        .card-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .card-description {
          color: #6b7280;
          font-size: 0.85rem;
          line-height: 1.4;
          margin-bottom: 15px;
        }

        .card-arrow {
          color: #6b7280;
          font-weight: 700;
          transition: transform 0.3s ease;
        }

        .admin-card:hover .card-arrow {
          transform: translateX(4px);
          color: #1f2937;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .activity-item {
          display: flex;
          gap: 12px;
          padding: 15px;
          border-radius: 10px;
          transition: background-color 0.2s ease;
        }

        .activity-item:hover {
          background: #f8fafc;
        }

        .activity-icon {
          font-size: 1.2rem;
          width: 40px;
          height: 40px;
          background: #f1f5f9;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .activity-content {
          flex: 1;
        }

        .activity-action {
          font-weight: 600;
          color: #1f2937;
          font-size: 0.9rem;
          margin-bottom: 4px;
        }

        .activity-title {
          color: #6b7280;
          font-size: 0.85rem;
          margin-bottom: 4px;
        }

        .activity-time {
          color: #9ca3af;
          font-size: 0.75rem;
        }

        .management-section, .analytics-section {
          background: white;
          border-radius: 20px;
          padding: 40px;
          margin-bottom: 30px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }

        .section-header {
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #f1f5f9;
        }

        .section-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .section-header p {
          color: #6b7280;
          font-size: 0.95rem;
        }

        .management-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 25px;
        }

        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .analytics-card {
          background: white;
          border: 2px solid #f1f5f9;
          border-radius: 12px;
          padding: 25px;
          transition: all 0.3s ease;
        }

        .analytics-card:hover {
          border-color: #1f2937;
          transform: translateY(-2px);
        }

        .analytics-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .analytics-header h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
        }

        .analytics-value {
          font-size: 1.5rem;
          font-weight: 800;
          color: #10b981;
        }

        .analytics-content p {
          color: #6b7280;
          font-size: 0.85rem;
          margin-bottom: 15px;
          line-height: 1.4;
        }

        .progress-bar {
          height: 6px;
          background: #e5e7eb;
          border-radius: 10px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(135deg, #1f2937, #374151);
          border-radius: 10px;
          transition: width 0.3s ease;
        }

        .insights-section {
          margin-top: 30px;
        }

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .insight-card {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .insight-card:hover {
          background: #f1f5f9;
          transform: translateY(-2px);
        }

        .insight-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .insight-content h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 5px;
        }

        .insight-content p {
          font-size: 0.85rem;
          color: #6b7280;
          line-height: 1.4;
          margin: 0;
        }

        .system-status {
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }

        .status-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .status-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 12px;
        }

        .status-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #10b981;
          animation: pulse 2s infinite;
        }

        .status-item.online .status-indicator {
          background: #10b981;
        }

        .status-label {
          font-weight: 600;
          color: #1f2937;
          font-size: 0.9rem;
          display: block;
        }

        .status-value {
          color: #6b7280;
          font-size: 0.8rem;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        @media (max-width: 1024px) {
          .admin-dashboard-main {
            margin-left: 0;
            padding: 20px;
          }
          
          .header-content {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .overview-content {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .dashboard-header {
            padding: 25px;
          }
          
          .header-text h1 {
            font-size: 2rem;
          }
          
          .dashboard-tabs {
            flex-direction: column;
          }
          
          .metrics-grid {
            grid-template-columns: 1fr;
          }
          
          .management-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .admin-dashboard-main {
            padding: 15px;
          }
          
          .dashboard-header {
            padding: 20px;
          }
          
          .header-text h1 {
            font-size: 1.75rem;
          }
          
          .analytics-grid, .insights-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}