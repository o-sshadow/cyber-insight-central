import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // adjust this import based on your auth setup

/**
 * Component that automatically redirects authenticated users away from sign-in page
 */
const AutoSignIn = () => {
  const { currentUser, isLoading } = useAuth(); // adjust to match your auth context
  const navigate = useNavigate();
  
  useEffect(() => {
    // Only redirect after auth state is confirmed (not loading)
    if (!isLoading) {
      if (currentUser) {
        // User is already logged in, redirect to home
        navigate('/');
      }
    }
  }, [currentUser, isLoading, navigate]);
  
  // This component doesn't render anything
  return null;
};

export default AutoSignIn;
