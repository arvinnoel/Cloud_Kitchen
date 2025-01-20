import React, { useState } from 'react';
import { Link , Outlet} from 'react-router-dom'
const Owner = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
    const toggleDropdown = () => {
      setIsDropdownOpen(!isDropdownOpen);
    };
    const handleLogout = () => {
      // Remove the token from localStorage
      localStorage.removeItem('authToken');
      
      // Optionally show a logout success message
      alert('Logged out successfully');
    
    };
    
  return (
    <div>
    <div className="bg-gray-100 shadow-md">
          <div className="container mx-auto px-4 py-4">
            <ul className="flex items-center  space-x-14 text-gray-700">
            <li>
                <Link to="kitchen" className="hover:text-blue-500 transition-colors duration-200"> My Kitchen </Link>
              </li>
              <li>
                <Link to="additem" className="hover:text-blue-500 transition-colors duration-200"> Add Items </Link>
              </li>
              <li>
                <Link to="login" className="hover:text-blue-500 transition-colors duration-200">Sign In</Link>
              </li>
              <li>
                <Link to="register" className="hover:text-blue-500 transition-colors duration-200">Sign Up</Link>
              </li>
              <li>
                <Link to="orders" className="hover:text-blue-500 transition-colors duration-200">Orders</Link>
              </li>
    
              {/* Dropdown Menu */}
              <li className="ml-auto">
                <button onClick={toggleDropdown} className="bg-gray-200 px-4 py-2 rounded-md text-gray-800 font-semibold hover:bg-gray-300"> Options </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10">
                    <Link to="/owner/login" onClick={handleLogout} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-500" >Logout </Link>
                    <Link to="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-500"> Switch to Customer</Link>
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>
        <Outlet />
        </div>
  )
}

export default Owner
