import { AmplifySignIn, AmplifyAuthenticator } from '@aws-amplify/ui-react';
import App from './App';
import React from 'react';

const federated = {
  google_client_id: '812957620541-ea9mak245pm437uheokbtdp9i3eu633i.apps.googleusercontent.com', // Enter your google_client_id here
  facebook_app_id: '', // Enter your facebook_app_id here
  amazon_client_id: '', // Enter your amazon_client_id here
};

const AppWithAuth = () => {
  return (
    <AmplifyAuthenticator hide={[AmplifySignIn]} federated={federated}>
      <AmplifySignIn />
      <App />
    </AmplifyAuthenticator>
  );
};

export default AppWithAuth;
