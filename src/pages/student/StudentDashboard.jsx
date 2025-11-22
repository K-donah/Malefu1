import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

export default function StudentDashboard() {
  const [stats, setStats] = useState({
    applications: 0,
    pending: 0,
    accepted: 0,
    jobs: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);

  const links = [
    { to: "/student/profile", label: "Update Profile / Documents", icon: "👤", color: "#8b5cf6" },
    { to: "/student/apply", label: "Apply for Courses", icon: "📝", color: "#06b6d4" },
    { to: "/student/admissions", label: "Admissions Results", icon: "🎓", color: "#10b981" },
    { to: "/student/jobs", label: "Job Postings", icon: "💼", color: "#f59e0b" },
    { to: "/student/transcripts", label: "Upload Transcripts", icon: "📄", color: "#ef4444" },
  ];

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setStats({
        applications: 5,
        pending: 2,
        accepted: 1,
        jobs: 12
      });
      setRecentActivity([
        { id: 1, type: 'application', message: 'Applied to Computer Science at NUL', time: '2 hours ago', status: 'submitted' },
        { id: 2, type: 'document', message: 'Transcript uploaded successfully', time: '1 day ago', status: 'completed' },
        { id: 3, type: 'admission', message: 'Admission decision pending review', time: '3 days ago', status: 'pending' },
        { id: 4, type: 'job', message: 'New internship opportunity available', time: '5 days ago', status: 'new' }
      ]);
      setUpcomingDeadlines([
        { id: 1, title: 'NUL Application Deadline', date: '2024-12-15', type: 'urgent' },
        { id: 2, title: 'LIM Scholarship Application', date: '2024-12-20', type: 'upcoming' },
        { id: 3, title: 'Transcript Submission', date: '2024-12-25', type: 'upcoming' }
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
        {activity.type === 'document' && '📄'}
        {activity.type === 'admission' && '🎓'}
        {activity.type === 'job' && '💼'}
      </div>
      <div className="activity-content">
        <p className="activity-message">{activity.message}</p>
        <span className="activity-time">{activity.time}</span>
      </div>
      <div className={`activity-status ${activity.status}`}>
        {activity.status === 'submitted' && '🔄'}
        {activity.status === 'completed' && '✅'}
        {activity.status === 'pending' && '⏳'}
        {activity.status === 'new' && '🆕'}
      </div>
    </div>
  );

  const DeadlineItem = ({ deadline }) => (
    <div className={`deadline-item ${deadline.type}`}>
      <div className="deadline-date">
        <span className="date-day">{new Date(deadline.date).getDate()}</span>
        <span className="date-month">
          {new Date(deadline.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
        </span>
      </div>
      <div className="deadline-content">
        <h4>{deadline.title}</h4>
        <p>{new Date(deadline.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
      <div className={`deadline-badge ${deadline.type}`}>
        {deadline.type === 'urgent' ? 'Urgent' : 'Upcoming'}
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="student-dashboard-container">
        <Sidebar links={links} />
        
        <main className="dashboard-main">
          {/* Header Section */}
          <div className="dashboard-header">
            <div className="header-content">
              <div className="welcome-section">
                <h1 className="welcome-title">
                  Welcome to Your Student Dashboard! 🎓
                </h1>
                <p className="welcome-subtitle">
                  Manage your academic journey, track applications, and discover career opportunities
                </p>
              </div>
              <div className="header-stats">
                <div className="stat-item">
                  <div className="stat-number">{stats.applications}</div>
                  <div className="stat-label">Total Applications</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{stats.pending}</div>
                  <div className="stat-label">Pending Reviews</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{stats.accepted}</div>
                  <div className="stat-label">Accepted</div>
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
              subtitle="Course applications submitted"
              color="#8b5cf6"
              to="/student/apply"
            />
            <DashboardCard 
              icon="⏳"
              title="Pending"
              value={stats.pending}
              subtitle="Applications under review"
              color="#f59e0b"
              to="/student/admissions"
            />
            <DashboardCard 
              icon="✅"
              title="Accepted"
              value={stats.accepted}
              subtitle="Successful applications"
              color="#10b981"
              to="/student/admissions"
            />
            <DashboardCard 
              icon="💼"
              title="Job Opportunities"
              value={stats.jobs}
              subtitle="Available positions"
              color="#06b6d4"
              to="/student/jobs"
            />
          </div>

          {/* Main Content Grid */}
          <div className="content-grid">
            {/* Quick Actions */}
            <div className="content-section">
              <div className="section-header">
                <h2>Quick Actions</h2>
                <p>Get things done quickly</p>
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
                <p>Your latest updates</p>
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
                {upcomingDeadlines.map(deadline => (
                  <DeadlineItem key={deadline.id} deadline={deadline} />
                ))}
              </div>
            </div>

            {/* Career Spotlight */}
            <div className="content-section">
              <div className="section-header">
                <h2>Career Spotlight</h2>
                <p>Recommended opportunities</p>
              </div>
              <div className="career-grid">
                <div className="career-card">
                  <div className="career-icon">💻</div>
                  <div className="career-content">
                    <h4>Software Developer Intern</h4>
                    <p>Tech Solutions Ltd.</p>
                    <div className="career-meta">
                      <span>Maseru</span>
                      <span>₦ 25,000/mo</span>
                    </div>
                  </div>
                  <div className="career-badge">Match: 95%</div>
                </div>
                <div className="career-card">
                  <div className="career-icon">📊</div>
                  <div className="career-content">
                    <h4>Data Analyst</h4>
                    <p>Finance Corp</p>
                    <div className="career-meta">
                      <span>Remote</span>
                      <span>₦ 35,000/mo</span>
                    </div>
                  </div>
                  <div className="career-badge">Match: 88%</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .student-dashboard-container {
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
          margin-bottom: 10px;
          background: linear-gradient(135deg, #fff, #e2e8f0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .welcome-subtitle {
          font-size: 1.1rem;
          opacity: 0.9;
          max-width: 500px;
          line-height: 1.6;
        }

        .header-stats {
          display: flex;
          justify-content: space-around;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 25px;
          border-radius: 15px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
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

        .deadline-badge.urgent {
          background: #fef2f2;
          color: #dc2626;
        }

        .deadline-badge.upcoming {
          background: #f0f9ff;
          color: #0369a1;
        }

        .career-grid {
          display: grid;
          gap: 15px;
        }

        .career-card {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .career-card:hover {
          background: white;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .career-icon {
          font-size: 2rem;
        }

        .career-content {
          flex: 1;
        }

        .career-content h4 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 5px;
          color: #1f2937;
        }

        .career-content p {
          font-size: 0.8rem;
          color: #6b7280;
          margin-bottom: 8px;
        }

        .career-meta {
          display: flex;
          gap: 15px;
          font-size: 0.7rem;
          color: #6b7280;
        }

        .career-badge {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          padding: 6px 12px;
          border-radius: 15px;
          font-size: 0.7rem;
          font-weight: 600;
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
        }
      `}</style>
    </>
  );
}