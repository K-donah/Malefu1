import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useAppData } from "../../context/ApplicationContext";
import { useAuth } from "../../context/AuthContext";

export default function ManageFaculties() {
  const { faculties, addFaculty, deleteFaculty, courses } = useAppData();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dean, setDean] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const sidebarLinks = [
    { to: "/institute/profile", label: "Manage Profile" },
    { to: "/institute/faculties", label: "Faculties" },
    { to: "/institute/courses", label: "Courses" },
    { to: "/institute/applications", label: "Student Applications" },
  ];

  const myFaculties = faculties.filter(f => f.institutionId === user.id.toString());

  const getFacultyIcon = (facultyName) => {
    const icons = {
      "engineering": "⚙️",
      "science": "🔬",
      "medicine": "🏥",
      "business": "💼",
      "arts": "🎨",
      "law": "⚖️",
      "education": "👨‍🏫",
      "technology": "💻"
    };
    
    const lowerName = facultyName.toLowerCase();
    for (const [key, icon] of Object.entries(icons)) {
      if (lowerName.includes(key)) return icon;
    }
    return "🏛️";
  };

  const getCourseCount = (facultyId) => {
    return courses.filter(c => c.facultyId === facultyId).length;
  };

  const handleAdd = async () => {
    if (!name.trim()) return alert("Please enter faculty name");

    setIsAdding(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addFaculty({
        id: `fac_${Date.now()}`,
        name: name.trim(),
        institutionId: user.id.toString(),
        description: description.trim(),
        dean: dean.trim(),
        createdAt: new Date().toISOString()
      });

      setName("");
      setDescription("");
      setDean("");
      alert("🎉 Faculty added successfully!");
    } catch (error) {
      alert("❌ Failed to add faculty. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (facultyId) => {
    const courseCount = getCourseCount(facultyId);
    if (courseCount > 0) {
      alert(`Cannot delete faculty. There are ${courseCount} course(s) associated with this faculty.`);
      return;
    }

    if (window.confirm("Are you sure you want to delete this faculty? This action cannot be undone.")) {
      await deleteFaculty(facultyId);
      alert("Faculty deleted successfully");
    }
  };

  const FacultyCard = ({ faculty }) => {
    const courseCount = getCourseCount(faculty.id);
    
    return (
      <div className="faculty-card">
        <div className="faculty-header">
          <div className="faculty-icon">
            {getFacultyIcon(faculty.name)}
          </div>
          <div className="faculty-info">
            <h3 className="faculty-name">{faculty.name}</h3>
            {faculty.dean && (
              <p className="faculty-dean">
                <span className="dean-icon">👤</span>
                Dean: {faculty.dean}
              </p>
            )}
            <div className="faculty-meta">
              <span className="meta-item">
                <span className="meta-icon">📚</span>
                {courseCount} course{courseCount !== 1 ? 's' : ''}
              </span>
              <span className="meta-item">
                <span className="meta-icon">📅</span>
                Added {new Date(faculty.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="faculty-actions">
            <button className="action-btn edit" title="Edit Faculty">
              ✏️
            </button>
            <button 
              className={`action-btn delete ${courseCount > 0 ? 'disabled' : ''}`}
              title={courseCount > 0 ? "Cannot delete - has courses" : "Delete Faculty"}
              onClick={() => courseCount === 0 && handleDelete(faculty.id)}
              disabled={courseCount > 0}
            >
              🗑️
            </button>
          </div>
        </div>
        
        {faculty.description && (
          <div className="faculty-description">
            <p>{faculty.description}</p>
          </div>
        )}

        {courseCount > 0 && (
          <div className="faculty-warning">
            <span className="warning-icon">⚠️</span>
            This faculty has {courseCount} course{courseCount !== 1 ? 's' : ''}. Remove all courses before deleting.
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="faculties-container">
        <Sidebar links={sidebarLinks} />
        
        <main className="faculties-main">
          {/* Header Section */}
          <div className="faculties-header">
            <div className="header-content">
              <div className="header-text">
                <h1>Manage Faculties</h1>
                <p>Organize your institution's academic departments and faculties</p>
              </div>
              <div className="header-stats">
                <div className="stat-card">
                  <div className="stat-icon">🏛️</div>
                  <div className="stat-info">
                    <span className="stat-number">{myFaculties.length}</span>
                    <span className="stat-label">Total Faculties</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add Faculty Section */}
          <div className="add-faculty-section">
            <div className="add-faculty-card">
              <div className="card-header">
                <h2>Add New Faculty</h2>
                <p>Create a new academic department for your institution</p>
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">🏛️</span>
                    Faculty Name *
                  </label>
                  <input
                    placeholder="e.g., Faculty of Engineering, School of Business"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">👤</span>
                    Dean Name
                  </label>
                  <input
                    placeholder="Name of faculty dean"
                    value={dean}
                    onChange={e => setDean(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">
                    <span className="label-icon">📄</span>
                    Description
                  </label>
                  <textarea
                    placeholder="Describe the faculty, its focus areas, and key programs..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="form-textarea"
                    rows="3"
                  />
                  <div className="char-count">{description.length}/300 characters</div>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  className="add-faculty-btn"
                  onClick={handleAdd}
                  disabled={!name.trim() || isAdding}
                >
                  {isAdding ? (
                    <>
                      <div className="spinner"></div>
                      Adding Faculty...
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">➕</span>
                      Add Faculty
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Faculties List Section */}
          <div className="faculties-section">
            <div className="section-header">
              <h2>Your Faculties</h2>
              <p>{myFaculties.length} facult{myFaculties.length !== 1 ? 'ies' : 'y'} in your institution</p>
            </div>

            {myFaculties.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🏛️</div>
                <h3>No faculties added yet</h3>
                <p>Start by adding your first faculty above. Faculties help organize your courses and programs.</p>
                <div className="empty-tips">
                  <h4>💡 Tips for organizing faculties:</h4>
                  <ul>
                    <li>Group related academic disciplines together</li>
                    <li>Consider your institution's organizational structure</li>
                    <li>Plan for future growth and new programs</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="faculties-grid">
                {myFaculties.map(faculty => (
                  <FacultyCard key={faculty.id} faculty={faculty} />
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="quick-stats">
            <div className="stat-item">
              <div className="stat-icon">📚</div>
              <div className="stat-text">
                <span className="stat-value">
                  {myFaculties.reduce((total, faculty) => total + getCourseCount(faculty.id), 0)}
                </span>
                <span className="stat-label">Total Courses</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">⚡</div>
              <div className="stat-text">
                <span className="stat-value">
                  {Math.round(myFaculties.reduce((total, faculty) => total + getCourseCount(faculty.id), 0) / Math.max(myFaculties.length, 1))}
                </span>
                <span className="stat-label">Avg Courses/Faculty</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🎯</div>
              <div className="stat-text">
                <span className="stat-value">
                  {myFaculties.filter(faculty => getCourseCount(faculty.id) > 0).length}
                </span>
                <span className="stat-label">Active Faculties</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .faculties-container {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .faculties-main {
          flex: 1;
          padding: 30px;
          margin-left: 280px;
        }

        .faculties-header {
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

        .add-faculty-section {
          margin-bottom: 30px;
        }

        .add-faculty-card {
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

        .form-input, .form-textarea {
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
          font-family: inherit;
        }

        .form-input:focus, .form-textarea:focus {
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

        .add-faculty-btn {
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

        .add-faculty-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
        }

        .add-faculty-btn:disabled {
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

        .faculties-section {
          background: white;
          border-radius: 20px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
        }

        .section-header {
          margin-bottom: 25px;
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

        .faculties-grid {
          display: grid;
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
          border-color: #667eea;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .faculty-header {
          display: flex;
          gap: 20px;
          margin-bottom: 15px;
        }

        .faculty-icon {
          font-size: 2.5rem;
          flex-shrink: 0;
        }

        .faculty-info {
          flex: 1;
        }

        .faculty-name {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 5px;
        }

        .faculty-dean {
          font-size: 0.9rem;
          color: #667eea;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .dean-icon {
          font-size: 0.9rem;
        }

        .faculty-meta {
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

        .faculty-actions {
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

        .action-btn.delete:hover:not(.disabled) {
          background: #fef2f2;
        }

        .action-btn.disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .faculty-description {
          border-top: 1px solid #e5e7eb;
          padding-top: 15px;
          margin-bottom: 10px;
        }

        .faculty-description p {
          color: #6b7280;
          line-height: 1.5;
          font-size: 0.9rem;
        }

        .faculty-warning {
          background: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 8px;
          padding: 10px 15px;
          font-size: 0.8rem;
          color: #92400e;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .warning-icon {
          font-size: 1rem;
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
          margin-bottom: 25px;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }

        .empty-tips {
          background: #f8fafc;
          border-radius: 12px;
          padding: 20px;
          text-align: left;
          max-width: 500px;
          margin: 0 auto;
        }

        .empty-tips h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 10px;
        }

        .empty-tips ul {
          margin: 0;
          padding-left: 20px;
          color: #6b7280;
          font-size: 0.9rem;
        }

        .empty-tips li {
          margin-bottom: 5px;
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
          .faculties-main {
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
          .faculties-header {
            padding: 25px;
          }
          
          .header-text h1 {
            font-size: 2rem;
          }
          
          .faculty-header {
            flex-direction: column;
            gap: 15px;
          }
          
          .faculty-actions {
            align-self: flex-end;
          }
        }

        @media (max-width: 480px) {
          .faculties-main {
            padding: 15px;
          }
          
          .faculties-header {
            padding: 20px;
          }
          
          .header-text h1 {
            font-size: 1.75rem;
          }
          
          .add-faculty-card, .faculties-section {
            padding: 20px;
          }
        }
      `}</style>
    </>
  );
}