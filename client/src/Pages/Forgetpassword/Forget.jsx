import  { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
// import { response } from 'express';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRequestOtp = async () => {
    try {
      const response = await axios.post('/api/email/send', { to: email });
      setMessage('OTP sent to your email');
    } catch (error) {
      setError('Failed to send OTP');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/email/verify-otp', { email, otp, newPassword });
      setMessage('Password reset successful');
    } catch (error) {
      setError('Failed to verify OTP or reset password');
    }
  };


  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-6">Forget Password</h1>
      {message && <p className="text-green-500 mb-4">{message}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleVerifyOtp} className="flex flex-col space-y-4">
        <div className="flex flex-col">
          <label htmlFor="email" className="mb-1">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <button type="button" onClick={handleRequestOtp} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">Request OTP</button>
        <div className="flex flex-col">
          <label htmlFor="otp" className="mb-1">OTP:</label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="newPassword" className="mb-1">New Password:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">Reset Password</button>
      </form>
      <p className="mt-4">Remember your password? <Link to="/signin" className="text-blue-500 hover:underline">Sign In</Link></p>
    </div>
  );
};

export default ForgetPassword;
