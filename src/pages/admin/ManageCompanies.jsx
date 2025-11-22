import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useAppData } from "../../context/ApplicationContext";

export default function ManageCompanies() {
  const { companies, addCompany, updateCompany, deleteCompany } = useAppData();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [industry, setIndustry] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const adminLinks = [
    { to: "/admin/institutions", label: "Manage Institutions" },
    { to: "/admin/faculties", label: "Manage Faculties" },
    { to: "/admin/courses", label: "Manage Courses" },
    { to: "/admin/companies", label: "Manage Companies" },
    { to: "/admin/reports", label: "Reports & Analytics" },
    { to: "/admin/admissions", label: "Publish Admissions" },
    { to: "/admin/users", label: "Monitor Users" },
  ];

  const handleAdd = async () => {
    if (!name.trim()) {
      alert("Please enter company name");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      addCompany({
        id: `comp_${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        industry: industry.trim(),
        status: "pending",
        createdAt: new Date().toISOString(),
        jobs: 0,
        applicants: 0,
        verified: false
      });
      setName("");
      setEmail("");
      setIndustry("");
    } catch (error) {
      alert("Failed to add company");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompanyAction = async (companyId, action, newStatus = null) => {
    setActionLoading(companyId);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      if (action === 'delete') {
        deleteCompany(companyId);
      } else if (action === 'update' && newStatus) {
        updateCompany(companyId, { status: newStatus });
      }
    } catch (error) {
      alert(`Failed to ${action} company`);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      "approved": "✅",
      "pending": "⏳",
      "suspended": "⏸️",
      "rejected": "❌"
    };
    return icons[status] || "📊";
  };

  const getStatusColor = (status) => {
    const colors = {
      "approved": "#10b981",
      "pending": "#f59e0b",
      "suspended": "#ef4444",
      "rejected": "#6b7280"
    };
    return colors[status] || "#6b7280";
  };

  const getStatusText = (status) => {
    const texts = {
      "approved": "Approved",
      "pending": "Pending Review",
      "suspended": "Suspended",
      "rejected": "Rejected"
    };
    return texts[status] || status;
  };

  const filteredCompanies = companies.filter(company => {
    const matchesStatus = filterStatus === "all" || company.status === filterStatus;
    const matchesSearch = company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const approvedCompanies = companies.filter(c => c.status === "approved");
  const pendingCompanies = companies.filter(c => c.status === "pending");
  const suspendedCompanies = companies.filter(c => c.status === "suspended");

  const CompanyCard = ({ company }) => (
    <div className="company-card">
      <div className="card-header">
        <div className="company-info">
          <div className="company-avatar">
            {company.name?.charAt(0).toUpperCase() || "C"}
          </div>
          <div className="company-details">
            <h3 className="company-name">{company.name}</h3>
            <p className="company-email">{company.email || "No email provided"}</p>
            <div className="company-meta">
              <span className="meta-item">
                <span className="meta-icon">🏢</span>
                {company.industry || "Not specified"}
              </span>
              <span className="meta-item">
                <span className="meta-icon">📅</span>
                Joined {new Date(company.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <div className="status-section">
          <div 
            className="status-badge"
            style={{ backgroundColor: getStatusColor(company.status) }}
          >
            <span className="status-icon">{getStatusIcon(company.status)}</span>
            {getStatusText(company.status)}
          </div>
          <div className="company-stats">
            <div className="stat">
              <span className="stat-number">{company.jobs || 0}</span>
              <span className="stat-label">Jobs</span>
            </div>
            <div className="stat">
              <span className="stat-number">{company.applicants || 0}</span>
              <span className="stat-label">Applicants</span>
            </div>
          </div>
        </div>
      </div>

      <div className="action-section">
        <div className="status-actions">
          <h4>Manage Status:</h4>
          <div className="action-buttons">
            {company.status !== "approved" && (
              <button
                onClick={() => handleCompanyAction(company.id, 'update', 'approved')}
                disabled={actionLoading === company.id}
                className="action-btn approve"
              >
                {actionLoading === company.id ? (
                  <div className="mini-spinner"></div>
                ) : (
                  <>
                    <span className="btn-icon">✅</span>
                    Approve
                  </>
                )}
              </button>
            )}
            
            {company.status !== "suspended" && (
              <button
                onClick={() => handleCompanyAction(company.id, 'update', 'suspended')}
                disabled={actionLoading === company.id}
                className="action-btn suspend"
              >
                {actionLoading === company.id ? (
                  <div className="mini-spinner"></div>
                ) : (
                  <>
                    <span className="btn-icon">⏸️</span>
                    Suspend
                  </>
                )}
              </button>
            )}

            {company.status !== "pending" && (
              <button
                onClick={() => handleCompanyAction(company.id, 'update', 'pending')}
                disabled={actionLoading === company.id}
                className="action-btn pending"
              >
                {actionLoading === company.id ? (
                  <div className="mini-spinner"></div>
                ) : (
                  <>
                    <span className="btn-icon">⏳</span>
                    Set Pending
                  </>
                )}
              </button>
            )}

            <button
              onClick={() => handleCompanyAction(company.id, 'delete')}
              disabled={actionLoading === company.id}
              className="action-btn delete"
            >
              {actionLoading === company.id ? (
                <div className="mini-spinner"></div>
              ) : (
                <>
                  <span className="btn-icon">🗑️</span>
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const stats = {
    total: companies.length,
    approved: approvedCompanies.length,
    pending: pendingCompanies.length,
    suspended: suspendedCompanies.length,
    activeRate: companies.length > 0 ? Math.round((approvedCompanies.length / companies.length) * 100) : 0
  };

  return (
    <>
      <Navbar />
      <div className="manage-companies-container">
        <Sidebar links={adminLinks} />
        
        <main className="manage-companies-main">
          {/* Header Section */}
          <div className="companies-header">
            <div className="header-content">
              <div className="header-text">
                <h1>Manage Companies</h1>
                <p>Oversee company registrations and manage platform partnerships</p>
              </div>
              <div className="header-stats">
                <div className="stat-card">
                  <div className="stat-icon">🏢</div>
                  <div className="stat-info">
                    <span className="stat-number">{stats.total}</span>
                    <span className="stat-label">Total Companies</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Overview */}
          <div className="stats-overview">
            <div className="stat-item approved">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <span className="stat-value">{stats.approved}</span>
                <span className="stat-label">Approved</span>
              </div>
            </div>
            <div className="stat-item pending">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <span className="stat-value">{stats.pending}</span>
                <span className="stat-label">Pending Review</span>
              </div>
            </div>
            <div className="stat-item suspended">
              <div className="stat-icon">⏸️</div>
              <div className="stat-content">
                <span className="stat-value">{stats.suspended}</span>
                <span className="stat-label">Suspended</span>
              </div>
            </div>
            <div className="stat-item rate">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <span className="stat-value">{stats.activeRate}%</span>
                <span className="stat-label">Active Rate</span>
              </div>
            </div>
          </div>

          {/* Add Company Form */}
          <div className="add-company-section">
            <div className="section-header">
              <h2>➕ Add New Company</h2>
              <p>Register a new company to the platform</p>
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">🏢 Company Name *</label>
                <input
                  type="text"
                  placeholder="Enter company name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">📧 Email Address</label>
                <input
                  type="email"
                  placeholder="company@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">🏭 Industry</label>
                <input
                  type="text"
                  placeholder="e.g., Technology, Healthcare"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
            
            <button 
              className={`add-button ${isLoading ? "loading" : ""}`}
              onClick={handleAdd}
              disabled={isLoading || !name.trim()}
            >
              {isLoading ? (
                <>
                  <div className="button-spinner"></div>
                  Adding Company...
                </>
              ) : (
                <>
                  <span className="button-icon">🏢</span>
                  Add Company
                </>
              )}
            </button>
          </div>

          {/* Filters and Search */}
          <div className="filters-section">
            <div className="search-box">
              <div className="search-icon">🔍</div>
              <input
                type="text"
                placeholder="Search companies by name, industry, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Filter by Status:</label>
              <div className="filter-buttons">
                <button 
                  className={`filter-btn ${filterStatus === "all" ? "active" : ""}`}
                  onClick={() => setFilterStatus("all")}
                >
                  🌐 All Companies
                </button>
                <button 
                  className={`filter-btn ${filterStatus === "approved" ? "active" : ""}`}
                  onClick={() => setFilterStatus("approved")}
                >
                  ✅ Approved
                </button>
                <button 
                  className={`filter-btn ${filterStatus === "pending" ? "active" : ""}`}
                  onClick={() => setFilterStatus("pending")}
                >
                  ⏳ Pending
                </button>
                <button 
                  className={`filter-btn ${filterStatus === "suspended" ? "active" : ""}`}
                  onClick={() => setFilterStatus("suspended")}
                >
                  ⏸️ Suspended
                </button>
              </div>
            </div>
          </div>

          {/* Companies List */}
          <div className="companies-section">
            <div className="section-header">
              <h2>
                {filterStatus === "all" ? "All Companies" : 
                 filterStatus === "approved" ? "Approved Companies" :
                 filterStatus === "pending" ? "Pending Review" : "Suspended Companies"}
                <span className="results-count"> ({filteredCompanies.length})</span>
              </h2>
              
              {stats.pending > 0 && filterStatus === "all" && (
                <div className="pending-alert">
                  <span className="alert-icon">📢</span>
                  You have {stats.pending} companies awaiting approval
                </div>
              )}
            </div>

            {filteredCompanies.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  {filterStatus === "all" ? "🏢" :
                   filterStatus === "approved" ? "✅" :
                   filterStatus === "pending" ? "⏳" : "⏸️"}
                </div>
                <h3>
                  {filterStatus === "all" ? "No Companies Found" :
                   filterStatus === "approved" ? "No Approved Companies" :
                   filterStatus === "pending" ? "No Pending Companies" : "No Suspended Companies"}
                </h3>
                <p>
                  {searchTerm 
                    ? "No companies match your search criteria. Try adjusting your filters."
                    : "No companies have been registered on the platform yet."
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
              <div className="companies-grid">
                {filteredCompanies.map(company => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            )}
          </div>

          {/* Platform Insights */}
          <div className="insights-section">
            <h3>📊 Platform Insights</h3>
            <div className="insights-grid">
              <div className="insight-card">
                <div className="insight-icon">🚀</div>
                <div className="insight-content">
                  <h4>Growth Rate</h4>
                  <p>+15% new companies this month</p>
                </div>
              </div>
              <div className="insight-card">
                <div className="insight-icon">💼</div>
                <div className="insight-content">
                  <h4>Job Postings</h4>
                  <p>Average 12 jobs per active company</p>
                </div>
              </div>
              <div className="insight-card">
                <div className="insight-icon">👥</div>
                <div className="insight-content">
                  <h4>Recruitment</h4>
                  <p>85% approval rate for new registrations</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .manage-companies-container {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .manage-companies-main {
          flex: 1;
          padding: 30px;
          margin-left: 280px;
        }

        .companies-header {
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

        .stat-item.approved {
          border-left: 4px solid #10b981;
        }

        .stat-item.pending {
          border-left: 4px solid #f59e0b;
        }

        .stat-item.suspended {
          border-left: 4px solid #ef4444;
        }

        .stat-item.rate {
          border-left: 4px solid #3b82f6;
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

        .add-company-section {
          background: white;
          border-radius: 20px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }

        .section-header {
          margin-bottom: 25px;
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

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 25px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-label {
          font-weight: 600;
          font-size: 0.9rem;
          color: #374151;
          margin-bottom: 8px;
          display: block;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #1e40af;
          box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
        }

        .add-button {
          width: 100%;
          padding: 16px 24px;
          background: linear-gradient(135deg, #1e40af, #1e3a8a);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .add-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(30, 64, 175, 0.3);
        }

        .add-button.loading {
          background: linear-gradient(135deg, #6b7280, #9ca3af);
        }

        .add-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .button-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .button-icon {
          font-size: 1.1rem;
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
          border-color: #1e40af;
          box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
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
          border-color: #1e40af;
          transform: translateY(-2px);
        }

        .filter-btn.active {
          background: #1e40af;
          color: white;
          border-color: #1e40af;
        }

        .companies-section {
          background: white;
          border-radius: 20px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .results-count {
          color: #1e40af;
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

        .companies-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .company-card {
          border: 2px solid #f1f5f9;
          border-radius: 15px;
          padding: 25px;
          transition: all 0.3s ease;
          background: white;
        }

        .company-card:hover {
          border-color: #1e40af;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .company-info {
          display: flex;
          gap: 15px;
          align-items: flex-start;
        }

        .company-avatar {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #1e40af, #1e3a8a);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: white;
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .company-details {
          flex: 1;
        }

        .company-name {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 5px;
        }

        .company-email {
          color: #6b7280;
          font-size: 0.9rem;
          margin-bottom: 10px;
        }

        .company-meta {
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

        .company-stats {
          display: flex;
          gap: 15px;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          font-size: 1.2rem;
          font-weight: 800;
          color: #1f2937;
          display: block;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.7rem;
          color: #6b7280;
          font-weight: 500;
        }

        .action-section {
          border-top: 1px solid #e5e7eb;
          padding-top: 20px;
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

        .action-btn {
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

        .action-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .action-btn.approve {
          background-color: #10b981;
          border-color: #10b981;
          color: white;
        }

        .action-btn.suspend {
          background-color: transparent;
          border-color: #f59e0b;
          color: #f59e0b;
        }

        .action-btn.suspend:hover {
          background-color: #f59e0b;
          color: white;
        }

        .action-btn.pending {
          background-color: transparent;
          border-color: #6b7280;
          color: #6b7280;
        }

        .action-btn.pending:hover {
          background-color: #6b7280;
          color: white;
        }

        .action-btn.delete {
          background-color: transparent;
          border-color: #ef4444;
          color: #ef4444;
        }

        .action-btn.delete:hover {
          background-color: #ef4444;
          color: white;
        }

        .mini-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .btn-icon {
          font-size: 0.9rem;
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
          background: #1e40af;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background: #1e3a8a;
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

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 1024px) {
          .manage-companies-main {
            margin-left: 0;
            padding: 20px;
          }
          
          .header-content {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }

        @media (max-width: 768px) {
          .companies-header {
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
          
          .company-stats {
            justify-content: flex-start;
          }
          
          .action-buttons {
            justify-content: center;
          }
          
          .filter-buttons {
            justify-content: center;
          }
          
          .section-header {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }
        }

        @media (max-width: 480px) {
          .manage-companies-main {
            padding: 15px;
          }
          
          .companies-header {
            padding: 20px;
          }
          
          .header-text h1 {
            font-size: 1.75rem;
          }
          
          .companies-section {
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