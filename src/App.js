import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserSelection from "./pages/userSelection";
import StudentAuth from "./pages/studentAuth";
import AdminAuth from "./pages/adminAuth";
import CertificateUpload from "./pages/certificateUpload";
import AdminDashboard from "./pages/adminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserSelection />} />
        <Route path="/student" element={<StudentAuth />} />
        <Route path="/admin" element={<AdminAuth />} />
        <Route path="/upload-certificate" element={<CertificateUpload />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
