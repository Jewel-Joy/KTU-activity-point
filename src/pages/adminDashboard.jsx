import { useState } from "react";
import { Search, AlertCircle, Award, UserX, Menu } from "lucide-react";
import "./adminDashboard.css";

const AdminDashboard = () => {
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [activeTab, setActiveTab] = useState("search");
  const [studentData, setStudentData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  
  // Dummy data for demonstration
  const dummyStudentRecords = {
    "KTU1234": {
      name: "John Doe",
      certificates: [
        { name: "NSS Volunteer", points: 10, status: "verified" },
        { name: "Hackathon Winner", points: 20, status: "verified" },
        { name: "Technical Workshop", points: 15, status: "flagged", reason: "Invalid signature" },
        { name: "Sports Event", points: 10, status: "verified" },
        { name: "Cultural Fest", points: 12, status: "flagged", reason: "Unclear document" }
      ]
    },
    "KTU5678": {
      name: "Jane Smith",
      certificates: [
        { name: "Internship", points: 20, status: "verified" },
        { name: "Research Paper", points: 25, status: "flagged", reason: "Needs verification" },
        { name: "Coding Contest", points: 18, status: "verified" },
        { name: "Webinar Participation", points: 10, status: "verified" },
        { name: "Robotics Club", points: 15, status: "verified" }
      ]
    }
  };

  // Dummy data for flagged certificates
  const flaggedCertificates = [
    { student: "John Doe", admissionNo: "KTU1234", certificate: "Technical Workshop", reason: "Invalid signature" },
    { student: "John Doe", admissionNo: "KTU1234", certificate: "Cultural Fest", reason: "Unclear document" },
    { student: "Jane Smith", admissionNo: "KTU5678", certificate: "Research Paper", reason: "Needs verification" },
    { student: "Alice Johnson", admissionNo: "KTU9012", certificate: "Sports Medal", reason: "Date mismatch" }
  ];

  // Dummy data for students with low points
  const lowPointsStudents = [
    { name: "Tom Wilson", admissionNo: "KTU2468", totalPoints: 45 },
    { name: "Sarah Davis", admissionNo: "KTU1357", totalPoints: 65 },
    { name: "Mike Brown", admissionNo: "KTU3690", totalPoints: 78 },
    { name: "Emily White", admissionNo: "KTU1598", totalPoints: 82 }
  ];

  const handleSearch = () => {
    if (dummyStudentRecords[admissionNumber]) {
      setStudentData(dummyStudentRecords[admissionNumber]);
      setShowDetails(true);
    } else {
      setStudentData(null);
      setShowDetails(false);
      alert("No records found for the given Admission Number!");
    }
  };

  const getTotalPoints = (certificates) => {
    return certificates.reduce((acc, cert) => acc + cert.points, 0);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>KTU Activity Point Calculation</h1>
          <div className="header-actions">
            <span className="admin-name">Admin</span>
          </div>
        </div>
      </header>

      <div className="dashboard-container">
        <div className="dashboard-sidebar">
          <nav className="dashboard-nav">
            <button 
              className={`nav-item ${activeTab === 'search' ? 'active' : ''}`}
              onClick={() => setActiveTab('search')}
            >
              <Search size={20} />
              <span>Student Search</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'flagged' ? 'active' : ''}`}
              onClick={() => setActiveTab('flagged')}
            >
              <AlertCircle size={20} />
              <span>Flagged Certificates</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'lowPoints' ? 'active' : ''}`}
              onClick={() => setActiveTab('lowPoints')}
            >
              <UserX size={20} />
              <span>Low Activity Points</span>
            </button>
          </nav>
        </div>

        <div className="dashboard-content">
          {activeTab === 'search' && (
            <div className="content-section">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Enter Admission Number"
                  value={admissionNumber}
                  onChange={(e) => setAdmissionNumber(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
              </div>

              {studentData && showDetails && (
                <div className="student-details">
                  <div className="student-header">
                    <div>
                      <h2>{studentData.name}</h2>
                      <p className="admission-number">Admission No: {admissionNumber}</p>
                    </div>
                    <div className="total-points-badge">
                      <Award size={20} />
                      <span>{getTotalPoints(studentData.certificates)} Points</span>
                    </div>
                  </div>

                  <div className="certificates-list">
                    <h3>Certificates</h3>
                    <div className="certificate-grid">
                      {studentData.certificates.map((cert, index) => (
                        <div key={index} className={`certificate-card ${cert.status}`}>
                          <h4>{cert.name}</h4>
                          <div className="certificate-details">
                            <span className="points">{cert.points} points</span>
                            {cert.status === 'flagged' && (
                              <span className="flag-reason">{cert.reason}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'flagged' && (
            <div className="content-section">
              <h2>Flagged Certificates</h2>
              <div className="flagged-list">
                {flaggedCertificates.map((item, index) => (
                  <div key={index} className="flagged-item">
                    <div className="flagged-header">
                      <h3>{item.student}</h3>
                      <span className="admission-number">{item.admissionNo}</span>
                    </div>
                    <div className="flagged-details">
                      <p><strong>Certificate:</strong> {item.certificate}</p>
                      <p><strong>Reason:</strong> <span className="flag-reason">{item.reason}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'lowPoints' && (
            <div className="content-section">
              <h2>Students with Low Activity Points</h2>
              <div className="low-points-list">
                {lowPointsStudents.map((student, index) => (
                  <div key={index} className="low-points-item">
                    <div className="student-info">
                      <h3>{student.name}</h3>
                      <span className="admission-number">{student.admissionNo}</span>
                    </div>
                    <div className="points-indicator">
                      <div className="progress-bar">
                        <div 
                          className="progress" 
                          style={{ width: `${(student.totalPoints / 100) * 100}%` }}
                        ></div>
                      </div>
                      <span className="points-text">{student.totalPoints}/100 points</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;