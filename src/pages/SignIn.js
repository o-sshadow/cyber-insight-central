import React from 'react';
import AutoSignIn from '../components/Auth/AutoSignIn';
// Import your other components as needed

const SignInPage = () => {
  return (
    <>
      {/* This component will auto-redirect if user is already logged in */}
      <AutoSignIn />
      
      {/* Your existing sign-in form and UI components */}
      <div className="sign-in-container">
        {/* ...existing sign-in form code... */}
      </div>
    </>
  );
};

export default SignInPage;
