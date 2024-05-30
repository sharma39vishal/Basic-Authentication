import React, { useState } from 'react';
import axios from 'axios';
import JSEncrypt from 'jsencrypt';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const publicKey = `-----BEGIN PUBLIC KEY-----
  MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnXdBJGcAArRAlTi/jDzQ
  JCaXKvFb8jfZSB12q59t0TYimIQoGPOxWJkBN72zd52dzb9Y1KrLUXYmvKRHFmzm
  Qe7da/nyxBKVkKURdvIDfJNJVj6tFYhQQqpJP6oHZpDLXYyP2/XG/DuLUzpSrJ2j
  viwhK9P6SAIJjfo+dhR+7+i0Aedf6/2L9snw3uVyvMPuE1HhGbXsVZ5uYsIrUt2t
  n6H+RPyYb5QfFtPljmpCPsoekIZVqhis5NGr82DypBjDT0NO9qIPczCBso3jP3Aj
  W4++pqJ9H4sd0/vvJRubjrXX9CtIWXbjyWuiBTxH+Mwd3VVNl6VblU/Y6be5cqoR
  MQIDAQAB
  -----END PUBLIC KEY-----`;

  const encryptPassword = (password) => {
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    return encrypt.encrypt(password);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const encryptedPassword = encryptPassword(password);
      const response = await axios.post('/api/auth/signup', { username, email, password: encryptedPassword }, { withCredentials: true });
      console.log('Signup successful:', response.data);
      window.location.href = '/';
      // Redirect or show success message
    } catch (error) {
      setError(error.response.data.message);
      console.error('Signup failed:', error.response.data.message);
      // Show error message
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-3xl font-bold mb-6">Sign Up</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="flex flex-col">
          <label htmlFor="username" className="mb-1">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>
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
        <div className="flex flex-col">
          <label htmlFor="password" className="mb-1">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">Sign Up</button>
      </form>
      <p className="mt-4">Already have an account? <a href="/signin" className="text-blue-500 hover:underline">Sign In</a></p>
    </div>
  );
};

export default SignUp;
