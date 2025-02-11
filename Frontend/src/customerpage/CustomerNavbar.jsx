import React, { useState, useEffect, useRef } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineShoppingCart, AiOutlineLogin, AiOutlineShopping, AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import "react-toastify/dist/ReactToastify.css";

const Customer = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("userauthToken");
    toast.success("Logged out successfully");
    setTimeout(() => {
      navigate("/customerlogin");
    }, 1000);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <div className="bg-gray-100 shadow-md fixed top-0 left-0 w-full z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="hover:text-blue-500 transition-colors duration-200 font-semibold text-lg">
            Home
          </Link>
          <div className="flex items-center gap-2 md:gap-6">
            <Link to="cart" className="flex items-center gap-1 md:gap-2 hover:text-blue-500 transition-colors duration-200">
              <AiOutlineShoppingCart size={20} /> <span className="hidden md:inline">Cart</span>
            </Link>
            <Link to="myorders" className="flex items-center gap-1 md:gap-2 hover:text-blue-500 transition-colors duration-200">
              <AiOutlineShopping size={20} /> <span className="hidden md:inline">Orders</span>
            </Link>
            <Link to="customerlogin" className="flex items-center gap-1 md:gap-2 hover:text-blue-500 transition-colors duration-200">
              <AiOutlineLogin size={20} /> <span className="hidden md:inline">Login</span>
            </Link>

            {/* Dropdown - Desktop: Shows 'Options', Mobile: Shows Menu Icon */}
            <div className="relative dropdown-menu" ref={dropdownRef}>
              {isMobile ? (
                <button onClick={toggleDropdown} className="p-2 hover:text-blue-500">
                  {isDropdownOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
                </button>
              ) : (
                <button onClick={toggleDropdown} className="bg-gray-200 px-3 py-1 rounded-md text-gray-800 font-semibold hover:bg-gray-300">
                  Options
                </button>
              )}

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-2 z-10">
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-500">
                    Logout
                  </button>
                  <Link to="owner" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-500">
                    Own a Kitchen
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Page Content - Add padding to prevent content from being hidden behind the fixed navbar */}
      <div className="pt-16">
        <Outlet />
      </div>
    </div>
  );
};

export default Customer;
