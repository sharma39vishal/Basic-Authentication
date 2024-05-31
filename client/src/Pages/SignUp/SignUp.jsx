import React, { useState } from 'react';
import axios from 'axios';
import JSEncrypt from 'jsencrypt';
import { Link } from 'react-router-dom';

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
      <Link to="http://localhost:5000/api/auth/google" className="bg-blue-500 text-white px-4 py-2 my-3 rounded hover:bg-blue-600 transition duration-300 flex "><svg width="24px" height="24px" className='mr-2' viewBox="-3 0 262 262" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"/><path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"/><path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"/><path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"/></svg>Signin With Google</Link>

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
      <p className="mt-4">Forget Password? <Link to="/forget" className="text-blue-500 hover:underline">Reset</Link></p>

    </div>
  );
};

export default SignUp;
