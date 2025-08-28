
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BarChart3,
  Users,
  Plus,
  TrendingUp,
  LogOut,
  Menu,
  X,
  User,
} from "lucide-react";

// 🔹 Keep menuItems outside to avoid recreation on each render
const menuItems = [
  { name: "Dashboard", path: "/admin", icon: BarChart3 },
  { name: "Candidates", path: "/admin-candidate", icon: Users },
  { name: "Create Quiz", path: "/create-quiz", icon: Plus },
  { name: "Results", path: "/admin-result", icon: TrendingUp },
];

function AdminSideBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard");
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  //  Set active menu based on route
  useEffect(() => {
    const currentItem = menuItems.find((item) => item.path === location.pathname);
    if (currentItem) {
      setActiveItem(currentItem.name);
    }
  }, [location.pathname]);

  //  useCallback to prevent re-renders
  const handleNavigate = useCallback(
    (path, itemName) => {
      navigate(path);
      setActiveItem(itemName);
      setSidebarOpen(false); // close sidebar on mobile
    },
    [navigate]
  );

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate("/admin-login");
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Mobile Toggle Button */}
      <button
        aria-label="Toggle Sidebar"
        className="fixed top-4 left-4 z-50 lg:hidden bg-blue-600 text-white p-2 rounded-md shadow-lg hover:bg-blue-700 transition-colors duration-200"
        onClick={toggleSidebar}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 lg:w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:static lg:shadow-lg`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <h2 className="text-2xl font-bold text-white">Questify</h2>
          <button
            aria-label="Close Sidebar"
            className="lg:hidden text-white hover:text-gray-200 transition-colors duration-200"
            onClick={toggleSidebar}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map(({ name, path, icon: Icon }) => (
            <button
              key={name}
              onClick={() => handleNavigate(path, name)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left font-medium transition-all duration-200 transform hover:scale-[1.02] 
                ${
                  activeItem === name
                    ? "bg-blue-50 text-blue-700 border-r-4 border-blue-600 shadow-md"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
            >
              <Icon className="w-5 h-5" />
              <span>{name}</span>
              {activeItem === name && (
                <span className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default AdminSideBar;

