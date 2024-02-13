import React, { useContext, useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

export default function BeforeLoginRoutes({ children }) {
const { userdata } = useAuth();

  const navigate = useNavigate();
  useEffect(() => {
    
    if(userdata){
      navigate('/');      
    }

  }, [userdata])

  return children; // Render the protected content if logged in
}