import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useAuth } from "../../context/AuthContext";
import { useAppData } from "../../context/ApplicationContext";

export default function CompanyProfile() {
  const { user, updateUser } = useAuth();
  const { updateCompanyProfile } = useAppData();

  const links = [
    { to: "/company/post-job", label: "Post Job" },
    { to: "/company/applicants", label: "View Applicants" },
    { to: "/company/profile", label: "Update Profile" },
    { to: "/company/settings", label: "Settings" },
  ];

  const [form, setForm] = useState({
    companyName: user.companyName || "",
    email: user.email || "",
    industry: user.industry || "",
    phone: user.phone || "",
    address: user.address || "",
    description: user.description || "",
    logo: user.logo || "",
    website: user.website || "",
    founded: user.founded || "",
    employees: user.employees || "",
    hiringManager: user.hiringManager || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((prev) => ({ ...prev, logo: URL.createObjectURL(files[0]) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    setSaved(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateCompanyProfile(user.id, form);
      updateUser({ ...user, ...form });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      alert("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const Input = ({ label, name, value, onChange, type = "text", placeholder, icon }) => (
    <div className="form-group">
      <label className="form-label">
        {icon && <span className="label-icon">{icon}</span>}
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="form-input"
      />
    </div>
  );

  const TextArea = ({ label, name, value, onChange, placeholder, icon }) => (
    <div className="form-group">
      <label className="form-label">
        {icon && <span className="label-icon">{icon}</span>}
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows="4"
        className="form-textarea"
      />
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="company-profile-container">
        <Sidebar links={links} />
        
        <main className="company-profile-main">
          {/* Header Section */}
          <div className="profile-header">
            <div className="header-content">
              <div className="header-text">
                <h1>Company Profile</h1>
                <p>Update your company information and branding</p>
              </div>
              <div className="header-stats">
                <div className="stat-card">
                  <div className="stat-icon">🏢</div>
                  <div className="stat-info">
                    <span className="stat-number">100%</span>
                    <span className="stat-label">Profile Complete</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-content">
            {/* Left Column - Logo & Basic Info */}
            <div className="left-column">
              <div className="logo-section">
                <div className="logo-container">
                  <img
                    src={form.logo || "https://via.placeholder.com/150"}
                    alt="Company Logo"
                    className="logo-image"
                  />
                  <div className="logo-overlay">
                    <span className="upload-text">📷 Upload Logo</span>
                  </div>
                </div>
                <input
                  type="file"
                  name="logo"
                  onChange={handleChange}
                  className="file-input"
                  accept="image/*"
                />
                <p className="logo-hint">Recommended: 150x150px PNG or JPG</p>
              </div>

              <div className="quick-stats">
                <h3 className="stats-title">📊 Profile Strength</h3>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '100%' }}></div>
                </div>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-value">12</span>
                    <span className="stat-label">Jobs Posted</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">84</span>
                    <span className="stat-label">Applicants</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="right-column">
              <div className="form-section">
                <div className="section-header">
                  <h2>🏢 Company Information</h2>
                  <div className={`save-status ${saved ? 'saved' : ''}`}>
                    {saved ? '✓ Profile Saved!' : 'Unsaved changes'}
                  </div>
                </div>

                <div className="form-grid">
                  <Input
                    label="Company Name"
                    name="companyName"
                    value={form.companyName}
                    onChange={handleChange}
                    placeholder="Enter your company name"
                    icon="🏢"
                  />
                  
                  <Input
                    label="Industry"
                    name="industry"
                    value={form.industry}
                    onChange={handleChange}
                    placeholder="e.g., Technology, Healthcare"
                    icon="📊"
                  />

                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="company@email.com"
                    icon="📧"
                  />

                  <Input
                    label="Contact Number"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    icon="📞"
                  />

                  <Input
                    label="Website"
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                    placeholder="https://company.com"
                    icon="🌐"
                  />

                  <Input
                    label="Year Founded"
                    name="founded"
                    value={form.founded}
                    onChange={handleChange}
                    placeholder="1990"
                    icon="📅"
                  />

                  <Input
                    label="Company Size"
                    name="employees"
                    value={form.employees}
                    onChange={handleChange}
                    placeholder="e.g., 50-100 employees"
                    icon="👥"
                  />

                  <Input
                    label="Hiring Manager"
                    name="hiringManager"
                    value={form.hiringManager}
                    onChange={handleChange}
                    placeholder="Name of hiring manager"
                    icon="👨‍💼"
                  />
                </div>

                <TextArea
                  label="Company Address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter your company's full address"
                  icon="📍"
                />

                <TextArea
                  label="Company Description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe your company's mission, culture, and values..."
                  icon="📝"
                />

                <button 
                  className={`save-button ${isLoading ? 'loading' : ''} ${saved ? 'saved' : ''}`}
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="button-spinner"></div>
                      Saving Changes...
                    </>
                  ) : saved ? (
                    <>
                      <span className="button-icon">✓</span>
                      Changes Saved!
                    </>
                  ) : (
                    <>
                      <span className="button-icon">💾</span>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="tips-section">
            <h3>💡 Profile Tips</h3>
            <div className="tips-grid">
              <div className="tip-card">
                <div className="tip-icon">🎯</div>
                <div className="tip-content">
                  <h4>Complete Profile</h4>
                  <p>A complete profile attracts 3x more applicants</p>
                </div>
              </div>
              <div className="tip-card">
                <div className="tip-icon">📸</div>
                <div className="tip-content">
                  <h4>Professional Logo</h4>
                  <p>Upload a high-quality logo for better branding</p>
                </div>
              </div>
              <div className="tip-card">
                <div className="tip-icon">📝</div>
                <div className="tip-content">
                  <h4>Detailed Description</h4>
                  <p>Describe your company culture and values</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .company-profile-container {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .company-profile-main {
          flex: 1;
          padding: 30px;
          margin-left: 280px;
        }

        .profile-header {
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

        .profile-content {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 30px;
          margin-bottom: 30px;
        }

        .left-column {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .logo-section {
          background: white;
          border-radius: 20px;
          padding: 30px;
          text-align: center;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }

        .logo-container {
          position: relative;
          display: inline-block;
          margin-bottom: 15px;
          cursor: pointer;
        }

        .logo-image {
          width: 150px;
          height: 150px;
          object-fit: cover;
          border-radius: 20px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
        }

        .logo-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .logo-container:hover .logo-overlay {
          opacity: 1;
        }

        .logo-container:hover .logo-image {
          transform: scale(1.05);
        }

        .upload-text {
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .file-input {
          display: none;
        }

        .logo-hint {
          color: #6b7280;
          font-size: 0.8rem;
          margin-top: 10px;
        }

        .quick-stats {
          background: white;
          border-radius: 20px;
          padding: 25px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }

        .stats-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 15px;
        }

        .progress-bar {
          height: 8px;
          background: #e5e7eb;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 20px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 10px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .stat-item {
          text-align: center;
          padding: 15px;
          background: #f8fafc;
          border-radius: 12px;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 800;
          color: #1f2937;
          display: block;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 500;
        }

        .right-column {
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #f1f5f9;
        }

        .section-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
        }

        .save-status {
          padding: 8px 16px;
          background: #fef3c7;
          color: #92400e;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .save-status.saved {
          background: #d1fae5;
          color: #065f46;
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

        .form-input, .form-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          background: white;
        }

        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .save-button {
          width: 100%;
          padding: 16px 24px;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
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
          margin-top: 20px;
        }

        .save-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(79, 70, 229, 0.3);
        }

        .save-button.loading {
          background: linear-gradient(135deg, #6b7280, #9ca3af);
        }

        .save-button.saved {
          background: linear-gradient(135deg, #10b981, #059669);
        }

        .save-button:disabled {
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
          .company-profile-main {
            margin-left: 0;
            padding: 20px;
          }
          
          .header-content {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .profile-content {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .profile-header {
            padding: 25px;
          }
          
          .header-text h1 {
            font-size: 2rem;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .right-column {
            padding: 25px;
          }
          
          .section-header {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }
        }

        @media (max-width: 480px) {
          .company-profile-main {
            padding: 15px;
          }
          
          .profile-header {
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