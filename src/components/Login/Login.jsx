/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../use-auth';
import './style.scss';

function Login() {
  const auth = useAuth();
  const history = useHistory();

  // Error state
  const [errors, setErrors] = useState([]);

  const [loginSuccess, setLoginSuccess] = useState(false);

  // State and logic to change form display
  const [form, setForm] = useState('Login');
  const handleFormSwitch = (type) => {
    setForm(type);
  };
  // State and logic for login in form input vals
  const [loginUser, setLoginUser] = useState('');
  const handleLoginUser = (e) => {
    setLoginUser(e.target.value);
  };
  const [loginPassword, setLoginPassword] = useState('');
  const handleLoginPassword = (e) => {
    setLoginPassword(e.target.value);
  };
  // State and logic for login in form input vals
  const [signUser, setSignUser] = useState('');
  const handleSignUser = (e) => {
    setSignUser(e.target.value);
  };
  const [signDisplay, setSignDisplay] = useState('');
  const handleSignDisplay = (e) => {
    setSignDisplay(e.target.value);
  };
  const [signPassword, setSignPassword] = useState('');
  const handleSignPassword = (e) => {
    setSignPassword(e.target.value);
  };
  const [signCPassword, setSignCPassword] = useState('');
  const handleSignCPassword = (e) => {
    setSignCPassword(e.target.value);
  };

  // Form validation
  const validateLogin = () => {
    const localErrors = [];
    if (loginUser.length === 0) {
      localErrors.push('Email must be provided');
    }
    if (loginPassword.length === 0) {
      localErrors.push('Password must be provided');
    }
    if (localErrors.length) {
      setErrors(localErrors);
      return true;
    }
    setErrors([]);
    return false;
  };
  const validateSignup = () => {
    const localErrors = [];

    if (signUser.length === 0) {
      localErrors.push('Email must be provided');
    }
    if (signUser.length > 128) {
      localErrors.push('Email character count of 128 exceeded');
    }
    if (signDisplay.length === 0) {
      localErrors.push('Displayname must be provided');
    }
    if (signDisplay.length > 128) {
      localErrors.push('Displayname character count of 128 exceeded');
    }
    if (signPassword.length === 0) {
      localErrors.push('Password must be provided');
    }
    if (signPassword.length > 128) {
      localErrors.push('Password character count of 128 exceeded');
    }
    if (!/\d/.test(signPassword)) {
      localErrors.push('Password must contain at least 1 number');
    }
    if (!/[a-z]/.test(signPassword)) {
      localErrors.push('Password must contain at least one lowercase letter');
    }
    if (!/[A-Z]/.test(signPassword)) {
      localErrors.push('Password must contain at least one uppercase letter');
    }
    if (signPassword !== signCPassword) {
      localErrors.push('Passwords do not match');
    }

    if (localErrors.length) {
      setErrors(localErrors);
      return true;
    }
    setErrors([]);
    return false;
  };

  // Form submission
  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    if (validateLogin()) return;

    const signIn = await auth.signin(loginUser, loginPassword);
    if (typeof signIn === 'object') {
      setErrors([signIn.message]);
    }
  };
  const handleSubmitSignup = async (e) => {
    e.preventDefault();
    if (validateSignup()) return;

    const signUp = await auth.signup(signUser, signDisplay, signPassword);

    if (typeof signUp === 'object') {
      setErrors([signUp]);
      return;
    }

    if (signUp === 'Email already in use') {
      setErrors([signUp]);
      return;
    }

    setForm('Login');
    setLoginSuccess(true);
  };

  useEffect(() => {
    auth.checkAuth();
  }, [auth]);

  useEffect(() => {
    if (auth.user) {
      history.push('/');
    }
  }, [auth.user, history]);

  return (
    <div className="login-wrap">
      <main>

        <div className="main-head">
          <h1>
            {form}
            {' '}
            Form
          </h1>
          <h2 style={{ color: '#1db643' }}>{loginSuccess ? 'Account created!' : ''}</h2>
        </div>

        <div className="toggle">
          <div
            role="button"
            onClick={() => { handleFormSwitch('Login'); }}
            onKeyDown={() => { handleFormSwitch('Login'); }}
            className={`tog-option ${form === 'Login' ? 'active' : ''}`}
          >
            login
          </div>
          <div
            role="button"
            onClick={() => { handleFormSwitch('Signup'); }}
            onKeyDown={() => { handleFormSwitch('Login'); }}
            className={`tog-option ${form === 'Signup' ? 'active' : ''}`}
          >
            signup
          </div>
        </div>

        <form
          onSubmit={handleSubmitLogin}
          style={{ display: form === 'Login' ? 'block' : 'none' }}
          className="login"
        >
          <input type="email" onInput={handleLoginUser} value={loginUser} name="email" placeholder="email" required="required" />
          <input type="password" onInput={handleLoginPassword} value={loginPassword} name="password" placeholder="password" required="required" />
          <button type="submit">Login</button>
        </form>

        <form
          onSubmit={handleSubmitSignup}
          style={{ display: form === 'Signup' ? 'block' : 'none' }}
          className="signup"
        >
          <input type="email" onInput={handleSignUser} value={signUser} name="email" placeholder="email" required="required" />
          <input type="text" onInput={handleSignDisplay} value={signDisplay} name="displayname" placeholder="display name" required="required" />
          <input type="password" onInput={handleSignPassword} value={signPassword} name="password" placeholder="password" required="required" />
          <input type="password" onInput={handleSignCPassword} value={signCPassword} name="password" placeholder="confirm password" required="required" />
          <button type="submit">Signup</button>
        </form>

        <div className="errors">
          <ul>
            {errors.map((error, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <li key={index}>
                *
                {error}
                {' '}
                *
              </li>
            ))}
          </ul>
        </div>

      </main>
    </div>
  );
}

export default Login;
