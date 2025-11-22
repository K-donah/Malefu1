import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useAppData } from "../../context/ApplicationContext";
import { useAuth } from "../../context/AuthContext";

export default function ManageCourses() {
  const { courses, addCourse, deleteCourse, faculties } = useAppData();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const sidebarLinks = [
    { to: "/institute/profile", label: "Manage Profile" },
    { to: "/institute/faculties", label: "Faculties" },
    { to: "/institute/courses", label: "Courses" },
    { to: "/institute/applications", label: "Student Applications" },
  ];

  // Get the institute profile from localStorage
  const instituteProfile =
    JSON.parse(localStorage.getItem(`institute_profile_${user.id}`)) || { name: "" };

  // Only faculties for this institute
  const myFaculties = faculties.filter(f => f.institutionId === user.id.toString());

  // Courses for this institution
  const myCourses = courses.filter(c => c.institutionId === user.id.toString());

  const filteredCourses = activeTab === "all" 
    ? myCourses 
    : myCourses.filter(course => course.facultyId === activeTab);

  const handleAdd = async () => {
    if (!title || !facultyId) return alert("Please fill in all required fields");

    const fac = faculties.find(f => f.id === facultyId);

    setIsAdding(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addCourse({
        id: `course_${Date.now()}`,
        title: title.trim(),
        facultyId,
        facultyName: fac?.name || "",
        institutionId: user.id,
        institutionName: instituteProfile.name,
        description: description.trim(),
        duration: duration.trim(),
        createdAt: new Date().toISOString(),
        studentsEnrolled: 0
      });

      setTitle("");
      setFacultyId("");
      setDescription("");
      setDuration("");
      alert("🎉 Course added successfully!");
    } catch (error) {
      alert("❌ Failed to add course. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      await deleteCourse(courseId);
      alert("Course deleted successfully");
    }
  };

  const CourseCard = ({ course }) => (
    <div className="course-card">
      <div className="course-header">
        <div className="course-icon">📚</div>
        <div className="course-info">
          <h3 className="course-title">{course.title}</h3>
          <p className="course-faculty">{course.facultyName}</p>
          <div className="course-meta">
            {course.duration && (
              <span className="meta-item">
                <span className="meta-icon">⏱️</span>
                {course.duration}
              </span>
            )}
            <span className="meta-item">
              <span className="meta-icon">👥</span>
              {course.studentsEnrolled || 0} students
            </span>
            <span className="meta-item">
              <span className="meta-icon">📅</span>
              Added {new Date(course.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="course-actions">
          <button className="action-btn edit" title="Edit Course">
            ✏️
          </button>
          <button 
            className="action-btn delete" 
            title="Delete Course"
            onClick={() => handleDelete(course.id)}
          >
            🗑️
          </button>
        </div>
      </div>
      
      {course.description && (
        <div className="course-description">
          <p>{course.description}</p>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="courses-container">
        <Sidebar links={sidebarLinks} />
        
        <main className="courses-main">
          {/* Header Section */}
          <div className="courses-header">
            <div className="header-content">
              <div className="header-text">
                <h1>Manage Courses</h1>
                <p>Create and manage academic courses for your institution</p>
              </div>
              <div className="header-stats">
                <div className="stat-card">
                  <div className="stat-icon">📚</div>
                  <div className="stat-info">
                    <span className="stat-number">{myCourses.length}</span>
                    <span className="stat-label">Total Courses</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add Course Section */}
          <div className="add-course-section">
            <div className="add-course-card">
              <div className="card-header">
                <h2>Add New Course</h2>
                <p>Create a new academic course for your institution</p>
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">🏛️</span>
                    Faculty *
                  </label>
                  <select
                    value={facultyId}
                    onChange={e => setFacultyId(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Select Faculty</option>
                    {myFaculties.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">📝</span>
                    Course Title *
                  </label>
                  <input
                    placeholder="e.g., Computer Science, Business Administration"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">⏱️</span>
                    Duration
                  </label>
                  <input
                    placeholder="e.g., 4 years, 2 semesters"
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">
                    <span className="label-icon">📄</span>
                    Description
                  </label>
                  <textarea
                    placeholder="Describe the course content, objectives, and requirements..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="form-textarea"
                    rows="3"
                  />
                  <div className="char-count">{description.length}/500 characters</div>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  className="add-course-btn"
                  onClick={handleAdd}
                  disabled={!title || !facultyId || isAdding}
                >
                  {isAdding ? (
                    <>
                      <div className="spinner"></div>
                      Adding Course...
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">➕</span>
                      Add Course
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Courses List Section */}
          <div className="courses-section">
            <div className="section-header">
              <div className="header-left">
                <h2>Your Courses</h2>
                <p>{filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} available</p>
              </div>
              
              <div className="filter-tabs">
                <button 
                  className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveTab('all')}
                >
                  🌐 All Courses
                </button>
                {myFaculties.map(faculty => (
                  <button 
                    key={faculty.id}
                    className={`filter-tab ${activeTab === faculty.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(faculty.id)}
                  >
                    {faculty.name}
                  </button>
                ))}
              </div>
            </div>

            {filteredCourses.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <h3>No courses found</h3>
                <p>
                  {activeTab === 'all' 
                    ? "You haven't added any courses yet. Start by adding your first course above."
                    : "No courses found in this faculty. Add courses to this faculty to see them here."
                  }
                </p>
              </div>
            ) : (
              <div className="courses-grid">
                {filteredCourses.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="quick-stats">
            <div className="stat-item">
              <div className="stat-icon">🏛️</div>
              <div className="stat-text">
                <span className="stat-value">{myFaculties.length}</span>
                <span className="stat-label">Faculties</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">📊</div>
              <div className="stat-text">
                <span className="stat-value">{myCourses.length}</span>
                <span className="stat-label">Total Courses</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">👥</div>
              <div className="stat-text">
                <span className="stat-value">
                  {myCourses.reduce((total, course) => total + (course.studentsEnrolled || 0), 0)}
                </span>
                <span className="stat-label">Total Students</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .courses-container {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .courses-main {
          flex: 1;
          padding: 30px;
          margin-left: 280px;
        }

        .courses-header {
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

        .add-course-section {
          margin-bottom: 30px;
        }

        .add-course-card {
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
        }

        .card-header {
          margin-bottom: 25px;
        }

        .card-header h2 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .card-header p {
          color: #6b7280;
          font-size: 1rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 25px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #374151;
          font-size: 0.9rem;
        }

        .label-icon {
          font-size: 1rem;
        }

        .form-input, .form-textarea, .form-select {
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
          font-family: inherit;
        }

        .form-input:focus, .form-textarea:focus, .form-select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .char-count {
          text-align: right;
          font-size: 0.8rem;
          color: #6b7280;
          margin-top: 4px;
        }

        .form-actions {
          text-align: center;
        }

        .add-course-btn {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 1rem;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }

        .add-course-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
        }

        .add-course-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .btn-icon {
          font-size: 1.1rem;
        }

        .courses-section {
          background: white;
          border-radius: 20px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 25px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .header-left h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 5px;
        }

        .header-left p {
          color: #6b7280;
          font-size: 0.9rem;
        }

        .filter-tabs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .filter-tab {
          padding: 8px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 20px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .filter-tab:hover {
          border-color: #667eea;
        }

        .filter-tab.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .courses-grid {
          display: grid;
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
          border-color: #667eea;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .course-header {
          display: flex;
          gap: 20px;
          margin-bottom: 15px;
        }

        .course-icon {
          font-size: 2.5rem;
          flex-shrink: 0;
        }

        .course-info {
          flex: 1;
        }

        .course-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 5px;
        }

        .course-faculty {
          font-size: 1rem;
          color: #667eea;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .course-meta {
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

        .course-actions {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }

        .action-btn {
          background: none;
          border: none;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1.1rem;
        }

        .action-btn.edit:hover {
          background: #dbeafe;
        }

        .action-btn.delete:hover {
          background: #fef2f2;
        }

        .course-description {
          border-top: 1px solid #e5e7eb;
          padding-top: 15px;
        }

        .course-description p {
          color: #6b7280;
          line-height: 1.5;
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

        .quick-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px;
          background: white;
          border-radius: 15px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
        }

        .stat-item .stat-icon {
          font-size: 1.5rem;
        }

        .stat-text {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-weight: 700;
          font-size: 1.5rem;
          color: #1f2937;
        }

        .stat-label {
          font-size: 0.8rem;
          color: #6b7280;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 1024px) {
          .courses-main {
            margin-left: 0;
            padding: 20px;
          }
          
          .header-content {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .courses-header {
            padding: 25px;
          }
          
          .header-text h1 {
            font-size: 2rem;
          }
          
          .section-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .filter-tabs {
            width: 100%;
            overflow-x: auto;
            padding-bottom: 10px;
          }
          
          .course-header {
            flex-direction: column;
            gap: 15px;
          }
          
          .course-actions {
            align-self: flex-end;
          }
        }

        @media (max-width: 480px) {
          .courses-main {
            padding: 15px;
          }
          
          .courses-header {
            padding: 20px;
          }
          
          .header-text h1 {
            font-size: 1.75rem;
          }
          
          .add-course-card, .courses-section {
            padding: 20px;
          }
        }
      `}</style>
    </>
  );
}