import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiUser, FiMail, FiLock, FiHome } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const OwnerRegister = () => {
  const [name, setName] = useState('');
  const [kitchenName, setKitchenName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const ownerData = { name, kitchen_name: kitchenName, email, password, confirmPassword };
      const response = await axios.post(`${apiUrl}/owner/ownerregister`, ownerData);

      console.log(response.data);
      toast.success('Registered successfully!');
      navigate('/owner/login');
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || 'Failed to register');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-8">
      <div className="w-full max-w-md bg-white p-6 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <div className="flex items-center border border-gray-300 rounded-md p-2 focus-within:ring-2 focus-within:ring-blue-500">
              <FiUser className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-white text-gray-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Kitchen Name</label>
            <div className="flex items-center border border-gray-300 rounded-md p-2 focus-within:ring-2 focus-within:ring-blue-500">
              <FiHome className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Enter your kitchen name"
                value={kitchenName}
                onChange={(e) => setKitchenName(e.target.value)}
                required
                className="w-full bg-white text-gray-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="flex items-center border border-gray-300 rounded-md p-2 focus-within:ring-2 focus-within:ring-blue-500">
              <FiMail className="text-gray-500 mr-2" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white text-gray-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="flex items-center border border-gray-300 rounded-md p-2 focus-within:ring-2 focus-within:ring-blue-500">
              <FiLock className="text-gray-500 mr-2" />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white text-gray-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="flex items-center border border-gray-300 rounded-md p-2 focus-within:ring-2 focus-within:ring-blue-500">
              <FiLock className="text-gray-500 mr-2" />
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-white text-gray-700 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white font-semibold rounded-md focus:outline-none focus:ring-2 ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'}`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <AiOutlineLoading3Quarters className="animate-spin text-white mr-2" />
                Registering...
              </div>
            ) : (
              'Register'
            )}
          </button>

          <div className="mt-4 text-center">
            <h3 className="text-sm text-gray-600">Already registered?</h3>
            <Link to="/owner/login" className="text-blue-500 hover:underline">Login</Link>
          </div>
        </form>
      </div>
      <Outlet />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default OwnerRegister;
