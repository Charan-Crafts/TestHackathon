import React from 'react';
import { Navigate } from 'react-router-dom';

function Auth() {
  // Redirect to login by default
  return <Navigate to="/login" replace />;
}

export default Auth; 