
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



  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSideBar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <Header />
      
        </header>

        <div className="flex-1 overflow-auto px-6 py-6">
          <div className="mb-8">
            <DashboardStats />
          </div>

          <div className="max-w">{children}</div>
        </div>
        <footer className="bg-white border-t border-gray-200 px-6 py-4 mt-auto">
          <Footer />
        </footer>
      </main>
    </div>
  );
};

export default Layout;
