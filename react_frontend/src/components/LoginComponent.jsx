import React, { useState } from 'react';
import { FormControl, Input, Button, CircularProgress, Paper } from '@mui/material';
import AuthService from '../services/AuthService';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const onChangeUsername = (e) => {
    const username = e.target.value;
    setUsername(username);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const handleLogin = () => {
    setLoading(true);
    setMessage('');

    // Send the login request to the server
    AuthService.login(username, password)
      .then((response) => {
        if (response.login) {
          // If the login is successful, call the provided callback function to inform the parent component
          onLogin();
        }
      })
      .catch((error) => {
        const resMessage =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();
        setMessage(resMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="col-md-12">
      <Paper elevation={3} className="card-container">
        <FormControl>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <Input
              type="text"
              className="form-control"
              name="username"
              value={username}
              onChange={onChangeUsername}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <Input
              type="password"
              className="form-control"
              name="password"
              value={password}
              onChange={onChangePassword}
            />
          </div>

          <div className="form-group">
            <Button
              variant="contained"
              color="primary"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
          </div>

          {message && (
            <div className="form-group">
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            </div>
          )}
        </FormControl>
      </Paper>
    </div>
  );
}

export default Login;
