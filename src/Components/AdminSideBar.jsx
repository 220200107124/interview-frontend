import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminSideBar.css";

function AdminSideBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleNavigate = (path) => {
    navigate(path);
    setSidebarOpen(false); // auto close sidebar on mobile
  };


  return (
    <>
      {/* Sidebar  */}
      <div>
        <button className="toggle-btn" onClick={toggleSidebar}>
          ☰
        </button>
      </div>
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Questify</h2>
          <button className="close-btn" onClick={toggleSidebar}>
            ✕
          </button>
        </div>
        <nav className="sidebar-nav">
          <button onClick={() => handleNavigate("/admin")}>Dashboard</button>
           <button onClick={() => handleNavigate("/admin-candidate")}>
            Candidates
          </button>
          <button onClick={() => handleNavigate("/create-quiz")}>

            +Quiz
          </button>
         
          <button onClick={() => handleNavigate("/admin-result")}>
            Results
          </button>
        
          <button
            onClick={() => {

              if (window.confirm("Are you sure you want to logout?")) {
                
              localStorage.clear()
                  navigate("/admin-login");

              }
              else{
                navigate("/admin");
              }
            }}
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main content (placeholder) */}
    </>
  );
}

export default AdminSideBar;
