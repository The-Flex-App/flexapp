import { withAuthenticator } from 'aws-amplify-react';
import App from './App';
import React, { useEffect, useState, useReducer } from 'react';
import { Hub, Auth } from 'aws-amplify';
import Buttons from './components/auth/Buttons';

const initialUserState = { user: null, loading: true };

const AppWithAuth = () => {
  const [userState, dispatch] = useReducer(reducer, initialUserState);
  const [formState, updateFormState] = useState('base');

  function reducer(state, action) {
    switch (action.type) {
      case 'setUser':
        return { ...state, user: action.user, loading: false };
      case 'loaded':
        return { ...state, loading: false };
      default:
        return state;
    }
  }

  async function checkUser(dispatch) {
    try {
      const user = await Auth.currentAuthenticatedUser();
      console.log('user: ', user);
      dispatch({ type: 'setUser', user });
    } catch (err) {
      console.log('err: ', err);
      dispatch({ type: 'loaded' });
    }
  }

  useEffect(() => {
    Hub.listen('auth', (data) => {
      const { payload } = data;
      if (payload.event === 'signIn') {
        setImmediate(() => dispatch({ type: 'setUser', user: payload.data }));
        setImmediate(() => window.history.pushState({}, null, 'https://www.amplifyauth.dev/'));
        updateFormState('base');
      }
      // this listener is needed for form sign ups since the OAuth will redirect & reload
      if (payload.event === 'signOut') {
        setTimeout(() => dispatch({ type: 'setUser', user: null }), 350);
      }
    });
    // we check for the current user unless there is a redirect to ?signedIn=true
    if (!window.location.search.includes('?signedin=true')) {
      checkUser(dispatch);
    }
  }, []);

  return (
    <div style={styles.appContainer}>
      {userState.loading && (
        <div style={styles.body}>
          <p>Loading...</p>
        </div>
      )}
      {!userState.user && !userState.loading && <Buttons updateFormState={updateFormState} />}

      {userState.user && userState.user.signInUserSession && <App />}
    </div>
  );
};

const styles = {
  appContainer: {
    paddingTop: 85,
  },
  loading: {},
  button: {
    marginTop: 15,
    width: '100%',
    maxWidth: 250,
    marginBottom: 10,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: '0px 16px',
    borderRadius: 2,
    boxShadow: '0px 1px 3px rgba(0, 0, 0, .3)',
    cursor: 'pointer',
    outline: 'none',
    border: 'none',
    minHeight: 40,
  },
  text: {
    color: 'white',
    fontSize: 14,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  signOut: {
    backgroundColor: 'black',
  },
  footer: {
    fontWeight: '600',
    padding: '0px 25px',
    textAlign: 'right',
    color: 'rgba(0, 0, 0, 0.6)',
  },
  anchor: {
    color: 'rgb(255, 153, 0)',
    textDecoration: 'none',
  },
  body: {
    padding: '0px 30px',
    height: '78vh',
  },
};

export default AppWithAuth;
