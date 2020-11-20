import { Authenticator } from 'aws-amplify-react';
import React from 'react';
import '@aws-amplify/ui/dist/style.css';
import AuthWrapper from './components/auth/AuthWrapper';

const federated = {
  google_client_id: '812957620541-ea9mak245pm437uheokbtdp9i3eu633i.apps.googleusercontent.com',
  facebook_app_id: '1318557628490865',
};

const theme = {
  signInButtonIcon: { display: 'none' },
};

const signUpConfig = {
  hiddenDefaults: ['phone_number'],
  signUpFields: [{ label: 'Name', key: 'name', required: true, type: 'string', displayOrer: 1 }],
};

const AppWithAuth = () => {
  return (
    <Authenticator federated={federated} theme={theme} signUpConfig={signUpConfig}>
      <AuthWrapper />
    </Authenticator>
  );
};

export default AppWithAuth;
