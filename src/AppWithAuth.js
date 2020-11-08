import { SignIn, Authenticator } from 'aws-amplify-react';
import App from './App';
import React from 'react';
import '@aws-amplify/ui/dist/style.css';

const federated = {
  google_client_id: '812957620541-ea9mak245pm437uheokbtdp9i3eu633i.apps.googleusercontent.com', // Enter your google_client_id here
  facebook_app_id: '', // Enter your facebook_app_id here
  amazon_client_id: '', // Enter your amazon_client_id here
};

const theme = {
  signInButtonIcon: { display: 'none' },
};

const signUpConfig = {
  hiddenDefaults: ['phone_number', 'username'],
  signUpFields: [{ label: 'Name', key: 'name', required: true, type: 'string', displayOrer: 1 }],
};

const AppWithAuth = () => {
  return (
    <Authenticator federated={federated} theme={theme} signUpConfig={signUpConfig}>
      <SignIn />
      <App />
    </Authenticator>
  );
};

export default AppWithAuth;
