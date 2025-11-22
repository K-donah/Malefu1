import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useAppData } from "../../context/ApplicationContext";

export default function ManageInstitutions() {
  const { institutions, addInstitution, updateInstitution, deleteInstitution, faculties, addFaculty, deleteFaculty, courses, addCourse, deleteCourse } = useAppData();

  // Local states
  const [institutionName, setInstitutionName] = useState("");
  const [institutionEmail, setInstitutionEmail] = useState("");
  const [institutionLocation, setInstitutionLocation] = useState("");
  const [facultyName, setFacultyName] = useState("");
  const [facultyDescription, setFacultyDescription] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
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

  // Add new institution
  const handleAddInstitution = async () => {
    if (!institutionName.trim()) {
      alert("Please enter institution name");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      addInstitution({
        id: `inst_${Date.now()}`,
        name: institutionName.trim(),
        email: institutionEmail.trim(),
        location: institutionLocation.trim(),
        status: "approved",
        createdAt: new Date().toISOString(),
        faculties: 0,
        courses: 0,
        students: 0
      });
      setInstitutionName("");
      setInstitutionEmail("");
      setInstitutionLocation("");
    } catch (error) {
      alert("Failed to add institution");
    } finally {
      setIsLoading(false);
    }
  };

  // Add faculty under selected institution
  const handleAddFaculty = async () => {
    if (!selectedInstitution) {
      alert("Please select an institution first");
      return;
    }
    if (!facultyName.trim()) {
      alert("Please enter faculty name");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      addFaculty({
        id: `fac_${Date.now()}`,
        name: facultyName.trim(),
        description: facultyDescription.trim(),
        institutionId: selectedInstitution.id,
        institutionName: selectedInstitution.name,
        createdAt: new Date().toISOString(),
        courses: 0,
        students: 0
      });
      setFacultyName("");
      setFacultyDescription("");
    } catch (error) {
      alert("Failed to add faculty");
    } finally {
      setIsLoading(false);
    }
  };

  // Add course under selected faculty
  const handleAddCourse = async () => {
    if (!selectedFaculty) {
      alert("Please select a faculty first");
      return;
    }
    if (!courseTitle.trim()) {
      alert("Please enter course title");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      addCourse({
        id: `course_${Date.now()}`,
        title: courseTitle.trim(),
        description: courseDescription.trim(),
        facultyId: selectedFaculty.id,
        facultyName: selectedFaculty.name,
        institutionId: selectedFaculty.institutionId,
        institutionName: selectedInstitution?.name || "",
        createdAt: new Date().toISOString(),
        students: 0,
        applications: 0
      });
      setCourseTitle("");
      setCourseDescription("");
    } catch (error) {
      alert("Failed to add course");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteInstitution = async (institutionId) => {
    setActionLoading(institutionId);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      deleteInstitution(institutionId);
      if (selectedInstitution?.id === institutionId) {
        setSelectedInstitution(null);
        setSelectedFaculty(null);
      }
    } catch (error) {
      alert("Failed to delete institution");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteFaculty = async (facultyId) => {
    setActionLoading(facultyId);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      deleteFaculty(facultyId);
      if (selectedFaculty?.id === facultyId) {
        setSelectedFaculty(null);
      }
    } catch (error) {
      alert("Failed to delete faculty");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    setActionLoading(courseId);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      deleteCourse(courseId);
    } catch (error) {
      alert("Failed to delete course");
    } finally {
      setActionLoading(null);
    }
  };

  // Filtered data
  const filteredInstitutions = institutions.filter(inst => {
    const matchesStatus = filterStatus === "all" || inst.status === filterStatus;
    const matchesSearch = inst.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inst.location?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const facultiesForInstitution = faculties.filter(f => f.institutionId === selectedInstitution?.id);
  const coursesForFaculty = courses.filter(c => c.facultyId === selectedFaculty?.id);

  const getStatusIcon = (status) => {
    const icons = {
      "approved": "✅",
      "pending": "⏳",
      "suspended": "⏸️"
    };
    return icons[status] || "📊";
  };

  const getStatusColor = (status) => {
    const colors = {
      "approved": "#10b981",
      "pending": "#f59e0b",
      "suspended": "#ef4444"
    };
    return colors[status] || "#6b7280";
  };

  const InstitutionCard = ({ institution }) => {
    const institutionFaculties = faculties.filter(f => f.institutionId === institution.id);
    const institutionCourses = courses.filter(c => c.institutionId === institution.id);

    return (
      <div className="institution-card">
        <div className="card-header">
          <div className="institution-info">
            <div className="institution-avatar">
              {institution.name?.charAt(0).toUpperCase() || "I"}
            </div>
            <div className="institution-details">
              <h3 className="institution-name">{institution.name}</h3>
              <div className="institution-meta">
                {institution.location && (
                  <span className="meta-item">
                    <span className="meta-icon">📍</span>
                    {institution.location}
                  </span>
                )}
                {institution.email && (
                  <span className="meta-item">
                    <span className="meta-icon">📧</span>
                    {institution.email}
                  </span>
                )}
                <span className="meta-item">
                  <span className="meta-icon">📅</span>
                  Created {new Date(institution.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="status-section">
            <div 
              className="status-badge"
              style={{ backgroundColor: getStatusColor(institution.status) }}
            >
              <span className="status-icon">{getStatusIcon(institution.status)}</span>
              {institution.status.charAt(0).toUpperCase() + institution.status.slice(1)}
            </div>
            <div className="institution-stats">
              <div className="stat">
                <span className="stat-number">{institutionFaculties.length}</span>
                <span className="stat-label">Faculties</span>
              </div>
              <div className="stat">
                <span className="stat-number">{institutionCourses.length}</span>
                <span className="stat-label">Courses</span>
              </div>
            </div>
          </div>
        </div>

        <div className="action-section">
          <div className="institution-actions">
            <button
              onClick={() => setSelectedInstitution(institution)}
              className="action-btn manage"
            >
              <span className="btn-icon">⚙️</span>
              Manage
            </button>
            {institution.status !== "approved" && (
              <button
                onClick={() => updateInstitution(institution.id, { status: "approved" })}
                className="action-btn approve"
              >
                <span className="btn-icon">✅</span>
                Approve
              </button>
            )}
            {institution.status !== "suspended" && (
              <button
                onClick={() => updateInstitution(institution.id, { status: "suspended" })}
                className="action-btn suspend"
              >
                <span className="btn-icon">⏸️</span>
                Suspend
              </button>
            )}
            <button
              onClick={() => handleDeleteInstitution(institution.id)}
              disabled={actionLoading === institution.id}
              className="action-btn delete"
            >
              {actionLoading === institution.id ? (
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

  const FacultyCard = ({ faculty }) => (
    <div className="faculty-card">
      <div className="faculty-header">
        <div className="faculty-info">
          <div className="faculty-avatar">
            {faculty.name?.charAt(0).toUpperCase() || "F"}
          </div>
          <div className="faculty-details">
            <h4 className="faculty-name">{faculty.name}</h4>
            <p className="faculty-description">{faculty.description || "No description provided"}</p>
          </div>
        </div>
        <div className="faculty-actions">
          <button
            onClick={() => setSelectedFaculty(faculty)}
            className="action-btn manage"
          >
            <span className="btn-icon">📚</span>
            Manage Courses
          </button>
          <button
            onClick={() => handleDeleteFaculty(faculty.id)}
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

  const CourseCard = ({ course }) => (
    <div className="course-card">
      <div className="course-header">
        <div className="course-info">
          <h5 className="course-title">{course.title}</h5>
          <p className="course-description">{course.description || "No description provided"}</p>
        </div>
        <button
          onClick={() => handleDeleteCourse(course.id)}
          disabled={actionLoading === course.id}
          className="action-btn delete"
        >
          {actionLoading === course.id ? (
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
  );

  const stats = {
    total: institutions.length,
    approved: institutions.filter(i => i.status === "approved").length,
    pending: institutions.filter(i => i.status === "pending").length,
    suspended: institutions.filter(i => i.status === "suspended").length,
    totalFaculties: faculties.length,
    totalCourses: courses.length
  };

  return (
    <>
      <Navbar />
      <div className="manage-institutions-container">
        <Sidebar links={adminLinks} />
        
        <main className="manage-institutions-main">
          {/* Header Section */}
          <div className="institutions-header">
            <div className="header-content">
              <div className="header-text">
                <h1>Institution Management</h1>
                <p>Oversee educational institutions, faculties, and academic courses</p>
              </div>
              <div className="header-stats">
                <div className="stat-card">
                  <div className="stat-icon">🏛️</div>
                  <div className="stat-info">
                    <span className="stat-number">{stats.total}</span>
                    <span className="stat-label">Total Institutions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Overview */}
          <div className="stats-overview">
            <div className="stat-item total">
              <div className="stat-icon">🏛️</div>
              <div className="stat-content">
                <span className="stat-value">{stats.total}</span>
                <span className="stat-label">Institutions</span>
              </div>
            </div>
            <div className="stat-item approved">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <span className="stat-value">{stats.approved}</span>
                <span className="stat-label">Approved</span>
              </div>
            </div>
            <div className="stat-item faculties">
              <div className="stat-icon">🎓</div>
              <div className="stat-content">
                <span className="stat-value">{stats.totalFaculties}</span>
                <span className="stat-label">Faculties</span>
              </div>
            </div>
            <div className="stat-item courses">
              <div className="stat-icon">📚</div>
              <div className="stat-content">
                <span className="stat-value">{stats.totalCourses}</span>
                <span className="stat-label">Courses</span>
              </div>
            </div>
          </div>

          {/* Add Institution Form */}
          <div className="add-institution-section">
            <div className="section-header">
              <h2>➕ Add New Institution</h2>
              <p>Register a new educational institution to the platform</p>
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">🏛️ Institution Name *</label>
                <input
                  type="text"
                  placeholder="Enter institution name"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">📧 Email Address</label>
                <input
                  type="email"
                  placeholder="institution@email.com"
                  value={institutionEmail}
                  onChange={(e) => setInstitutionEmail(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">📍 Location</label>
                <input
                  type="text"
                  placeholder="City, Country"
                  value={institutionLocation}
                  onChange={(e) => setInstitutionLocation(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
            
            <button 
              className={`add-button ${isLoading ? "loading" : ""}`}
              onClick={handleAddInstitution}
              disabled={isLoading || !institutionName.trim()}
            >
              {isLoading ? (
                <>
                  <div className="button-spinner"></div>
                  Adding Institution...
                </>
              ) : (
                <>
                  <span className="button-icon">🏛️</span>
                  Add Institution
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
                placeholder="Search institutions by name or location..."
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
                  🌐 All Institutions
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

          {/* Institutions List */}
          <div className="institutions-section">
            <div className="section-header">
              <h2>
                {filterStatus === "all" ? "All Institutions" : 
                 filterStatus === "approved" ? "Approved Institutions" :
                 filterStatus === "pending" ? "Pending Institutions" : "Suspended Institutions"}
                <span className="results-count"> ({filteredInstitutions.length})</span>
              </h2>
              
              {stats.pending > 0 && filterStatus === "all" && (
                <div className="pending-alert">
                  <span className="alert-icon">📢</span>
                  You have {stats.pending} institutions awaiting approval
                </div>
              )}
            </div>

            {filteredInstitutions.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  {searchTerm || filterStatus !== "all" ? "🔍" : "🏛️"}
                </div>
                <h3>
                  {searchTerm || filterStatus !== "all" 
                    ? "No Institutions Found" 
                    : "No Institutions Added Yet"}
                </h3>
                <p>
                  {searchTerm || filterStatus !== "all"
                    ? "No institutions match your current filters. Try adjusting your search criteria."
                    : "Start by adding the first institution to the platform."
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
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="institutions-grid">
                {filteredInstitutions.map(institution => (
                  <InstitutionCard key={institution.id} institution={institution} />
                ))}
              </div>
            )}
          </div>

          {/* Management Panels */}
          {selectedInstitution && (
            <div className="management-panel">
              <div className="panel-header">
                <h2>
                  🎓 Managing: <span className="institution-highlight">{selectedInstitution.name}</span>
                  <button 
                    className="close-panel"
                    onClick={() => {
                      setSelectedInstitution(null);
                      setSelectedFaculty(null);
                    }}
                  >
                    ✕
                  </button>
                </h2>
              </div>

              {/* Add Faculty Section */}
              <div className="add-faculty-section">
                <h3>➕ Add New Faculty</h3>
                <div className="form-grid compact">
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Faculty name"
                      value={facultyName}
                      onChange={(e) => setFacultyName(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Faculty description"
                      value={facultyDescription}
                      onChange={(e) => setFacultyDescription(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <button 
                    className="add-button compact"
                    onClick={handleAddFaculty}
                    disabled={!facultyName.trim()}
                  >
                    <span className="button-icon">🎓</span>
                    Add Faculty
                  </button>
                </div>
              </div>

              {/* Faculties List */}
              <div className="faculties-list">
                <h3>📋 Faculties ({facultiesForInstitution.length})</h3>
                {facultiesForInstitution.length === 0 ? (
                  <div className="empty-state small">
                    <p>No faculties added yet for this institution.</p>
                  </div>
                ) : (
                  <div className="faculties-grid">
                    {facultiesForInstitution.map(faculty => (
                      <FacultyCard key={faculty.id} faculty={faculty} />
                    ))}
                  </div>
                )}
              </div>

              {/* Courses Management */}
              {selectedFaculty && (
                <div className="courses-management">
                  <div className="courses-header">
                    <h3>
                      📚 Managing Courses: <span className="faculty-highlight">{selectedFaculty.name}</span>
                      <button 
                        className="close-panel"
                        onClick={() => setSelectedFaculty(null)}
                      >
                        ✕
                      </button>
                    </h3>
                  </div>

                  {/* Add Course Section */}
                  <div className="add-course-section">
                    <div className="form-grid compact">
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="Course title"
                          value={courseTitle}
                          onChange={(e) => setCourseTitle(e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="Course description"
                          value={courseDescription}
                          onChange={(e) => setCourseDescription(e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <button 
                        className="add-button compact"
                        onClick={handleAddCourse}
                        disabled={!courseTitle.trim()}
                      >
                        <span className="button-icon">📚</span>
                        Add Course
                      </button>
                    </div>
                  </div>

                  {/* Courses List */}
                  <div className="courses-list">
                    <h4>Course Catalog ({coursesForFaculty.length})</h4>
                    {coursesForFaculty.length === 0 ? (
                      <div className="empty-state small">
                        <p>No courses added yet for this faculty.</p>
                      </div>
                    ) : (
                      <div className="courses-grid">
                        {coursesForFaculty.map(course => (
                          <CourseCard key={course.id} course={course} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Educational Insights */}
          <div className="insights-section">
            <h3>🎯 Educational Ecosystem Insights</h3>
            <div className="insights-grid">
              <div className="insight-card">
                <div className="insight-icon">📈</div>
                <div className="insight-content">
                  <h4>Institutional Growth</h4>
                  <p>{stats.total} institutions providing education</p>
                </div>
              </div>
              <div className="insight-card">
                <div className="insight-icon">🏗️</div>
                <div className="insight-content">
                  <h4>Academic Structure</h4>
                  <p>{stats.totalFaculties} faculties across institutions</p>
                </div>
              </div>
              <div className="insight-card">
                <div className="insight-icon">📚</div>
                <div className="insight-content">
                  <h4>Course Diversity</h4>
                  <p>{stats.totalCourses} courses available for students</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .manage-institutions-container {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .manage-institutions-main {
          flex: 1;
          padding: 30px;
          margin-left: 280px;
        }

        .institutions-header {
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

        .stat-item.total {
          border-left: 4px solid #1e40af;
        }

        .stat-item.approved {
          border-left: 4px solid #10b981;
        }

        .stat-item.faculties {
          border-left: 4px solid #7c3aed;
        }

        .stat-item.courses {
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

        .add-institution-section {
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

        .form-grid.compact {
          grid-template-columns: 1fr 1fr auto;
          align-items: end;
        }

        .form-group {
          margin-bottom: 20px;
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

        .add-button.compact {
          padding: 12px 20px;
          font-size: 0.9rem;
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

        .institutions-section {
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

        .institutions-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .institution-card {
          border: 2px solid #f1f5f9;
          border-radius: 15px;
          padding: 25px;
          transition: all 0.3s ease;
          background: white;
        }

        .institution-card:hover {
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

        .institution-info {
          display: flex;
          gap: 15px;
          align-items: flex-start;
        }

        .institution-avatar {
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

        .institution-details {
          flex: 1;
        }

        .institution-name {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .institution-meta {
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

        .institution-stats {
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

        .institution-actions {
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

        .action-btn.manage {
          background-color: #1e40af;
          border-color: #1e40af;
          color: white;
        }

        .action-btn.approve {
          background-color: transparent;
          border-color: #10b981;
          color: #10b981;
        }

        .action-btn.approve:hover {
          background-color: #10b981;
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

        .empty-state.small {
          padding: 30px 20px;
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

        .management-panel {
          background: white;
          border-radius: 20px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border: 2px solid #1e40af;
        }

        .panel-header {
          margin-bottom: 25px;
          padding-bottom: 20px;
          border-bottom: 2px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .panel-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .institution-highlight {
          color: #1e40af;
        }

        .faculty-highlight {
          color: #7c3aed;
        }

        .close-panel {
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 8px 12px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .close-panel:hover {
          background: #dc2626;
          transform: scale(1.05);
        }

        .add-faculty-section, .add-course-section {
          margin-bottom: 25px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 12px;
        }

        .add-faculty-section h3, .courses-header h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 15px;
        }

        .faculties-list, .courses-list {
          margin-top: 20px;
        }

        .faculties-list h3, .courses-list h4 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 15px;
        }

        .faculties-grid, .courses-grid {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .faculty-card, .course-card {
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 15px;
          background: white;
        }

        .faculty-header, .course-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .faculty-info, .course-info {
          flex: 1;
        }

        .faculty-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: white;
          font-size: 1rem;
          margin-right: 12px;
        }

        .faculty-info {
          display: flex;
          align-items: flex-start;
        }

        .faculty-name {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .faculty-description, .course-description {
          color: #6b7280;
          font-size: 0.85rem;
          line-height: 1.4;
        }

        .course-title {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .faculty-actions {
          display: flex;
          gap: 8px;
        }

        .courses-management {
          margin-top: 25px;
          padding: 20px;
          background: #faf5ff;
          border-radius: 12px;
          border: 1px solid #e9d5ff;
        }

        .courses-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
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
          .manage-institutions-main {
            margin-left: 0;
            padding: 20px;
          }
          
          .header-content {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .form-grid.compact {
            grid-template-columns: 1fr;
            gap: 15px;
          }
        }

        @media (max-width: 768px) {
          .institutions-header {
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
          
          .institution-stats {
            justify-content: flex-start;
          }
          
          .institution-actions {
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
          
          .faculty-header, .course-header {
            flex-direction: column;
            gap: 10px;
          }
          
          .faculty-actions {
            align-self: flex-end;
          }
        }

        @media (max-width: 480px) {
          .manage-institutions-main {
            padding: 15px;
          }
          
          .institutions-header {
            padding: 20px;
          }
          
          .header-text h1 {
            font-size: 1.75rem;
          }
          
          .institutions-section {
            padding: 20px;
          }
          
          .management-panel {
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