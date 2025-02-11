import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { AiOutlineUser, AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [firstName, setFirstname] = useState('');
  const [lastName, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const userData = { firstName, lastName, email, password };

      await axios.post(`${apiUrl}/user/register`, userData);

      toast.success('Registered successfully');
      setTimeout(() => navigate('/customerlogin'), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <ToastContainer />

      <div className="w-full max-w-md bg-white p-6 shadow-lg rounded-lg">
        <h2 className="text-3xl font-semibold mb-5 text-center text-gray-700">Sign Up</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* First Name */}
          <div className="relative">
            <AiOutlineUser className="absolute left-3 top-3 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstname(e.target.value)}
              required
              className="pl-10 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Last Name */}
          <div className="relative">
            <AiOutlineUser className="absolute left-3 top-3 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastname(e.target.value)}
              required
              className="pl-10 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <AiOutlineMail className="absolute left-3 top-3 text-gray-500" size={20} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <AiOutlineLock className="absolute left-3 top-3 text-gray-500" size={20} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <AiOutlineLock className="absolute left-3 top-3 text-gray-500" size={20} />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="pl-10 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-all"
          >
            Register
          </button>

          {/* Login Redirect */}
          <div className="mt-4 text-center text-sm text-gray-600">
            Already registered?{" "}
            <Link to="/customerlogin" className="text-blue-500 hover:underline">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
