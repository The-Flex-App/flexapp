import React from 'react';
import App from '../../App';

const AuthWrapper = (props) => {
  const { authState } = props;

  return (
    <>
      {authState === 'signedIn' && <App />}
    </>
  );
};

export default AuthWrapper;
