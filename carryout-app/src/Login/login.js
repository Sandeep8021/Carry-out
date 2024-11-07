import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../components/Authentication/AuthContext'; 

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true); // Start loading

    try {
      const response = await axios.post('http://localhost:8081/login', formData);
      
      // Simulate a minimum 1.5 second wait or wait until the backend responds
      const delay = new Promise(resolve => setTimeout(resolve, 1500));
      await Promise.all([response, delay]);

      if (response.status === 200) {
        const token = response.data.token; // Assuming JWT is returned in `response.data.token`
        console.log('Login successful', response.data);
        login(token, formData.email); // Mark the user as logged in
        navigate('/restaurants'); // Redirect to the restaurants page
      }
    } catch (error) {
      setErrorMessage('Invalid email or password');
      console.error('Login error', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-300">
        <h2 className="text-4xl font-lobster mb-6 text-center text-black">B'MORE EATS 🍔</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-4 py-3 border border-gray-400 rounded-full focus:ring-2 focus:ring-black focus:outline-none transition duration-300"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-400 rounded-full focus:ring-2 focus:ring-black focus:outline-none transition duration-300"
            required
          />
          {errorMessage && (
            <div className="text-red-500 text-center transition duration-300 ease-in-out">
              {errorMessage}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
            disabled={loading} // Disable the button while loading
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
            ) : (
              'Login'
            )}
          </button>
          <div className="text-center mt-4">
            <span className="text-gray-500">Don't have an account? </span>
            <button
              onClick={() => navigate('/signup')}
              className="text-black hover:underline"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
