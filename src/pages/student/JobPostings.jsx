import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import { useAppData } from "../../context/ApplicationContext";
import { useAuth } from "../../context/AuthContext";

export default function JobPostings() {
  const { jobs, applyForJob } = useAppData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [applyingJob, setApplyingJob] = useState(null);

  const categories = ["all", "technology", "business", "engineering", "healthcare", "education"];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || job.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleApply = async (job) => {
    setApplyingJob(job.id);
    try {
      await applyForJob(user.id, job);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert(`Successfully applied for ${job.title} at ${job.company}!`);
    } catch (error) {
      alert("Failed to apply. Please try again.");
    } finally {
      setApplyingJob(null);
    }
  };

  const getJobIcon = (category) => {
    const icons = {
      technology: "💻",
      business: "💼",
      engineering: "⚙️",
      healthcare: "🏥",
      education: "🎓",
      default: "💼"
    };
    return icons[category] || icons.default;
  };

  const formatSalary = (salary) => {
    if (!salary) return "Negotiable";
    return `₦ ${salary.toLocaleString()}`;
  };

  const JobCard = ({ job }) => (
    <div className="job-card">
      <div className="job-header">
        <div className="job-icon">
          {getJobIcon(job.category)}
        </div>
        <div className="job-info">
          <h3 className="job-title">{job.title}</h3>
          <p className="company-name">{job.company}</p>
          <div className="job-meta">
            <span className="meta-item">
              <span className="meta-icon">📍</span>
              {job.location || "Remote"}
            </span>
            <span className="meta-item">
              <span className="meta-icon">💰</span>
              {formatSalary(job.salary)}
            </span>
            <span className="meta-item">
              <span className="meta-icon">⏰</span>
              {job.type || "Full-time"}
            </span>
          </div>
        </div>
        <div className="job-actions">
          <button 
            className={`apply-btn ${applyingJob === job.id ? 'applying' : ''}`}
            onClick={() => handleApply(job)}
            disabled={applyingJob === job.id}
          >
            {applyingJob === job.id ? (
              <>
                <div className="spinner"></div>
                Applying...
              </>
            ) : (
              <>
                <span className="btn-icon">🚀</span>
                Apply Now
              </>
            )}
          </button>
        </div>
      </div>

      <div className="job-description">
        <p>{job.description}</p>
      </div>

      <div className="job-footer">
        <div className="job-tags">
          {job.skills?.slice(0, 3).map((skill, index) => (
            <span key={index} className="skill-tag">{skill}</span>
          ))}
          {job.skills?.length > 3 && (
            <span className="skill-tag more">+{job.skills.length - 3} more</span>
          )}
        </div>
        <div className="job-posted">
          Posted {job.postedDate ? new Date(job.postedDate).toLocaleDateString() : "recently"}
        </div>
      </div>

      {job.featured && <div className="featured-badge">Featured 🔥</div>}
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="jobs-container">
        <main className="jobs-main">
          {/* Header Section */}
          <div className="jobs-header">
            <div className="header-content">
              <div className="header-text">
                <h1>Career Opportunities</h1>
                <p>Discover your next career move with top companies in Lesotho</p>
              </div>
              <div className="header-stats">
                <div className="stat-card">
                  <div className="stat-icon">💼</div>
                  <div className="stat-info">
                    <span className="stat-number">{jobs.length}</span>
                    <span className="stat-label">Available Jobs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="filters-section">
            <div className="search-box">
              <div className="search-icon">🔍</div>
              <input
                type="text"
                placeholder="Search jobs, companies, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="category-filters">
              {categories.map(category => (
                <button
                  key={category}
                  className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'all' ? '🌐 All Jobs' : 
                   `${getJobIcon(category)} ${category.charAt(0).toUpperCase() + category.slice(1)}`}
                </button>
              ))}
            </div>
          </div>

          {/* Jobs Grid */}
          <div className="jobs-content">
            <div className="results-header">
              <h2>
                {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Found
                {selectedCategory !== 'all' && ` in ${selectedCategory}`}
                {searchTerm && ` for "${searchTerm}"`}
              </h2>
            </div>

            {filteredJobs.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>No jobs found</h3>
                <p>Try adjusting your search criteria or browse all categories</p>
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="jobs-grid">
                {filteredJobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>

          {/* Career Tips Section */}
          <div className="career-tips">
            <h3>💡 Job Search Tips</h3>
            <div className="tips-grid">
              <div className="tip-card">
                <div className="tip-icon">📝</div>
                <h4>Tailor Your Resume</h4>
                <p>Customize your resume for each job application to highlight relevant skills</p>
              </div>
              <div className="tip-card">
                <div className="tip-icon">💬</div>
                <h4>Network Effectively</h4>
                <p>Connect with professionals in your desired industry on LinkedIn</p>
              </div>
              <div className="tip-card">
                <div className="tip-icon">🎯</div>
                <h4>Research Companies</h4>
                <p>Learn about company culture and values before applying</p>
              </div>
              <div className="tip-card">
                <div className="tip-icon">⏱️</div>
                <h4>Apply Early</h4>
                <p>Submit applications as soon as possible for better chances</p>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .jobs-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .jobs-main {
          padding: 40px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .jobs-header {
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

        .filters-section {
          background: white;
          border-radius: 20px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
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
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .category-filters {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .category-btn {
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

        .category-btn:hover {
          border-color: #667eea;
          transform: translateY(-2px);
        }

        .category-btn.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .jobs-content {
          background: white;
          border-radius: 20px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .results-header {
          margin-bottom: 25px;
        }

        .results-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
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
          position: relative;
          overflow: hidden;
        }

        .job-card:hover {
          border-color: #667eea;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transform: translateY(-5px);
        }

        .job-header {
          display: flex;
          gap: 20px;
          margin-bottom: 15px;
        }

        .job-icon {
          font-size: 2.5rem;
          flex-shrink: 0;
        }

        .job-info {
          flex: 1;
        }

        .job-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 5px;
        }

        .company-name {
          font-size: 1.1rem;
          color: #667eea;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .job-meta {
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

        .job-actions {
          flex-shrink: 0;
        }

        .apply-btn {
          padding: 12px 20px;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }

        .apply-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
        }

        .apply-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .apply-btn.applying {
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }

        .btn-icon {
          font-size: 1.1rem;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .job-description {
          margin-bottom: 15px;
        }

        .job-description p {
          color: #6b7280;
          line-height: 1.5;
        }

        .job-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .job-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .skill-tag {
          background: #f1f5f9;
          color: #374151;
          padding: 4px 10px;
          border-radius: 15px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .skill-tag.more {
          background: #e0e7ff;
          color: #667eea;
        }

        .job-posted {
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .featured-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          padding: 4px 10px;
          border-radius: 10px;
          font-size: 0.7rem;
          font-weight: 600;
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
          background: #667eea;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background: #5a67d8;
          transform: translateY(-2px);
        }

        .career-tips {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 40px;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .career-tips h3 {
          text-align: center;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 30px;
          color: white;
        }

        .tips-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .tip-card {
          background: rgba(255, 255, 255, 0.1);
          padding: 25px;
          border-radius: 15px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }

        .tip-card:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-5px);
        }

        .tip-icon {
          font-size: 2.5rem;
          margin-bottom: 15px;
        }

        .tip-card h4 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 8px;
          color: white;
        }

        .tip-card p {
          font-size: 0.9rem;
          opacity: 0.8;
          line-height: 1.5;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .jobs-main {
            padding: 20px;
          }
          
          .jobs-header {
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
          
          .job-header {
            flex-direction: column;
            gap: 15px;
          }
          
          .job-actions {
            align-self: flex-start;
          }
          
          .job-footer {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .category-filters {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .jobs-main {
            padding: 15px;
          }
          
          .jobs-header {
            padding: 25px 20px;
          }
          
          .header-text h1 {
            font-size: 1.75rem;
          }
          
          .filters-section, .jobs-content {
            padding: 20px;
          }
        }
      `}</style>
    </>
  );
}