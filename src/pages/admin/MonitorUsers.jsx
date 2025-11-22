import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useAppData } from "../../context/ApplicationContext";

export default function MonitorUsers() {
  const { users = [], updateUserStatus, deleteUser } = useAppData();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
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

  const handleStatusUpdate = async (userId, newStatus) => {
    setActionLoading(userId);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      await updateUserStatus(userId, newStatus);
    } catch (error) {
      alert("Failed to update user status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    setActionLoading(userId);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      await deleteUser(userId);
    } catch (error) {
      alert("Failed to delete user");
    } finally {
      setActionLoading(null);
    }
  };

  const getRoleIcon = (role) => {
    const icons = {
      "student": "🎓",
      "institute": "🏛️",
      "company": "🏢",
      "admin": "⚙️"
    };
    return icons[role] || "👤";
  };

  const getRoleColor = (role) => {
    const colors = {
      "student": "#3b82f6",
      "institute": "#8b5cf6",
      "company": "#10b981",
      "admin": "#ef4444"
    };
    return colors[role] || "#6b7280";
  };

  const getStatusIcon = (status) => {
    const icons = {
      "active": "✅",
      "pending": "⏳",
      "suspended": "⏸️",
      "inactive": "❌"
    };
    return icons[status] || "📊";
  };

  const getStatusColor = (status) => {
    const colors = {
      "active": "#10b981",
      "pending": "#f59e0b",
      "suspended": "#ef4444",
      "inactive": "#6b7280"
    };
    return colors[status] || "#6b7280";
  };

  const getStatusText = (status) => {
    const texts = {
      "active": "Active",
      "pending": "Pending",
      "suspended": "Suspended",
      "inactive": "Inactive"
    };
    return texts[status] || status;
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.role?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesRole && matchesStatus && matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case "oldest":
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      case "name":
        return (a.name || "").localeCompare(b.name || "");
      case "role":
        return (a.role || "").localeCompare(b.role || "");
      default:
        return 0;
    }
  });

  const UserCard = ({ user }) => (
    <div className="user-card">
      <div className="card-header">
        <div className="user-info">
          <div 
            className="user-avatar"
            style={{ backgroundColor: getRoleColor(user.role) + '20', color: getRoleColor(user.role) }}
          >
            {getRoleIcon(user.role)}
          </div>
          <div className="user-details">
            <h3 className="user-name">{user.name || "Unknown User"}</h3>
            <p className="user-email">{user.email || "No email provided"}</p>
            <div className="user-meta">
              <span className="meta-item">
                <span className="meta-icon">👤</span>
                {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Unknown Role"}
              </span>
              <span className="meta-item">
                <span className="meta-icon">📅</span>
                Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown date"}
              </span>
              {user.lastLogin && (
                <span className="meta-item">
                  <span className="meta-icon">🕒</span>
                  Last login: {new Date(user.lastLogin).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="status-section">
          <div 
            className="status-badge"
            style={{ backgroundColor: getStatusColor(user.status) }}
          >
            <span className="status-icon">{getStatusIcon(user.status)}</span>
            {getStatusText(user.status)}
          </div>
          <div className="user-stats">
            <div className="stat">
              <span className="stat-number">{user.loginCount || 0}</span>
              <span className="stat-label">Logins</span>
            </div>
          </div>
        </div>
      </div>

      <div className="action-section">
        <div className="status-actions">
          <h4>Manage Status:</h4>
          <div className="action-buttons">
            {user.status !== "active" && (
              <button
                onClick={() => handleStatusUpdate(user.id, "active")}
                disabled={actionLoading === user.id}
                className="action-btn activate"
              >
                {actionLoading === user.id ? (
                  <div className="mini-spinner"></div>
                ) : (
                  <>
                    <span className="btn-icon">✅</span>
                    Activate
                  </>
                )}
              </button>
            )}
            
            {user.status !== "suspended" && (
              <button
                onClick={() => handleStatusUpdate(user.id, "suspended")}
                disabled={actionLoading === user.id}
                className="action-btn suspend"
              >
                {actionLoading === user.id ? (
                  <div className="mini-spinner"></div>
                ) : (
                  <>
                    <span className="btn-icon">⏸️</span>
                    Suspend
                  </>
                )}
              </button>
            )}

            {user.status !== "pending" && user.status !== "inactive" && (
              <button
                onClick={() => handleStatusUpdate(user.id, "pending")}
                disabled={actionLoading === user.id}
                className="action-btn pending"
              >
                {actionLoading === user.id ? (
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
              onClick={() => handleDeleteUser(user.id)}
              disabled={actionLoading === user.id}
              className="action-btn delete"
            >
              {actionLoading === user.id ? (
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

        <div className="quick-actions">
          <button className="quick-btn">
            <span className="btn-icon">📧</span>
            Send Email
          </button>
          <button className="quick-btn">
            <span className="btn-icon">📊</span>
            View Activity
          </button>
        </div>
      </div>
    </div>
  );

  const stats = {
    total: users.length,
    students: users.filter(u => u.role === "student").length,
    institutes: users.filter(u => u.role === "institute").length,
    companies: users.filter(u => u.role === "company").length,
    active: users.filter(u => u.status === "active").length,
    pending: users.filter(u => u.status === "pending").length,
    suspended: users.filter(u => u.status === "suspended").length
  };

  const activeRate = users.length > 0 ? Math.round((stats.active / users.length) * 100) : 0;

  return (
    <>
      <Navbar />
      <div className="monitor-users-container">
        <Sidebar links={adminLinks} />
        
        <main className="monitor-users-main">
          {/* Header Section */}
          <div className="users-header">
            <div className="header-content">
              <div className="header-text">
                <h1>User Management</h1>
                <p>Monitor and manage all registered users across the platform</p>
              </div>
              <div className="header-stats">
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-info">
                    <span className="stat-number">{stats.total}</span>
                    <span className="stat-label">Total Users</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Overview */}
          <div className="stats-overview">
            <div className="stat-item students">
              <div className="stat-icon">🎓</div>
              <div className="stat-content">
                <span className="stat-value">{stats.students}</span>
                <span className="stat-label">Students</span>
              </div>
            </div>
            <div className="stat-item institutes">
              <div className="stat-icon">🏛️</div>
              <div className="stat-content">
                <span className="stat-value">{stats.institutes}</span>
                <span className="stat-label">Institutions</span>
              </div>
            </div>
            <div className="stat-item companies">
              <div className="stat-icon">🏢</div>
              <div className="stat-content">
                <span className="stat-value">{stats.companies}</span>
                <span className="stat-label">Companies</span>
              </div>
            </div>
            <div className="stat-item active">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <span className="stat-value">{activeRate}%</span>
                <span className="stat-label">Active Rate</span>
              </div>
            </div>
          </div>

          {/* Status Distribution */}
          <div className="status-distribution">
            <h3>📈 User Status Distribution</h3>
            <div className="distribution-grid">
              <div className="distribution-item active">
                <div className="distribution-icon">✅</div>
                <div className="distribution-content">
                  <span className="distribution-value">{stats.active}</span>
                  <span className="distribution-label">Active Users</span>
                </div>
              </div>
              <div className="distribution-item pending">
                <div className="distribution-icon">⏳</div>
                <div className="distribution-content">
                  <span className="distribution-value">{stats.pending}</span>
                  <span className="distribution-label">Pending</span>
                </div>
              </div>
              <div className="distribution-item suspended">
                <div className="distribution-icon">⏸️</div>
                <div className="distribution-content">
                  <span className="distribution-value">{stats.suspended}</span>
                  <span className="distribution-label">Suspended</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="filters-section">
            <div className="search-box">
              <div className="search-icon">🔍</div>
              <input
                type="text"
                placeholder="Search users by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-row">
              <div className="filter-item">
                <label className="filter-label">Filter by Role:</label>
                <select 
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Roles</option>
                  <option value="student">🎓 Students</option>
                  <option value="institute">🏛️ Institutions</option>
                  <option value="company">🏢 Companies</option>
                  <option value="admin">⚙️ Administrators</option>
                </select>
              </div>

              <div className="filter-item">
                <label className="filter-label">Filter by Status:</label>
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Status</option>
                  <option value="active">✅ Active</option>
                  <option value="pending">⏳ Pending</option>
                  <option value="suspended">⏸️ Suspended</option>
                  <option value="inactive">❌ Inactive</option>
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
                  <option value="role">Role</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users List */}
          <div className="users-section">
            <div className="section-header">
              <h2>
                {filterRole === "all" && filterStatus === "all" ? "All Users" : 
                 filterRole !== "all" ? `${filterRole.charAt(0).toUpperCase() + filterRole.slice(1)} Users` :
                 `${filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)} Users`}
                <span className="results-count"> ({filteredUsers.length})</span>
              </h2>
              
              {stats.pending > 0 && filterStatus === "all" && (
                <div className="pending-alert">
                  <span className="alert-icon">📢</span>
                  You have {stats.pending} users awaiting activation
                </div>
              )}
            </div>

            {filteredUsers.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  {searchTerm || filterRole !== "all" || filterStatus !== "all" ? "🔍" : "👥"}
                </div>
                <h3>
                  {searchTerm || filterRole !== "all" || filterStatus !== "all" 
                    ? "No Users Found" 
                    : "No Users Registered Yet"}
                </h3>
                <p>
                  {searchTerm || filterRole !== "all" || filterStatus !== "all"
                    ? "No users match your current filters. Try adjusting your search criteria."
                    : "No users have registered on the platform yet."
                  }
                </p>
                {(searchTerm || filterRole !== "all" || filterStatus !== "all") && (
                  <button 
                    className="btn-secondary"
                    onClick={() => {
                      setSearchTerm("");
                      setFilterRole("all");
                      setFilterStatus("all");
                    }}
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="users-grid">
                {filteredUsers.map(user => (
                  <UserCard key={user.id} user={user} />
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
                  <h4>User Growth</h4>
                  <p>+28% new registrations this month</p>
                </div>
              </div>
              <div className="insight-card">
                <div className="insight-icon">📈</div>
                <div className="insight-content">
                  <h4>Engagement Rate</h4>
                  <p>{activeRate}% of users are active</p>
                </div>
              </div>
              <div className="insight-card">
                <div className="insight-icon">🎯</div>
                <div className="insight-content">
                  <h4>Platform Health</h4>
                  <p>Healthy user distribution across roles</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .monitor-users-container {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .monitor-users-main {
          flex: 1;
          padding: 30px;
          margin-left: 280px;
        }

        .users-header {
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

        .stat-item.students {
          border-left: 4px solid #3b82f6;
        }

        .stat-item.institutes {
          border-left: 4px solid #8b5cf6;
        }

        .stat-item.companies {
          border-left: 4px solid #10b981;
        }

        .stat-item.active {
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

        .status-distribution {
          background: white;
          border-radius: 20px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }

        .status-distribution h3 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 20px;
        }

        .distribution-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .distribution-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .distribution-item.active {
          background: #f0fdf4;
          border: 1px solid #dcfce7;
        }

        .distribution-item.pending {
          background: #fffbeb;
          border: 1px solid #fef3c7;
        }

        .distribution-item.suspended {
          background: #fef2f2;
          border: 1px solid #fecaca;
        }

        .distribution-icon {
          font-size: 1.5rem;
        }

        .distribution-content {
          display: flex;
          flex-direction: column;
        }

        .distribution-value {
          font-size: 1.5rem;
          font-weight: 800;
          color: #1f2937;
        }

        .distribution-label {
          font-size: 0.8rem;
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

        .users-section {
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

        .users-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .user-card {
          border: 2px solid #f1f5f9;
          border-radius: 15px;
          padding: 25px;
          transition: all 0.3s ease;
          background: white;
        }

        .user-card:hover {
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

        .user-info {
          display: flex;
          gap: 15px;
          align-items: flex-start;
        }

        .user-avatar {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .user-details {
          flex: 1;
        }

        .user-name {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 5px;
        }

        .user-email {
          color: #6b7280;
          font-size: 0.9rem;
          margin-bottom: 10px;
        }

        .user-meta {
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

        .user-stats {
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
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
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

        .action-btn.activate {
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

        .quick-actions {
          display: flex;
          gap: 10px;
        }

        .quick-btn {
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

        .quick-btn:hover {
          border-color: #7c3aed;
          color: #7c3aed;
          transform: translateY(-1px);
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

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 1024px) {
          .monitor-users-main {
            margin-left: 0;
            padding: 20px;
          }
          
          .header-content {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }

        @media (max-width: 768px) {
          .users-header {
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
          
          .user-stats {
            justify-content: flex-start;
          }
          
          .action-section {
            flex-direction: column;
            gap: 15px;
          }
          
          .quick-actions {
            width: 100%;
            justify-content: flex-start;
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
          .monitor-users-main {
            padding: 15px;
          }
          
          .users-header {
            padding: 20px;
          }
          
          .header-text h1 {
            font-size: 1.75rem;
          }
          
          .users-section {
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