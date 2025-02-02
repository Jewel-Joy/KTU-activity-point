import { useNavigate } from "react-router-dom";
import "./userSelection.css"; // Import the CSS file

const UserSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="card">
        <h2 className="heading">Select Your Role</h2>
        <p className="subtext">Are you an Admin or a Student?</p>
        <div className="button-group">
          <button onClick={() => navigate("/admin")} className="button">
            Admin
          </button>
          <button onClick={() => navigate("/student")} className="button">
            Student
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSelection;
