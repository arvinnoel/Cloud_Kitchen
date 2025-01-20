import React, { useState } from 'react';
import { Outlet,Link } from 'react-router-dom'
const Customer = () => {

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('userauthToken');
    
    // Optionally show a logout success message
    alert('Logged out successfully');
  
  };
  return (
    <div>
    <div className="bg-gray-100 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <ul className="flex items-center  space-x-14 text-gray-700">
          <li>
            <Link to="/" className="hover:text-blue-500 transition-colors duration-200"> Home </Link>
          </li>
          <li>
            <Link to="myfavorites" className="hover:text-blue-500 transition-colors duration-200">
              My Favorites
            </Link>
          </li>
          <li>
            <Link to="customerlogin" className="hover:text-blue-500 transition-colors duration-200">Sign In</Link>
          </li>
          <li>
            <Link to="customerregister" className="hover:text-blue-500 transition-colors duration-200">Sign Up</Link>
          </li>
          <li>
            <Link to="cart" className="hover:text-blue-500 transition-colors duration-200">Cart</Link>
          </li>
          <li>
            <Link to="myorders" className="hover:text-blue-500 transition-colors duration-200">My Orders</Link>
          </li>

          {/* Dropdown Menu */}
          <li className="ml-auto">
            <button onClick={toggleDropdown} className="bg-gray-200 px-4 py-2 rounded-md text-gray-800 font-semibold hover:bg-gray-300"> Options </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10">
                <Link to="/customerlogin" onClick={handleLogout} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-500" >Logout </Link>
                <Link to="owner"  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-500"> Own a Kitchen</Link>
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

export default Customer
