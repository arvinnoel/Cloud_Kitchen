import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { toast,ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Owner = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    toast.success("Logged out successfully!");
    navigate("/owner/login"); 
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-menu")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div>
      <div className="bg-gray-100 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <ul className="flex flex-wrap items-center gap-4 text-gray-700">
            <li>
              <Link to="kitchen" className="hover:text-blue-500 transition-colors duration-200">My Kitchen</Link>
            </li>
            <li>
              <Link to="additem" className="hover:text-blue-500 transition-colors duration-200">Add Items</Link>
            </li>
            <li>
              <Link to="login" className="hover:text-blue-500 transition-colors duration-200"> Login</Link>
            </li>
            <li>
              <Link to="register" className="hover:text-blue-500 transition-colors duration-200" >Register</Link>
            </li>
            <li>
              <Link to="orders" className="hover:text-blue-500 transition-colors duration-200">Orders</Link>
            </li>
            <li className="ml-auto relative dropdown-menu">
              <button onClick={toggleDropdown} className="bg-gray-200 px-4 py-2 rounded-md text-gray-800 font-semibold hover:bg-gray-300">Options</button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10">
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-500">Logout</button>
                  <Link to="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-500"> Switch to Customer</Link>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
      <Outlet />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Owner;
