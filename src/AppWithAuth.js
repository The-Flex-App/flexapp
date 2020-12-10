import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Auth, Hub } from 'aws-amplify';
import { useParams, useHistory } from 'react-router-dom';
import useAuthentication from './utils/useAuthentication';
import { UserProvider } from './utils/userContext';
import { setUser } from './store/slices/user';
import App from './App';
import { ADD_USER } from './graphql/mutations';
import { useMutation } from '@apollo/client';

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
			'aws.cognito.signin.user.admin'
		],
		redirectSignIn: `${document.location.origin}/`,
		redirectSignOut: `${document.location.origin}/`,
		responseType: 'code'
	}
});

const AppWithAuth = () => {
	const { workspaceId, inviteId } = useParams();
	const history = useHistory();
	const [addUser] = useMutation(ADD_USER);
	const {
		isAuthenticated,
		isLoading,
		user,
		signIn,
		signOut,
		ready
	} = useAuthentication();
	const dispatch = useDispatch();

	useEffect(() => {
		if (!ready && !isLoading && !isAuthenticated && !user) {
			signIn();
		}
	}, [isLoading, isAuthenticated, signIn, user, ready]);

	useEffect(() => {
		if (user) {
			const { attributes, username } = user;
			const { userId } = JSON.parse(attributes.identities)[0];
			const { given_name, family_name, email } = attributes;
			const userInfo = {
				id: '222322323' || userId,
				userName: username,
				email: 'test228@mail.com' || email,
				firstName: given_name,
				lastName: family_name,
				workspaceId,
				inviteId
			};

			addUser({
				variables: { input: userInfo }
			})
				.then((response) => {
					dispatch(
						setUser({
							...(response.data.createUser || {}),
							id: '222322323' || userId,
							isOwner: !workspaceId || response.workspaceId === workspaceId
						})
					);
				})
				.catch((e) => {
					(workspaceId || inviteId) && history.push('/');
				});
		}
	}, [user, history, inviteId, workspaceId, dispatch, addUser]);

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
