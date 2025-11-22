import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import { useAppData } from "../../context/ApplicationContext";
import { useAuth } from "../../context/AuthContext";

export default function AdmissionsResults() {
  const { applications } = useAppData();
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState("all");

  const studentApps = applications.filter(a => a.studentId === user.id.toString());

  const filteredApplications = filterStatus === "all" 
    ? studentApps 
    : studentApps.filter(app => app.status === filterStatus);

  const getStatusIcon = (status) => {
    const icons = {
      "pending": "⏳",
      "admitted": "✅",
      "rejected": "❌",
      "under_review": "🔍"
    };
    return icons[status] || "📄";
  };

  const getStatusColor = (status) => {
    const colors = {
      "pending": "#f59e0b",
      "admitted": "#10b981",
      "rejected": "#ef4444",
      "under_review": "#3b82f6"
    };
    return colors[status] || "#6b7280";
  };

  const getStatusText = (status) => {
    const texts = {
      "pending": "Under Review",
      "admitted": "Admitted",
      "rejected": "Not Admitted",
      "under_review": "In Review"
    };
    return texts[status] || status;
  };

  const ApplicationCard = ({ application }) => (
    <div className="application-card">
      <div className="card-header">
        <div className="app-info">
          <div className="app-icon">{getStatusIcon(application.status)}</div>
          <div className="app-details">
            <h3 className="course-title">{application.courseTitle}</h3>
            <p className="institution-name">{application.institutionName}</p>
            <div className="app-meta">
              <span className="meta-item">
                <span className="meta-icon">🎓</span>
                {application.facultyName}
              </span>
              <span className="meta-item">
                <span className="meta-icon">📅</span>
                Applied {new Date(application.appliedDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <div className="status-section">
          <div 
            className="status-badge"
            style={{ backgroundColor: getStatusColor(application.status) }}
          >
            {getStatusText(application.status)}
          </div>
          {application.status === "admitted" && (
            <button className="accept-btn">
              Accept Offer
            </button>
          )}
        </div>
      </div>

      {application.status === "admitted" && (
        <div className="admission-details">
          <div className="success-message">
            <div className="message-icon">🎉</div>
            <div className="message-content">
              <h4>Congratulations! You've been admitted</h4>
              <p>Next steps: Accept the offer and complete your enrollment process</p>
            </div>
          </div>
          <div className="action-buttons">
            <button className="btn-primary">Accept Admission</button>
            <button className="btn-secondary">View Details</button>
          </div>
        </div>
      )}

      {application.status === "rejected" && (
        <div className="rejection-details">
          <div className="message-icon">💡</div>
          <div className="message-content">
            <h4>Application Not Successful</h4>
            <p>Don't be discouraged! Consider applying to other programs or improving your application for next time.</p>
          </div>
        </div>
      )}

      {application.status === "pending" && (
        <div className="pending-details">
          <div className="progress-indicator">
            <div className="progress-steps">
              <div className="step completed">
                <div className="step-dot"></div>
                <span className="step-label">Applied</span>
              </div>
              <div className="step-connector"></div>
              <div className="step active">
                <div className="step-dot"></div>
                <span className="step-label">Under Review</span>
              </div>
              <div className="step-connector"></div>
              <div className="step">
                <div className="step-dot"></div>
                <span className="step-label">Decision</span>
              </div>
            </div>
          </div>
          <p className="processing-text">Your application is being reviewed by the admissions committee</p>
        </div>
      )}
    </div>
  );

  const stats = {
    total: studentApps.length,
    admitted: studentApps.filter(app => app.status === "admitted").length,
    pending: studentApps.filter(app => app.status === "pending" || app.status === "under_review").length,
    rejected: studentApps.filter(app => app.status === "rejected").length
  };

  return (
    <>
      <Navbar />
      <div className="admissions-container">
        <main className="admissions-main">
          {/* Header Section */}
          <div className="admissions-header">
            <div className="header-content">
              <div className="header-text">
                <h1>Admissions Results</h1>
                <p>Track your application status and admission decisions</p>
              </div>
              <div className="header-stats">
                <div className="stat-card">
                  <div className="stat-icon">📋</div>
                  <div className="stat-info">
                    <span className="stat-number">{stats.total}</span>
                    <span className="stat-label">Total Applications</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Overview */}
          <div className="stats-overview">
            <div className="stat-item admitted">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <span className="stat-value">{stats.admitted}</span>
                <span className="stat-label">Admitted</span>
              </div>
            </div>
            <div className="stat-item pending">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <span className="stat-value">{stats.pending}</span>
                <span className="stat-label">Under Review</span>
              </div>
            </div>
            <div className="stat-item rejected">
              <div className="stat-icon">❌</div>
              <div className="stat-content">
                <span className="stat-value">{stats.rejected}</span>
                <span className="stat-label">Not Admitted</span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="filters-section">
            <div className="filter-group">
              <label className="filter-label">Filter by Status:</label>
              <div className="filter-buttons">
                <button 
                  className={`filter-btn ${filterStatus === "all" ? "active" : ""}`}
                  onClick={() => setFilterStatus("all")}
                >
                  🌐 All Applications
                </button>
                <button 
                  className={`filter-btn ${filterStatus === "admitted" ? "active" : ""}`}
                  onClick={() => setFilterStatus("admitted")}
                >
                  ✅ Admitted
                </button>
                <button 
                  className={`filter-btn ${filterStatus === "pending" ? "active" : ""}`}
                  onClick={() => setFilterStatus("pending")}
                >
                  ⏳ Under Review
                </button>
                <button 
                  className={`filter-btn ${filterStatus === "rejected" ? "active" : ""}`}
                  onClick={() => setFilterStatus("rejected")}
                >
                  ❌ Not Admitted
                </button>
              </div>
            </div>
          </div>

          {/* Applications List */}
          <div className="applications-section">
            <div className="section-header">
              <h2>
                {filterStatus === "all" ? "All Applications" : 
                 filterStatus === "admitted" ? "Admission Offers" :
                 filterStatus === "pending" ? "Applications Under Review" : "Application Decisions"}
                <span className="results-count"> ({filteredApplications.length})</span>
              </h2>
            </div>

            {filteredApplications.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  {filterStatus === "all" ? "📚" :
                   filterStatus === "admitted" ? "🎓" :
                   filterStatus === "pending" ? "⏳" : "📝"}
                </div>
                <h3>
                  {filterStatus === "all" ? "No Applications Yet" :
                   filterStatus === "admitted" ? "No Admission Offers" :
                   filterStatus === "pending" ? "No Pending Applications" : "No Application Decisions"}
                </h3>
                <p>
                  {filterStatus === "all" ? 
                   "You haven't applied to any courses yet. Start your academic journey by applying to available programs." :
                   filterStatus === "admitted" ?
                   "You don't have any admission offers at the moment. Keep checking back for updates." :
                   filterStatus === "pending" ?
                   "All your applications have been processed. Check other status filters for results." :
                   "No applications have been rejected. That's great news!"}
                </p>
                {filterStatus === "all" && (
                  <button className="btn-primary">
                    🚀 Browse Courses
                  </button>
                )}
              </div>
            ) : (
              <div className="applications-grid">
                {filteredApplications.map(application => (
                  <ApplicationCard key={application.id} application={application} />
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h3>Next Steps</h3>
            <div className="actions-grid">
              <div className="action-card">
                <div className="action-icon">📝</div>
                <h4>Apply to More Courses</h4>
                <p>Explore additional programs that match your interests</p>
                <button className="action-btn">Browse Courses</button>
              </div>
              <div className="action-card">
                <div className="action-icon">📊</div>
                <h4>Track All Applications</h4>
                <p>Monitor the status of all your submitted applications</p>
                <button className="action-btn">View Dashboard</button>
              </div>
              <div className="action-card">
                <div className="action-icon">💼</div>
                <h4>Explore Career Options</h4>
                <p>Discover job opportunities related to your field of study</p>
                <button className="action-btn">Find Jobs</button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .admissions-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .admissions-main {
          padding: 40px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .admissions-header {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 40px;
          margin-bottom: 30px;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
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
          margin-bottom: 12px;
          background: linear-gradient(135deg, #fff, #e2e8f0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header-text p {
          font-size: 1.1rem;
          opacity: 0.9;
          line-height: 1.6;
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

        .stat-item.admitted {
          border-left: 4px solid #10b981;
        }

        .stat-item.pending {
          border-left: 4px solid #f59e0b;
        }

        .stat-item.rejected {
          border-left: 4px solid #ef4444;
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

        .filters-section {
          background: white;
          border-radius: 15px;
          padding: 25px;
          margin-bottom: 30px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }

        .filter-label {
          display: block;
          font-weight: 600;
          color: #374151;
          margin-bottom: 12px;
          font-size: 1rem;
        }

        .filter-buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 10px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 25px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .filter-btn:hover {
          border-color: #667eea;
          transform: translateY(-2px);
        }

        .filter-btn.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .applications-section {
          background: white;
          border-radius: 20px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .section-header {
          margin-bottom: 25px;
        }

        .section-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
        }

        .results-count {
          color: #667eea;
          font-weight: 600;
        }

        .applications-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .application-card {
          border: 2px solid #f1f5f9;
          border-radius: 15px;
          padding: 25px;
          transition: all 0.3s ease;
          background: white;
        }

        .application-card:hover {
          border-color: #667eea;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }

        .app-info {
          display: flex;
          gap: 15px;
          align-items: flex-start;
        }

        .app-icon {
          font-size: 2rem;
          flex-shrink: 0;
        }

        .app-details {
          flex: 1;
        }

        .course-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 5px;
        }

        .institution-name {
          font-size: 1.1rem;
          color: #667eea;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .app-meta {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.85rem;
          color: #6b7280;
        }

        .meta-icon {
          font-size: 0.9rem;
        }

        .status-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: flex-end;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          color: white;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .accept-btn {
          background: #10b981;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .accept-btn:hover {
          background: #059669;
          transform: translateY(-1px);
        }

        .admission-details, .rejection-details, .pending-details {
          border-top: 1px solid #e5e7eb;
          padding-top: 20px;
          margin-top: 15px;
        }

        .success-message, .rejection-details {
          display: flex;
          gap: 15px;
          align-items: flex-start;
          margin-bottom: 15px;
        }

        .message-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .message-content h4 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 5px;
        }

        .message-content p {
          color: #6b7280;
          font-size: 0.9rem;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
        }

        .btn-primary, .btn-secondary {
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          font-size: 0.9rem;
        }

        .btn-primary {
          background: #10b981;
          color: white;
        }

        .btn-primary:hover {
          background: #059669;
          transform: translateY(-1px);
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
        }

        .progress-indicator {
          margin-bottom: 15px;
        }

        .progress-steps {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 400px;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          flex: 1;
        }

        .step-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #e5e7eb;
          transition: all 0.3s ease;
        }

        .step.completed .step-dot {
          background: #10b981;
        }

        .step.active .step-dot {
          background: #3b82f6;
          transform: scale(1.2);
        }

        .step-label {
          font-size: 0.7rem;
          color: #6b7280;
          text-align: center;
        }

        .step.completed .step-label,
        .step.active .step-label {
          color: #374151;
          font-weight: 500;
        }

        .step-connector {
          flex: 1;
          height: 2px;
          background: #e5e7eb;
          margin: 0 5px;
        }

        .processing-text {
          color: #6b7280;
          font-size: 0.9rem;
          text-align: center;
        }

        .empty-state {
          text-align: center;
          padding: 60px 30px;
          color: #6b7280;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .empty-state h3 {
          font-size: 1.3rem;
          margin-bottom: 8px;
          color: #374151;
        }

        .empty-state p {
          margin-bottom: 20px;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }

        .quick-actions {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 40px;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .quick-actions h3 {
          text-align: center;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 30px;
          color: white;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .action-card {
          background: rgba(255, 255, 255, 0.1);
          padding: 25px;
          border-radius: 15px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }

        .action-card:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-5px);
        }

        .action-icon {
          font-size: 2.5rem;
          margin-bottom: 15px;
        }

        .action-card h4 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 8px;
          color: white;
        }

        .action-card p {
          font-size: 0.9rem;
          opacity: 0.8;
          line-height: 1.5;
          margin-bottom: 15px;
        }

        .action-btn {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .action-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        @media (max-width: 768px) {
          .admissions-main {
            padding: 20px;
          }
          
          .admissions-header {
            padding: 30px 25px;
          }
          
          .header-content {
            grid-template-columns: 1fr;
            gap: 20px;
            text-align: center;
          }
          
          .header-text h1 {
            font-size: 2rem;
          }
          
          .card-header {
            flex-direction: column;
            gap: 15px;
          }
          
          .status-section {
            align-items: flex-start;
          }
          
          .app-info {
            flex-direction: column;
            text-align: center;
          }
          
          .filter-buttons {
            justify-content: center;
          }
          
          .action-buttons {
            flex-direction: column;
          }
        }

        @media (max-width: 480px) {
          .admissions-main {
            padding: 15px;
          }
          
          .admissions-header {
            padding: 25px 20px;
          }
          
          .header-text h1 {
            font-size: 1.75rem;
          }
          
          .applications-section {
            padding: 20px;
          }
        }
      `}</style>
    </>
  );
}