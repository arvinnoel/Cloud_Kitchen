import React, { useState }from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = { email, password};

      const response = await axios.post(`${apiUrl}/user/login`, userData);
      
      // Extract the token from the response
      const token = response.data.data.token;
  
      if (!token) {
        alert('Token is missing in the response.');
        return;
      }
  
      // Save the token to localStorage
      localStorage.setItem('userauthToken', token);
  
      alert('Logged in successfully');
      console.log('Token saved:', token);
  
      // Redirect to the Add Item page
      navigate('/');
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert('An unexpected error occurred');
      }
    }
  };
  return (
    <div className="flex justify-center mt-10">
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Sign In</h2>
      <form onSubmit={handleLogin}>
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input type="email" id="email" name="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} 
          required className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input type="password" id="password" name="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
      </div>
      <button type="submit" className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
        Login </button>
      <br/>
      <div className="mt-4 text-center">
        <h3 className="text-sm text-gray-600">Not registered?</h3>
        <Link to="/customerregister" className="text-blue-500 hover:underline">Register</Link>
      </div>
    </form>
  </div>
</div>
  )
}

export default Login
