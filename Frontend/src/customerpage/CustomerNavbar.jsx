import React, { useState, useEffect, useRef } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ShoppingCart, LogIn, ShoppingBag, Menu, X } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "../CartContext";

const CustomerNavbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { cartCount, fetchCartCount } = useCart();

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("userauthToken");
    toast.success("Logged out successfully");
    setTimeout(() => {
      navigate("/customerlogin");
    }, 1000);
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 shadow-md fixed top-0 left-0 w-full z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center text-2xl font-extrabold transition-colors duration-300 hover:text-transparent hover:bg-clip-text">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500">Cloud Culinary</span>
        </Link>
          <div className="flex items-center gap-2 md:gap-6">
            <Link to="cart" className="relative flex items-center gap-2 hover:text-blue-500 transition-transform duration-200 hover:scale-110">
              <ShoppingCart size={24} /><span className="hidden md:inline">Cart</span>
              {cartCount > 0 && <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full px-2 py-1">{cartCount}</span>}
            </Link>
            <Link to="myorders" className="flex items-center gap-1 md:gap-2 hover:text-blue-500 transition-transform transform hover:scale-110">
              <ShoppingBag size={20} /><span className="hidden md:inline">Orders</span>
            </Link>
            <Link to="customerlogin" className="flex items-center gap-1 md:gap-2 hover:text-blue-500 transition-transform transform hover:scale-110">
              <LogIn size={20} /><span className="hidden md:inline">Login</span>
            </Link>
            <div className="relative dropdown-menu" ref={dropdownRef}>
              {isMobile ? (
                <button onClick={toggleDropdown} className="p-2 hover:text-blue-500 transition-transform transform hover:rotate-90">
                  {isDropdownOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              ) : (
                <button onClick={toggleDropdown} className="bg-gray-200 px-3 py-1 rounded-md text-gray-800 font-semibold hover:bg-gray-300 transition-all">Options</button>
              )}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-2 z-10 transition-opacity duration-300">
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-500">Logout</button>
                  <Link to="owner" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-500">Own a Kitchen</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="pt-16">
        <Outlet />
      </div>
    </div>
  );
};

export default CustomerNavbar;
