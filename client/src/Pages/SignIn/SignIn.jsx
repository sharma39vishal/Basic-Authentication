import React, { useState } from 'react';
import axios from 'axios';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/signin', { email, password }, { withCredentials: true });
      console.log('Signin successful:', response.data);
      // Redirect or perform any other action upon successful signin
    } catch (error) {
      console.error('Signin failed:', error.response.data.message);
    }
  };

  return (
    <div>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Sign In</button>
      </form>

      
      <a href="/signup">Don't have an account? Sign Up</a>
    </div>
  );
};

export default SignIn;
