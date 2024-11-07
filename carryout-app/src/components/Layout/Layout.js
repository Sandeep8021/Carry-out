import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaCog, FaHistory, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../Authentication/AuthContext';

const Layout = ({ children }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [location, setLocation] = useState(null); // State to store location data
  const [address, setAddress] = useState(''); // State to store address
  const navigate = useNavigate();
  const { logout } = useAuth();
  const apiKey = 'ed44fce202e9404ea14c350a4d5cc4ae'; // Replace with your OpenCage API key

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleLocation = () => {
    setIsLocationEnabled(!isLocationEnabled);

    if (!isLocationEnabled) {
      // Request live location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Location fetched:', position);

          // Set location state with latitude and longitude
          setLocation({ latitude, longitude });

          // Fetch address using reverse geocoding
          fetchAddress(latitude, longitude);
        },
        (error) => {
          console.error('Error fetching location:', error);
        }
      );
    } else {
      setLocation(null); // Clear location when disabled
      setAddress(''); // Clear address when disabled
    }
  };

  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        setAddress(data.results[0].formatted); // Get the formatted address
      } else {
        console.error('No address found');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove token from localStorage
    logout();
    navigate('/'); // Redirect to sign-in page
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">
          <Link to="/">B'MORE EATS</Link>
        </h1>
        <div className="flex items-center">
          {/* Toggle for Live Location */}
          <label className="flex items-center mr-4 cursor-pointer">
            <span className="mr-2">Live Location</span>
            <input
              type="checkbox"
              checked={isLocationEnabled}
              onChange={toggleLocation}
              className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
            />
          </label>
          {/* Display location if available */}
          {location && (
            <span className="ml-2 text-sm bg-green-500 text-white px-2 py-1 rounded">
              Lat: {location.latitude.toFixed(4)}, Lng: {location.longitude.toFixed(4)}
            </span>
          )}
          {/* Display address if available */}
          {address && (
            <span className="ml-2 text-sm bg-blue-500 text-white px-2 py-1 rounded">
              {address}
            </span>
          )}

          {/* Profile Button */}
          <div className="relative">
            <button onClick={toggleProfile} className="focus:outline-none">
              <FaUserCircle size={24} />
            </button>
            {isProfileOpen && (
              <div
                className={`absolute right-0 mt-2 w-48 bg-white text-black border rounded shadow-lg transition duration-300 ease-in-out transform ${
                  isProfileOpen ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95'
                }`}
              >
                <Link to="/profile" className="flex items-center px-4 py-2 hover:bg-gray-100 transition">
                  <FaUser className="mr-2" /> Profile
                </Link>
                
                <Link to="/settings" className="flex items-center px-4 py-2 hover:bg-gray-100 transition">
                  <FaCog className="mr-2" /> Settings
                </Link>
                <Link to="/orders" className="flex items-center px-4 py-2 hover:bg-gray-100 transition">
                  <FaHistory className="mr-2" /> Orders
                </Link>
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition"
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
                <button
                  onClick={toggleProfile}
                  className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 transition"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6 bg-gray-100">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white p-4 text-center mt-auto">
        <p>© {new Date().getFullYear()} Your Company Name</p>
        <p>Address: 123 Your Street, City, State, Zip</p>
        <div className="mt-2">
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline mx-2"
          >
            Facebook
          </a>
          <a
            href="https://www.twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline mx-2"
          >
            Twitter
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline mx-2"
          >
            Instagram
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
