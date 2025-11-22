import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useAppData } from "../../context/ApplicationContext";
import { useAuth } from "../../context/AuthContext";

export default function ViewApplicants() {
  const { applications, jobs, updateApplication } = useAppData();
  const { user } = useAuth();

  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const links = [
    { to: "/company/post-job", label: "Post Job" },
    { to: "/company/applicants", label: "View Applicants" },
    { to: "/company/profile", label: "Update Profile" },
    { to: "/company/settings", label: "Settings" },
  ];

  // Filter applications for company's jobs
  const companyJobs = jobs.filter(job => job.companyId === user.id);
  const applicantList = applications.filter(app => 
    companyJobs.some(job => job.id === app.jobId)
  );

  // Enhanced filtering and sorting
  const filteredApplicants = applicantList.filter(applicant => {
    const matchesStatus = filterStatus === "all" || applicant.status === filterStatus;
    const matchesJob = selectedJob === "all" || applicant.jobId === selectedJob;
    const matchesSearch = applicant.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         applicant.courseTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         applicant.institutionName?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesJob && matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.appliedDate) - new Date(a.appliedDate);
      case "oldest":
        return new Date(a.appliedDate) - new Date(b.appliedDate);
      case "name":
        return a.studentName?.localeCompare(b.studentName);
      default:
        return 0;
    }
  });

  const getStatusIcon = (status) => {
    const icons = {
      "pending": "⏳",
      "reviewed": "👀",
      "shortlisted": "⭐",
      "rejected": "❌",
      "hired": "✅"
    };
    return icons[status] || "📄";
  };

  const getStatusColor = (status) => {
    const colors = {
      "pending": "#f59e0b",
      "reviewed": "#3b82f6",
      "shortlisted": "#8b5cf6",
      "rejected": "#ef4444",
      "hired": "#10b981"
    };
    return colors[status] || "#6b7280";
  };

  const getStatusText = (status) => {
    const texts = {
      "pending": "Pending Review",
      "reviewed": "Under Review",
      "shortlisted": "Shortlisted",
      "rejected": "Not Selected",
      "hired": "Hired"
    };
    return texts[status] || status;
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await updateApplication(applicationId, { status: newStatus });
    } catch (error) {
      alert("Failed to update application status");
    }
  };

  const ApplicantCard = ({ applicant }) => {
    const job = companyJobs.find(j => j.id === applicant.jobId);

    return (
      <div className="applicant-card">
        <div className="card-header">
          <div className="applicant-info">
            <div className="applicant-avatar">
              {applicant.studentName?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="applicant-details">
              <h3 className="applicant-name">{applicant.studentName || `Applicant ${applicant.id}`}</h3>
              <p className="applicant-email">{applicant.studentEmail || "Email not provided"}</p>
              <div className="application-meta">
                <span className="meta-item">
                  <span className="meta-icon">📅</span>
                  Applied {new Date(applicant.appliedDate).toLocaleDateString()}
                </span>
                <span className="meta-item">
                  <span className="meta-icon">💼</span>
                  {job?.title || "Position not specified"}
                </span>
              </div>
            </div>
          </div>
          <div className="status-section">
            <div 
              className="status-badge"
              style={{ backgroundColor: getStatusColor(applicant.status) }}
            >
              <span className="status-icon">{getStatusIcon(applicant.status)}</span>
              {getStatusText(applicant.status)}
            </div>
          </div>
        </div>

        <div className="education-info">
          <div className="info-item">
            <span className="info-label">🎓 Course:</span>
            <span className="info-value">{applicant.courseTitle || "N/A"}</span>
          </div>
          <div className="info-item">
            <span className="info-label">🏛️ Institution:</span>
            <span className="info-value">{applicant.institutionName || "N/A"}</span>
          </div>
          <div className="info-item">
            <span className="info-label">📊 GPA:</span>
            <span className="info-value">{applicant.gpa || "Not specified"}</span>
          </div>
        </div>

        {applicant.applicationText && (
          <div className="motivation-section">
            <details>
              <summary className="motivation-toggle">
                <span className="toggle-icon">📄</span>
                View Cover Letter
              </summary>
              <div className="motivation-content">
                <p>{applicant.applicationText}</p>
              </div>
            </details>
          </div>
        )}

        <div className="action-section">
          <div className="status-actions">
            <h4>Update Status:</h4>
            <div className="action-buttons">
              {[
                { status: "reviewed", label: "Mark Reviewed", icon: "👀", color: "#3b82f6" },
                { status: "shortlisted", label: "Shortlist", icon: "⭐", color: "#8b5cf6" },
                { status: "rejected", label: "Reject", icon: "❌", color: "#ef4444" },
                { status: "hired", label: "Hire", icon: "✅", color: "#10b981" }
              ].map(({ status, label, icon, color }) => (
                <button
                  key={status}
                  onClick={() => handleStatusUpdate(applicant.id, status)}
                  disabled={applicant.status === status}
                  className="status-btn"
                  style={{ 
                    backgroundColor: applicant.status === status ? color : 'transparent',
                    borderColor: color,
                    color: applicant.status === status ? 'white' : color
                  }}
                >
                  <span className="btn-icon">{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="contact-actions">
            <button className="contact-btn">
              <span className="btn-icon">📧</span>
              Contact
            </button>
            <button className="contact-btn">
              <span className="btn-icon">📋</span>
              View Resume
            </button>
          </div>
        </div>
      </div>
    );
  };

  const stats = {
    total: applicantList.length,
    pending: applicantList.filter(app => app.status === "pending").length,
    reviewed: applicantList.filter(app => app.status === "reviewed").length,
    shortlisted: applicantList.filter(app => app.status === "shortlisted").length,
    hired: applicantList.filter(app => app.status === "hired").length
  };

  const conversionRate = stats.total > 0 ? Math.round((stats.hired / stats.total) * 100) : 0;

  return (
    <>
      <Navbar />
      <div className="view-applicants-container">
        <Sidebar links={links} />
        
        <main className="view-applicants-main">
          {/* Header Section */}
          <div className="applicants-header">
            <div className="header-content">
              <div className="header-text">
                <h1>Applicant Management</h1>
                <p>Review and manage candidates for your job openings</p>
              </div>
              <div className="header-stats">
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-info">
                    <span className="stat-number">{stats.total}</span>
                    <span className="stat-label">Total Applicants</span>
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
            <div className="stat-item reviewed">
              <div className="stat-icon">👀</div>
              <div className="stat-content">
                <span className="stat-value">{stats.reviewed}</span>
                <span className="stat-label">Under Review</span>
              </div>
            </div>
            <div className="stat-item shortlisted">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <span className="stat-value">{stats.shortlisted}</span>
                <span className="stat-label">Shortlisted</span>
              </div>
            </div>
            <div className="stat-item hired">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <span className="stat-value">{stats.hired}</span>
                <span className="stat-label">Hired</span>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="filters-section">
            <div className="search-box">
              <div className="search-icon">🔍</div>
              <input
                type="text"
                placeholder="Search by applicant name, course, or institution..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-group">
              <div className="filter-row">
                <div className="filter-item">
                  <label className="filter-label">Filter by Status:</label>
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Applications</option>
                    <option value="pending">⏳ Pending</option>
                    <option value="reviewed">👀 Under Review</option>
                    <option value="shortlisted">⭐ Shortlisted</option>
                    <option value="hired">✅ Hired</option>
                    <option value="rejected">❌ Rejected</option>
                  </select>
                </div>

                <div className="filter-item">
                  <label className="filter-label">Filter by Job:</label>
                  <select 
                    value={selectedJob}
                    onChange={(e) => setSelectedJob(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Jobs</option>
                    {companyJobs.map(job => (
                      <option key={job.id} value={job.id}>
                        {job.title}
                      </option>
                    ))}
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
                    <option value="name">Name A-Z</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Applicants List */}
          <div className="applicants-section">
            <div className="section-header">
              <h2>
                {filterStatus === "all" ? "All Applicants" : 
                 filterStatus === "pending" ? "Pending Review" :
                 filterStatus === "reviewed" ? "Under Review" :
                 filterStatus === "shortlisted" ? "Shortlisted Candidates" :
                 filterStatus === "hired" ? "Hired Candidates" : "Application Decisions"}
                <span className="results-count"> ({filteredApplicants.length})</span>
              </h2>
              
              {stats.pending > 0 && filterStatus === "all" && (
                <div className="pending-alert">
                  <span className="alert-icon">📢</span>
                  You have {stats.pending} applications awaiting review
                </div>
              )}
            </div>

            {filteredApplicants.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  {filterStatus === "all" ? "👥" :
                   filterStatus === "pending" ? "⏳" :
                   filterStatus === "reviewed" ? "👀" :
                   filterStatus === "shortlisted" ? "⭐" : "✅"}
                </div>
                <h3>
                  {filterStatus === "all" ? "No Applicants Found" :
                   filterStatus === "pending" ? "No Pending Applications" :
                   filterStatus === "reviewed" ? "No Applications Under Review" :
                   filterStatus === "shortlisted" ? "No Shortlisted Candidates" : "No Hired Candidates"}
                </h3>
                <p>
                  {searchTerm || selectedJob !== "all"
                    ? "No applicants match your current filters. Try adjusting your search criteria."
                    : "You haven't received any applications for your job postings yet."
                  }
                </p>
                {(searchTerm || filterStatus !== "all" || selectedJob !== "all") && (
                  <button 
                    className="btn-secondary"
                    onClick={() => {
                      setSearchTerm("");
                      setFilterStatus("all");
                      setSelectedJob("all");
                    }}
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="applicants-grid">
                {filteredApplicants.map(applicant => (
                  <ApplicantCard key={applicant.id} applicant={applicant} />
                ))}
              </div>
            )}
          </div>

          {/* Recruitment Insights */}
          <div className="insights-section">
            <h3>📊 Recruitment Insights</h3>
            <div className="insights-grid">
              <div className="insight-card">
                <div className="insight-icon">🎯</div>
                <div className="insight-content">
                  <h4>Conversion Rate</h4>
                  <p>{conversionRate}% of applicants get hired</p>
                </div>
              </div>
              <div className="insight-card">
                <div className="insight-icon">⚡</div>
                <div className="insight-content">
                  <h4>Average Response</h4>
                  <p>2.1 days to first review</p>
                </div>
              </div>
              <div className="insight-card">
                <div className="insight-icon">📈</div>
                <div className="insight-content">
                  <h4>Quality Score</h4>
                  <p>68% match with job requirements</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .view-applicants-container {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .view-applicants-main {
          flex: 1;
          padding: 30px;
          margin-left: 280px;
        }

        .applicants-header {
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
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

        .stat-item.pending {
          border-left: 4px solid #f59e0b;
        }

        .stat-item.reviewed {
          border-left: 4px solid #3b82f6;
        }

        .stat-item.shortlisted {
          border-left: 4px solid #8b5cf6;
        }

        .stat-item.hired {
          border-left: 4px solid #10b981;
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
          border-color: #7c3aed;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
        }

        .filter-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
          border-color: #7c3aed;
        }

        .applicants-section {
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
          color: #7c3aed;
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

        .applicants-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .applicant-card {
          border: 2px solid #f1f5f9;
          border-radius: 15px;
          padding: 25px;
          transition: all 0.3s ease;
          background: white;
        }

        .applicant-card:hover {
          border-color: #7c3aed;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .applicant-info {
          display: flex;
          gap: 15px;
          align-items: flex-start;
        }

        .applicant-avatar {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: white;
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .applicant-details {
          flex: 1;
        }

        .applicant-name {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 5px;
        }

        .applicant-email {
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

        .education-info {
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
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .status-actions h4 {
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

        .status-btn {
          padding: 8px 16px;
          border: 2px solid;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
        }

        .status-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .status-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .contact-actions {
          display: flex;
          gap: 10px;
        }

        .contact-btn {
          padding: 8px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          color: #374151;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
        }

        .contact-btn:hover {
          border-color: #7c3aed;
          color: #7c3aed;
          transform: translateY(-1px);
        }

        .btn-icon {
          font-size: 0.9rem;
        }

        .motivation-section {
          margin-top: 15px;
        }

        .motivation-toggle {
          background: none;
          border: none;
          cursor: pointer;
          color: #7c3aed;
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
          padding: 15px;
          margin-top: 10px;
          border-left: 3px solid #7c3aed;
        }

        .motivation-content p {
          color: #6b7280;
          line-height: 1.5;
          font-size: 0.9rem;
          margin: 0;
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
          background: #7c3aed;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background: #6d28d9;
          transform: translateY(-2px);
        }

        .insights-section {
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }

        .insights-section h3 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 20px;
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

        @media (max-width: 1024px) {
          .view-applicants-main {
            margin-left: 0;
            padding: 20px;
          }
          
          .header-content {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }

        @media (max-width: 768px) {
          .applicants-header {
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
          
          .action-section {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .contact-actions {
            width: 100%;
            justify-content: flex-start;
          }
          
          .section-header {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }
          
          .filter-row {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .view-applicants-main {
            padding: 15px;
          }
          
          .applicants-header {
            padding: 20px;
          }
          
          .header-text h1 {
            font-size: 1.75rem;
          }
          
          .applicants-section {
            padding: 20px;
          }
          
          .insights-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}