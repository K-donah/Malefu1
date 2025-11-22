import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "student",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    const res = await register({ 
      name: formData.name, 
      email: formData.email, 
      password: formData.password, 
      role: formData.role 
    });
    
    setIsLoading(false);
    
    if (!res.success) {
      setError(res.message || "Registration failed");
      return;
    }

    // Redirect based on role
    const redirectPaths = {
      admin: "/admin",
      institute: "/institute",
      student: "/student",
      company: "/company"
    };
    
    nav(redirectPaths[formData.role] || "/");
  };

  const roleDescriptions = {
    student: "Looking for educational opportunities and career guidance",
    institute: "Educational institution offering courses and programs",
    company: "Employer seeking talent and offering career opportunities",
    admin: "Platform administrator with system management access"
  };

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "20px",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      position: "relative",
      overflow: "hidden"
    },
    backgroundShapes: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: "hidden",
      zIndex: 0
    },
    shape: {
      position: "absolute",
      borderRadius: "50%",
      background: "rgba(255, 255, 255, 0.1)",
      animation: "float 6s ease-in-out infinite"
    },
    shape1: {
      width: "200px",
      height: "200px",
      top: "10%",
      left: "10%",
      animationDelay: "0s"
    },
    shape2: {
      width: "150px",
      height: "150px",
      top: "60%",
      right: "10%",
      animationDelay: "2s"
    },
    shape3: {
      width: "100px",
      height: "100px",
      bottom: "20%",
      left: "20%",
      animationDelay: "4s"
    },
    content: {
      display: "grid",
      gridTemplateColumns: "1fr 400px",
      maxWidth: "1200px",
      width: "100%",
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      borderRadius: "24px",
      overflow: "hidden",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
      zIndex: 1
    },
    card: {
      padding: "48px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    },
    cardHeader: {
      textAlign: "center",
      marginBottom: "40px"
    },
    logo: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      marginBottom: "16px",
      fontWeight: "700",
      fontSize: "1.5rem",
      color: "#4f46e5"
    },
    logoIcon: {
      fontSize: "1.75rem"
    },
    cardTitle: {
      fontSize: "2rem",
      fontWeight: "800",
      color: "#1f2937",
      marginBottom: "8px"
    },
    cardSubtitle: {
      color: "#6b7280",
      fontSize: "1rem"
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "24px"
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px"
    },
    formLabel: {
      fontWeight: "600",
      color: "#374151",
      fontSize: "0.875rem",
      display: "flex",
      alignItems: "center",
      gap: "4px"
    },
    required: {
      color: "#ef4444"
    },
    inputContainer: {
      position: "relative",
      display: "flex",
      alignItems: "center"
    },
    inputIcon: {
      position: "absolute",
      left: "16px",
      fontSize: "1.125rem",
      zIndex: 1
    },
    formInput: {
      width: "100%",
      padding: "12px 16px 12px 48px",
      border: "2px solid #e5e7eb",
      borderRadius: "12px",
      fontSize: "1rem",
      transition: "all 0.3s ease",
      background: "#fff"
    },
    formInputFocus: {
      outline: "none",
      borderColor: "#4f46e5",
      boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.1)"
    },
    passwordToggle: {
      position: "absolute",
      right: "16px",
      background: "none",
      border: "none",
      fontSize: "1.125rem",
      cursor: "pointer",
      padding: "4px",
      borderRadius: "4px",
      transition: "background 0.2s ease"
    },
    passwordToggleHover: {
      background: "#f3f4f6"
    },
    roleSelector: {
      display: "flex",
      flexDirection: "column",
      gap: "8px"
    },
    roleSelect: {
      padding: "12px 16px",
      border: "2px solid #e5e7eb",
      borderRadius: "12px",
      fontSize: "1rem",
      background: "#fff",
      cursor: "pointer",
      transition: "all 0.3s ease"
    },
    roleDescription: {
      fontSize: "0.875rem",
      color: "#6b7280",
      padding: "8px 12px",
      background: "#f8fafc",
      borderRadius: "8px",
      borderLeft: "3px solid #4f46e5"
    },
    passwordStrength: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginTop: "8px"
    },
    strengthBar: {
      height: "4px",
      borderRadius: "2px",
      background: "#e5e7eb",
      transition: "all 0.3s ease",
      flex: 1
    },
    strengthBarWeak: {
      background: "#ef4444"
    },
    strengthBarStrong: {
      background: "#10b981"
    },
    strengthText: {
      fontSize: "0.75rem",
      color: "#6b7280",
      minWidth: "120px"
    },
    passwordMismatch: {
      color: "#ef4444",
      fontSize: "0.875rem",
      marginTop: "4px"
    },
    errorMessage: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "12px 16px",
      background: "#fef2f2",
      border: "1px solid #fecaca",
      borderRadius: "8px",
      color: "#dc2626",
      fontSize: "0.875rem",
      fontWeight: "500"
    },
    formOptions: {
      margin: "8px 0"
    },
    checkboxLabel: {
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
      fontSize: "0.875rem",
      color: "#6b7280",
      cursor: "pointer"
    },
    checkmark: {
      width: "18px",
      height: "18px",
      border: "2px solid #d1d5db",
      borderRadius: "4px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      transition: "all 0.2s ease"
    },
    checkmarkChecked: {
      background: "#4f46e5",
      borderColor: "#4f46e5"
    },
    link: {
      color: "#4f46e5",
      textDecoration: "none",
      fontWeight: "500"
    },
    linkHover: {
      textDecoration: "underline"
    },
    submitButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      padding: "16px 24px",
      background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
      color: "white",
      border: "none",
      borderRadius: "12px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      position: "relative",
      overflow: "hidden"
    },
    submitButtonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 8px 25px rgba(79, 70, 229, 0.3)"
    },
    submitButtonDisabled: {
      opacity: 0.7,
      cursor: "not-allowed"
    },
    spinner: {
      width: "18px",
      height: "18px",
      border: "2px solid transparent",
      borderTop: "2px solid white",
      borderRadius: "50%",
      animation: "spin 1s linear infinite"
    },
    buttonIcon: {
      fontSize: "1.125rem"
    },
    divider: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      color: "#9ca3af",
      fontSize: "0.875rem",
      margin: "16px 0"
    },
    dividerLine: {
      content: "",
      flex: 1,
      height: "1px",
      background: "#e5e7eb"
    },
    socialAuth: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px"
    },
    socialButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      padding: "12px 16px",
      border: "2px solid #e5e7eb",
      borderRadius: "8px",
      background: "#fff",
      color: "#374151",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease"
    },
    socialButtonHover: {
      borderColor: "#4f46e5",
      background: "#f8fafc"
    },
    socialIcon: {
      fontSize: "1.125rem"
    },
    authRedirect: {
      textAlign: "center",
      marginTop: "24px",
      color: "#6b7280",
      fontSize: "0.875rem"
    },
    redirectLink: {
      color: "#4f46e5",
      textDecoration: "none",
      fontWeight: "600"
    },
    sidepanel: {
      background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
      color: "white",
      padding: "48px 32px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    },
    sidepanelContent: {
      display: "flex",
      flexDirection: "column",
      gap: "48px"
    },
    testimonial: {
      background: "rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(10px)",
      padding: "24px",
      borderRadius: "16px",
      border: "1px solid rgba(255, 255, 255, 0.2)"
    },
    testimonialText: {
      fontStyle: "italic",
      marginBottom: "20px",
      lineHeight: "1.6"
    },
    testimonialAuthor: {
      display: "flex",
      alignItems: "center",
      gap: "12px"
    },
    authorAvatar: {
      fontSize: "2rem"
    },
    authorName: {
      fontWeight: "600",
      marginBottom: "2px"
    },
    authorRole: {
      fontSize: "0.875rem",
      opacity: 0.8
    },
    featuresList: {
      display: "flex",
      flexDirection: "column",
      gap: "16px"
    },
    featureItem: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      fontWeight: "500"
    },
    featureIcon: {
      fontSize: "1.25rem"
    }
  };

  // Inline styles for dynamic states
  const getInputStyle = () => ({
    ...styles.formInput,
    ...(document.activeElement?.name === 'name' && styles.formInputFocus)
  });

  const getSubmitButtonStyle = () => ({
    ...styles.submitButton,
    ...(isLoading && styles.submitButtonDisabled)
  });

  const getStrengthBarStyle = () => ({
    ...styles.strengthBar,
    ...(formData.password.length >= 6 ? styles.strengthBarStrong : styles.strengthBarWeak),
    width: `${Math.min((formData.password.length / 6) * 100, 100)}%`
  });

  return (
    <div style={styles.container}>
      {/* Background Animation */}
      <div style={styles.backgroundShapes}>
        <div style={{...styles.shape, ...styles.shape1}}></div>
        <div style={{...styles.shape, ...styles.shape2}}></div>
        <div style={{...styles.shape, ...styles.shape3}}></div>
      </div>

      <div style={styles.content}>
        {/* Main Form */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.logo}>
              <span style={styles.logoIcon}>🎯</span>
              <span>CareerPath</span>
            </div>
            <h1 style={styles.cardTitle}>Create Your Account</h1>
            <p style={styles.cardSubtitle}>
              Join thousands of users shaping their future careers
            </p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            {error && (
              <div style={styles.errorMessage}>
                <span>⚠️</span>
                {error}
              </div>
            )}

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>
                Full Name
                <span style={styles.required}>*</span>
              </label>
              <div style={styles.inputContainer}>
                <span style={styles.inputIcon}>👤</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  style={getInputStyle()}
                  required
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>
                Email Address
                <span style={styles.required}>*</span>
              </label>
              <div style={styles.inputContainer}>
                <span style={styles.inputIcon}>✉️</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  style={styles.formInput}
                  required
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>
                Account Type
                <span style={styles.required}>*</span>
              </label>
              <div style={styles.roleSelector}>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  style={styles.roleSelect}
                >
                  <option value="student">🎓 Student</option>
                  <option value="institute">🏫 Institution</option>
                  <option value="company">💼 Company</option>
                  <option value="admin">⚙️ Admin</option>
                </select>
                <div style={styles.roleDescription}>
                  {roleDescriptions[formData.role]}
                </div>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>
                Password
                <span style={styles.required}>*</span>
              </label>
              <div style={styles.inputContainer}>
                <span style={styles.inputIcon}>🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  style={styles.formInput}
                  required
                />
                <button
                  type="button"
                  style={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <div style={styles.passwordStrength}>
                <div style={getStrengthBarStyle()}></div>
                <span style={styles.strengthText}>
                  {formData.password.length >= 6 ? "Strong password" : "Minimum 6 characters"}
                </span>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>
                Confirm Password
                <span style={styles.required}>*</span>
              </label>
              <div style={styles.inputContainer}>
                <span style={styles.inputIcon}>🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  style={styles.formInput}
                  required
                />
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <div style={styles.passwordMismatch}>
                  Passwords do not match
                </div>
              )}
            </div>

            <div style={styles.formOptions}>
              <label style={styles.checkboxLabel}>
                <input type="checkbox" required />
                <span style={styles.checkmark}></span>
                I agree to the <Link to="/terms" style={styles.link}>Terms of Service</Link> and <Link to="/privacy" style={styles.link}>Privacy Policy</Link>
              </label>
            </div>

            <button
              type="submit"
              style={getSubmitButtonStyle()}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div style={styles.spinner}></div>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <span style={styles.buttonIcon}>🚀</span>
                </>
              )}
            </button>

            <div style={styles.divider}>
              <div style={styles.dividerLine}></div>
              <span>Or continue with</span>
              <div style={styles.dividerLine}></div>
            </div>

            <div style={styles.socialAuth}>
              <button type="button" style={styles.socialButton}>
                <span style={styles.socialIcon}>🔍</span>
                Google
              </button>
              <button type="button" style={styles.socialButton}>
                <span style={styles.socialIcon}>💼</span>
                LinkedIn
              </button>
            </div>

            <div style={styles.authRedirect}>
              <p>
                Already have an account?{" "}
                <Link to="/login" style={styles.redirectLink}>
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Side Panel */}
        <div style={styles.sidepanel}>
          <div style={styles.sidepanelContent}>
            <div style={styles.testimonial}>
              <div style={styles.testimonialText}>
                "This platform helped me discover my perfect career path and connect with top institutions in Lesotho."
              </div>
              <div style={styles.testimonialAuthor}>
                <div style={styles.authorAvatar}>👩‍🎓</div>
                <div>
                  <div style={styles.authorName}>Mary Molapo</div>
                  <div style={styles.authorRole}>Computer Science Student</div>
                </div>
              </div>
            </div>

            <div style={styles.featuresList}>
              <div style={styles.featureItem}>
                <span style={styles.featureIcon}>🎯</span>
                <span>AI Career Matching</span>
              </div>
              <div style={styles.featureItem}>
                <span style={styles.featureIcon}>🏫</span>
                <span>50+ Institutions</span>
              </div>
              <div style={styles.featureItem}>
                <span style={styles.featureIcon}>💼</span>
                <span>Career Placement</span>
              </div>
              <div style={styles.featureItem}>
                <span style={styles.featureIcon}>🌟</span>
                <span>10,000+ Success Stories</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          input:focus {
            outline: none;
            border-color: #4f46e5 !important;
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1) !important;
          }

          select:focus {
            outline: none;
            border-color: #4f46e5 !important;
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1) !important;
          }

          button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(79, 70, 229, 0.3);
          }

          .password-toggle:hover {
            background: #f3f4f6 !important;
          }

          .social-button:hover {
            border-color: #4f46e5 !important;
            background: #f8fafc !important;
          }

          .link:hover {
            text-decoration: underline;
          }

          input[type="checkbox"]:checked + .checkmark {
            background: #4f46e5;
            border-color: #4f46e5;
          }

          input[type="checkbox"]:checked + .checkmark::after {
            content: "✓";
            color: white;
            font-size: 12px;
            font-weight: bold;
          }

          @media (max-width: 1024px) {
            .register-content {
              grid-template-columns: 1fr !important;
              max-width: 500px !important;
            }
            
            .register-sidepanel {
              display: none !important;
            }
          }

          @media (max-width: 640px) {
            .register-container {
              padding: 0 !important;
              background: white !important;
            }
            
            .register-content {
              border-radius: 0 !important;
              box-shadow: none !important;
            }
            
            .register-card {
              padding: 32px 24px !important;
            }
            
            .card-title {
              font-size: 1.75rem !important;
            }
            
            .social-auth {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 480px) {
            .register-card {
              padding: 24px 16px !important;
            }
            
            .card-title {
              font-size: 1.5rem !important;
            }
          }
        `}
      </style>
    </div>
  );
}