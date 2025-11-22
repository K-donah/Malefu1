import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useAppData } from "../../context/ApplicationContext";
import { useAuth } from "../../context/AuthContext";

export default function PostJob() {
  const { addJob, jobs } = useAppData();
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [posted, setPosted] = useState(false);
  const [activeTab, setActiveTab] = useState("post");

  const [form, setForm] = useState({
    title: "",
    requirements: "",
    description: "",
    location: "",
    type: "full-time",
    salary: "",
    experience: "mid-level",
    category: "technology",
    applicationDeadline: "",
    skills: ""
  });

  const links = [
    { to: "/company/post-job", label: "Post Job" },
    { to: "/company/applicants", label: "View Applicants" },
    { to: "/company/profile", label: "Update Profile" },
    { to: "/company/settings", label: "Settings" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePost = async () => {
    if (!form.title.trim()) {
      alert("Please enter a job title");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addJob({
        id: `job_${Date.now()}`,
        title: form.title.trim(),
        requirements: form.requirements,
        description: form.description,
        location: form.location,
        type: form.type,
        salary: form.salary,
        experience: form.experience,
        category: form.category,
        skills: form.skills.split(',').map(skill => skill.trim()),
        applicationDeadline: form.applicationDeadline,
        companyId: user.id,
        companyName: user.companyName || user.name,
        status: "open",
        postedAt: new Date().toISOString(),
        applicants: 0
      });

      setForm({
        title: "",
        requirements: "",
        description: "",
        location: "",
        type: "full-time",
        salary: "",
        experience: "mid-level",
        category: "technology",
        applicationDeadline: "",
        skills: ""
      });
      
      setPosted(true);
      setTimeout(() => setPosted(false), 3000);
    } catch (error) {
      alert("Failed to post job");
    } finally {
      setIsLoading(false);
    }
  };

  const myJobs = jobs.filter(j => j.companyId === user.id);
  const activeJobs = myJobs.filter(j => j.status === "open");
  const closedJobs = myJobs.filter(j => j.status === "closed");

  const JobCard = ({ job }) => (
    <div className="job-card">
      <div className="job-header">
        <div className="job-title-section">
          <h3 className="job-title">{job.title}</h3>
          <div className="job-meta">
            <span className="job-type">{job.type}</span>
            <span className="job-experience">{job.experience}</span>
            <span className="job-location">{job.location || "Remote"}</span>
          </div>
        </div>
        <div className="job-status">
          <span className={`status-badge ${job.status}`}>
            {job.status === "open" ? "🟢 Active" : "🔴 Closed"}
          </span>
          <div className="applicant-count">
            <span className="count-number">{job.applicants || 0}</span>
            <span className="count-label">Applicants</span>
          </div>
        </div>
      </div>
      
      <div className="job-details">
        <div className="detail-item">
          <span className="detail-label">📅 Posted:</span>
          <span className="detail-value">{new Date(job.postedAt).toLocaleDateString()}</span>
        </div>
        {job.salary && (
          <div className="detail-item">
            <span className="detail-label">💰 Salary:</span>
            <span className="detail-value">{job.salary}</span>
          </div>
        )}
        {job.applicationDeadline && (
          <div className="detail-item">
            <span className="detail-label">⏰ Deadline:</span>
            <span className="detail-value">{new Date(job.applicationDeadline).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {job.description && (
        <div className="job-description">
          <p>{job.description.length > 120 ? `${job.description.substring(0, 120)}...` : job.description}</p>
        </div>
      )}
    </div>
  );

  const Input = ({ label, name, value, onChange, type = "text", placeholder, icon, required = false }) => (
    <div className="form-group">
      <label className="form-label">
        {icon && <span className="label-icon">{icon}</span>}
        {label}
        {required && <span className="required">*</span>}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="form-input"
        required={required}
      />
    </div>
  );

  const Select = ({ label, name, value, onChange, options, icon, required = false }) => (
    <div className="form-group">
      <label className="form-label">
        {icon && <span className="label-icon">{icon}</span>}
        {label}
        {required && <span className="required">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="form-select"
        required={required}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const TextArea = ({ label, name, value, onChange, placeholder, icon, required = false, rows = 4 }) => (
    <div className="form-group">
      <label className="form-label">
        {icon && <span className="label-icon">{icon}</span>}
        {label}
        {required && <span className="required">*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="form-textarea"
        required={required}
      />
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="post-job-container">
        <Sidebar links={links} />
        
        <main className="post-job-main">
          {/* Header Section */}
          <div className="post-job-header">
            <div className="header-content">
              <div className="header-text">
                <h1>Post a New Job</h1>
                <p>Reach qualified candidates and grow your team</p>
              </div>
              <div className="header-stats">
                <div className="stat-card">
                  <div className="stat-icon">📊</div>
                  <div className="stat-info">
                    <span className="stat-number">{activeJobs.length}</span>
                    <span className="stat-label">Active Jobs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="job-tabs">
            <button 
              className={`tab-button ${activeTab === "post" ? "active" : ""}`}
              onClick={() => setActiveTab("post")}
            >
              <span className="tab-icon">📝</span>
              Post New Job
            </button>
            <button 
              className={`tab-button ${activeTab === "active" ? "active" : ""}`}
              onClick={() => setActiveTab("active")}
            >
              <span className="tab-icon">🟢</span>
              Active Jobs ({activeJobs.length})
            </button>
            <button 
              className={`tab-button ${activeTab === "closed" ? "active" : ""}`}
              onClick={() => setActiveTab("closed")}
            >
              <span className="tab-icon">🔴</span>
              Closed Jobs ({closedJobs.length})
            </button>
          </div>

          {/* Post Job Form */}
          {activeTab === "post" && (
            <div className="post-job-content">
              <div className="form-section">
                <div className="section-header">
                  <h2>📋 Job Details</h2>
                  <p>Provide comprehensive information about the position</p>
                </div>

                <div className="form-grid">
                  <Input
                    label="Job Title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g., Senior Frontend Developer"
                    icon="💼"
                    required
                  />

                  <Select
                    label="Job Type"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    options={[
                      { value: "full-time", label: "Full Time" },
                      { value: "part-time", label: "Part Time" },
                      { value: "contract", label: "Contract" },
                      { value: "internship", label: "Internship" },
                      { value: "remote", label: "Remote" }
                    ]}
                    icon="🕒"
                  />

                  <Select
                    label="Experience Level"
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    options={[
                      { value: "intern", label: "Intern" },
                      { value: "entry-level", label: "Entry Level" },
                      { value: "mid-level", label: "Mid Level" },
                      { value: "senior", label: "Senior" },
                      { value: "lead", label: "Lead" }
                    ]}
                    icon="⭐"
                  />

                  <Input
                    label="Location"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g., New York, NY or Remote"
                    icon="📍"
                  />

                  <Input
                    label="Salary Range"
                    name="salary"
                    value={form.salary}
                    onChange={handleChange}
                    placeholder="e.g., $80,000 - $120,000"
                    icon="💰"
                  />

                  <Select
                    label="Category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    options={[
                      { value: "technology", label: "Technology" },
                      { value: "marketing", label: "Marketing" },
                      { value: "sales", label: "Sales" },
                      { value: "design", label: "Design" },
                      { value: "operations", label: "Operations" },
                      { value: "hr", label: "Human Resources" }
                    ]}
                    icon="📁"
                  />

                  <Input
                    label="Application Deadline"
                    name="applicationDeadline"
                    value={form.applicationDeadline}
                    onChange={handleChange}
                    type="date"
                    icon="⏰"
                  />

                  <Input
                    label="Required Skills"
                    name="skills"
                    value={form.skills}
                    onChange={handleChange}
                    placeholder="e.g., React, Node.js, TypeScript"
                    icon="🛠️"
                  />
                </div>

                <TextArea
                  label="Job Description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the role, responsibilities, and what you're looking for in a candidate..."
                  icon="📄"
                  rows={6}
                />

                <TextArea
                  label="Requirements & Qualifications"
                  name="requirements"
                  value={form.requirements}
                  onChange={handleChange}
                  placeholder="List the required qualifications, skills, and experience..."
                  icon="✅"
                  rows={4}
                />

                <button 
                  className={`post-button ${isLoading ? "loading" : ""} ${posted ? "posted" : ""}`}
                  onClick={handlePost}
                  disabled={isLoading || !form.title.trim()}
                >
                  {isLoading ? (
                    <>
                      <div className="button-spinner"></div>
                      Posting Job...
                    </>
                  ) : posted ? (
                    <>
                      <span className="button-icon">🎉</span>
                      Job Posted Successfully!
                    </>
                  ) : (
                    <>
                      <span className="button-icon">🚀</span>
                      Post Job Opening
                    </>
                  )}
                </button>

                {posted && (
                  <div className="success-message">
                    Your job has been posted successfully! Candidates can now apply.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Active Jobs Tab */}
          {activeTab === "active" && (
            <div className="jobs-list-section">
              <div className="section-header">
                <h2>🟢 Active Job Postings</h2>
                <p>Manage your currently open positions</p>
              </div>

              {activeJobs.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <h3>No Active Jobs</h3>
                  <p>You haven't posted any active job openings yet.</p>
                  <button 
                    className="post-new-button"
                    onClick={() => setActiveTab("post")}
                  >
                    Post Your First Job
                  </button>
                </div>
              ) : (
                <div className="jobs-grid">
                  {activeJobs.map(job => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Closed Jobs Tab */}
          {activeTab === "closed" && (
            <div className="jobs-list-section">
              <div className="section-header">
                <h2>🔴 Closed Job Postings</h2>
                <p>Review your previously filled or closed positions</p>
              </div>

              {closedJobs.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <h3>No Closed Jobs</h3>
                  <p>You haven't closed any job positions yet.</p>
                </div>
              ) : (
                <div className="jobs-grid">
                  {closedJobs.map(job => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quick Tips */}
          <div className="tips-section">
            <h3>💡 Job Posting Tips</h3>
            <div className="tips-grid">
              <div className="tip-card">
                <div className="tip-icon">🎯</div>
                <div className="tip-content">
                  <h4>Be Specific</h4>
                  <p>Clear job titles attract better candidates</p>
                </div>
              </div>
              <div className="tip-card">
                <div className="tip-icon">💰</div>
                <div className="tip-content">
                  <h4>Include Salary</h4>
                  <p>Jobs with salary ranges get 3x more applications</p>
                </div>
              </div>
              <div className="tip-card">
                <div className="tip-icon">📝</div>
                <div className="tip-content">
                  <h4>Detailed Description</h4>
                  <p>Comprehensive descriptions improve candidate quality</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .post-job-container {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .post-job-main {
          flex: 1;
          padding: 30px;
          margin-left: 280px;
        }

        .post-job-header {
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

        .job-tabs {
          display: flex;
          background: white;
          border-radius: 15px;
          padding: 10px;
          margin-bottom: 30px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }

        .tab-button {
          flex: 1;
          padding: 15px 20px;
          border: none;
          background: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #6b7280;
        }

        .tab-button:hover {
          background: #f8fafc;
          color: #374151;
        }

        .tab-button.active {
          background: #4f46e5;
          color: white;
        }

        .tab-icon {
          font-size: 1.1rem;
        }

        .post-job-content {
          background: white;
          border-radius: 20px;
          padding: 40px;
          margin-bottom: 30px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }

        .section-header {
          margin-bottom: 30px;
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
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 25px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          font-weight: 600;
          font-size: 0.9rem;
          color: #374151;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .label-icon {
          font-size: 1rem;
        }

        .required {
          color: #ef4444;
          margin-left: 4px;
        }

        .form-input, .form-select, .form-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          background: white;
        }

        .form-input:focus, .form-select:focus, .form-textarea:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .post-button {
          width: 100%;
          padding: 16px 24px;
          background: linear-gradient(135deg, #059669, #047857);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 20px;
        }

        .post-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(5, 150, 105, 0.3);
        }

        .post-button.loading {
          background: linear-gradient(135deg, #6b7280, #9ca3af);
        }

        .post-button.posted {
          background: linear-gradient(135deg, #10b981, #059669);
        }

        .post-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .button-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .button-icon {
          font-size: 1.2rem;
        }

        .success-message {
          margin-top: 15px;
          padding: 15px;
          background: #d1fae5;
          color: #065f46;
          border-radius: 8px;
          text-align: center;
          font-weight: 500;
        }

        .jobs-list-section {
          background: white;
          border-radius: 20px;
          padding: 40px;
          margin-bottom: 30px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }

        .jobs-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .job-card {
          border: 2px solid #f1f5f9;
          border-radius: 15px;
          padding: 25px;
          transition: all 0.3s ease;
          background: white;
        }

        .job-card:hover {
          border-color: #4f46e5;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .job-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }

        .job-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .job-meta {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .job-type, .job-experience, .job-location {
          padding: 4px 8px;
          background: #f1f5f9;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 500;
          color: #6b7280;
        }

        .job-status {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .status-badge.open {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge.closed {
          background: #fecaca;
          color: #b91c1c;
        }

        .applicant-count {
          text-align: center;
        }

        .count-number {
          font-size: 1.5rem;
          font-weight: 800;
          color: #4f46e5;
          display: block;
          line-height: 1;
        }

        .count-label {
          font-size: 0.7rem;
          color: #6b7280;
          font-weight: 500;
        }

        .job-details {
          display: flex;
          gap: 20px;
          margin-bottom: 15px;
          flex-wrap: wrap;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
        }

        .detail-label {
          font-weight: 600;
          color: #374151;
        }

        .detail-value {
          color: #6b7280;
        }

        .job-description {
          color: #6b7280;
          font-size: 0.9rem;
          line-height: 1.5;
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

        .post-new-button {
          background: #4f46e5;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
          margin-top: 15px;
        }

        .post-new-button:hover {
          background: #4338ca;
          transform: translateY(-2px);
        }

        .tips-section {
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }

        .tips-section h3 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 20px;
        }

        .tips-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .tip-card {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .tip-card:hover {
          background: #f1f5f9;
          transform: translateY(-2px);
        }

        .tip-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .tip-content h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 5px;
        }

        .tip-content p {
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
          .post-job-main {
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
          .post-job-header {
            padding: 25px;
          }
          
          .header-text h1 {
            font-size: 2rem;
          }
          
          .job-tabs {
            flex-direction: column;
          }
          
          .job-header {
            flex-direction: column;
            gap: 15px;
          }
          
          .job-status {
            align-items: flex-start;
          }
        }

        @media (max-width: 480px) {
          .post-job-main {
            padding: 15px;
          }
          
          .post-job-header {
            padding: 20px;
          }
          
          .header-text h1 {
            font-size: 1.75rem;
          }
          
          .tips-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}