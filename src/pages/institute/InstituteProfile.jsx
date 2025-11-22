import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useAuth } from "../../context/AuthContext";

export default function InstituteProfile() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const [profile, setProfile] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem(`institute_profile_${user?.id}`)) || {
          name: user?.name || "",
          email: user?.email || "",
          phone: "",
          address: "",
          description: "",
          logo: "",
          website: "",
          foundedYear: "",
          type: "university",
          accreditation: "",
          totalStudents: "",
          contactPerson: "",
          socialMedia: {
            website: "",
            facebook: "",
            twitter: "",
            linkedin: ""
          }
        }
      );
    } catch {
      return {
        name: user?.name || "",
        email: user?.email || "",
        phone: "",
        address: "",
        description: "",
        logo: "",
        website: "",
        foundedYear: "",
        type: "university",
        accreditation: "",
        totalStudents: "",
        contactPerson: "",
        socialMedia: {
          website: "",
          facebook: "",
          twitter: "",
          linkedin: ""
        }
      };
    }
  });

  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`institute_profile_${user.id}`, JSON.stringify(profile));
    }
  }, [profile, user]);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setProfile(p => ({ ...p, logo: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    alert("🎉 Profile updated successfully!");
  };

  const sidebarLinks = [
    { to: "/institute/profile", label: "Manage Profile" },
    { to: "/institute/faculties", label: "Faculties" },
    { to: "/institute/courses", label: "Courses" },
    { to: "/institute/applications", label: "Student Applications" },
  ];

  const FormGroup = ({ label, icon, children, fullWidth = false }) => (
    <div className={`form-group ${fullWidth ? 'full-width' : ''}`}>
      <label className="form-label">
        <span className="label-icon">{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="institute-profile-container">
        <Sidebar links={sidebarLinks} />
        
        <main className="profile-main">
          {/* Header Section */}
          <div className="profile-header">
            <div className="header-content">
              <div className="header-text">
                <h1>Institute Profile</h1>
                <p>Manage your institution's information and branding</p>
              </div>
              <div className="header-stats">
                <div className="stat-card">
                  <div className="stat-icon">🏛️</div>
                  <div className="stat-info">
                    <span className="stat-number">100%</span>
                    <span className="stat-label">Profile Complete</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="profile-content">
            {/* Navigation Tabs */}
            <div className="tabs-container">
              <div className="tabs">
                <button 
                  className={`tab ${activeTab === 'basic' ? 'active' : ''}`}
                  onClick={() => setActiveTab('basic')}
                >
                  👤 Basic Information
                </button>
                <button 
                  className={`tab ${activeTab === 'details' ? 'active' : ''}`}
                  onClick={() => setActiveTab('details')}
                >
                  📊 Institution Details
                </button>
                <button 
                  className={`tab ${activeTab === 'social' ? 'active' : ''}`}
                  onClick={() => setActiveTab('social')}
                >
                  🔗 Social Media
                </button>
              </div>
            </div>

            {/* Basic Information Tab */}
            {activeTab === 'basic' && (
              <div className="tab-content">
                <div className="form-section">
                  <div className="form-card">
                    <div className="form-header">
                      <h2>Basic Information</h2>
                      <p>Update your institution's core details and branding</p>
                    </div>

                    {/* Logo Upload Section */}
                    <div className="logo-section">
                      <div className="logo-preview">
                        {profile.logo ? (
                          <img src={profile.logo} alt="Institution Logo" className="logo-image" />
                        ) : (
                          <div className="logo-placeholder">
                            <span className="placeholder-icon">🏛️</span>
                            <span className="placeholder-text">Upload Logo</span>
                          </div>
                        )}
                      </div>
                      <div className="logo-actions">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          id="logo-upload"
                          style={{ display: 'none' }}
                        />
                        <label htmlFor="logo-upload" className="upload-btn">
                          📁 Choose Logo
                        </label>
                        {profile.logo && (
                          <button 
                            className="remove-btn"
                            onClick={() => setProfile(p => ({ ...p, logo: "" }))}
                          >
                            🗑️ Remove
                          </button>
                        )}
                        <p className="upload-hint">Recommended: 300x300px, PNG or JPG, max 5MB</p>
                      </div>
                    </div>

                    <div className="form-grid">
                      <FormGroup label="Institution Name" icon="🏛️">
                        <input
                          type="text"
                          value={profile.name}
                          onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                          className="form-input"
                          placeholder="Enter institution name"
                        />
                      </FormGroup>

                      <FormGroup label="Email Address" icon="✉️">
                        <input
                          type="email"
                          value={profile.email}
                          onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                          className="form-input"
                          placeholder="contact@institution.edu"
                        />
                      </FormGroup>

                      <FormGroup label="Phone Number" icon="📱">
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                          className="form-input"
                          placeholder="+266 1234 5678"
                        />
                      </FormGroup>

                      <FormGroup label="Contact Person" icon="👤">
                        <input
                          type="text"
                          value={profile.contactPerson}
                          onChange={e => setProfile(p => ({ ...p, contactPerson: e.target.value }))}
                          className="form-input"
                          placeholder="Name of primary contact"
                        />
                      </FormGroup>

                      <FormGroup label="Address" icon="📍" fullWidth>
                        <input
                          type="text"
                          value={profile.address}
                          onChange={e => setProfile(p => ({ ...p, address: e.target.value }))}
                          className="form-input"
                          placeholder="Full physical address"
                        />
                      </FormGroup>

                      <FormGroup label="Description" icon="📝" fullWidth>
                        <textarea
                          value={profile.description}
                          onChange={e => setProfile(p => ({ ...p, description: e.target.value }))}
                          className="form-textarea"
                          placeholder="Describe your institution, its mission, values, and unique offerings..."
                          rows="4"
                        />
                        <div className="char-count">{profile.description.length}/500 characters</div>
                      </FormGroup>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Institution Details Tab */}
            {activeTab === 'details' && (
              <div className="tab-content">
                <div className="form-section">
                  <div className="form-card">
                    <div className="form-header">
                      <h2>Institution Details</h2>
                      <p>Additional information about your institution</p>
                    </div>

                    <div className="form-grid">
                      <FormGroup label="Website" icon="🌐">
                        <input
                          type="url"
                          value={profile.website}
                          onChange={e => setProfile(p => ({ ...p, website: e.target.value }))}
                          className="form-input"
                          placeholder="https://institution.edu"
                        />
                      </FormGroup>

                      <FormGroup label="Founded Year" icon="📅">
                        <input
                          type="number"
                          value={profile.foundedYear}
                          onChange={e => setProfile(p => ({ ...p, foundedYear: e.target.value }))}
                          className="form-input"
                          placeholder="1990"
                          min="1800"
                          max="2024"
                        />
                      </FormGroup>

                      <FormGroup label="Institution Type" icon="🎓">
                        <select
                          value={profile.type}
                          onChange={e => setProfile(p => ({ ...p, type: e.target.value }))}
                          className="form-select"
                        >
                          <option value="university">University</option>
                          <option value="college">College</option>
                          <option value="polytechnic">Polytechnic</option>
                          <option value="vocational">Vocational School</option>
                          <option value="other">Other</option>
                        </select>
                      </FormGroup>

                      <FormGroup label="Total Students" icon="👥">
                        <input
                          type="number"
                          value={profile.totalStudents}
                          onChange={e => setProfile(p => ({ ...p, totalStudents: e.target.value }))}
                          className="form-input"
                          placeholder="5000"
                          min="0"
                        />
                      </FormGroup>

                      <FormGroup label="Accreditation" icon="⭐" fullWidth>
                        <input
                          type="text"
                          value={profile.accreditation}
                          onChange={e => setProfile(p => ({ ...p, accreditation: e.target.value }))}
                          className="form-input"
                          placeholder="Accreditation bodies and status"
                        />
                      </FormGroup>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Social Media Tab */}
            {activeTab === 'social' && (
              <div className="tab-content">
                <div className="form-section">
                  <div className="form-card">
                    <div className="form-header">
                      <h2>Social Media & Links</h2>
                      <p>Connect your social media profiles</p>
                    </div>

                    <div className="form-grid">
                      <FormGroup label="Website" icon="🌐">
                        <input
                          type="url"
                          value={profile.socialMedia.website}
                          onChange={e => setProfile(p => ({ 
                            ...p, 
                            socialMedia: { ...p.socialMedia, website: e.target.value }
                          }))}
                          className="form-input"
                          placeholder="https://institution.edu"
                        />
                      </FormGroup>

                      <FormGroup label="Facebook" icon="📘">
                        <input
                          type="url"
                          value={profile.socialMedia.facebook}
                          onChange={e => setProfile(p => ({ 
                            ...p, 
                            socialMedia: { ...p.socialMedia, facebook: e.target.value }
                          }))}
                          className="form-input"
                          placeholder="https://facebook.com/institution"
                        />
                      </FormGroup>

                      <FormGroup label="Twitter" icon="🐦">
                        <input
                          type="url"
                          value={profile.socialMedia.twitter}
                          onChange={e => setProfile(p => ({ 
                            ...p, 
                            socialMedia: { ...p.socialMedia, twitter: e.target.value }
                          }))}
                          className="form-input"
                          placeholder="https://twitter.com/institution"
                        />
                      </FormGroup>

                      <FormGroup label="LinkedIn" icon="💼">
                        <input
                          type="url"
                          value={profile.socialMedia.linkedin}
                          onChange={e => setProfile(p => ({ 
                            ...p, 
                            socialMedia: { ...p.socialMedia, linkedin: e.target.value }
                          }))}
                          className="form-input"
                          placeholder="https://linkedin.com/company/institution"
                        />
                      </FormGroup>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="save-section">
              <button 
                className="save-btn"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="spinner"></div>
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">💾</span>
                    Save Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .institute-profile-container {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .profile-main {
          flex: 1;
          padding: 30px;
          margin-left: 280px;
        }

        .profile-header {
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

        .profile-content {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .tabs-container {
          background: #f8fafc;
          border-bottom: 1px solid #e5e7eb;
          padding: 0 30px;
        }

        .tabs {
          display: flex;
          gap: 5px;
        }

        .tab {
          padding: 15px 20px;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 500;
          color: #6b7280;
          transition: all 0.3s ease;
          border-bottom: 3px solid transparent;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .tab:hover {
          color: #374151;
          background: #f1f5f9;
        }

        .tab.active {
          color: #667eea;
          border-bottom-color: #667eea;
          background: white;
        }

        .tab-content {
          padding: 40px;
        }

        .form-section {
          margin-bottom: 30px;
        }

        .form-card {
          background: #f8fafc;
          border-radius: 15px;
          padding: 30px;
          border: 1px solid #e5e7eb;
        }

        .form-header {
          margin-bottom: 30px;
        }

        .form-header h2 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .form-header p {
          color: #6b7280;
          font-size: 1rem;
        }

        .logo-section {
          display: flex;
          gap: 30px;
          align-items: flex-start;
          margin-bottom: 30px;
          padding: 25px;
          background: white;
          border-radius: 12px;
          border: 2px dashed #e5e7eb;
        }

        .logo-preview {
          flex-shrink: 0;
        }

        .logo-image {
          width: 120px;
          height: 120px;
          border-radius: 12px;
          object-fit: cover;
          border: 3px solid #e5e7eb;
        }

        .logo-placeholder {
          width: 120px;
          height: 120px;
          border: 2px dashed #d1d5db;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #f9fafb;
          color: #6b7280;
        }

        .placeholder-icon {
          font-size: 2rem;
          margin-bottom: 8px;
        }

        .placeholder-text {
          font-size: 0.8rem;
          font-weight: 500;
        }

        .logo-actions {
          flex: 1;
        }

        .upload-btn, .remove-btn {
          padding: 10px 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
          margin-right: 10px;
          margin-bottom: 10px;
        }

        .upload-btn {
          background: #667eea;
          color: white;
        }

        .upload-btn:hover {
          background: #5a67d8;
          transform: translateY(-1px);
        }

        .remove-btn {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .remove-btn:hover {
          background: #e5e7eb;
        }

        .upload-hint {
          font-size: 0.8rem;
          color: #6b7280;
          margin-top: 8px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 25px;
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
          min-height: 100px;
        }

        .char-count {
          text-align: right;
          font-size: 0.8rem;
          color: #6b7280;
          margin-top: 4px;
        }

        .save-section {
          padding: 30px 40px;
          background: #f8fafc;
          border-top: 1px solid #e5e7eb;
          text-align: center;
        }

        .save-btn {
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

        .save-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
        }

        .save-btn:disabled {
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

        .btn-icon {
          font-size: 1.1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 1024px) {
          .profile-main {
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
          .profile-header {
            padding: 25px;
          }
          
          .header-text h1 {
            font-size: 2rem;
          }
          
          .logo-section {
            flex-direction: column;
            text-align: center;
          }
          
          .tabs {
            flex-wrap: wrap;
          }
          
          .tab-content {
            padding: 25px;
          }
        }

        @media (max-width: 480px) {
          .profile-main {
            padding: 15px;
          }
          
          .profile-header {
            padding: 20px;
          }
          
          .header-text h1 {
            font-size: 1.75rem;
          }
          
          .form-card {
            padding: 20px;
          }
          
          .tab-content {
            padding: 20px;
          }
        }
      `}</style>
    </>
  );
}