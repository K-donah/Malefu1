import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    location: user.location || "",
    bio: user.bio || ""
  });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  const handleSave = async () => {
    if (!formData.name.trim()) return;
    
    setSaving(true);
    try {
      await updateUser({ ...user, ...formData });
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <main className="profile-main">
          {/* Header Section */}
          <div className="profile-header">
            <div className="header-content">
              <div className="user-info">
                <div className="avatar-section">
                  <div className="user-avatar">
                    {getInitials(formData.name)}
                  </div>
                  <div className="avatar-actions">
                    <button className="avatar-btn">📷</button>
                    <button className="avatar-btn">✨</button>
                  </div>
                </div>
                <div className="user-details">
                  <h1>{formData.name}</h1>
                  <p>{formData.email}</p>
                  <div className="user-stats">
                    <div className="stat">
                      <span className="stat-number">12</span>
                      <span className="stat-label">Applications</span>
                    </div>
                    <div className="stat">
                      <span className="stat-number">3</span>
                      <span className="stat-label">Accepted</span>
                    </div>
                    <div className="stat">
                      <span className="stat-number">95%</span>
                      <span className="stat-label">Profile Complete</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="header-actions">
                <button className="btn-secondary">📥 Export Data</button>
                <button className="btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? "🔄 Saving..." : "💾 Save Changes"}
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="profile-content">
            {/* Navigation Tabs */}
            <div className="tabs-container">
              <div className="tabs">
                <button 
                  className={`tab ${activeTab === 'personal' ? 'active' : ''}`}
                  onClick={() => setActiveTab('personal')}
                >
                  👤 Personal Info
                </button>
                <button 
                  className={`tab ${activeTab === 'education' ? 'active' : ''}`}
                  onClick={() => setActiveTab('education')}
                >
                  🎓 Education
                </button>
                <button 
                  className={`tab ${activeTab === 'documents' ? 'active' : ''}`}
                  onClick={() => setActiveTab('documents')}
                >
                  📄 Documents
                </button>
                <button 
                  className={`tab ${activeTab === 'preferences' ? 'active' : ''}`}
                  onClick={() => setActiveTab('preferences')}
                >
                  ⚙️ Preferences
                </button>
              </div>
            </div>

            {/* Personal Information Form */}
            {activeTab === 'personal' && (
              <div className="form-section">
                <div className="form-card">
                  <div className="form-header">
                    <h2>Personal Information</h2>
                    <p>Update your personal details and contact information</p>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">
                        <span className="label-icon">👤</span>
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="form-input"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <span className="label-icon">✉️</span>
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        readOnly
                        className="form-input readonly"
                        placeholder="Your email address"
                      />
                      <span className="readonly-badge">Cannot be changed</span>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <span className="label-icon">📱</span>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="form-input"
                        placeholder="+266 1234 5678"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <span className="label-icon">📍</span>
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="form-input"
                        placeholder="Maseru, Lesotho"
                      />
                    </div>

                    <div className="form-group full-width">
                      <label className="form-label">
                        <span className="label-icon">📝</span>
                        Bio / About Me
                      </label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        className="form-textarea"
                        placeholder="Tell us about yourself, your interests, and career goals..."
                        rows="4"
                      />
                      <div className="char-count">{formData.bio.length}/500</div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="actions-grid">
                  <div className="action-card">
                    <div className="action-icon">🔒</div>
                    <h3>Privacy Settings</h3>
                    <p>Control who can see your profile</p>
                    <button className="action-btn">Configure</button>
                  </div>
                  <div className="action-card">
                    <div className="action-icon">🔔</div>
                    <h3>Notifications</h3>
                    <p>Manage your email preferences</p>
                    <button className="action-btn">Manage</button>
                  </div>
                  <div className="action-card">
                    <div className="action-icon">🛡️</div>
                    <h3>Security</h3>
                    <p>Update password and security settings</p>
                    <button className="action-btn">Secure</button>
                  </div>
                </div>
              </div>
            )}

            {/* Education Tab Content */}
            {activeTab === 'education' && (
              <div className="form-section">
                <div className="form-card">
                  <div className="form-header">
                    <h2>Education Background</h2>
                    <p>Add your educational qualifications and achievements</p>
                  </div>
                  <div className="empty-state">
                    <div className="empty-icon">🎓</div>
                    <h3>No education added yet</h3>
                    <p>Add your educational background to enhance your profile</p>
                    <button className="btn-primary">+ Add Education</button>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="save-section">
              <button 
                className="save-btn"
                onClick={handleSave}
                disabled={saving || !formData.name.trim()}
              >
                {saving ? (
                  <>
                    <div className="spinner"></div>
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">💾</span>
                    Save Profile Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .profile-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .profile-main {
          padding: 40px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .profile-header {
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
          align-items: start;
        }

        .user-info {
          display: flex;
          gap: 25px;
          align-items: flex-start;
        }

        .avatar-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .user-avatar {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 700;
          color: white;
          box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
          border: 3px solid rgba(255, 255, 255, 0.3);
        }

        .avatar-actions {
          display: flex;
          gap: 8px;
        }

        .avatar-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 8px;
          padding: 8px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .avatar-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }

        .user-details h1 {
          font-size: 2.2rem;
          font-weight: 800;
          margin-bottom: 5px;
          background: linear-gradient(135deg, #fff, #e2e8f0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .user-details p {
          font-size: 1.1rem;
          opacity: 0.9;
          margin-bottom: 20px;
        }

        .user-stats {
          display: flex;
          gap: 25px;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 2px;
        }

        .stat-label {
          font-size: 0.8rem;
          opacity: 0.8;
        }

        .header-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .btn-primary, .btn-secondary {
          padding: 12px 20px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          font-size: 0.9rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
          color: white;
          box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .profile-content {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
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

        .form-section {
          padding: 40px;
        }

        .form-card {
          margin-bottom: 30px;
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

        .form-input, .form-textarea {
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
        }

        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-input.readonly {
          background: #f9fafb;
          color: #6b7280;
          cursor: not-allowed;
        }

        .readonly-badge {
          font-size: 0.7rem;
          color: #ef4444;
          font-weight: 600;
          margin-top: 4px;
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

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .action-card {
          background: #f8fafc;
          padding: 25px;
          border-radius: 15px;
          text-align: center;
          border: 2px solid transparent;
          transition: all 0.3s ease;
        }

        .action-card:hover {
          border-color: #667eea;
          background: white;
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .action-icon {
          font-size: 2.5rem;
          margin-bottom: 15px;
        }

        .action-card h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .action-card p {
          color: #6b7280;
          font-size: 0.9rem;
          margin-bottom: 15px;
        }

        .action-btn {
          background: #667eea;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .action-btn:hover {
          background: #5a67d8;
          transform: translateY(-2px);
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

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .profile-main {
            padding: 20px;
          }
          
          .profile-header {
            padding: 30px 25px;
          }
          
          .header-content {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .user-info {
            flex-direction: column;
            text-align: center;
          }
          
          .user-stats {
            justify-content: center;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .tabs {
            flex-wrap: wrap;
          }
          
          .form-section {
            padding: 25px;
          }
        }

        @media (max-width: 480px) {
          .profile-main {
            padding: 15px;
          }
          
          .profile-header {
            padding: 25px 20px;
          }
          
          .user-details h1 {
            font-size: 1.8rem;
          }
          
          .form-section {
            padding: 20px;
          }
        }
      `}</style>
    </>
  );
}