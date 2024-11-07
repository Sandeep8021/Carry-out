import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import CryptoJS from 'crypto-js';
import { FaSpinner } from 'react-icons/fa'; // Import a spinner icon
import { useAuth } from '../components/Authentication/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Signup.css'; // Import the CSS file

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [otpData, setOtpData] = useState({
    emailOtp: '',
  });
  const { login } = useAuth();

  const [otpSent, setOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state for signup
  const [isVerifying, setIsVerifying] = useState(false); // Loading state for OTP verification

  const otpEmailInputRef = useRef(null);

  useEffect(() => {
    if (showOtpModal) {
      // Focus on the OTP input when modal opens
      otpEmailInputRef.current.focus();
    }
  }, [showOtpModal]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === 'confirmPassword') {
      setErrorMessage('');
    }
  };

  const handleOtpChange = (e) => {
    setOtpData({
      ...otpData,
      [e.target.name]: e.target.value,
    });
  };

  const sendOtp = () => {
    axios
      .post('http://localhost:8081/signup/send-otp', {
        email: formData.email,
      })
      .then(() => {
        setOtpSent(true);
        setShowOtpModal(true);
        startResendTimer();
        setIsLoading(false); // Stop loading once OTP is sent
      })
      .catch((err) => {
        setIsLoading(false); // Stop loading in case of error
        if (err.response && err.response.status === 400) {
          setErrorMessage(err.response.data);
        } else {
          console.log(err);
        }
      });
  };

  const startResendTimer = () => {
    setCanResendOtp(false);
    setResendTimer(30);
    const timerInterval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev === 1) {
          clearInterval(timerInterval);
          setCanResendOtp(true);
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Confirm password does not match!');
      return;
    }

    setIsLoading(true); // Start loading spinner
    sendOtp();
  };

  const verifyOtp = () => {
    setIsVerifying(true); // Start loading spinner for OTP verification
    axios
      .post('http://localhost:8081/signup/verify-otp', {
        email: formData.email,
        emailOtp: otpData.emailOtp,
      })
      .then((response) => {
        if (response.data.verified) {
          saveUser();

        } else {
          setOtpError('Invalid OTP! Please try again.');
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsVerifying(false); // Stop loading after response
      });
  };

  const secretKey = CryptoJS.enc.Utf8.parse('youwillneverknow');

  const encryptPassword = (password) => {
    return CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(password), secretKey, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();
  };

  const saveUser = () => {
    axios
      .post('http://localhost:8081/signup/register', {
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: encryptPassword(formData.password),
      })
      .then((response) => {
        console.log(response.data)
        login(response.data.token, formData.email);
        console.log(response);
        setShowOtpModal(false);
        setIsLoading(false); // Stop loading once user is registered
        navigate('/restaurants');
      })
      .catch((err) => {
        setIsLoading(false); // Stop loading in case of error
        if (err.response && err.response.status === 400) {
          setErrorMessage(err.response.data);
        } else {
          console.log(err);
        }
      });
  };

  const resendOtp = () => {
    if (canResendOtp) {
      sendOtp();
    }
  };

  const onClose = () => {
    setShowOtpModal(false);
    setOtpData({ emailOtp: '' });
    setErrorMessage('');
    setOtpError('');
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b bg-white flex items-center justify-center px-4">
      <div className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-lobster mb-6 text-center text-black">B'MORE EATS</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full px-4 py-3 border border-gray-400 rounded-full focus:ring-2 focus:ring-black focus:outline-none transition duration-300"
            required
          />
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
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full px-4 py-3 border border-gray-400 rounded-full focus:ring-2 focus:ring-black focus:outline-none transition duration-300"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-400 rounded-full focus:ring-2 focus:ring-black focus:outline-none transition duration-300"
              required
            />
            <span
              className="absolute right-3 top-3 cursor-pointer"
              onClick={() => togglePasswordVisibility('password')}
            >
              {showPassword ? <AiFillEyeInvisible size={24} /> : <AiFillEye size={24} />}
            </span>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full px-4 py-3 border border-gray-400 rounded-full focus:ring-2 focus:ring-black focus:outline-none transition duration-300"
              required
            />
            <span
              className="absolute right-3 top-3 cursor-pointer"
              onClick={() => togglePasswordVisibility('confirmPassword')}
            >
              {showConfirmPassword ? <AiFillEyeInvisible size={24} /> : <AiFillEye size={24} />}
            </span>
          </div>

          {errorMessage && (
            <div className="text-red-500 text-center transition duration-300 ease-in-out">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-700 transition duration-300 flex items-center justify-center"
          >
            {isLoading ? <FaSpinner className="animate-spin" /> : 'Send OTP'}
          </button>
        </form>
      </div>

      {showOtpModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg p-6 rounded-lg shadow-xl w-80">
            <h3 className="text-lg font-semibold text-center mb-4">Verify OTP</h3>
            <input
              type="text"
              name="emailOtp"
              value={otpData.emailOtp}
              onChange={handleOtpChange}
              ref={otpEmailInputRef}
              placeholder="Enter OTP"
              className="w-full px-4 py-2 border border-gray-400 rounded-full focus:ring-2 focus:ring-black focus:outline-none transition duration-300"
              required
            />
            {otpError && <div className="text-red-500 text-center">{otpError}</div>}
            <button
              onClick={verifyOtp}
              className="w-full bg-black text-white py-2 rounded-full hover:bg-gray-700 transition duration-300 flex items-center justify-center"
            >
              {isVerifying ? <FaSpinner className="animate-spin" /> : 'Verify OTP'}
            </button>
            {canResendOtp && (
              <button
                onClick={resendOtp}
                className="text-gray-500 text-sm hover:underline mt-2"
              >
                Resend OTP
              </button>
            )}
            <button
              onClick={onClose}
              className="text-red-500 text-sm hover:underline mt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Signup;
