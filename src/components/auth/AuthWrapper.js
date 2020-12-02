import React from 'react';
// import CustomSignIn from './CustomSignIn';
import App from '../../App';
// import { SignIn, ConfirmSignIn, SignUp, ConfirmSignUp } from 'aws-amplify-react';

// const signUpConfig = {
//   hiddenDefaults: ['phone_number', 'username'],
//   signUpFields: [{ label: 'Name', key: 'name', required: true, type: 'string', displayOrer: 1 }],
// };

const AuthWrapper = (props) => {
  // const { authState, onStateChange, authData, federated, theme, onAuthEvent } = props;
  const { authState } = props;

  return (
    <>
      {/* <CustomSignIn authState={authState} onStateChange={onStateChange} /> */}
      {authState === 'signedIn' && <App />}
    </>
  );
};

export default AuthWrapper;
