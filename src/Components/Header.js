// import { useState, useRef, useEffect } from "react";
// // import axios from "axios";
// import { User, ChevronDown } from "lucide-react";

// const Header = () => {
//   const userInfo = JSON.parse(localStorage.getItem("adminData"));

//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   // const [adminData, setAdminData] = useState(null);
//   const dropdownRef = useRef(null);
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

//   return (
//     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
//       {/* Page Title */}
//       <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
//         Admin Dashboard
//       </h1>

//       {/* Right Side Actions */}
//       <div className="flex items-center gap-3">
//         {/* Create Quiz Button */}

//         {/* Admin Profile Dropdown */}
//         <div className="relative" ref={dropdownRef}>
//           <button
//             onClick={toggleDropdown}
//             className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
//           >
//             <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
//               <User className="w-4 h-4 text-white" />
//             </div>

//             <ChevronDown
//               className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
//                 isDropdownOpen ? "rotate-180" : ""
//               }`}
//             />
//           </button>

//           {/* Dropdown Menu */}
//           {isDropdownOpen && (
//             <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
//               {/* Admin Profile Info */}

//               {/* Admin Details */}
//               <div className="p-4 bg-gray-50 border-t border-gray-200">
//                 <div className="flex items-center space-x-3">
//                   <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
//                     <User className="w-4 h-4 text-white" />
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-900">
//                       {userInfo?.name}
//                     </p>
//                     <p className="text-xs text-gray-500">{userInfo?.email}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Header;
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, ChevronDown, LogOut } from "lucide-react";

// 🔹 Use the same logout utility function
const handleLogout = (navigate) => {
  if (window.confirm("Are you sure you want to logout?")) {
    // Clear all admin-related localStorage data
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    // Or use localStorage.clear() if you want to clear everything
    
    navigate("/"); // Consistent navigation target
  }
};

const Header = () => {
  const userInfo = JSON.parse(localStorage.getItem("adminData") || "{}");
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
      {/* Page Title - Add left margin on mobile to avoid overlap with toggle button */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight ml-16 lg:ml-0">
        Admin Dashboard
      </h1>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3">
        {/* Admin Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>

            <ChevronDown
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Admin Details */}
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {userInfo?.name || "Admin User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {userInfo?.email || "admin@questify.com"}
                    </p>
                  </div>
                </div>
              </div>

              {/* 🔹 Logout Button with confirmation */}
              <button
                onClick={() => handleLogout(navigate)}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;

