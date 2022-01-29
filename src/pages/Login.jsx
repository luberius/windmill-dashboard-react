import React, { useEffect, useState } from 'react';

import { Button, HelperText, Input, Label } from '@luberius/fork-windmill-react-ui';
import { useHistory } from 'react-router-dom';
import ImageLight from '../assets/img/login-office.jpeg';
import ImageDark from '../assets/img/login-office-dark.jpeg';
import { checkLogin, login } from '../utils/auth/auth';
import { showErrorNotification, showSuccessNotification } from '../utils/notification';
import http from '../utils/axios/axios';

function Login() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState({});

  const history = useHistory();

  useEffect(() => {
    if (checkLogin()) history.push('/app/dashboard');
  }, []);

  const validate = () => {
    const theError = {};
    setError(theError);
    theError.error = false;

    if (!username) {
      theError.username = 'Username wajib diisi';
      theError.error = true;
    }

    if (!password) {
      theError.password = 'Password wajib diisi';
      theError.error = true;
    }

    setError(theError);
    return theError.error;
  };

  const doLogin = () => {
    if (validate()) return;

    http
      .post('auth', {
        username,
        password
      })
      .then((r) => {
        if (!r.data.token) {
          showErrorNotification('User tidak memiliki akses');
          return;
        }

        login(r.data.token);
        history.push('/app/dashboard');
        showSuccessNotification('Login berhasil 🎉');
      })
      .catch((e) => {
        showErrorNotification(e.message);
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      doLogin();
    }
  };

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src={ImageLight}
              alt="Office"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src={ImageDark}
              alt="Office"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">Login</h1>
              <Label>
                <span>Username</span>
                <Input
                  className="mt-1"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={({ target: e }) => setUsername(e.value)}
                  onKeyDown={handleKeyDown}
                />
                {error.username && <HelperText valid={false}>{error.username}</HelperText>}
              </Label>

              <Label className="mt-4">
                <span>Password</span>
                <Input
                  className="mt-1"
                  type="password"
                  placeholder="***************"
                  onChange={({ target: e }) => setPassword(e.value)}
                  onKeyDown={handleKeyDown}
                  value={password}
                />
                {error.password && <HelperText valid={false}>{error.password}</HelperText>}
              </Label>

              <hr className="my-8" />
              <Button block onClick={doLogin}>
                Log in
              </Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Login;
