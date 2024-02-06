import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/profile', {
          withCredentials: true,
        });
        setUserData(response.data.user);
      } catch (error) {
        window.location.href = '/signin';

        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      <h1>Home Page</h1>
      {userData ? (
        <div>
          <h2>User Profile</h2>
          <p>Username: {userData.username}</p>
          <p>Email: {userData.email}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Home;
