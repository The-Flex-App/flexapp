import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Auth, Hub } from 'aws-amplify';
import { useMutation } from '@apollo/client';
import { useParams, useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import useAuthentication from './utils/useAuthentication';
import { UserProvider } from './utils/userContext';
import { selectCurrentUserId, setUser } from './store/slices/user';
import App from './App';
import { ADD_USER } from './graphql/mutations';

// https://aws-amplify.github.io/docs/js/hub
Hub.listen(/.*/, ({ channel, payload }) =>
  console.debug(`[hub::${channel}::${payload.event}]`, payload)
);

// https://aws-amplify.github.io/docs/js/authentication#manual-setup
Auth.configure({
  region: process.env.REACT_APP_AUTH_REGION,
  userPoolId: process.env.REACT_APP_AUTH_USER_POOL_ID,
  userPoolWebClientId: process.env.REACT_APP_AUTH_USER_POOL_CLIENT_ID,

  // Cognito Hosted UI configuration
  oauth: {
    domain: process.env.REACT_APP_LOGIN_DOMAIN,
    scope: [
      'phone',
      'email',
      'openid',
      'profile',
      'aws.cognito.signin.user.admin',
    ],
    redirectSignIn: `${document.location.origin}/`,
    redirectSignOut: `${document.location.origin}/`,
    responseType: 'code',
  },
});

const AppWithAuth = () => {
  const { workspaceId, inviteId } = useParams();
  const userId = useSelector(selectCurrentUserId);
  const history = useHistory();
  const [addUser] = useMutation(ADD_USER);
  const { isAuthenticated, isLoading, user, signIn, signOut, ready } =
    useAuthentication();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!ready && !isLoading && !isAuthenticated && !user) {
      if (workspaceId) {
        let url = `/dashboards/${workspaceId}`;
        if (inviteId) {
          url += `/${inviteId}`;
        }
        window.sessionStorage.setItem('redirectUrl', url);
      } else {
        const redirectUrl = window.sessionStorage.getItem('redirectUrl');
        redirectUrl && window.sessionStorage.removeItem('redirectUrl');
      }
      signIn();
    }
  }, [isLoading, isAuthenticated, signIn, user, ready, workspaceId, inviteId]);

  const [createUserRequested, setCreateUserRequested] = useState(false);

  useEffect(() => {
    if (user && !createUserRequested) {
      const redirectUrl = window.sessionStorage.getItem('redirectUrl');
      if (redirectUrl) {
        history.push(redirectUrl);
        window.sessionStorage.removeItem('redirectUrl');
        return;
      }
      const { attributes, username } = user;
      if (
        !username ||
        !attributes ||
        (!attributes.identities && !attributes.email)
      ) {
        history.push('/error', {
          error: 'Invalid login, please try login with valid credentials.',
        });
      }
      let userId;
      if (attributes.identities) {
        userId = JSON.parse(attributes.identities)[0].userId;
      }
      const { given_name, family_name, email } = attributes;
      const userInfo = {
        id: userId,
        userName: username,
        email: email,
        firstName: given_name,
        lastName: family_name,
        workspaceId,
        inviteId,
      };

      setCreateUserRequested(true);
      addUser({
        variables: { input: userInfo },
      })
        .then((response) => {
          dispatch(
            setUser({
              ...(response.data.createUser || {}),
              isOwner: !workspaceId || response.workspaceId === workspaceId,
            })
          );
        })
        .catch((e) => {
          history.push('/error', { error: e.message });
        });
    }
  }, [
    user,
    history,
    inviteId,
    workspaceId,
    createUserRequested,
    dispatch,
    addUser,
  ]);

  if (ready && isAuthenticated && userId) {
    return (
      <UserProvider value={{ signOut, user }}>
        <App />
      </UserProvider>
    );
  }

  return (
    <Grid
      container
      alignItems={'center'}
      justify={'center'}
      style={{ height: `calc(100vh - 16px)` }}
    >
      <CircularProgress color={'inherit'} />
    </Grid>
  );
};

export default AppWithAuth;
