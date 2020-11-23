import React, { useEffect } from 'react';
import { Auth, Hub } from 'aws-amplify';
import queryString from 'query-string';
import useAuthentication from './utils/useAuthentication';
import { UserProvider } from './utils/userContext';
import App from './App';

// https://aws-amplify.github.io/docs/js/hub
Hub.listen(/.*/, ({ channel, payload }) => console.debug(`[hub::${channel}::${payload.event}]`, payload));

// https://aws-amplify.github.io/docs/js/authentication#manual-setup
Auth.configure({
  region: process.env.REACT_APP_AUTH_REGION,
  userPoolId: process.env.REACT_APP_AUTH_USER_POOL_ID,
  userPoolWebClientId: process.env.REACT_APP_AUTH_USER_POOL_CLIENT_ID,

  // Cognito Hosted UI configuration
  oauth: {
    domain: process.env.REACT_APP_LOGIN_DOMAIN,
    scope: ['phone', 'email', 'openid', 'profile', 'aws.cognito.signin.user.admin'],
    redirectSignIn: `${document.location.origin}/`,
    redirectSignOut: `${document.location.origin}/`,
    responseType: 'code',
  },
});

const AppWithAuth = () => {
  const { isAuthenticated, isLoading, user, signIn, signOut, ready } = useAuthentication();
  const parsed = queryString.parse(document.location.search);

  useEffect(() => {
    if (!ready && !isLoading && !isAuthenticated && !user) {
      signIn();
    }
  }, [isLoading, isAuthenticated, signIn, parsed, user, ready]);

  if (ready && isAuthenticated) {
    return (
      <UserProvider value={{ signOut, user }}>
        <App />
      </UserProvider>
    );
  }

  return null;
};

export default AppWithAuth;
