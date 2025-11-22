import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useAuth } from "../../context/AuthContext";

export default function CompanySettings() {
  const { user } = useAuth();

  const links = [
    { to: "/company/post-job", label: "Post Job" },
    { to: "/company/applicants", label: "View Applicants" },
    { to: "/company/profile", label: "Update Profile" },
    { to: "/company/settings", label: "Settings" },
  ];

  const [settings, setSettings] = useState({
    emailNotifications: true,
    applicationAlerts: true,
    candidateUpdates: false,
    newsletter: true,
    twoFactorAuth: false,
    securityAlerts: true,
    autoLogout: true,
    dataExport: false
  });

  const [activeTab, setActiveTab] = useState("notifications");
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setSaved(false);
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Save settings to backend would go here
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      alert("Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = () => {
    alert("Password change functionality would be implemented here");
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      alert("Account deletion functionality would be implemented here");
    }
  };

  const SettingToggle = ({ label, description, checked, onChange, icon }) => (
    <div className="setting-item">
      <div className="setting-info">
        <div className="setting-header">
          <span className="setting-icon">{icon}</span>
          <div>
            <h4 className="setting-label">{label}</h4>
            <p className="setting-description">{description}</p>
          </div>
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>
    </div>
  );

  const DangerButton = ({ label, description, onClick, icon }) => (
    <div className="danger-item">
      <div className="danger-info">
        <span className="danger-icon">{icon}</span>
        <div>
          <h4 className="danger-label">{label}</h4>
          <p className="danger-description">{description}</p>
        </div>
      </div>
      <button className="danger-button" onClick={onClick}>
        {label}
      </button>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="company-settings-container">
        <Sidebar links={links} />
        
        <main className="company-settings-main">
          {/* Header Section */}
          <div className="settings-header">
            <div className="header-content">
              <div className="header-text">
                <h1>Company Settings</h1>
                <p>Manage your account preferences and security settings</p>
              </div>
              <div className="header-stats">
                <div className="stat-card">
                  <div className="stat-icon">⚙️</div>
                  <div className="stat-info">
                    <span className="stat-number">{Object.values(settings).filter(Boolean).length}</span>
                    <span className="stat-label">Active Settings</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="settings-content">
            {/* Left Navigation */}
            <div className="settings-sidebar">
              <nav className="settings-nav">
                <button 
                  className={`nav-item ${activeTab === "notifications" ? "active" : ""}`}
                  onClick={() => setActiveTab("notifications")}
                >
                  <span className="nav-icon">🔔</span>
                  Notifications
                </button>
                <button 
                  className={`nav-item ${activeTab === "security" ? "active" : ""}`}
                  onClick={() => setActiveTab("security")}
                >
                  <span className="nav-icon">🔒</span>
                  Security
                </button>
                <button 
                  className={`nav-item ${activeTab === "privacy" ? "active" : ""}`}
                  onClick={() => setActiveTab("privacy")}
                >
                  <span className="nav-icon">🛡️</span>
                  Privacy
                </button>
                <button 
                  className={`nav-item ${activeTab === "danger" ? "active" : ""}`}
                  onClick={() => setActiveTab("danger")}
                >
                  <span className="nav-icon">⚠️</span>
                  Danger Zone
                </button>
              </nav>

              <div className="save-section">
                <button 
                  className={`save-button ${isLoading ? "loading" : ""} ${saved ? "saved" : ""}`}
                  onClick={handleSaveSettings}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="button-spinner"></div>
                      Saving...
                    </>
                  ) : saved ? (
                    <>
                      <span className="button-icon">✓</span>
                      Settings Saved!
                    </>
                  ) : (
                    <>
                      <span className="button-icon">💾</span>
                      Save Changes
                    </>
                  )}
                </button>
                {saved && (
                  <div className="save-confirmation">
                    Your settings have been updated successfully
                  </div>
                )}
              </div>
            </div>

            {/* Right Content */}
            <div className="settings-panel">
              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="tab-content">
                  <div className="tab-header">
                    <h2>🔔 Notification Preferences</h2>
                    <p>Manage how and when you receive notifications</p>
                  </div>
                  
                  <div className="settings-group">
                    <h3 className="group-title">Email Notifications</h3>
                    <SettingToggle
                      label="Email Notifications"
                      description="Receive important updates via email"
                      checked={settings.emailNotifications}
                      onChange={(value) => handleSettingChange("emailNotifications", value)}
                      icon="📧"
                    />
                    <SettingToggle
                      label="Application Alerts"
                      description="Get notified when new candidates apply"
                      checked={settings.applicationAlerts}
                      onChange={(value) => handleSettingChange("applicationAlerts", value)}
                      icon="👥"
                    />
                    <SettingToggle
                      label="Candidate Updates"
                      description="Updates on candidate application status"
                      checked={settings.candidateUpdates}
                      onChange={(value) => handleSettingChange("candidateUpdates", value)}
                      icon="📊"
                    />
                    <SettingToggle
                      label="Newsletter"
                      description="Monthly updates and hiring tips"
                      checked={settings.newsletter}
                      onChange={(value) => handleSettingChange("newsletter", value)}
                      icon="📰"
                    />
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="tab-content">
                  <div className="tab-header">
                    <h2>🔒 Security Settings</h2>
                    <p>Enhance your account security and access controls</p>
                  </div>
                  
                  <div className="settings-group">
                    <h3 className="group-title">Authentication</h3>
                    <SettingToggle
                      label="Two-Factor Authentication"
                      description="Add an extra layer of security to your account"
                      checked={settings.twoFactorAuth}
                      onChange={(value) => handleSettingChange("twoFactorAuth", value)}
                      icon="🔐"
                    />
                    <SettingToggle
                      label="Security Alerts"
                      description="Get notified about suspicious login attempts"
                      checked={settings.securityAlerts}
                      onChange={(value) => handleSettingChange("securityAlerts", value)}
                      icon="🚨"
                    />
                    <SettingToggle
                      label="Auto Logout"
                      description="Automatically log out after 30 minutes of inactivity"
                      checked={settings.autoLogout}
                      onChange={(value) => handleSettingChange("autoLogout", value)}
                      icon="⏰"
                    />
                  </div>

                  <div className="action-section">
                    <h3 className="group-title">Password</h3>
                    <div className="action-item">
                      <div className="action-info">
                        <span className="action-icon">🔑</span>
                        <div>
                          <h4 className="action-label">Change Password</h4>
                          <p className="action-description">Update your account password regularly</p>
                        </div>
                      </div>
                      <button className="action-button" onClick={handlePasswordChange}>
                        Change Password
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === "privacy" && (
                <div className="tab-content">
                  <div className="tab-header">
                    <h2>🛡️ Privacy Settings</h2>
                    <p>Control your data and privacy preferences</p>
                  </div>
                  
                  <div className="settings-group">
                    <h3 className="group-title">Data Management</h3>
                    <SettingToggle
                      label="Data Export"
                      description="Allow exporting of your company data"
                      checked={settings.dataExport}
                      onChange={(value) => handleSettingChange("dataExport", value)}
                      icon="📤"
                    />
                  </div>

                  <div className="privacy-info">
                    <div className="info-card">
                      <div className="info-icon">📋</div>
                      <div className="info-content">
                        <h4>Data Usage</h4>
                        <p>Your data is used solely for recruitment purposes and is protected by our privacy policy.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Danger Zone Tab */}
              {activeTab === "danger" && (
                <div className="tab-content">
                  <div className="tab-header">
                    <h2>⚠️ Danger Zone</h2>
                    <p>Irreversible actions that affect your account</p>
                  </div>
                  
                  <div className="danger-group">
                    <DangerButton
                      label="Delete Company Account"
                      description="Permanently delete your company account and all associated data"
                      onClick={handleDeleteAccount}
                      icon="🗑️"
                    />
                    
                    <div className="danger-warning">
                      <div className="warning-icon">🚨</div>
                      <div className="warning-content">
                        <h4>Important Notice</h4>
                        <p>Account deletion is permanent and cannot be undone. All your job postings, applicant data, and company information will be permanently removed.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="tips-section">
            <h3>💡 Security Tips</h3>
            <div className="tips-grid">
              <div className="tip-card">
                <div className="tip-icon">🔒</div>
                <div className="tip-content">
                  <h4>Enable 2FA</h4>
                  <p>Add an extra layer of security to your account</p>
                </div>
              </div>
              <div className="tip-card">
                <div className="tip-icon">📧</div>
                <div className="tip-content">
                  <h4>Stay Updated</h4>
                  <p>Keep notifications enabled for important alerts</p>
                </div>
              </div>
              <div className="tip-card">
                <div className="tip-icon">🔄</div>
                <div className="tip-content">
                  <h4>Regular Updates</h4>
                  <p>Review your settings periodically</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .company-settings-container {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .company-settings-main {
          flex: 1;
          padding: 30px;
          margin-left: 280px;
        }

        .settings-header {
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

        .settings-content {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 30px;
          margin-bottom: 30px;
        }

        .settings-sidebar {
          background: white;
          border-radius: 20px;
          padding: 25px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
        }

        .settings-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 30px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 15px 20px;
          border: none;
          background: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.95rem;
          font-weight: 500;
          color: #6b7280;
          text-align: left;
        }

        .nav-item:hover {
          background: #f8fafc;
          color: #374151;
        }

        .nav-item.active {
          background: #4f46e5;
          color: white;
        }

        .nav-icon {
          font-size: 1.1rem;
          width: 20px;
        }

        .save-section {
          margin-top: auto;
        }

        .save-button {
          width: 100%;
          padding: 15px 20px;
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

        .save-confirmation {
          margin-top: 10px;
          padding: 10px;
          background: #d1fae5;
          color: #065f46;
          border-radius: 8px;
          font-size: 0.85rem;
          text-align: center;
          font-weight: 500;
        }

        .settings-panel {
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }

        .tab-header {
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #f1f5f9;
        }

        .tab-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .tab-header p {
          color: #6b7280;
          font-size: 0.95rem;
        }

        .settings-group {
          margin-bottom: 30px;
        }

        .group-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #f1f5f9;
        }

        .setting-item {
          padding: 20px;
          border: 1px solid #f1f5f9;
          border-radius: 12px;
          margin-bottom: 15px;
          transition: all 0.3s ease;
        }

        .setting-item:hover {
          border-color: #e5e7eb;
          background: #fafafa;
        }

        .setting-info {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .setting-header {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          flex: 1;
        }

        .setting-icon {
          font-size: 1.2rem;
          margin-top: 2px;
        }

        .setting-label {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .setting-description {
          font-size: 0.85rem;
          color: #6b7280;
          line-height: 1.4;
          margin: 0;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 24px;
          margin-left: 15px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #e5e7eb;
          transition: .3s;
          border-radius: 24px;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .3s;
          border-radius: 50%;
        }

        input:checked + .toggle-slider {
          background-color: #4f46e5;
        }

        input:checked + .toggle-slider:before {
          transform: translateX(26px);
        }

        .action-section {
          margin-top: 30px;
        }

        .action-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border: 1px solid #f1f5f9;
          border-radius: 12px;
        }

        .action-info {
          display: flex;
          align-items: center;
          gap: 15px;
          flex: 1;
        }

        .action-icon {
          font-size: 1.2rem;
        }

        .action-label {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .action-description {
          font-size: 0.85rem;
          color: #6b7280;
          margin: 0;
        }

        .action-button {
          padding: 10px 20px;
          background: #4f46e5;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-button:hover {
          background: #4338ca;
          transform: translateY(-1px);
        }

        .privacy-info {
          margin-top: 30px;
        }

        .info-card {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 12px;
          border-left: 4px solid #4f46e5;
        }

        .info-icon {
          font-size: 1.5rem;
        }

        .info-content h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 5px;
        }

        .info-content p {
          font-size: 0.85rem;
          color: #6b7280;
          margin: 0;
          line-height: 1.4;
        }

        .danger-group {
          margin-top: 20px;
        }

        .danger-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 25px;
          border: 2px solid #fecaca;
          border-radius: 12px;
          background: #fef2f2;
          margin-bottom: 20px;
        }

        .danger-info {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          flex: 1;
        }

        .danger-icon {
          font-size: 1.3rem;
        }

        .danger-label {
          font-size: 1rem;
          font-weight: 600;
          color: #dc2626;
          margin-bottom: 4px;
        }

        .danger-description {
          font-size: 0.85rem;
          color: #b91c1c;
          margin: 0;
        }

        .danger-button {
          padding: 12px 24px;
          background: #dc2626;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .danger-button:hover {
          background: #b91c1c;
          transform: translateY(-1px);
        }

        .danger-warning {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          padding: 20px;
          background: #fef3c7;
          border-radius: 12px;
          border-left: 4px solid #d97706;
        }

        .warning-icon {
          font-size: 1.5rem;
        }

        .warning-content h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #92400e;
          margin-bottom: 5px;
        }

        .warning-content p {
          font-size: 0.85rem;
          color: #92400e;
          margin: 0;
          line-height: 1.4;
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
          .company-settings-main {
            margin-left: 0;
            padding: 20px;
          }
          
          .header-content {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .settings-content {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .settings-header {
            padding: 25px;
          }
          
          .header-text h1 {
            font-size: 2rem;
          }
          
          .settings-panel {
            padding: 25px;
          }
          
          .setting-info {
            flex-direction: column;
            gap: 15px;
          }
          
          .danger-item {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }
        }

        @media (max-width: 480px) {
          .company-settings-main {
            padding: 15px;
          }
          
          .settings-header {
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