import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./adminAuth.css"; // Import CSS

const AdminAuth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Simulating authentication (Replace with actual backend logic)
    console.log(isSignUp ? "Admin Signing up..." : "Admin Logging in...");

    alert(isSignUp ? "Admin Sign up successful!" : "Admin Login successful!");

    // Redirect to Admin Dashboard (Change "/admin-dashboard" as needed)
    navigate("/admin-dashboard");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">{isSignUp ? "Admin Sign Up" : "Admin Login"}</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="auth-input"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="auth-input"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="auth-button">
            {isSignUp ? "Sign Up" : "Login"}
          </button>
        </form>
        <p className="auth-toggle" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
        </p>
        <button onClick={() => navigate("/")} className="back-button">
          ⬅ Back
        </button>
      </div>
    </div>
  );
};

export default AdminAuth;
