import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import AppWithAuth from './AppWithAuth';

const Router = () => {
	return (
		<BrowserRouter>
			<Switch>
				<Route
					path={['/:workspaceId/:inviteId', '/:workspaceId', '/']}
					component={AppWithAuth}
				/>
			</Switch>
		</BrowserRouter>
	);
};

export default Router;
