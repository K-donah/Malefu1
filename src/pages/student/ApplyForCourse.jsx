import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import { useAppData } from "../../context/ApplicationContext";
import { useAuth } from "../../context/AuthContext";

export default function ApplyForCourse() {
  const { courses, applyForCourse } = useAppData();
  const { user } = useAuth();
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [applicationText, setApplicationText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const availableCourses = courses.filter(
    (course) => course.institutionId && course.facultyName
  );

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  const handleApply = async () => {
    if (!selectedCourse || !applicationText.trim()) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      applyForCourse({
        id: `app_${Date.now()}`,
        studentId: user.id.toString(),
        studentName: user.name,
        courseId: selectedCourseId,
        courseTitle: selectedCourse.title,
        facultyId: selectedCourse.facultyId || "",
        facultyName: selectedCourse.facultyName,
        institutionId: selectedCourse.institutionId,
        institutionName: selectedCourse.institutionName,
        applicationText: applicationText.trim(),
        status: "pending",
        appliedDate: new Date().toISOString(),
      });

      setSelectedCourseId("");
      setApplicationText("");
      setActiveStep(1);
      alert("🎉 Application submitted successfully!");
    } catch (error) {
      alert("❌ Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInstitutionIcon = (institutionName) => {
    const icons = {
      "NUL": "🏛️",
      "LIM": "🎓",
      "Lerotholi": "⚙️",
      "default": "🏫"
    };
    return icons[institutionName] || icons.default;
  };

  const CourseCard = ({ course }) => (
    <div 
      className={`course-card ${selectedCourseId === course.id ? 'selected' : ''}`}
      onClick={() => {
        setSelectedCourseId(course.id);
        setActiveStep(2);
      }}
    >
      <div className="course-icon">
        {getInstitutionIcon(course.institutionName)}
      </div>
      <div className="course-info">
        <h3 className="course-title">{course.title}</h3>
        <p className="course-institution">{course.institutionName}</p>
        <div className="course-meta">
          <span className="meta-item">
            <span className="meta-icon">🎓</span>
            {course.facultyName}
          </span>
          <span className="meta-item">
            <span className="meta-icon">⏱️</span>
            {course.duration || "4 years"}
          </span>
        </div>
      </div>
      <div className="course-arrow">→</div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="apply-container">
        <main className="apply-main">
          {/* Header Section */}
          <div className="apply-header">
            <div className="header-content">
              <div className="header-text">
                <h1>Apply for Courses</h1>
                <p>Take the next step in your academic journey. Apply to your desired programs.</p>
              </div>
              <div className="header-stats">
                <div className="stat-card">
                  <div className="stat-icon">📚</div>
                  <div className="stat-info">
                    <span className="stat-number">{availableCourses.length}</span>
                    <span className="stat-label">Available Courses</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="progress-section">
            <div className="steps">
              <div className={`step ${activeStep >= 1 ? 'active' : ''}`}>
                <div className="step-number">1</div>
                <span className="step-label">Choose Course</span>
              </div>
              <div className="step-connector"></div>
              <div className={`step ${activeStep >= 2 ? 'active' : ''}`}>
                <div className="step-number">2</div>
                <span className="step-label">Write Application</span>
              </div>
              <div className="step-connector"></div>
              <div className={`step ${activeStep >= 3 ? 'active' : ''}`}>
                <div className="step-number">3</div>
                <span className="step-label">Submit</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="apply-content">
            {/* Step 1: Course Selection */}
            {activeStep === 1 && (
              <div className="step-content">
                <div className="step-header">
                  <h2>Select Your Course</h2>
                  <p>Choose from available courses that match your interests</p>
                </div>

                <div className="courses-grid">
                  {availableCourses.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">📚</div>
                      <h3>No courses available</h3>
                      <p>Check back later for new course offerings</p>
                    </div>
                  ) : (
                    availableCourses.map(course => (
                      <CourseCard key={course.id} course={course} />
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Application Form */}
            {activeStep === 2 && selectedCourse && (
              <div className="step-content">
                <div className="step-header">
                  <h2>Complete Your Application</h2>
                  <p>Tell us why you're interested in this course</p>
                </div>

                {/* Selected Course Preview */}
                <div className="selected-course-preview">
                  <div className="preview-header">
                    <div className="preview-icon">
                      {getInstitutionIcon(selectedCourse.institutionName)}
                    </div>
                    <div className="preview-info">
                      <h3>{selectedCourse.title}</h3>
                      <p>{selectedCourse.institutionName} • {selectedCourse.facultyName}</p>
                    </div>
                    <button 
                      className="change-course-btn"
                      onClick={() => setActiveStep(1)}
                    >
                      Change Course
                    </button>
                  </div>
                </div>

                {/* Application Form */}
                <div className="application-form">
                  <div className="form-group">
                    <label className="form-label">
                      <span className="label-icon">💭</span>
                      Motivation Letter
                    </label>
                    <div className="input-wrapper">
                      <textarea
                        placeholder="Tell us about your interest in this course, your background, and why you believe you're a good fit..."
                        value={applicationText}
                        onChange={(e) => setApplicationText(e.target.value)}
                        className="application-textarea"
                        rows="6"
                      />
                      <div className="char-count">
                        {applicationText.length}/500 characters
                      </div>
                    </div>
                    <div className="writing-tips">
                      <h4>💡 Writing Tips:</h4>
                      <ul>
                        <li>Explain your interest in the field</li>
                        <li>Highlight relevant experience or skills</li>
                        <li>Share your career goals</li>
                        <li>Be specific and authentic</li>
                      </ul>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button 
                      className="btn-secondary"
                      onClick={() => setActiveStep(1)}
                    >
                      ← Back to Courses
                    </button>
                    <button 
                      className="btn-primary"
                      onClick={() => setActiveStep(3)}
                      disabled={!applicationText.trim()}
                    >
                      Continue to Review →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review and Submit */}
            {activeStep === 3 && selectedCourse && (
              <div className="step-content">
                <div className="step-header">
                  <h2>Review Your Application</h2>
                  <p>Please review your application before submitting</p>
                </div>

                <div className="review-section">
                  <div className="review-card">
                    <h3>Course Details</h3>
                    <div className="review-item">
                      <span className="review-label">Course:</span>
                      <span className="review-value">{selectedCourse.title}</span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Institution:</span>
                      <span className="review-value">{selectedCourse.institutionName}</span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Faculty:</span>
                      <span className="review-value">{selectedCourse.facultyName}</span>
                    </div>
                  </div>

                  <div className="review-card">
                    <h3>Your Motivation Letter</h3>
                    <div className="motivation-preview">
                      {applicationText}
                    </div>
                  </div>

                  <div className="application-notes">
                    <div className="note-icon">ℹ️</div>
                    <div className="note-content">
                      <h4>Important Notes:</h4>
                      <ul>
                        <li>You can track your application status in the Admissions section</li>
                        <li>Applications are typically processed within 2-3 weeks</li>
                        <li>You'll receive email notifications about your application status</li>
                      </ul>
                    </div>
                  </div>

                  <div className="submit-actions">
                    <button 
                      className="btn-secondary"
                      onClick={() => setActiveStep(2)}
                    >
                      ← Edit Application
                    </button>
                    <button 
                      className="submit-btn"
                      onClick={handleApply}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="spinner"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          🚀 Submit Application
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="quick-stats">
            <div className="stat-item">
              <div className="stat-icon">📋</div>
              <div className="stat-text">
                <span className="stat-value">Easy Application</span>
                <span className="stat-desc">Simple 3-step process</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">⏱️</div>
              <div className="stat-text">
                <span className="stat-value">Quick Processing</span>
                <span className="stat-desc">2-3 week turnaround</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🔔</div>
              <div className="stat-text">
                <span className="stat-value">Instant Updates</span>
                <span className="stat-desc">Real-time status tracking</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .apply-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .apply-main {
          padding: 40px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .apply-header {
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

        .progress-section {
          background: white;
          border-radius: 20px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .steps {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          flex: 1;
        }

        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #f1f5f9;
          color: #6b7280;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .step.active .step-number {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .step-label {
          font-size: 0.8rem;
          color: #6b7280;
          font-weight: 500;
          text-align: center;
        }

        .step.active .step-label {
          color: #667eea;
          font-weight: 600;
        }

        .step-connector {
          flex: 1;
          height: 2px;
          background: #e5e7eb;
          margin: 0 10px;
        }

        .apply-content {
          background: white;
          border-radius: 20px;
          padding: 40px;
          margin-bottom: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .step-content {
          animation: slideIn 0.3s ease;
        }

        .step-header {
          margin-bottom: 30px;
          text-align: center;
        }

        .step-header h2 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .step-header p {
          color: #6b7280;
          font-size: 1rem;
        }

        .courses-grid {
          display: grid;
          gap: 15px;
        }

        .course-card {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 25px;
          border: 2px solid #f1f5f9;
          border-radius: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          background: white;
        }

        .course-card:hover {
          border-color: #667eea;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .course-card.selected {
          border-color: #667eea;
          background: #f0f4ff;
          box-shadow: 0 5px 20px rgba(102, 126, 234, 0.2);
        }

        .course-icon {
          font-size: 2.5rem;
          flex-shrink: 0;
        }

        .course-info {
          flex: 1;
        }

        .course-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 5px;
        }

        .course-institution {
          font-size: 1rem;
          color: #667eea;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .course-meta {
          display: flex;
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

        .course-arrow {
          font-size: 1.5rem;
          color: #667eea;
          transition: transform 0.3s ease;
        }

        .course-card:hover .course-arrow {
          transform: translateX(5px);
        }

        .selected-course-preview {
          background: #f8fafc;
          border-radius: 15px;
          padding: 25px;
          margin-bottom: 30px;
          border: 2px solid #e5e7eb;
        }

        .preview-header {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .preview-icon {
          font-size: 2.5rem;
        }

        .preview-info {
          flex: 1;
        }

        .preview-info h3 {
          font-size: 1.3rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 5px;
        }

        .preview-info p {
          color: #6b7280;
          font-size: 1rem;
        }

        .change-course-btn {
          background: none;
          border: 1px solid #667eea;
          color: #667eea;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .change-course-btn:hover {
          background: #667eea;
          color: white;
        }

        .application-form {
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 25px;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #374151;
          font-size: 1rem;
          margin-bottom: 10px;
        }

        .label-icon {
          font-size: 1.1rem;
        }

        .input-wrapper {
          position: relative;
        }

        .application-textarea {
          width: 100%;
          padding: 15px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          resize: vertical;
          min-height: 150px;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .application-textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .char-count {
          text-align: right;
          font-size: 0.8rem;
          color: #6b7280;
          margin-top: 5px;
        }

        .writing-tips {
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          border-radius: 10px;
          padding: 20px;
          margin-top: 15px;
        }

        .writing-tips h4 {
          font-size: 0.9rem;
          font-weight: 600;
          color: #0369a1;
          margin-bottom: 8px;
        }

        .writing-tips ul {
          margin: 0;
          padding-left: 20px;
          color: #0c4a6e;
          font-size: 0.85rem;
        }

        .writing-tips li {
          margin-bottom: 4px;
        }

        .form-actions {
          display: flex;
          gap: 15px;
          justify-content: space-between;
        }

        .btn-primary, .btn-secondary {
          padding: 12px 24px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          font-size: 1rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
        }

        .review-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .review-card {
          background: #f8fafc;
          border-radius: 15px;
          padding: 25px;
          border: 1px solid #e5e7eb;
        }

        .review-card h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 15px;
        }

        .review-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .review-label {
          font-weight: 500;
          color: #6b7280;
        }

        .review-value {
          font-weight: 600;
          color: #1f2937;
        }

        .motivation-preview {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 15px;
          line-height: 1.5;
          color: #374151;
          white-space: pre-wrap;
        }

        .application-notes {
          display: flex;
          gap: 15px;
          background: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 12px;
          padding: 20px;
        }

        .note-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .note-content h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #92400e;
          margin-bottom: 8px;
        }

        .note-content ul {
          margin: 0;
          padding-left: 20px;
          color: #92400e;
          font-size: 0.9rem;
        }

        .submit-actions {
          display: flex;
          gap: 15px;
          justify-content: space-between;
        }

        .submit-btn {
          padding: 15px 30px;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1rem;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
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
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .stat-item .stat-icon {
          font-size: 1.5rem;
        }

        .stat-text {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-weight: 600;
          font-size: 0.9rem;
        }

        .stat-desc {
          font-size: 0.8rem;
          opacity: 0.8;
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

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .apply-main {
            padding: 20px;
          }
          
          .apply-header {
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
          
          .apply-content {
            padding: 25px;
          }
          
          .steps {
            flex-direction: column;
            gap: 20px;
          }
          
          .step-connector {
            width: 2px;
            height: 20px;
          }
          
          .course-card {
            flex-direction: column;
            text-align: center;
            gap: 15px;
          }
          
          .course-meta {
            justify-content: center;
          }
          
          .form-actions, .submit-actions {
            flex-direction: column;
          }
          
          .quick-stats {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .apply-main {
            padding: 15px;
          }
          
          .apply-header {
            padding: 25px 20px;
          }
          
          .header-text h1 {
            font-size: 1.75rem;
          }
          
          .apply-content {
            padding: 20px;
          }
        }
      `}</style>
    </>
  );
}