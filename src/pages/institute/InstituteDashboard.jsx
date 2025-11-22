import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function InstituteDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    applications: 0,
    students: 0,
    courses: 0,
    faculties: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  const links = [
    { to: "/institute/profile", label: "Manage Profile", icon: "👤", color: "#8b5cf6" },
    { to: "/institute/faculties", label: "Faculties", icon: "🏛️", color: "#06b6d4" },
    { to: "/institute/courses", label: "Courses", icon: "📚", color: "#10b981" },
    { to: "/institute/applications", label: "Student Applications", icon: "📝", color: "#f59e0b" },
    { to: "/institute/admissions", label: "Publish Admissions", icon: "🎓", color: "#ef4444" },
    { to: "/institute/student-status", label: "Manage Student Status", icon: "👥", color: "#6366f1" },
  ];

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setStats({
        applications: 156,
        students: 1247,
        courses: 42,
        faculties: 8
      });
      setRecentActivity([
        { id: 1, type: 'application', message: '15 new applications received', time: '2 hours ago', status: 'new' },
        { id: 2, type: 'admission', message: 'Admission results published for Computer Science', time: '1 day ago', status: 'completed' },
        { id: 3, type: 'course', message: 'New course "Data Science" added', time: '2 days ago', status: 'completed' },
        { id: 4, type: 'student', message: '25 students enrolled this week', time: '3 days ago', status: 'completed' }
      ]);
    }, 1000);
  }, []);

  const DashboardCard = ({ icon, title, value, subtitle, color, to }) => (
    <Link 
      to={to} 
      className="dashboard-card"
      style={{ '--card-color': color }}
    >
      <div className="card-header">
        <div className="card-icon" style={{ background: color }}>
          {icon}
        </div>
        <div className="card-arrow">→</div>
      </div>
      <div className="card-content">
        <h3>{title}</h3>
        <div className="card-value">{value}</div>
        <p>{subtitle}</p>
      </div>
    </Link>
  );

  const ActivityItem = ({ activity }) => (
    <div className={`activity-item ${activity.status}`}>
      <div className="activity-icon">
        {activity.type === 'application' && '📝'}
        {activity.type === 'admission' && '🎓'}
        {activity.type === 'course' && '📚'}
        {activity.type === 'student' && '👥'}
      </div>
      <div className="activity-content">
        <p className="activity-message">{activity.message}</p>
        <span className="activity-time">{activity.time}</span>
      </div>
      <div className={`activity-status ${activity.status}`}>
        {activity.status === 'new' && '🆕'}
        {activity.status === 'completed' && '✅'}
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="institute-dashboard-container">
        <Sidebar links={links} />
        
        <main className="dashboard-main">
          {/* Header Section */}
          <div className="dashboard-header">
            <div className="header-content">
              <div className="welcome-section">
                <h1 className="welcome-title">
                  Welcome back, <span className="institute-name">{user?.name}</span>! 🎓
                </h1>
                <p className="welcome-subtitle">
                  Manage your institution, review applications, and track academic progress
                </p>
                <div className="header-stats">
                  <div className="stat">
                    <div className="stat-number">{stats.applications}</div>
                    <div className="stat-label">Pending Applications</div>
                  </div>
                  <div className="stat">
                    <div className="stat-number">{stats.students}</div>
                    <div className="stat-label">Total Students</div>
                  </div>
                </div>
              </div>
              <div className="institute-profile">
                <div className="profile-avatar">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="profile-info">
                  <div className="profile-name">{user?.name}</div>
                  <div className="profile-role">
                    <span className="role-badge">Institute Admin</span>
                  </div>
                  <div className="profile-meta">
                    <span>Active • Last login: Today</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="stats-grid">
            <DashboardCard 
              icon="📝"
              title="Applications"
              value={stats.applications}
              subtitle="Pending review"
              color="#8b5cf6"
              to="/institute/applications"
            />
            <DashboardCard 
              icon="👥"
              title="Students"
              value={stats.students}
              subtitle="Enrolled students"
              color="#06b6d4"
              to="/institute/student-status"
            />
            <DashboardCard 
              icon="📚"
              title="Courses"
              value={stats.courses}
              subtitle="Active courses"
              color="#10b981"
              to="/institute/courses"
            />
            <DashboardCard 
              icon="🏛️"
              title="Faculties"
              value={stats.faculties}
              subtitle="Academic departments"
              color="#f59e0b"
              to="/institute/faculties"
            />
          </div>

          {/* Main Content Grid */}
          <div className="content-grid">
            {/* Quick Actions */}
            <div className="content-section">
              <div className="section-header">
                <h2>Quick Actions</h2>
                <p>Manage your institution efficiently</p>
              </div>
              <div className="actions-grid">
                {links.map((link) => (
                  <Link key={link.to} to={link.to} className="action-card">
                    <div className="action-icon" style={{ background: link.color }}>
                      {link.icon}
                    </div>
                    <h3>{link.label}</h3>
                    <div className="action-arrow">→</div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="content-section">
              <div className="section-header">
                <h2>Recent Activity</h2>
                <p>Latest updates from your institution</p>
              </div>
              <div className="activity-feed">
                {recentActivity.map(activity => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="content-section">
              <div className="section-header">
                <h2>Upcoming Deadlines</h2>
                <p>Important dates to remember</p>
              </div>
              <div className="deadlines-list">
                <div className="deadline-item urgent">
                  <div className="deadline-date">
                    <span className="date-day">15</span>
                    <span className="date-month">DEC</span>
                  </div>
                  <div className="deadline-content">
                    <h4>Application Deadline</h4>
                    <p>Fall 2024 Semester</p>
                  </div>
                  <div className="deadline-badge">Urgent</div>
                </div>
                <div className="deadline-item">
                  <div className="deadline-date">
                    <span className="date-day">20</span>
                    <span className="date-month">DEC</span>
                  </div>
                  <div className="deadline-content">
                    <h4>Admission Results</h4>
                    <p>Publish decisions</p>
                  </div>
                  <div className="deadline-badge">Upcoming</div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="content-section">
              <div className="section-header">
                <h2>Performance Overview</h2>
                <p>Key metrics for your institution</p>
              </div>
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-icon">🎯</div>
                  <div className="metric-content">
                    <h4>85%</h4>
                    <p>Admission Rate</p>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon">⭐</div>
                  <div className="metric-content">
                    <h4>4.2/5</h4>
                    <p>Student Satisfaction</p>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon">📈</div>
                  <div className="metric-content">
                    <h4>+12%</h4>
                    <p>Enrollment Growth</p>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon">⏱️</div>
                  <div className="metric-content">
                    <h4>2.1 days</h4>
                    <p>Avg. Response Time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .institute-dashboard-container {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .dashboard-main {
          flex: 1;
          padding: 30px;
          margin-left: 280px; /* Sidebar width */
        }

        .dashboard-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

        .welcome-title {
          font-size: 2.5rem;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 10px;
        }

        .institute-name {
          background: linear-gradient(135deg, #ffd89b, #19547b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .welcome-subtitle {
          font-size: 1.1rem;
          opacity: 0.9;
          margin-bottom: 25px;
          max-width: 500px;
        }

        .header-stats {
          display: flex;
          gap: 30px;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 800;
          display: block;
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .institute-profile {
          display: flex;
          align-items: center;
          gap: 20px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 25px;
          border-radius: 15px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .profile-avatar {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
        }

        .profile-name {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 5px;
        }

        .role-badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          text-transform: capitalize;
        }

        .profile-meta {
          font-size: 0.8rem;
          opacity: 0.8;
          margin-top: 5px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .dashboard-card {
          background: white;
          padding: 25px;
          border-radius: 15px;
          text-decoration: none;
          color: inherit;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border: 2px solid transparent;
          position: relative;
          overflow: hidden;
        }

        .dashboard-card:hover {
          transform: translateY(-5px);
          border-color: var(--card-color);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .card-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .card-arrow {
          font-size: 1.2rem;
          color: #6b7280;
          transition: transform 0.3s ease;
        }

        .dashboard-card:hover .card-arrow {
          transform: translateX(5px);
          color: var(--card-color);
        }

        .card-content h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #6b7280;
          margin-bottom: 10px;
        }

        .card-value {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1f2937;
          margin-bottom: 5px;
        }

        .card-content p {
          font-size: 0.9rem;
          color: #9ca3af;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
        }

        .content-section {
          background: white;
          border-radius: 15px;
          padding: 25px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
        }

        .section-header {
          margin-bottom: 20px;
        }

        .section-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 5px;
        }

        .section-header p {
          color: #6b7280;
          font-size: 0.9rem;
        }

        .actions-grid {
          display: grid;
          gap: 15px;
        }

        .action-card {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 12px;
          text-decoration: none;
          color: inherit;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .action-card:hover {
          background: white;
          border-color: #667eea;
          transform: translateX(5px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .action-icon {
          width: 50px;
          height: 50px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .action-card h3 {
          flex: 1;
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .action-arrow {
          font-size: 1.2rem;
          color: #6b7280;
          transition: transform 0.3s ease;
        }

        .action-card:hover .action-arrow {
          transform: translateX(3px);
          color: #667eea;
        }

        .activity-feed {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          background: #f8fafc;
          border-radius: 10px;
          transition: background 0.3s ease;
        }

        .activity-item:hover {
          background: #f1f5f9;
        }

        .activity-icon {
          font-size: 1.2rem;
        }

        .activity-content {
          flex: 1;
        }

        .activity-message {
          font-weight: 500;
          margin-bottom: 5px;
          color: #1f2937;
        }

        .activity-time {
          font-size: 0.8rem;
          color: #6b7280;
        }

        .activity-status {
          font-size: 1.1rem;
        }

        .deadlines-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .deadline-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          background: #f8fafc;
          border-radius: 10px;
          transition: background 0.3s ease;
        }

        .deadline-item:hover {
          background: #f1f5f9;
        }

        .deadline-item.urgent {
          border-left: 4px solid #ef4444;
        }

        .deadline-date {
          text-align: center;
          background: #667eea;
          color: white;
          padding: 12px;
          border-radius: 8px;
          min-width: 60px;
        }

        .date-day {
          display: block;
          font-size: 1.3rem;
          font-weight: 700;
        }

        .date-month {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
        }

        .deadline-content {
          flex: 1;
        }

        .deadline-content h4 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 5px;
          color: #1f2937;
        }

        .deadline-content p {
          font-size: 0.8rem;
          color: #6b7280;
        }

        .deadline-badge {
          padding: 6px 12px;
          border-radius: 15px;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .deadline-item.urgent .deadline-badge {
          background: #fef2f2;
          color: #dc2626;
        }

        .deadline-item:not(.urgent) .deadline-badge {
          background: #f0f9ff;
          color: #0369a1;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .metric-card {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .metric-card:hover {
          background: white;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .metric-icon {
          font-size: 2rem;
        }

        .metric-content h4 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 2px;
        }

        .metric-content p {
          font-size: 0.8rem;
          color: #6b7280;
        }

        @media (max-width: 1024px) {
          .dashboard-main {
            margin-left: 0;
            padding: 20px;
          }
          
          .content-grid {
            grid-template-columns: 1fr;
          }
          
          .header-content {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }

        @media (max-width: 768px) {
          .dashboard-header {
            padding: 25px;
          }
          
          .welcome-title {
            font-size: 2rem;
          }
          
          .stats-grid {
            grid-template-columns: 1fr 1fr;
          }
          
          .header-stats {
            flex-direction: column;
            gap: 15px;
          }
          
          .institute-profile {
            flex-direction: column;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .dashboard-header {
            padding: 20px;
          }
          
          .welcome-title {
            font-size: 1.75rem;
          }
          
          .metrics-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}