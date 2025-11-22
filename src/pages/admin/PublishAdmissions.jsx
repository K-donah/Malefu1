import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useAppData } from "../../context/ApplicationContext";
import { useAuth } from "../../context/AuthContext";

export default function PublishAdmissions() {
  const { applications, admitApplication, courses, faculties, institutions } = useAppData();
  const { user } = useAuth();

  const [filterStatus, setFilterStatus] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [admittingApp, setAdmittingApp] = useState(null);

  const adminLinks = [
    { to: "/admin/institutions", label: "Manage Institutions" },
    { to: "/admin/faculties", label: "Manage Faculties" },
    { to: "/admin/courses", label: "Manage Courses" },
    { to: "/admin/companies", label: "Manage Companies" },
    { to: "/admin/reports", label: "Reports & Analytics" },
    { to: "/admin/admissions", label: "Publish Admissions" },
    { to: "/admin/users", label: "Monitor Users" },
  ];

  const handleAdmitStudent = async (applicationId) => {
    setAdmittingApp(applicationId);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      await admitApplication(applicationId);
    } catch (error) {
      alert("Failed to admit student");
    } finally {
      setAdmittingApp(null);
    }
  };

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
      "pending": "Pending Review",
      "admitted": "Admitted",
      "rejected": "Not Admitted",
      "under_review": "Under Review"
    };
    return texts[status] || status;
  };

  const filteredApplications = applications.filter(app => {
    const matchesStatus = filterStatus === "all" || app.status === filterStatus;
    const matchesSearch = app.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.courseTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.institutionName?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.appliedDate || 0) - new Date(a.appliedDate || 0);
      case "oldest":
        return new Date(a.appliedDate || 0) - new Date(b.appliedDate || 0);
      case "name":
        return (a.studentName || "").localeCompare(b.studentName || "");
      case "institution":
        return (a.institutionName || "").localeCompare(b.institutionName || "");
      default:
        return 0;
    }
  });

  const ApplicationCard = ({ application }) => {
    const course = courses.find(c => c.id === application.courseId);
    const faculty = faculties.find(f => f.id === application.facultyId);
    const institution = institutions.find(i => i.id === application.institutionId);

    return (
      <div className="application-card">
        <div className="card-header">
          <div className="student-info">
            <div className="student-avatar">
              {application.studentName?.charAt(0).toUpperCase() || "S"}
            </div>
            <div className="student-details">
              <h3 className="student-name">{application.studentName || `Student ${application.studentId}`}</h3>
              <p className="student-id">ID: {application.studentId}</p>
              <div className="application-meta">
                <span className="meta-item">
                  <span className="meta-icon">📅</span>
                  Applied {application.appliedDate ? new Date(application.appliedDate).toLocaleDateString() : "Unknown date"}
                </span>
                <span className="meta-item">
                  <span className="meta-icon">🎯</span>
                  Admission Decision Pending
                </span>
              </div>
            </div>
          </div>
          <div className="status-section">
            <div 
              className="status-badge"
              style={{ backgroundColor: getStatusColor(application.status) }}
            >
              <span className="status-icon">{getStatusIcon(application.status)}</span>
              {getStatusText(application.status)}
            </div>
          </div>
        </div>

        <div className="course-info">
          <div className="info-item">
            <span className="info-label">🎓 Course:</span>
            <span className="info-value">{course?.title || application.courseTitle || "N/A"}</span>
          </div>
          <div className="info-item">
            <span className="info-label">🏛️ Faculty:</span>
            <span className="info-value">{faculty?.name || application.facultyName || "N/A"}</span>
          </div>
          <div className="info-item">
            <span className="info-label">🏫 Institution:</span>
            <span className="info-value">{institution?.name || application.institutionName || "N/A"}</span>
          </div>
        </div>

        <div className="action-section">
          <div className="admission-actions">
            <h4>Admission Decision:</h4>
            <div className="action-buttons">
              <button
                onClick={() => handleAdmitStudent(application.id)}
                disabled={admittingApp === application.id || application.status === "admitted"}
                className="admit-btn"
                style={{ 
                  backgroundColor: application.status === "admitted" ? '#10b981' : '#059669',
                  borderColor: application.status === "admitted" ? '#10b981' : '#059669'
                }}
              >
                {admittingApp === application.id ? (
                  <div className="mini-spinner"></div>
                ) : (
                  <>
                    <span className="btn-icon">
                      {application.status === "admitted" ? "✅" : "🎓"}
                    </span>
                    {application.status === "admitted" ? "Admitted" : "Admit Student"}
                  </>
                )}
              </button>
              
              {application.status === "admitted" && (
                <button className="generate-letter-btn">
                  <span className="btn-icon">📄</span>
                  Generate Offer Letter
                </button>
              )}
            </div>
          </div>
        </div>

        {application.applicationText && (
          <div className="motivation-section">
            <details>
              <summary className="motivation-toggle">
                <span className="toggle-icon">📄</span>
                View Application Details
              </summary>
              <div className="motivation-content">
                <h5>Motivation Letter:</h5>
                <p>{application.applicationText}</p>
                
                <div className="additional-info">
                  <div className="info-row">
                    <span className="info-label">Application Date:</span>
                    <span className="info-value">{application.appliedDate ? new Date(application.appliedDate).toLocaleDateString() : "Unknown"}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Application ID:</span>
                    <span className="info-value">{application.id}</span>
                  </div>
                </div>
              </div>
            </details>
          </div>
        )}
      </div>
    );
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === "pending").length,
    admitted: applications.filter(app => app.status === "admitted").length,
    rejected: applications.filter(app => app.status === "rejected").length,
    underReview: applications.filter(app => app.status === "under_review").length
  };

  const admissionRate = applications.length > 0 ? Math.round((stats.admitted / applications.length) * 100) : 0;

  return (
    <>
      <Navbar />
      <div className="publish-admissions-container">
        <Sidebar links={adminLinks} />
        
        <main className="publish-admissions-main">
          {/* Header Section */}
          <div className="admissions-header">
            <div className="header-content">
              <div className="header-text">
                <h1>Publish Admissions</h1>
                <p>Review and publish admission decisions for qualified students</p>
              </div>
              <div className="header-stats">
                <div className="stat-card">
                  <div className="stat-icon">🎓</div>
                  <div className="stat-info">
                    <span className="stat-number">{stats.admitted}</span>
                    <span className="stat-label">Students Admitted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Overview */}
          <div className="stats-overview">
            <div className="stat-item pending">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <span className="stat-value">{stats.pending}</span>
                <span className="stat-label">Pending Review</span>
              </div>
            </div>
            <div className="stat-item admitted">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <span className="stat-value">{stats.admitted}</span>
                <span className="stat-label">Admission Offers</span>
              </div>
            </div>
            <div className="stat-item under-review">
              <div className="stat-icon">🔍</div>
              <div className="stat-content">
                <span className="stat-value">{stats.underReview}</span>
                <span className="stat-label">Under Review</span>
              </div>
            </div>
            <div className="stat-item rate">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <span className="stat-value">{admissionRate}%</span>
                <span className="stat-label">Admission Rate</span>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="filters-section">
            <div className="search-box">
              <div className="search-icon">🔍</div>
              <input
                type="text"
                placeholder="Search by student name, course, or institution..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-row">
              <div className="filter-item">
                <label className="filter-label">Filter by Status:</label>
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Applications</option>
                  <option value="pending">⏳ Pending Review</option>
                  <option value="under_review">🔍 Under Review</option>
                  <option value="admitted">✅ Admitted</option>
                  <option value="rejected">❌ Rejected</option>
                </select>
              </div>

              <div className="filter-item">
                <label className="filter-label">Sort by:</label>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Student Name A-Z</option>
                  <option value="institution">Institution</option>
                </select>
              </div>
            </div>
          </div>

          {/* Applications List */}
          <div className="applications-section">
            <div className="section-header">
              <h2>
                {filterStatus === "all" ? "All Student Applications" : 
                 filterStatus === "admitted" ? "Admitted Students" :
                 filterStatus === "pending" ? "Pending Admission Decisions" : 
                 filterStatus === "under_review" ? "Applications Under Review" : "Rejected Applications"}
                <span className="results-count"> ({filteredApplications.length})</span>
              </h2>
              
              {stats.pending > 0 && filterStatus === "all" && (
                <div className="pending-alert">
                  <span className="alert-icon">📢</span>
                  You have {stats.pending} applications awaiting admission decisions
                </div>
              )}
            </div>

            {filteredApplications.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  {filterStatus === "all" ? "📚" :
                   filterStatus === "admitted" ? "✅" :
                   filterStatus === "pending" ? "⏳" :
                   filterStatus === "under_review" ? "🔍" : "❌"}
                </div>
                <h3>
                  {filterStatus === "all" ? "No Applications Found" :
                   filterStatus === "admitted" ? "No Admitted Students" :
                   filterStatus === "pending" ? "No Pending Decisions" : 
                   filterStatus === "under_review" ? "No Applications Under Review" : "No Rejected Applications"}
                </h3>
                <p>
                  {searchTerm 
                    ? `No applications found matching "${searchTerm}". Try adjusting your search.`
                    : filterStatus === "all" 
                    ? "There are no student applications to review yet."
                    : `No applications with ${filterStatus} status.`
                  }
                </p>
                {(searchTerm || filterStatus !== "all") && (
                  <button 
                    className="btn-secondary"
                    onClick={() => {
                      setSearchTerm("");
                      setFilterStatus("all");
                    }}
                  >
                    Clear Filters
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
            <h3>🚀 Admission Tools</h3>
            <div className="insights-grid">
              <div className="insight-card">
                <div className="insight-icon">⚡</div>
                <div className="insight-content">
                  <h4>Quick Admission</h4>
                  <p>Admit qualified students with one click</p>
                </div>
              </div>
              <div className="insight-card">
                <div className="insight-icon">📊</div>
                <div className="insight-content">
                  <h4>Admission Analytics</h4>
                  <p>{admissionRate}% admission rate across {stats.total} applications</p>
                </div>
              </div>
              <div className="insight-card">
                <div className="insight-icon">📨</div>
                <div className="insight-content">
                  <h4>Notify Students</h4>
                  <p>Send admission offers automatically</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .publish-admissions-container {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
        }

        .publish-admissions-main {
          flex: 1;
          padding: 30px;
          margin-left: 280px;
        }

        .admissions-header {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
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
          background: linear-gradient(135deg, #fff, #e0f2fe);
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

        .stat-item.pending {
          border-left: 4px solid #f59e0b;
        }

        .stat-item.admitted {
          border-left: 4px solid #10b981;
        }

        .stat-item.under-review {
          border-left: 4px solid #3b82f6;
        }

        .stat-item.rate {
          border-left: 4px solid #8b5cf6;
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

        .search-box {
          position: relative;
          margin-bottom: 20px;
        }

        .search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.2rem;
          color: #6b7280;
        }

        .search-input {
          width: 100%;
          padding: 15px 15px 15px 45px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #059669;
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
        }

        .filter-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .filter-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .filter-label {
          font-weight: 600;
          color: #374151;
          font-size: 0.9rem;
        }

        .filter-select {
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          background: white;
        }

        .filter-select:focus {
          outline: none;
          border-color: #059669;
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
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .section-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
        }

        .results-count {
          color: #059669;
          font-weight: 600;
        }

        .pending-alert {
          background: #fef3c7;
          color: #92400e;
          padding: 12px 20px;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .alert-icon {
          font-size: 1.1rem;
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
          border-color: #059669;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .student-info {
          display: flex;
          gap: 15px;
          align-items: flex-start;
        }

        .student-avatar {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #059669, #047857);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: white;
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .student-details {
          flex: 1;
        }

        .student-name {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 5px;
        }

        .student-id {
          color: #6b7280;
          font-size: 0.9rem;
          margin-bottom: 10px;
        }

        .application-meta {
          display: flex;
          flex-direction: column;
          gap: 5px;
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
          padding: 8px 16px;
          border-radius: 20px;
          color: white;
          font-size: 0.9rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .status-icon {
          font-size: 1rem;
        }

        .course-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
          padding: 15px;
          background: #f8fafc;
          border-radius: 10px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .info-label {
          font-weight: 600;
          color: #374151;
          font-size: 0.9rem;
        }

        .info-value {
          color: #6b7280;
          font-size: 0.9rem;
        }

        .action-section {
          border-top: 1px solid #e5e7eb;
          padding-top: 20px;
        }

        .admission-actions h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 12px;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .admit-btn {
          padding: 10px 20px;
          border: 2px solid;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.9rem;
          color: white;
        }

        .generate-letter-btn {
          padding: 10px 20px;
          border: 2px solid #6b7280;
          border-radius: 8px;
          background: white;
          color: #6b7280;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.9rem;
        }

        .generate-letter-btn:hover {
          border-color: #059669;
          color: #059669;
          transform: translateY(-1px);
        }

        .admit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .admit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .mini-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .btn-icon {
          font-size: 1rem;
        }

        .motivation-section {
          margin-top: 15px;
        }

        .motivation-toggle {
          background: none;
          border: none;
          cursor: pointer;
          color: #059669;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 0;
        }

        .toggle-icon {
          font-size: 1rem;
        }

        .motivation-content {
          background: #f8fafc;
          border-radius: 8px;
          padding: 20px;
          margin-top: 10px;
          border-left: 3px solid #059669;
        }

        .motivation-content h5 {
          color: #374151;
          margin-bottom: 10px;
          font-size: 1rem;
        }

        .motivation-content p {
          color: #6b7280;
          line-height: 1.5;
          font-size: 0.9rem;
          margin-bottom: 15px;
        }

        .additional-info {
          border-top: 1px solid #e5e7eb;
          padding-top: 15px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        }

        .info-row .info-label {
          font-weight: 600;
          color: #374151;
        }

        .info-row .info-value {
          color: #6b7280;
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

        .btn-secondary {
          background: #059669;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background: #047857;
          transform: translateY(-2px);
        }

        .quick-actions {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          border-radius: 20px;
          padding: 40px;
          color: white;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .quick-actions h3 {
          text-align: center;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 30px;
          color: white;
        }

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .insight-card {
          background: rgba(255, 255, 255, 0.1);
          padding: 25px;
          border-radius: 15px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }

        .insight-card:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-5px);
        }

        .insight-icon {
          font-size: 2.5rem;
          margin-bottom: 15px;
        }

        .insight-card h4 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 8px;
          color: white;
        }

        .insight-card p {
          font-size: 0.9rem;
          opacity: 0.8;
          line-height: 1.5;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 1024px) {
          .publish-admissions-main {
            margin-left: 0;
            padding: 20px;
          }
          
          .header-content {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }

        @media (max-width: 768px) {
          .admissions-header {
            padding: 25px;
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
          
          .course-info {
            grid-template-columns: 1fr;
          }
          
          .action-buttons {
            justify-content: center;
          }
          
          .filter-row {
            grid-template-columns: 1fr;
          }
          
          .section-header {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }
        }

        @media (max-width: 480px) {
          .publish-admissions-main {
            padding: 15px;
          }
          
          .admissions-header {
            padding: 20px;
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