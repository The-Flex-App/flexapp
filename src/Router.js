import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import AppWithAuth from './AppWithAuth';
import Error from './components/Error';

const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path={'/error'} component={Error} exact />
        <Route
          path={[
            '/dashboards/:workspaceId/:inviteId',
            '/dashboards/:workspaceId',
            '/',
          ]}
          component={AppWithAuth}
        />
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
