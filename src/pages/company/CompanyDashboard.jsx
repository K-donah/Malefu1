import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

export default function CompanyDashboard() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const sidebarLinks = [
    { to: "/company/post-job", label: "Post Job" },
    { to: "/company/applicants", label: "View Applicants" },
    { to: "/company/profile", label: "Update Profile" },
    { to: "/company/settings", label: "Settings" },
  ];

  const dashboardStats = {
    activeJobs: 12,
    totalApplicants: 84,
    qualifiedApplicants: 23,
    interviewsScheduled: 8
  };

  const recentActivities = [
    { id: 1, action: "Job Posted", title: "Senior Frontend Developer", time: "2 hours ago", icon: "📝" },
    { id: 2, action: "New Applicant", title: "John Smith applied for React Developer", time: "5 hours ago", icon: "👤" },
    { id: 3, action: "Interview Scheduled", title: "Product Manager position", time: "1 day ago", icon: "📅" },
    { id: 4, action: "Profile Updated", title: "Company information updated", time: "2 days ago", icon: "🏢" }
  ];

  const DashboardCard = ({ title, description, icon, href, stat, statLabel, color }) => (
    <a
      href={href}
      style={{ textDecoration: "none", color: "inherit" }}
      onMouseEnter={() => setHoveredCard(title)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <div className="dashboard-card" style={{ borderLeft: `4px solid ${color}` }}>
        <div className="card-header">
          <div className="card-icon" style={{ backgroundColor: color + '20' }}>
            {icon}
          </div>
          <div className="card-stats">
            {stat && <span className="stat-number">{stat}</span>}
            {statLabel && <span className="stat-label">{statLabel}</span>}
          </div>
        </div>
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
        <div className="card-arrow">→</div>
      </div>
    </a>
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
      <div className="company-dashboard-container">
        <Sidebar links={sidebarLinks} />
        
        <main className="company-dashboard-main">
          {/* Header Section */}
          <div className="dashboard-header">
            <div className="header-content">
              <div className="header-text">
                <h1>Company Dashboard</h1>
                <p>Manage your recruitment process and find the perfect candidates</p>
              </div>
              <div className="header-stats">
                <div className="stat-card">
                  <div className="stat-icon">🚀</div>
                  <div className="stat-info">
                    <span className="stat-number">{dashboardStats.activeJobs}</span>
                    <span className="stat-label">Active Jobs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Overview */}
          <div className="stats-overview">
            <div className="stat-item applicants">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <span className="stat-value">{dashboardStats.totalApplicants}</span>
                <span className="stat-label">Total Applicants</span>
              </div>
            </div>
            <div className="stat-item qualified">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <span className="stat-value">{dashboardStats.qualifiedApplicants}</span>
                <span className="stat-label">Qualified</span>
              </div>
            </div>
            <div className="stat-item interviews">
              <div className="stat-icon">📅</div>
              <div className="stat-content">
                <span className="stat-value">{dashboardStats.interviewsScheduled}</span>
                <span className="stat-label">Interviews</span>
              </div>
            </div>
          </div>

          {/* Main Feature Cards */}
          <div className="dashboard-grid">
            <DashboardCard
              title="📝 Post Job"
              description="Create new job postings with qualifications, requirements, and applicant criteria."
              icon="📝"
              href="/company/post-job"
              stat={dashboardStats.activeJobs}
              statLabel="Active Jobs"
              color="#4f46e5"
            />

            <DashboardCard
              title="👥 Qualified Applicants"
              description="View automatically filtered applicants based on academic performance, certificates, and experience."
              icon="👥"
              href="/company/applicants"
              stat={dashboardStats.qualifiedApplicants}
              statLabel="Qualified"
              color="#10b981"
            />

            <DashboardCard
              title="🏢 Update Profile"
              description="Update company information, logo, contact details, and hiring preferences."
              icon="🏢"
              href="/company/profile"
              color="#f59e0b"
            />

            <DashboardCard
              title="⚙️ Settings"
              description="Manage login security, email verification and notification preferences."
              icon="⚙️"
              href="/company/settings"
              color="#ef4444"
            />
          </div>

          {/* Recent Activity & Quick Actions */}
          <div className="bottom-section">
            <div className="recent-activity">
              <h3 className="section-title">Recent Activity</h3>
              <div className="activity-list">
                {recentActivities.map(activity => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </div>

            <div className="quick-actions">
              <h3 className="section-title">Quick Actions</h3>
              <div className="action-buttons">
                <button className="action-btn primary">
                  <span className="btn-icon">🚀</span>
                  Post New Job
                </button>
                <button className="action-btn secondary">
                  <span className="btn-icon">📊</span>
                  View Analytics
                </button>
                <button className="action-btn secondary">
                  <span className="btn-icon">📧</span>
                  Message Candidates
                </button>
              </div>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="welcome-message">
            <div className="message-icon">🎯</div>
            <div className="message-content">
              <h4>Streamline Your Hiring Process</h4>
              <p>Use our AI-powered matching to find the most qualified candidates based on academic performance, certifications, and relevant experience.</p>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .company-dashboard-container {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .company-dashboard-main {
          flex: 1;
          padding: 30px;
          margin-left: 280px;
        }

        .dashboard-header {
          background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
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

        .stat-card {
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

        .stats-overview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 25px;
          background: white;
          border-radius: 15px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }

        .stat-item.applicants {
          border-left: 4px solid #4f46e5;
        }

        .stat-item.qualified {
          border-left: 4px solid #10b981;
        }

        .stat-item.interviews {
          border-left: 4px solid #f59e0b;
        }

        .stat-content {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 800;
          color: #1f2937;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #6b7280;
          font-weight: 500;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 25px;
          margin-bottom: 30px;
        }

        .dashboard-card {
          background: white;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .dashboard-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .card-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .card-stats {
          text-align: right;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 800;
          color: #1f2937;
          display: block;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.8rem;
          color: #6b7280;
          font-weight: 500;
        }

        .card-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 12px;
        }

        .card-description {
          color: #6b7280;
          line-height: 1.5;
          margin-bottom: 20px;
          font-size: 0.95rem;
        }

        .card-arrow {
          font-size: 1.5rem;
          font-weight: 700;
          color: #4f46e5;
          transition: transform 0.3s ease;
        }

        .dashboard-card:hover .card-arrow {
          transform: translateX(4px);
        }

        .bottom-section {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
          margin-bottom: 30px;
        }

        .recent-activity, .quick-actions {
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }

        .section-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 20px;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .activity-item {
          display: flex;
          gap: 15px;
          padding: 15px;
          border-radius: 12px;
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
          border-radius: 10px;
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

        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .action-btn {
          padding: 15px 20px;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
        }

        .action-btn.primary {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: white;
        }

        .action-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(79, 70, 229, 0.3);
        }

        .action-btn.secondary {
          background: #f8fafc;
          color: #374151;
          border: 2px solid #e5e7eb;
        }

        .action-btn.secondary:hover {
          border-color: #4f46e5;
          transform: translateY(-2px);
        }

        .btn-icon {
          font-size: 1.1rem;
        }

        .welcome-message {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          border-radius: 20px;
          padding: 40px;
          color: white;
          display: flex;
          align-items: center;
          gap: 25px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .message-icon {
          font-size: 3rem;
          flex-shrink: 0;
        }

        .message-content h4 {
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 8px;
          color: white;
        }

        .message-content p {
          font-size: 1rem;
          opacity: 0.9;
          line-height: 1.5;
          margin: 0;
        }

        @media (max-width: 1024px) {
          .company-dashboard-main {
            margin-left: 0;
            padding: 20px;
          }
          
          .header-content {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .bottom-section {
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
          
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
          
          .stats-overview {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .welcome-message {
            flex-direction: column;
            text-align: center;
            padding: 30px;
          }
        }

        @media (max-width: 480px) {
          .company-dashboard-main {
            padding: 15px;
          }
          
          .dashboard-header {
            padding: 20px;
          }
          
          .header-text h1 {
            font-size: 1.75rem;
          }
          
          .stats-overview {
            grid-template-columns: 1fr;
          }
          
          .recent-activity, .quick-actions {
            padding: 20px;
          }
        }
      `}</style>
    </>
  );
}