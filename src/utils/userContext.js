import React from 'react';

const UserContext = React.createContext({
  signOut: null,
  user: null,
});

export const UserProvider = UserContext.Provider;
export const UserConsumer = UserContext.Consumer;
export default UserContext;
