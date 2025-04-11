import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SignInPage = () => {
  const { user, session, loading } = useAuth(); // Using the Supabase auth context properties
  const navigate = useNavigate();
  
  useEffect(() => {
    // Only redirect after auth state is confirmed (not loading)
    if (!loading) {
      // If user is already authenticated (Supabase session exists), redirect to home page
      if (user && session) {
        navigate('/dashboard'); // Redirecting to dashboard as that seems to be your main page after login
      }
    }
  }, [user, session, loading, navigate]);
  
  return (
    <div className="sign-in-container">
      {/* ...existing sign-in form code... */}
    </div>
  );
};

export default SignInPage;
