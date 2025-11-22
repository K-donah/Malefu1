import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useAppData } from "../../context/ApplicationContext";

export default function ManageFaculties() {
  const { faculties, addFaculty, deleteFaculty, institutions, courses } = useAppData();
  const [name, setName] = useState("");
  const [institutionId, setInstitutionId] = useState("");
  const [description, setDescription] = useState("");
  const [dean, setDean] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterInstitution, setFilterInstitution] = useState("all");
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
    if (!name || !institutionId) {
      alert("Please select institution and enter faculty name");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const institution = institutions.find(i => i.id === institutionId);
      
      addFaculty({
        id: `fac_${Date.now()}`,
        name: name.trim(),
        description: description.trim(),
        dean: dean.trim(),
        institutionId,
        institutionName: institution?.name || "",
        createdAt: new Date().toISOString(),
        courses: 0,
        students: 0
      });
      
      setName("");
      setInstitutionId("");
      setDescription("");
      setDean("");
    } catch (error) {
      alert("Failed to add faculty");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (facultyId) => {
    setActionLoading(facultyId);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      deleteFaculty(facultyId);
    } catch (error) {
      alert("Failed to delete faculty");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredFaculties = faculties.filter(faculty => {
    const matchesInstitution = filterInstitution === "all" || faculty.institutionId === filterInstitution;
    const matchesSearch = faculty.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faculty.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faculty.dean?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faculty.institutionName?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesInstitution && matchesSearch;
  });

  const FacultyCard = ({ faculty }) => {
    const facultyCourses = courses.filter(course => course.facultyId === faculty.id);
    const facultyStudents = facultyCourses.reduce((sum, course) => sum + (course.students || 0), 0);

    return (
      <div className="faculty-card">
        <div className="card-header">
          <div className="faculty-info">
            <div className="faculty-avatar">
              {faculty.name?.charAt(0).toUpperCase() || "F"}
            </div>
            <div className="faculty-details">
              <h3 className="faculty-name">{faculty.name}</h3>
              <p className="faculty-description">{faculty.description || "No description provided"}</p>
              <div className="faculty-meta">
                <span className="meta-item">
                  <span className="meta-icon">🏛️</span>
                  {faculty.institutionName}
                </span>
                {faculty.dean && (
                  <span className="meta-item">
                    <span className="meta-icon">👨‍🏫</span>
                    Dean: {faculty.dean}
                  </span>
                )}
                <span className="meta-item">
                  <span className="meta-icon">📅</span>
                  Created {new Date(faculty.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="faculty-stats">
            <div className="stat">
              <span className="stat-number">{facultyCourses.length}</span>
              <span className="stat-label">Courses</span>
            </div>
            <div className="stat">
              <span className="stat-number">{facultyStudents}</span>
              <span className="stat-label">Students</span>
            </div>
          </div>
        </div>

        {facultyCourses.length > 0 && (
          <div className="courses-preview">
            <h4>📚 Recent Courses</h4>
            <div className="courses-list">
              {facultyCourses.slice(0, 3).map(course => (
                <span key={course.id} className="course-tag">
                  {course.title}
                </span>
              ))}
              {facultyCourses.length > 3 && (
                <span className="more-courses">
                  +{facultyCourses.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="action-section">
          <div className="faculty-actions">
            <button className="action-btn view">
              <span className="btn-icon">👀</span>
              View Details
            </button>
            <button className="action-btn edit">
              <span className="btn-icon">✏️</span>
              Edit Faculty
            </button>
            <button
              onClick={() => handleDelete(faculty.id)}
              disabled={actionLoading === faculty.id}
              className="action-btn delete"
            >
              {actionLoading === faculty.id ? (
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
    );
  };

  const stats = {
    total: faculties.length,
    byInstitution: [...new Set(faculties.map(f => f.institutionId))].length,
    totalCourses: courses.length,
    averageCourses: faculties.length > 0 ? Math.round(courses.length / faculties.length) : 0
  };

  return (
    <>
      <Navbar />
      <div className="manage-faculties-container">
        <Sidebar links={adminLinks} />
        
        <main className="manage-faculties-main">
          {/* Header Section */}
          <div className="faculties-header">
            <div className="header-content">
              <div className="header-text">
                <h1>Manage Faculties</h1>
                <p>Oversee academic faculties and departments across institutions</p>
              </div>
              <div className="header-stats">
                <div className="stat-card">
                  <div className="stat-icon">🎓</div>
                  <div className="stat-info">
                    <span className="stat-number">{stats.total}</span>
                    <span className="stat-label">Total Faculties</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Overview */}
          <div className="stats-overview">
            <div className="stat-item total">
              <div className="stat-icon">🎓</div>
              <div className="stat-content">
                <span className="stat-value">{stats.total}</span>
                <span className="stat-label">Faculties</span>
              </div>
            </div>
            <div className="stat-item institutions">
              <div className="stat-icon">🏛️</div>
              <div className="stat-content">
                <span className="stat-value">{stats.byInstitution}</span>
                <span className="stat-label">Institutions</span>
              </div>
            </div>
            <div className="stat-item courses">
              <div className="stat-icon">📚</div>
              <div className="stat-content">
                <span className="stat-value">{stats.totalCourses}</span>
                <span className="stat-label">Total Courses</span>
              </div>
            </div>
            <div className="stat-item average">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <span className="stat-value">{stats.averageCourses}</span>
                <span className="stat-label">Avg. Courses/Faculty</span>
              </div>
            </div>
          </div>

          {/* Add Faculty Form */}
          <div className="add-faculty-section">
            <div className="section-header">
              <h2>➕ Add New Faculty</h2>
              <p>Create a new academic faculty or department</p>
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">🎓 Faculty Name *</label>
                <input
                  type="text"
                  placeholder="Enter faculty name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">🏛️ Institution *</label>
                <select
                  value={institutionId}
                  onChange={(e) => setInstitutionId(e.target.value)}
                  className="form-select"
                >
                  <option value="">Select Institution</option>
                  {institutions.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">👨‍🏫 Dean/Head</label>
                <input
                  type="text"
                  placeholder="Enter dean's name"
                  value={dean}
                  onChange={(e) => setDean(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label className="form-label">📝 Faculty Description</label>
              <textarea
                placeholder="Describe the faculty's focus, departments, and academic offerings..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className="form-textarea"
              />
            </div>
            
            <button 
              className={`add-button ${isLoading ? "loading" : ""}`}
              onClick={handleAdd}
              disabled={isLoading || !name.trim() || !institutionId}
            >
              {isLoading ? (
                <>
                  <div className="button-spinner"></div>
                  Adding Faculty...
                </>
              ) : (
                <>
                  <span className="button-icon">🎓</span>
                  Add Faculty
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
                placeholder="Search faculties by name, description, dean, or institution..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Filter by Institution:</label>
              <select 
                value={filterInstitution}
                onChange={(e) => setFilterInstitution(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Institutions</option>
                {institutions.map(inst => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Faculties List */}
          <div className="faculties-section">
            <div className="section-header">
              <h2>
                {filterInstitution === "all" ? "All Faculties" : "Filtered Faculties"}
                <span className="results-count"> ({filteredFaculties.length})</span>
              </h2>
              
              {filteredFaculties.length > 0 && (
                <div className="faculties-summary">
                  Showing faculties from {[...new Set(filteredFaculties.map(f => f.institutionName))].length} institutions
                </div>
              )}
            </div>

            {filteredFaculties.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  {searchTerm || filterInstitution !== "all" ? "🔍" : "🎓"}
                </div>
                <h3>
                  {searchTerm || filterInstitution !== "all" 
                    ? "No Faculties Found" 
                    : "No Faculties Added Yet"}
                </h3>
                <p>
                  {searchTerm || filterInstitution !== "all"
                    ? "No faculties match your current filters. Try adjusting your search criteria."
                    : "Start by adding the first faculty to the platform."
                  }
                </p>
                {(searchTerm || filterInstitution !== "all") && (
                  <button 
                    className="btn-secondary"
                    onClick={() => {
                      setSearchTerm("");
                      setFilterInstitution("all");
                    }}
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="faculties-grid">
                {filteredFaculties.map(faculty => (
                  <FacultyCard key={faculty.id} faculty={faculty} />
                ))}
              </div>
            )}
          </div>

          {/* Academic Structure Insights */}
          <div className="insights-section">
            <h3>🏛️ Academic Structure Insights</h3>
            <div className="insights-grid">
              <div className="insight-card">
                <div className="insight-icon">📈</div>
                <div className="insight-content">
                  <h4>Institutional Coverage</h4>
                  <p>Faculties span across {stats.byInstitution} institutions</p>
                </div>
              </div>
              <div className="insight-card">
                <div className="insight-icon">📚</div>
                <div className="insight-content">
                  <h4>Course Distribution</h4>
                  <p>Average {stats.averageCourses} courses per faculty</p>
                </div>
              </div>
              <div className="insight-card">
                <div className="insight-icon">🎯</div>
                <div className="insight-content">
                  <h4>Academic Diversity</h4>
                  <p>Comprehensive faculty structure for student development</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .manage-faculties-container {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .manage-faculties-main {
          flex: 1;
          padding: 30px;
          margin-left: 280px;
        }

        .faculties-header {
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

        .stat-item.total {
          border-left: 4px solid #7c3aed;
        }

        .stat-item.institutions {
          border-left: 4px solid #3b82f6;
        }

        .stat-item.courses {
          border-left: 4px solid #10b981;
        }

        .stat-item.average {
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

        .add-faculty-section {
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
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-label {
          font-weight: 600;
          font-size: 0.9rem;
          color: #374151;
          margin-bottom: 8px;
          display: block;
        }

        .form-input, .form-select, .form-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .form-input:focus, .form-select:focus, .form-textarea:focus {
          outline: none;
          border-color: #7c3aed;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .add-button {
          width: 100%;
          padding: 16px 24px;
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
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
          box-shadow: 0 8px 25px rgba(124, 58, 237, 0.3);
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
          border-color: #7c3aed;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
        }

        .filter-group {
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

        .faculties-section {
          background: white;
          border-radius: 20px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .results-count {
          color: #7c3aed;
          font-weight: 600;
        }

        .faculties-summary {
          background: #faf5ff;
          color: #7c3aed;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .faculties-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .faculty-card {
          border: 2px solid #f1f5f9;
          border-radius: 15px;
          padding: 25px;
          transition: all 0.3s ease;
          background: white;
        }

        .faculty-card:hover {
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

        .faculty-info {
          display: flex;
          gap: 15px;
          align-items: flex-start;
        }

        .faculty-avatar {
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

        .faculty-details {
          flex: 1;
        }

        .faculty-name {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .faculty-description {
          color: #6b7280;
          font-size: 0.9rem;
          margin-bottom: 12px;
          line-height: 1.4;
        }

        .faculty-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
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

        .faculty-stats {
          display: flex;
          gap: 20px;
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

        .courses-preview {
          background: #faf5ff;
          border-radius: 10px;
          padding: 15px;
          margin-bottom: 15px;
        }

        .courses-preview h4 {
          font-size: 0.9rem;
          font-weight: 600;
          color: #7c3aed;
          margin-bottom: 8px;
        }

        .courses-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .course-tag {
          background: white;
          border: 1px solid #e9d5ff;
          border-radius: 6px;
          padding: 4px 8px;
          font-size: 0.75rem;
          color: #7c3aed;
          font-weight: 500;
        }

        .more-courses {
          color: #6b7280;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .action-section {
          border-top: 1px solid #e5e7eb;
          padding-top: 20px;
        }

        .faculty-actions {
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

        .action-btn.view {
          background-color: transparent;
          border-color: #3b82f6;
          color: #3b82f6;
        }

        .action-btn.view:hover {
          background-color: #3b82f6;
          color: white;
        }

        .action-btn.edit {
          background-color: transparent;
          border-color: #f59e0b;
          color: #f59e0b;
        }

        .action-btn.edit:hover {
          background-color: #f59e0b;
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
          .manage-faculties-main {
            margin-left: 0;
            padding: 20px;
          }
          
          .header-content {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }

        @media (max-width: 768px) {
          .faculties-header {
            padding: 25px;
          }
          
          .header-text h1 {
            font-size: 2rem;
          }
          
          .card-header {
            flex-direction: column;
            gap: 15px;
          }
          
          .faculty-stats {
            justify-content: flex-start;
          }
          
          .faculty-actions {
            justify-content: center;
          }
          
          .section-header {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }
        }

        @media (max-width: 480px) {
          .manage-faculties-main {
            padding: 15px;
          }
          
          .faculties-header {
            padding: 20px;
          }
          
          .header-text h1 {
            font-size: 1.75rem;
          }
          
          .faculties-section {
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