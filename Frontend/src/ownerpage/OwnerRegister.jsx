import React, { useState }from 'react'
import { Link,Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {Navigate} from 'react-router-dom';
import axios from 'axios';
import Owner from "./OwnerNavbar";
const OwnerRegister = () => {
  const [name, setName] = useState('');
  const [kitchen_name, setKitchenname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const ownerData = { name, kitchen_name, email, password, confirmPassword };

      const response = await axios.post('http://localhost:5000/owner/ownerregister', ownerData);

      console.log(response.data); 
      alert('Registered successfully');
      navigate('/owner/login');
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data.message || 'Failed to register');
      } else {
        alert('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="flex justify-center mt-8">
    <div className="w-full max-w-md bg-white p-6 shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">Name</label>
          <input 
            type="text" 
            id="firstname" 
            name="firstname" 
            placeholder="Enter your first name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">Kitchen name</label>
          <input 
            type="text" 
            id="lastname" 
            name="lastname" 
            placeholder="Enter your last name" 
            value={kitchen_name} 
            onChange={(e) => setKitchenname(e.target.value)} 
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            placeholder="Enter your email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            placeholder="Enter your password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-5">
          <label htmlFor="password2" className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input 
            type="password" 
            id="password2" 
            name="password" 
            placeholder="Enter your password again" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button 
          type="submit" 
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Register
        </button>
        <br />
        <div className="mt-4 text-center">
          <h3 className="text-sm text-gray-600">Already registered?</h3>
          <Link to="/owner/login" className="text-blue-500 hover:underline">Login</Link>
        </div>
      </form>
    </div>
    <Outlet />
  </div>
  
  )
}

export default OwnerRegister
