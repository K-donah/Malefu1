import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-icon">🎯</span>
            <span className="logo-text">CareerPath LS</span>
          </div>
          <div className="nav-links">
            <Link to="/courses" className="nav-link">Courses</Link>
            <Link to="/institutions" className="nav-link">Institutions</Link>
            <Link to="/careers" className="nav-link">Careers</Link>
            <Link to="/login" className="nav-link secondary">Sign In</Link>
            <Link to="/register" className="nav-link primary">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
<section className="hero-section">
  <div className="hero-background">
    <div className="hero-particles" id="particles-js"></div>
    <div className="hero-gradient"></div>
  </div>
  
  <div className="hero-content">
    <div className="hero-text-content">
      <div className="hero-badges">
        <div className="badge badge-primary">
          <span className="badge-icon">🌟</span>
          Trusted by 10,000+ Students
        </div>
        <div className="badge badge-secondary">
          <span className="badge-icon">🏆</span>
          #1 Career Platform in Lesotho
        </div>
      </div>
      
      <h1 className="hero-title">
        <span className="title-line">Shape Your Future</span>
        <span className="title-line">
          With <span className="text-gradient">Smart Career</span>
        </span>
        <span className="title-line">Guidance</span>
      </h1>
      
      <p className="hero-description">
        Discover your perfect career path with AI-powered recommendations, 
        connect directly with top institutions, and get personalized guidance 
        to unlock your potential in Lesotho's growing job market.
      </p>
      
      <div className="hero-actions">
        <Link to="/career-assessment" className="btn btn-primary">
          <span className="btn-icon">🔍</span>
          <span>Find My Career Path</span>
          <div className="btn-shine"></div>
        </Link>
        
        <Link to="/institutions" className="btn btn-secondary">
          <span className="btn-icon">🏫</span>
          <span>Browse Institutions</span>
        </Link>
        
        <div className="play-demo">
          <button className="demo-btn">
            <div className="play-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
              </svg>
            </div>
            <span>Watch Demo</span>
          </button>
        </div>
      </div>
      
      <div className="hero-features">
        <div className="feature">
          <div className="feature-icon">⚡</div>
          <span>AI Career Matching</span>
        </div>
        <div className="feature">
          <div className="feature-icon">🎯</div>
          <span>Personalized Roadmaps</span>
        </div>
        <div className="feature">
          <div className="feature-icon">💼</div>
          <span>Job Placement Support</span>
        </div>
      </div>
    </div>
    
    <div className="hero-visual">
      <div className="floating-card card-1">
        <div className="card-header">
          <div className="card-avatar">🎓</div>
          <div className="card-info">
            <div className="card-name">Computer Science</div>
            <div className="card-status">NUL • 98% Match</div>
          </div>
        </div>
        <div className="card-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{width: '98%'}}></div>
          </div>
        </div>
      </div>
      
      <div className="floating-card card-2">
        <div className="card-header">
          <div className="card-avatar">💼</div>
          <div className="card-info">
            <div className="card-name">Business Admin</div>
            <div className="card-status">LIM • 87% Match</div>
          </div>
        </div>
        <div className="card-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{width: '87%'}}></div>
          </div>
        </div>
      </div>
      
      <div className="floating-card card-3">
        <div className="card-header">
          <div className="card-avatar">⚡</div>
          <div className="card-info">
            <div className="card-name">Your Career Match</div>
            <div className="card-status">Ready to Discover</div>
          </div>
        </div>
        <button className="discover-btn">
          Discover Yours
        </button>
      </div>
      
      <div className="hero-graphic">
        <div className="graphic-circle circle-1"></div>
        <div className="graphic-circle circle-2"></div>
        <div className="graphic-circle circle-3"></div>
        <div className="graphic-center">
          <div className="center-icon">🚀</div>
        </div>
      </div>
    </div>
  </div>
  
  <div className="hero-scroll-indicator">
    <div className="scroll-text">Explore More</div>
    <div className="scroll-arrow">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  </div>
</section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Your Path to Success</h2>
            <p className="section-subtitle">Three simple steps to launch your career</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-number">01</div>
              <div className="feature-icon">🔍</div>
              <h3 className="feature-title">Discover & Explore</h3>
              <p className="feature-description">
                Browse through hundreds of courses and programs from accredited institutions across Lesotho
              </p>
              <div className="feature-tags">
                <span className="tag">Courses</span>
                <span className="tag">Programs</span>
                <span className="tag">Institutions</span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-number">02</div>
              <div className="feature-icon">📝</div>
              <h3 className="feature-title">Apply & Enroll</h3>
              <p className="feature-description">
                Streamlined application process to multiple institutions with real-time tracking
              </p>
              <div className="feature-tags">
                <span className="tag">Applications</span>
                <span className="tag">Admissions</span>
                <span className="tag">Tracking</span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-number">03</div>
              <div className="feature-icon">💼</div>
              <h3 className="feature-title">Launch Career</h3>
              <p className="feature-description">
                Connect with employers and kickstart your professional journey with career support
              </p>
              <div className="feature-tags">
                <span className="tag">Jobs</span>
                <span className="tag">Internships</span>
                <span className="tag">Placement</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Shape Your Future?</h2>
            <p className="cta-description">
              Join thousands of students who have found their path through our platform
            </p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-light">
                Create Free Account
              </Link>
              <Link to="/contact" className="btn btn-outline-light">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="logo-icon">🎯</span>
                <span className="logo-text">CareerPath LS</span>
              </div>
              <p className="footer-description">
                Empowering Basotho youth through education and career guidance
              </p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Platform</h4>
                <Link to="/courses">Courses</Link>
                <Link to="/institutions">Institutions</Link>
                <Link to="/careers">Careers</Link>
                <Link to="/blog">Blog</Link>
              </div>
              <div className="footer-column">
                <h4>Support</h4>
                <Link to="/help">Help Center</Link>
                <Link to="/contact">Contact Us</Link>
                <Link to="/faq">FAQ</Link>
              </div>
              <div className="footer-column">
                <h4>Legal</h4>
                <Link to="/privacy">Privacy Policy</Link>
                <Link to="/terms">Terms of Service</Link>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 CareerPath Lesotho. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;