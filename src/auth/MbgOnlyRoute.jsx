import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import MyContext from './Context';

const MbgOnlyRoute = ({ children }) => {
  const { username } = useContext(MyContext);
  const location = useLocation();
  
  // Path yang diizinkan untuk user djsef
  const djsefAllowedPaths = ['/v3/landing/mbg', '/v3/mbg/update-data/'];
  
  // Jika user adalah djsef dan path tidak diizinkan, redirect ke MBG landing
  if (username === 'djsef' && !djsefAllowedPaths.includes(location.pathname)) {
    return <Navigate to="/v3/landing/mbg" replace />;
  }
  
  // Jika bukan user djsef, tampilkan children
  return children;
};

export default MbgOnlyRoute;
