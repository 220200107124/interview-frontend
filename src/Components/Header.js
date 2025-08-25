import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const handleCreateQuiz = () => navigate("/create-quiz");
  const handleLogout = () => {
    
    localStorage.clear();

    navigate("/admin-login");
  };
  return (
    <>
      <h1>Admin Dashboard</h1>
      <div className="header-buttons">
        <button className="creates-btn" onClick={handleCreateQuiz}>
          +Quiz
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </>
  );
}
export default Header;
