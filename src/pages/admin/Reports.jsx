import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useAppData } from "../../context/ApplicationContext";
import { useAuth } from "../../context/AuthContext";

export default function Reports() {
  const { institutions, faculties, courses, applications, companies, jobs } = useAppData();
  const { user } = useAuth();

  const [selectedTimeframe, setSelectedTimeframe] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const adminLinks = [
    { to: "/admin/institutions", label: "Manage Institutions" },
    { to: "/admin/faculties", label: "Manage Faculties" },
    { to: "/admin/courses", label: "Manage Courses" },
    { to: "/admin/companies", label: "Manage Companies" },
    { to: "/admin/reports", label: "Reports & Analytics" },
    { to: "/admin/admissions", label: "Publish Admissions" },
    { to: "/admin/users", label: "Monitor Users" },
  ];

  const stats = {
    institutions: institutions.length,
    faculties: faculties.length,
    courses: courses.length,
    applications: applications.length,
    companies: companies.length,
    jobs: jobs.length
  };

  const getGrowthRate = (current, previous) => {
    if (previous === 0) return 100;
    return Math.round(((current - previous) / previous) * 100);
  };

  const getStatusDistribution = () => {
    const statusCount = {
      pending: applications.filter(app => app.status === "pending").length,
      admitted: applications.filter(app => app.status === "admitted").length,
      rejected: applications.filter(app => app.status === "rejected").length,
      under_review: applications.filter(app => app.status === "under_review").length
    };
    return statusCount;
  };

  const statusDistribution = getStatusDistribution();
  const admissionRate = applications.length > 0 ? Math.round((statusDistribution.admitted / applications.length) * 100) : 0;

  const StatCard = ({ title, value, icon, color, growth }) => (
    <div className="stat-card">
      <div className="stat-header">
        <div className="stat-icon" style={{ backgroundColor: color }}>
          {icon}
        </div>
        <div className="stat-trend">
          <span className={`trend ${growth >= 0 ? 'positive' : 'negative'}`}>
            {growth >= 0 ? '↗' : '↘'} {Math.abs(growth)}%
          </span>
        </div>
      </div>
      <div className="stat-content">
        <h3 className="stat-value">{value}</h3>
        <p className="stat-title">{title}</p>
        <div className="stat-progress">
          <div 
            className="progress-bar" 
            style={{ 
              width: `${Math.min(100, (value / Math.max(...Object.values(stats))) * 100)}%`,
              backgroundColor: color
            }}
          ></div>
        </div>
      </div>
    </div>
  );

  const ChartPlaceholder = ({ title, description, data, color }) => (
    <div className="chart-card">
      <div className="chart-header">
        <h4>{title}</h4>
        <span className="chart-info">ℹ️</span>
      </div>
      <div className="chart-placeholder">
        <div className="chart-bars">
          {Object.entries(data).map(([key, value], index) => (
            <div key={key} className="chart-bar-container">
              <div 
                className="chart-bar"
                style={{ 
                  height: `${(value / Math.max(...Object.values(data))) * 80}%`,
                  backgroundColor: color
                }}
              ></div>
              <span className="bar-label">{key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="chart-description">{description}</p>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="reports-container">
        <Sidebar links={adminLinks} />
        
        <main className="reports-main">
          {/* Header Section */}
          <div className="reports-header">
            <div className="header-content">
              <div className="header-text">
                <h1>Reports & Analytics</h1>
                <p>Comprehensive insights and system performance metrics</p>
              </div>
              <div className="header-stats">
                <div className="stat-card-mini">
                  <div className="stat-icon">📊</div>
                  <div className="stat-info">
                    <span className="stat-number">{admissionRate}%</span>
                    <span className="stat-label">Admission Rate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Overview */}
          <div className="stats-overview">
            <StatCard 
              title="Total Institutions" 
              value={stats.institutions} 
              icon="🏛️" 
              color="#3b82f6"
              growth={12}
            />
            <StatCard 
              title="Total Faculties" 
              value={stats.faculties} 
              icon="🎓" 
              color="#8b5cf6"
              growth={8}
            />
            <StatCard 
              title="Total Courses" 
              value={stats.courses} 
              icon="📚" 
              color="#06b6d4"
              growth={15}
            />
            <StatCard 
              title="Total Applications" 
              value={stats.applications} 
              icon="📝" 
              color="#10b981"
              growth={23}
            />
            <StatCard 
              title="Partner Companies" 
              value={stats.companies} 
              icon="🏢" 
              color="#f59e0b"
              growth={5}
            />
            <StatCard 
              title="Available Jobs" 
              value={stats.jobs} 
              icon="💼" 
              color="#ef4444"
              growth={18}
            />
          </div>

          {/* Filters and Controls */}
          <div className="filters-section">
            <div className="search-box">
              <div className="search-icon">🔍</div>
              <input
                type="text"
                placeholder="Search reports and insights..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-row">
              <div className="filter-item">
                <label className="filter-label">Timeframe:</label>
                <select 
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Time</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last Quarter</option>
                  <option value="1y">Last Year</option>
                </select>
              </div>

              <div className="filter-item">
                <label className="filter-label">Category:</label>
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Categories</option>
                  <option value="admissions">Admissions</option>
                  <option value="academic">Academic</option>
                  <option value="career">Career</option>
                  <option value="system">System</option>
                </select>
              </div>

              <div className="filter-item">
                <label className="filter-label">Export:</label>
                <select className="filter-select">
                  <option value="">Export Report</option>
                  <option value="pdf">PDF Format</option>
                  <option value="excel">Excel Format</option>
                  <option value="csv">CSV Format</option>
                </select>
              </div>
            </div>
          </div>

          {/* Charts and Visualizations */}
          <div className="charts-section">
            <div className="charts-grid">
              <ChartPlaceholder 
                title="Application Status Distribution"
                description="Breakdown of all student applications by current status"
                data={statusDistribution}
                color="#10b981"
              />
              <ChartPlaceholder 
                title="System Entities Overview"
                description="Distribution of main system entities and resources"
                data={stats}
                color="#3b82f6"
              />
            </div>
          </div>

          {/* Detailed Reports */}
          <div className="detailed-reports">
            <div className="section-header">
              <h2>Detailed System Reports</h2>
              <span className="results-count">Last updated: Today</span>
            </div>

            <div className="reports-grid">
              <div className="report-card">
                <div className="report-header">
                  <div className="report-icon">🎓</div>
                  <h3>Academic Overview</h3>
                </div>
                <div className="report-content">
                  <div className="report-item">
                    <span className="item-label">Institutions</span>
                    <span className="item-value">{stats.institutions}</span>
                  </div>
                  <div className="report-item">
                    <span className="item-label">Faculties</span>
                    <span className="item-value">{stats.faculties}</span>
                  </div>
                  <div className="report-item">
                    <span className="item-label">Courses</span>
                    <span className="item-value">{stats.courses}</span>
                  </div>
                  <div className="report-item highlight">
                    <span className="item-label">Admission Rate</span>
                    <span className="item-value">{admissionRate}%</span>
                  </div>
                </div>
              </div>

              <div className="report-card">
                <div className="report-header">
                  <div className="report-icon">💼</div>
                  <h3>Career Center</h3>
                </div>
                <div className="report-content">
                  <div className="report-item">
                    <span className="item-label">Partner Companies</span>
                    <span className="item-value">{stats.companies}</span>
                  </div>
                  <div className="report-item">
                    <span className="item-label">Available Jobs</span>
                    <span className="item-value">{stats.jobs}</span>
                  </div>
                  <div className="report-item">
                    <span className="item-label">Student Applications</span>
                    <span className="item-value">{stats.applications}</span>
                  </div>
                  <div className="report-item highlight">
                    <span className="item-label">Active Partnerships</span>
                    <span className="item-value">{Math.round(stats.companies * 0.7)}</span>
                  </div>
                </div>
              </div>

              <div className="report-card">
                <div className="report-header">
                  <div className="report-icon">📊</div>
                  <h3>Performance Metrics</h3>
                </div>
                <div className="report-content">
                  <div className="report-item">
                    <span className="item-label">System Uptime</span>
                    <span className="item-value">99.8%</span>
                  </div>
                  <div className="report-item">
                    <span className="item-label">Active Users</span>
                    <span className="item-value">1,247</span>
                  </div>
                  <div className="report-item">
                    <span className="item-label">Data Processed</span>
                    <span className="item-value">2.4GB</span>
                  </div>
                  <div className="report-item highlight">
                    <span className="item-label">Response Time</span>
                    <span className="item-value">128ms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Insights */}
          <div className="insights-section">
            <h3>🚀 Key Insights & Recommendations</h3>
            <div className="insights-grid">
              <div className="insight-card">
                <div className="insight-icon">📈</div>
                <div className="insight-content">
                  <h4>Growth Opportunity</h4>
                  <p>Applications increased by 23% this month. Consider expanding course offerings.</p>
                </div>
              </div>
              <div className="insight-card">
                <div className="insight-icon">🎯</div>
                <div className="insight-content">
                  <h4>Admission Efficiency</h4>
                  <p>{admissionRate}% admission rate with {statusDistribution.pending} pending decisions.</p>
                </div>
              </div>
              <div className="insight-card">
                <div className="insight-icon">🤝</div>
                <div className="insight-content">
                  <h4>Partnership Growth</h4>
                  <p>{stats.companies} companies actively recruiting from your institution.</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .reports-container {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .reports-main {
          flex: 1;
          padding: 30px;
          margin-left: 280px;
        }

        .reports-header {
          background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%);
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
          background: linear-gradient(135deg, #fff, #e0f2fe);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header-text p {
          font-size: 1.1rem;
          opacity: 0.9;
          max-width: 500px;
        }

        .stat-card-mini {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 25px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .stat-card-mini .stat-icon {
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

        .stats-overview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          border-radius: 15px;
          padding: 25px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .stat-trend .trend {
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .trend.positive {
          background: #dcfce7;
          color: #166534;
        }

        .trend.negative {
          background: #fecaca;
          color: #dc2626;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1f2937;
          margin-bottom: 5px;
        }

        .stat-title {
          color: #6b7280;
          font-weight: 500;
          margin-bottom: 15px;
        }

        .stat-progress {
          width: 100%;
          height: 6px;
          background: #f1f5f9;
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .filters-section {
          background: white;
          border-radius: 15px;
          padding: 25px;
          margin-bottom: 30px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
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
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .filter-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .filter-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .filter-label {
          font-weight: 600;
          color: #374151;
          font-size: 0.9rem;
        }

        .filter-select {
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          background: white;
        }

        .filter-select:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .charts-section {
          margin-bottom: 30px;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 20px;
        }

        .chart-card {
          background: white;
          border-radius: 15px;
          padding: 25px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .chart-header h4 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1f2937;
        }

        .chart-info {
          color: #6b7280;
          cursor: help;
        }

        .chart-placeholder {
          height: 200px;
          background: #f8fafc;
          border-radius: 10px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding: 20px;
          margin-bottom: 15px;
        }

        .chart-bars {
          display: flex;
          align-items: flex-end;
          gap: 15px;
          height: 100%;
          width: 100%;
        }

        .chart-bar-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          height: 100%;
        }

        .chart-bar {
          width: 30px;
          border-radius: 4px 4px 0 0;
          transition: all 0.3s ease;
          min-height: 10px;
        }

        .bar-label {
          margin-top: 8px;
          font-size: 0.7rem;
          color: #6b7280;
          text-align: center;
          font-weight: 500;
          text-transform: capitalize;
        }

        .chart-description {
          color: #6b7280;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .detailed-reports {
          background: white;
          border-radius: 20px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .section-header {
          margin-bottom: 25px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .section-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
        }

        .results-count {
          color: #6b7280;
          font-size: 0.9rem;
        }

        .reports-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .report-card {
          border: 2px solid #f1f5f9;
          border-radius: 15px;
          padding: 25px;
          transition: all 0.3s ease;
        }

        .report-card:hover {
          border-color: #3b82f6;
          transform: translateY(-2px);
        }

        .report-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .report-icon {
          font-size: 1.5rem;
        }

        .report-header h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1f2937;
        }

        .report-content {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .report-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .report-item:last-child {
          border-bottom: none;
        }

        .report-item.highlight {
          background: #f0f9ff;
          margin: 0 -10px;
          padding: 12px 10px;
          border-radius: 8px;
          border: none;
        }

        .item-label {
          color: #6b7280;
          font-weight: 500;
        }

        .item-value {
          color: #1f2937;
          font-weight: 600;
        }

        .insights-section {
          background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%);
          border-radius: 20px;
          padding: 40px;
          color: white;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .insights-section h3 {
          text-align: center;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 30px;
          color: white;
        }

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .insight-card {
          background: rgba(255, 255, 255, 0.1);
          padding: 25px;
          border-radius: 15px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }

        .insight-card:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-5px);
        }

        .insight-icon {
          font-size: 2rem;
          margin-bottom: 15px;
        }

        .insight-card h4 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 8px;
          color: white;
        }

        .insight-card p {
          font-size: 0.9rem;
          opacity: 0.8;
          line-height: 1.5;
        }

        @media (max-width: 1024px) {
          .reports-main {
            margin-left: 0;
            padding: 20px;
          }
          
          .header-content {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .charts-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .reports-header {
            padding: 25px;
          }
          
          .header-text h1 {
            font-size: 2rem;
          }
          
          .stats-overview {
            grid-template-columns: 1fr;
          }
          
          .filter-row {
            grid-template-columns: 1fr;
          }
          
          .reports-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .reports-main {
            padding: 15px;
          }
          
          .reports-header {
            padding: 20px;
          }
          
          .header-text h1 {
            font-size: 1.75rem;
          }
          
          .detailed-reports {
            padding: 20px;
          }
        }
      `}</style>
    </>
  );
}