import React, { useContext, useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

export default function AfterLoginRoutes({ children }) {
const { userdata } = useAuth();

  const navigate = useNavigate();
  useEffect(() => {
    
    if(!userdata){
      navigate('/signin');
    }
    else {
      navigate('/');      
    }

  }, [userdata])

  return children; // Render the protected content if logged in
}