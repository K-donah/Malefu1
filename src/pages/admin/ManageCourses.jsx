import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useAppData } from "../../context/ApplicationContext";

export default function ManageCourses() {
  const { courses, addCourse, deleteCourse, faculties, institutions } = useAppData();
  const [title, setTitle] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [description, setDescription] = useState("");
  const [credits, setCredits] = useState("");
  const [duration, setDuration] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFaculty, setFilterFaculty] = useState("all");
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
    if (!title || !facultyId) {
      alert("Please select faculty and enter course title");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const fac = faculties.find(f => f.id === facultyId);
      const instId = fac?.institutionId || null;
      const instName = institutions.find(i => i.id === instId)?.name || "";
      
      addCourse({
        id: `course_${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        credits: credits || "Not specified",
        duration: duration || "Not specified",
        facultyId,
        facultyName: fac?.name || "",
        institutionId: instId,
        institutionName: instName,
        createdAt: new Date().toISOString(),
        students: 0,
        applications: 0
      });
      
      setTitle("");
      setFacultyId("");
      setDescription("");
      setCredits("");
      setDuration("");
    } catch (error) {
      alert("Failed to add course");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
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

  const filteredCourses = courses.filter(course => {
    const matchesFaculty = filterFaculty === "all" || course.facultyId === filterFaculty;
    const matchesInstitution = filterInstitution === "all" || course.institutionId === filterInstitution;
    const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.facultyName?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFaculty && matchesInstitution && matchesSearch;
  });

  const uniqueInstitutions = [...new Set(courses.map(course => course.institutionId))]
    .map(id => institutions.find(inst => inst.id === id))
    .filter(Boolean);

  const CourseCard = ({ course }) => (
    <div className="course-card">
      <div className="card-header">
        <div className="course-info">
          <div className="course-avatar">
            {course.title?.charAt(0).toUpperCase() || "C"}
          </div>
          <div className="course-details">
            <h3 className="course-title">{course.title}</h3>
            <p className="course-description">{course.description || "No description provided"}</p>
            <div className="course-meta">
              <span className="meta-item">
                <span className="meta-icon">🏛️</span>
                {course.facultyName}
              </span>
              <span className="meta-item">
                <span className="meta-icon">🎓</span>
                {course.institutionName}
              </span>
              <span className="meta-item">
                <span className="meta-icon">⏱️</span>
                {course.duration}
              </span>
              <span className="meta-item">
                <span className="meta-icon">📊</span>
                {course.credits} credits
              </span>
            </div>
          </div>
        </div>
        <div className="course-stats">
          <div className="stat">
            <span className="stat-number">{course.students || 0}</span>
            <span className="stat-label">Students</span>
          </div>
          <div className="stat">
            <span className="stat-number">{course.applications || 0}</span>
            <span className="stat-label">Applications</span>
          </div>
        </div>
      </div>

      <div className="action-section">
        <div className="course-actions">
          <button className="action-btn view">
            <span className="btn-icon">👀</span>
            View Details
          </button>
          <button className="action-btn edit">
            <span className="btn-icon">✏️</span>
            Edit Course
          </button>
          <button
            onClick={() => handleDelete(course.id)}
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
    </div>
  );

  const stats = {
    total: courses.length,
    byInstitution: uniqueInstitutions.length,
    averageStudents: courses.length > 0 ? Math.round(courses.reduce((sum, course) => sum + (course.students || 0), 0) / courses.length) : 0,
    totalApplications: courses.reduce((sum, course) => sum + (course.applications || 0), 0)
  };

  return (
    <>
      <Navbar />
      <div className="manage-courses-container">
        <Sidebar links={adminLinks} />
        
        <main className="manage-courses-main">
          {/* Header Section */}
          <div className="courses-header">
            <div className="header-content">
              <div className="header-text">
                <h1>Manage Courses</h1>
                <p>Oversee academic courses across all institutions and faculties</p>
              </div>
              <div className="header-stats">
                <div className="stat-card">
                  <div className="stat-icon">📚</div>
                  <div className="stat-info">
                    <span className="stat-number">{stats.total}</span>
                    <span className="stat-label">Total Courses</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Overview */}
          <div className="stats-overview">
            <div className="stat-item total">
              <div className="stat-icon">📚</div>
              <div className="stat-content">
                <span className="stat-value">{stats.total}</span>
                <span className="stat-label">Courses</span>
              </div>
            </div>
            <div className="stat-item institutions">
              <div className="stat-icon">🏛️</div>
              <div className="stat-content">
                <span className="stat-value">{stats.byInstitution}</span>
                <span className="stat-label">Institutions</span>
              </div>
            </div>
            <div className="stat-item students">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <span className="stat-value">{stats.averageStudents}</span>
                <span className="stat-label">Avg. Students</span>
              </div>
            </div>
            <div className="stat-item applications">
              <div className="stat-icon">📝</div>
              <div className="stat-content">
                <span className="stat-value">{stats.totalApplications}</span>
                <span className="stat-label">Applications</span>
              </div>
            </div>
          </div>

          {/* Add Course Form */}
          <div className="add-course-section">
            <div className="section-header">
              <h2>➕ Add New Course</h2>
              <p>Create a new academic course for student enrollment</p>
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">📚 Course Title *</label>
                <input
                  type="text"
                  placeholder="Enter course title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">🏛️ Faculty *</label>
                <select
                  value={facultyId}
                  onChange={(e) => setFacultyId(e.target.value)}
                  className="form-select"
                >
                  <option value="">Select Faculty</option>
                  {faculties.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} — {institutions.find((i) => i.id === f.institutionId)?.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">⏱️ Duration</label>
                <input
                  type="text"
                  placeholder="e.g., 4 years, 2 semesters"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">📊 Credits</label>
                <input
                  type="text"
                  placeholder="e.g., 3 credits, 120 ECTS"
                  value={credits}
                  onChange={(e) => setCredits(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label className="form-label">📝 Course Description</label>
              <textarea
                placeholder="Describe the course content, objectives, and learning outcomes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className="form-textarea"
              />
            </div>
            
            <button 
              className={`add-button ${isLoading ? "loading" : ""}`}
              onClick={handleAdd}
              disabled={isLoading || !title.trim() || !facultyId}
            >
              {isLoading ? (
                <>
                  <div className="button-spinner"></div>
                  Adding Course...
                </>
              ) : (
                <>
                  <span className="button-icon">📚</span>
                  Add Course
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
                placeholder="Search courses by title, description, or faculty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-row">
              <div className="filter-item">
                <label className="filter-label">Filter by Faculty:</label>
                <select 
                  value={filterFaculty}
                  onChange={(e) => setFilterFaculty(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Faculties</option>
                  {faculties.map(faculty => (
                    <option key={faculty.id} value={faculty.id}>
                      {faculty.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-item">
                <label className="filter-label">Filter by Institution:</label>
                <select 
                  value={filterInstitution}
                  onChange={(e) => setFilterInstitution(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Institutions</option>
                  {uniqueInstitutions.map(inst => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Courses List */}
          <div className="courses-section">
            <div className="section-header">
              <h2>
                {filterFaculty === "all" && filterInstitution === "all" ? "All Courses" : 
                 "Filtered Courses"}
                <span className="results-count"> ({filteredCourses.length})</span>
              </h2>
              
              {filteredCourses.length > 0 && (
                <div className="courses-summary">
                  Showing courses from {[...new Set(filteredCourses.map(c => c.institutionName))].length} institutions
                </div>
              )}
            </div>

            {filteredCourses.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  {searchTerm || filterFaculty !== "all" || filterInstitution !== "all" ? "🔍" : "📚"}
                </div>
                <h3>
                  {searchTerm || filterFaculty !== "all" || filterInstitution !== "all" 
                    ? "No Courses Found" 
                    : "No Courses Added Yet"}
                </h3>
                <p>
                  {searchTerm || filterFaculty !== "all" || filterInstitution !== "all"
                    ? "No courses match your current filters. Try adjusting your search criteria."
                    : "Start by adding the first course to the platform."
                  }
                </p>
                {(searchTerm || filterFaculty !== "all" || filterInstitution !== "all") && (
                  <button 
                    className="btn-secondary"
                    onClick={() => {
                      setSearchTerm("");
                      setFilterFaculty("all");
                      setFilterInstitution("all");
                    }}
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="courses-grid">
                {filteredCourses.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </div>

          {/* Academic Insights */}
          <div className="insights-section">
            <h3>🎯 Academic Insights</h3>
            <div className="insights-grid">
              <div className="insight-card">
                <div className="insight-icon">📈</div>
                <div className="insight-content">
                  <h4>Course Diversity</h4>
                  <p>Courses span across {uniqueInstitutions.length} institutions</p>
                </div>
              </div>
              <div className="insight-card">
                <div className="insight-icon">👥</div>
                <div className="insight-content">
                  <h4>Student Engagement</h4>
                  <p>Average {stats.averageStudents} students per course</p>
                </div>
              </div>
              <div className="insight-card">
                <div className="insight-icon">🎓</div>
                <div className="insight-content">
                  <h4>Academic Reach</h4>
                  <p>Comprehensive course catalog for student development</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .manage-courses-container {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .manage-courses-main {
          flex: 1;
          padding: 30px;
          margin-left: 280px;
        }

        .courses-header {
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
          border-left: 4px solid #059669;
        }

        .stat-item.institutions {
          border-left: 4px solid #3b82f6;
        }

        .stat-item.students {
          border-left: 4px solid #8b5cf6;
        }

        .stat-item.applications {
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

        .add-course-section {
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
          border-color: #059669;
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .add-button {
          width: 100%;
          padding: 16px 24px;
          background: linear-gradient(135deg, #059669, #047857);
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
          box-shadow: 0 8px 25px rgba(5, 150, 105, 0.3);
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

        .courses-section {
          background: white;
          border-radius: 20px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .results-count {
          color: #059669;
          font-weight: 600;
        }

        .courses-summary {
          background: #f0fdf4;
          color: #065f46;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .courses-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .course-card {
          border: 2px solid #f1f5f9;
          border-radius: 15px;
          padding: 25px;
          transition: all 0.3s ease;
          background: white;
        }

        .course-card:hover {
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

        .course-info {
          display: flex;
          gap: 15px;
          align-items: flex-start;
        }

        .course-avatar {
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

        .course-details {
          flex: 1;
        }

        .course-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .course-description {
          color: #6b7280;
          font-size: 0.9rem;
          margin-bottom: 12px;
          line-height: 1.4;
        }

        .course-meta {
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

        .course-stats {
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

        .action-section {
          border-top: 1px solid #e5e7eb;
          padding-top: 20px;
        }

        .course-actions {
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
          .manage-courses-main {
            margin-left: 0;
            padding: 20px;
          }
          
          .header-content {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }

        @media (max-width: 768px) {
          .courses-header {
            padding: 25px;
          }
          
          .header-text h1 {
            font-size: 2rem;
          }
          
          .card-header {
            flex-direction: column;
            gap: 15px;
          }
          
          .course-stats {
            justify-content: flex-start;
          }
          
          .course-actions {
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
          .manage-courses-main {
            padding: 15px;
          }
          
          .courses-header {
            padding: 20px;
          }
          
          .header-text h1 {
            font-size: 1.75rem;
          }
          
          .courses-section {
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