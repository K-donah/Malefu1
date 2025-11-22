import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
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

    if (!formData.email || !formData.password) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }

    const res = await login({ email: formData.email, password: formData.password });
    setIsLoading(false);
    
    if (!res.success) {
      setError("Invalid credentials");
      return;
    }

    const role = res.user?.role;
    const redirectPaths = {
      admin: "/admin",
      institute: "/institute",
      student: "/student/dashboard",
      company: "/company"
    };
    
    nav(redirectPaths[role] || "/");
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
      position: "relative"
    },
    backgroundShapes: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: "hidden"
    },
    shape: {
      position: "absolute",
      borderRadius: "50%",
      background: "rgba(255, 255, 255, 0.1)",
      animation: "float 6s ease-in-out infinite"
    },
    content: {
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      padding: "48px",
      borderRadius: "24px",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
      width: "100%",
      maxWidth: "440px",
      zIndex: 1
    },
    header: {
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
    title: {
      fontSize: "2rem",
      fontWeight: "800",
      color: "#1f2937",
      marginBottom: "8px"
    },
    subtitle: {
      color: "#6b7280",
      fontSize: "1rem"
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "24px"
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
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px"
    },
    label: {
      fontWeight: "600",
      color: "#374151",
      fontSize: "0.875rem"
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
    input: {
      width: "100%",
      padding: "12px 16px 12px 48px",
      border: "2px solid #e5e7eb",
      borderRadius: "12px",
      fontSize: "1rem",
      transition: "all 0.3s ease",
      background: "#fff"
    },
    passwordToggle: {
      position: "absolute",
      right: "16px",
      background: "none",
      border: "none",
      fontSize: "1.125rem",
      cursor: "pointer",
      padding: "4px",
      borderRadius: "4px"
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
    spinner: {
      width: "18px",
      height: "18px",
      border: "2px solid transparent",
      borderTop: "2px solid white",
      borderRadius: "50%",
      animation: "spin 1s linear infinite"
    },
    divider: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      color: "#9ca3af",
      fontSize: "0.875rem",
      margin: "16px 0"
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
    footer: {
      textAlign: "center",
      marginTop: "24px",
      color: "#6b7280",
      fontSize: "0.875rem"
    },
    link: {
      color: "#4f46e5",
      textDecoration: "none",
      fontWeight: "600"
    }
  };

  return (
    <div style={styles.container}>
      {/* Background Animation */}
      <div style={styles.backgroundShapes}>
        <div style={{...styles.shape, width: "120px", height: "120px", top: "15%", left: "10%"}}></div>
        <div style={{...styles.shape, width: "80px", height: "80px", top: "65%", right: "15%", animationDelay: "2s"}}></div>
        <div style={{...styles.shape, width: "60px", height: "60px", bottom: "20%", left: "20%", animationDelay: "4s"}}></div>
      </div>

      <div style={styles.content}>
        <div style={styles.header}>
          <div style={styles.logo}>
            <span>🎯</span>
            <span>CareerPath</span>
          </div>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to continue your career journey</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && (
            <div style={styles.errorMessage}>
              <span>⚠️</span>
              {error}
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputContainer}>
              <span style={styles.inputIcon}>✉️</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputContainer}>
              <span style={styles.inputIcon}>🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                style={styles.input}
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
          </div>

          <div style={{ textAlign: "right" }}>
            <Link to="/forgot-password" style={styles.link}>
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            style={{
              ...styles.submitButton,
              ...(isLoading && { opacity: 0.7, cursor: "not-allowed" })
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div style={styles.spinner}></div>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>

          <div style={styles.divider}>
            <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }}></div>
            <span>Or continue with</span>
            <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }}></div>
          </div>

          <div style={styles.socialAuth}>
            <button type="button" style={styles.socialButton}>
              <span>🔍</span>
              Google
            </button>
            <button type="button" style={styles.socialButton}>
              <span>💼</span>
              LinkedIn
            </button>
          </div>

          <div style={styles.footer}>
            <p>
              Don't have an account?{" "}
              <Link to="/register" style={styles.link}>
                Create account
              </Link>
            </p>
          </div>
        </form>
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
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

          @media (max-width: 480px) {
            .content {
              padding: 32px 24px !important;
              margin: 0 16px !important;
            }
            
            .title {
              font-size: 1.75rem !important;
            }
            
            .social-auth {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
}