import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { AppContext } from "../Context/AppContext.jsx";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const { navigate, user, setUser, setOwner, axios } = useContext(AppContext);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Hotels", path: "/hotels" },
    { name: "Rooms", path: "/rooms" },
    { name: "About", path: "/about" },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside it
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

  const logout = async () => {
    try {
      const { data } = await axios.post("/api/users/logout");

      if (data.success) {
        toast.success(data.message || "Logged out successfully");
        setUser(null);
        setOwner(false);
        setIsDropdownOpen(false);
        setIsMenuOpen(false);
        navigate("/");
      }
    } catch (error) {
      console.error("Logout failed:", error);

      toast.error(error.response?.data?.message || "Logout failed");
    } finally {
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 bg-[#FF6347] w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 py-4 md:py-6 transition-all duration-500 z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <img src={assets.logo} alt="StayEase" className="h-9 w-auto" />
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-4 lg:gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className="group flex flex-col gap-0.5 text-white"
          >
            {link.name}

            <div className="bg-white h-0.5 w-0 group-hover:w-full transition-all duration-300" />
          </Link>
        ))}
      </div>

      {/* Desktop Right Section */}
      <div className="hidden md:flex items-center gap-4">
        {user ? (
          <div ref={dropdownRef} className="relative inline-block">
            {/* Profile Icon */}
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              aria-expanded={isDropdownOpen}
              aria-label="Toggle profile menu"
              className="block"
            >
              <img
                src={assets.profile_icon}
                alt="Profile"
                className="w-12 h-12 rounded-full cursor-pointer"
              />
            </button>

            {/* Click-to-toggle Dropdown */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md z-50">
                <ul className="py-2">
                  <li>
                    <Link
                      to="/my-bookings"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Bookings
                    </Link>
                  </li>

                  <li>
                    <button
                      type="button"
                      onClick={logout}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Log Out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-2.5 rounded-full ml-4 bg-white text-black cursor-pointer hover:bg-primary hover:text-white"
          >
            Login
          </button>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="flex items-center gap-3 md:hidden">
        <svg
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="h-6 w-6 cursor-pointer text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button
          type="button"
          className="absolute top-4 right-4"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Mobile Navigation Links */}
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            onClick={() => setIsMenuOpen(false)}
          >
            {link.name}
          </Link>
        ))}

        {/* Mobile User Section */}
        {user ? (
          <>
            <img
              src={assets.profile_icon}
              alt="Profile"
              className="w-14 h-14 rounded-full"
            />

            <Link
              to="/my-bookings"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-700"
            >
              My Bookings
            </Link>

            <button
              onClick={logout}
              className="bg-red-500 text-white px-8 py-2.5 rounded-full"
            >
              Log Out
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              setIsMenuOpen(false);
              navigate("/login");
            }}
            className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500 hover:bg-primary hover:text-white"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
