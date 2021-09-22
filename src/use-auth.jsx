/* eslint-disable react/prop-types */
import React, { useState, useContext, createContext } from 'react';

const axios = require('axios').default;

const authContext = createContext();

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => useContext(authContext);

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState(false);
  const [jwt, setJWT] = useState('');

  const signin = async (username, password) => {
    try {
      const responseData = await axios.post('http://localhost:5000/auth/login', {
        username,
        password,
      });
      setUser(true);
      setJWT(responseData.data);
      localStorage.setItem('jwt-fe', responseData.data);
      return responseData.data;
    } catch (error) {
      return error.response.data;
    }
  };

  const signup = async (username, displayname, password) => {
    try {
      const responseData = await axios.post('http://localhost:5000/auth/signup', {
        username,
        displayname,
        password,
      });
      return responseData.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
    }

    return true;
  };

  const signout = () => {
    setUser(false);
    setJWT('');
    localStorage.removeItem('jwt-fe');
  };

  const checkAuth = async () => {
    try {
      await axios.get('http://localhost:5000/user/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt-fe')}`,
        },
      });

      setUser(true);
    } catch (error) {
      setUser(false);
    }
  };

  // Return the user object and auth methods
  return {
    user,
    jwt,
    signin,
    signup,
    signout,
    checkAuth,
  };
}

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}