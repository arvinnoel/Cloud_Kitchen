import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";

const Admin = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
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
      {/* Navbar */}
      <div className="bg-gray-100 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <ul className="flex items-center gap-4 text-gray-700"> 
            <li>
              <Link
                to="kitchenowners"
                className="hover:text-blue-500 transition-colors duration-200"
              >
                Kitchen Owners
              </Link>
            </li>
            <li>
              <Link
                to="activities"
                className="hover:text-blue-500 transition-colors duration-200"
              >
                Activities
              </Link>
            </li>

            {/* Dropdown Menu */}
            <li className="ml-auto relative dropdown-menu">
              <button
                onClick={toggleDropdown}
                className="bg-gray-200 px-4 py-2 rounded-md text-gray-800 font-semibold hover:bg-gray-300"
              >
                Options
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10">
                  <Link
                    to=""
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-500"
                  >
                    Logout
                  </Link>
                  <Link
                    to=""
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-500"
                  >
                    Own a Kitchen
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>

      <Outlet />
    </div>
  );
};

export default Admin;
