import { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { loginSchema } from "../utils/Schema";

function AdminLogin({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");


  // Formik setup
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setServerError("");
      setLoading(true);
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/auth/login`,
          values
        );

        const { token, userInfo } = response.data;

        localStorage.setItem("adminToken", token);
        localStorage.setItem("adminData", JSON.stringify(userInfo));
        console.log("login successful ",response.data)

        onLogin(); // redirect to dashboard
      } catch (err) {
        if (err.response && err.response.data.message) {
          setServerError(err.response.data.message);
        } else {
          setServerError("Login failed. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        {/* Logo & Heading */}
        <div className="text-center mb-6">
          <svg
            className="mx-auto h-12 w-14 text-blue-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3L4 6v6c0 5.25 3.75 10.125 8 11 4.25-.875 8-5.75 8-11V6l-8-3z"
            />
          </svg>
          <h2 className="mt-2 text-2xl font-bold text-gray-700">
            Questify Admin Access
          </h2>
          <p className="text-gray-500 mt-1">
            Please authenticate to access the admin panel
          </p>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-2">{formik.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          {/* Error */}
          {serverError && <p className="text-red-500 text-sm">{serverError}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login to Admin Panel"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
