import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiMail, FiLock } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await axios.post(`${apiUrl}/user/login`, { email, password });
  
      if (response.status >= 200 && response.status < 300) {
        const token = response.data?.data?.token;
  
        if (!token) {
          toast.error("Invalid User");
          setLoading(false);
          return;
        }
  
        // Store token in localStorage
        localStorage.setItem("userauthToken", token);
        console.log(token);
  
        toast.success("Logged in successfully!");
  
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
  
      // Handle authentication failures
      if (error.response?.status === 401) {
        // localStorage.removeItem("userauthToken"); 
        toast.error("Invalid email or password. Please try again.");
      } else if (error.response?.status === 403) {
        // localStorage.removeItem("userauthToken");
        toast.error("Access forbidden. Please check your credentials.");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg border border-gray-200">
        <h2 className="text-3xl font-semibold mb-6 text-center text-blue-600">Sign In</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-2 focus-within:ring-2 focus-within:ring-blue-500">
              <FiMail className="text-gray-500 mr-2" />
              <input
                type="email"
                id="email"
                name="email"
                aria-label="Enter your email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full outline-none"
              />
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-2 focus-within:ring-2 focus-within:ring-blue-500">
              <FiLock className="text-gray-500 mr-2" />
              <input
                type="password"
                id="password"
                name="password"
                aria-label="Enter your password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-center items-center"
            disabled={loading}
          >
            {loading ? <FaSpinner className="animate-spin mr-2" /> : "Login"}
          </button>

          <div className="mt-4 text-center">
            <h3 className="text-sm text-gray-600">Not registered?</h3>
            <Link to="/customerregister" className="text-blue-500 hover:underline font-medium">
              Register
            </Link>
          </div>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Login;
