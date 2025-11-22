import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    courses: 0,
    applications: 0,
    institutions: 0,
    opportunities: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setStats({
        courses: 12,
        applications: 3,
        institutions: 8,
        opportunities: 15
      });
      setRecentActivity([
        { id: 1, type: 'application', message: 'Applied to Computer Science at NUL', time: '2 hours ago', status: 'pending' },
        { id: 2, type: 'profile', message: 'Profile completion: 85%', time: '1 day ago', status: 'completed' },
        { id: 3, type: 'recommendation', message: 'New career recommendation available', time: '2 days ago', status: 'new' },
        { id: 4, type: 'course', message: 'Web Development course starts next week', time: '3 days ago', status: 'upcoming' }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getRoleBasedContent = () => {
    const role = user?.role;
    const content = {
      student: {
        welcome: "Ready to shape your future?",
        description: "Discover courses, track applications, and find your perfect career path.",
        primaryAction: "/courses",
        primaryText: "Browse Courses"
      },
      institute: {
        welcome: "Manage your institution",
        description: "Handle applications, manage courses, and connect with students.",
        primaryAction: "/institute/applications",
        primaryText: "View Applications"
      },
      company: {
        welcome: "Find talented professionals",
        description: "Post jobs, browse candidates, and build your dream team.",
        primaryAction: "/company/jobs",
        primaryText: "Post Job"
      },
      admin: {
        welcome: "Platform Administration",
        description: "Manage users, monitor activity, and maintain system integrity.",
        primaryAction: "/admin/users",
        primaryText: "Manage Users"
      }
    };
    return content[role] || content.student;
  };

  const roleContent = getRoleBasedContent();

  const StatCard = ({ icon, value, label, trend, color }) => (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: color }}>
        {icon}
      </div>
      <div className="stat-content">
        <div className="stat-value">{loading ? '...' : value}</div>
        <div className="stat-label">{label}</div>
        {trend && <div className="stat-trend">{trend}</div>}
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => (
    <div className={`activity-item ${activity.status}`}>
      <div className="activity-icon">
        {activity.type === 'application' && '📝'}
        {activity.type === 'profile' && '👤'}
        {activity.type === 'recommendation' && '🎯'}
        {activity.type === 'course' && '📚'}
      </div>
      <div className="activity-content">
        <p className="activity-message">{activity.message}</p>
        <span className="activity-time">{activity.time}</span>
      </div>
      <div className={`activity-status ${activity.status}`}>
        {activity.status === 'pending' && '⏳'}
        {activity.status === 'completed' && '✅'}
        {activity.status === 'new' && '🆕'}
        {activity.status === 'upcoming' && '📅'}
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1 className="welcome-title">
              Welcome back, <span className="user-name">{user?.name}</span>! 👋
            </h1>
            <p className="welcome-subtitle">
              {roleContent.welcome}
            </p>
            <p className="welcome-description">
              {roleContent.description}
            </p>
            <div className="header-actions">
              <Link to={roleContent.primaryAction} className="btn btn-primary">
                {roleContent.primaryText}
              </Link>
              <button className="btn btn-secondary">
                Take Quick Tour
              </button>
            </div>
          </div>
          <div className="user-profile">
            <div className="profile-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
              <div className="profile-name">{user?.name}</div>
              <div className="profile-role">
                <span className="role-badge">{user?.role}</span>
              </div>
              <div className="profile-stats">
                <span>Member since 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard 
          icon="📚" 
          value={stats.courses} 
          label="Available Courses" 
          trend="+2 this week"
          color="linear-gradient(135deg, #667eea, #764ba2)"
        />
        <StatCard 
          icon="📝" 
          value={stats.applications} 
          label="My Applications" 
          trend="1 pending"
          color="linear-gradient(135deg, #f093fb, #f5576c)"
        />
        <StatCard 
          icon="🏫" 
          value={stats.institutions} 
          label="Partner Institutions" 
          trend="+1 new"
          color="linear-gradient(135deg, #4facfe, #00f2fe)"
        />
        <StatCard 
          icon="💼" 
          value={stats.opportunities} 
          label="Career Opportunities" 
          trend="5 matches"
          color="linear-gradient(135deg, #43e97b, #38f9d7)"
        />
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-content">
        {/* Quick Actions */}
        <div className="content-section">
          <div className="section-header">
            <h2>Quick Actions</h2>
            <p>Frequently used features</p>
          </div>
          <div className="quick-actions-grid">
            <Link to="/courses" className="action-card">
              <div className="action-icon">🔍</div>
              <h3>Browse Courses</h3>
              <p>Discover programs that match your interests</p>
              <div className="action-arrow">→</div>
            </Link>
            
            <Link to="/career-assessment" className="action-card">
              <div className="action-icon">🎯</div>
              <h3>Career Assessment</h3>
              <p>Find your perfect career path</p>
              <div className="action-arrow">→</div>
            </Link>
            
            <Link to="/institutions" className="action-card">
              <div className="action-icon">🏫</div>
              <h3>Institutions</h3>
              <p>Explore educational partners</p>
              <div className="action-arrow">→</div>
            </Link>
            
            <Link to="/profile" className="action-card">
              <div className="action-icon">👤</div>
              <h3>My Profile</h3>
              <p>Update your information</p>
              <div className="action-arrow">→</div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="content-section">
          <div className="section-header">
            <h2>Recent Activity</h2>
            <p>Your latest updates and actions</p>
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
            <div className="deadline-item">
              <div className="deadline-date">
                <span className="date-day">15</span>
                <span className="date-month">DEC</span>
              </div>
              <div className="deadline-content">
                <h4>NUL Applications Close</h4>
                <p>Computer Science Program</p>
              </div>
              <div className="deadline-badge urgent">Urgent</div>
            </div>
            <div className="deadline-item">
              <div className="deadline-date">
                <span className="date-day">20</span>
                <span className="date-month">DEC</span>
              </div>
              <div className="deadline-content">
                <h4>LIM Scholarship Deadline</h4>
                <p>Business Administration</p>
              </div>
              <div className="deadline-badge upcoming">Upcoming</div>
            </div>
          </div>
        </div>

        {/* Career Recommendations */}
        <div className="content-section">
          <div className="section-header">
            <h2>Career Recommendations</h2>
            <p>Based on your profile and interests</p>
          </div>
          <div className="recommendations-grid">
            <div className="recommendation-card">
              <div className="rec-icon">💻</div>
              <h4>Software Developer</h4>
              <p>95% match with your skills</p>
              <div className="rec-meta">
                <span>High Demand</span>
                <span>₦ 45,000 avg.</span>
              </div>
            </div>
            <div className="recommendation-card">
              <div className="rec-icon">📊</div>
              <h4>Data Analyst</h4>
              <p>88% match with your skills</p>
              <div className="rec-meta">
                <span>Growing Field</span>
                <span>₦ 38,000 avg.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 20px;
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
        }

        .user-name {
          background: linear-gradient(135deg, #ffd89b, #19547b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .welcome-subtitle {
          font-size: 1.25rem;
          margin-bottom: 10px;
          opacity: 0.9;
        }

        .welcome-description {
          font-size: 1rem;
          margin-bottom: 25px;
          opacity: 0.8;
          max-width: 500px;
        }

        .header-actions {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        .btn {
          padding: 12px 24px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-primary {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .btn-primary:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .btn-secondary {
          background: transparent;
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .user-profile {
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

        .profile-stats {
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

        .stat-card {
          background: white;
          padding: 25px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          gap: 20px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 800;
          color: #1f2937;
        }

        .stat-label {
          color: #6b7280;
          font-weight: 600;
          margin-bottom: 5px;
        }

        .stat-trend {
          font-size: 0.8rem;
          color: #10b981;
          font-weight: 600;
        }

        .dashboard-content {
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

        .quick-actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .action-card {
          background: #f8fafc;
          padding: 20px;
          border-radius: 12px;
          text-decoration: none;
          color: inherit;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          position: relative;
        }

        .action-card:hover {
          background: white;
          border-color: #667eea;
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .action-icon {
          font-size: 2rem;
          margin-bottom: 10px;
        }

        .action-card h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 8px;
          color: #1f2937;
        }

        .action-card p {
          font-size: 0.85rem;
          color: #6b7280;
          margin-bottom: 15px;
        }

        .action-arrow {
          position: absolute;
          top: 20px;
          right: 20px;
          font-size: 1.2rem;
          color: #667eea;
          transition: transform 0.3s ease;
        }

        .action-card:hover .action-arrow {
          transform: translateX(3px);
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
        }

        .deadline-date {
          text-align: center;
          background: #667eea;
          color: white;
          padding: 10px;
          border-radius: 8px;
          min-width: 50px;
        }

        .date-day {
          display: block;
          font-size: 1.2rem;
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
          padding: 4px 8px;
          border-radius: 12px;
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

        .recommendations-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .recommendation-card {
          background: #f8fafc;
          padding: 20px;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .recommendation-card:hover {
          background: white;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .rec-icon {
          font-size: 2rem;
          margin-bottom: 10px;
        }

        .recommendation-card h4 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 8px;
          color: #1f2937;
        }

        .recommendation-card p {
          font-size: 0.8rem;
          color: #6b7280;
          margin-bottom: 10px;
        }

        .rec-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.7rem;
          color: #6b7280;
        }

        @media (max-width: 1024px) {
          .dashboard-content {
            grid-template-columns: 1fr;
          }
          
          .header-content {
            grid-template-columns: 1fr;
            text-align: center;
          }
          
          .user-profile {
            justify-content: center;
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
          
          .quick-actions-grid {
            grid-template-columns: 1fr;
          }
          
          .recommendations-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .header-actions {
            flex-direction: column;
          }
          
          .btn {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;