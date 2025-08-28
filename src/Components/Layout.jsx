// import AdminSideBar from "./AdminSideBar";
// import DashboardStats from "./DashboardStats";
// import Footer from "./Footer";
// import Header from "./Header";
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const Layout = ({ children }) => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage?.getItem("adminToken");

//     if (!token) {
//       navigate("/");
//     }
//   }, [navigate]);

//   return (
//     <div className="flex h-screen bg-gray-50">
//       <AdminSideBar />
//       <main className="flex-1 flex flex-col overflow-hidden">
//         <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
//           <Header />
//         </header>

//         <div className="flex-1 overflow-auto px-6 py-6">
//           <div className="mb-8">
//             <DashboardStats />
//           </div>

//           <div className="max-w-7xl mx-auto">{children}</div>
//         </div>
//         <footer className="bg-white border-t border-gray-200 px-6 py-4 mt-auto">
//           <Footer />
//         </footer>
//       </main>
//     </div>
//   );
// };

// export default Layout;
import AdminSideBar from "./AdminSideBar";
import DashboardStats from "./DashboardStats";
import Footer from "./Footer";
import Header from "./Header";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage?.getItem("adminToken");

    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  // 🔹 Logout handler
  const handleLogout = () => {
    localStorage.removeItem("adminToken"); // remove token
    navigate("/"); // redirect to login page
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSideBar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <Header />
          {/* 🔹 Logout Button */}
          <button
            onClick={handleLogout}
            className="ml-4 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg shadow hover:bg-red-600 transition"
          >
            Logout
          </button>
        </header>

        <div className="flex-1 overflow-auto px-6 py-6">
          <div className="mb-8">
            <DashboardStats />
          </div>

          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
        <footer className="bg-white border-t border-gray-200 px-6 py-4 mt-auto">
          <Footer />
        </footer>
      </main>
    </div>
  );
};

export default Layout;
