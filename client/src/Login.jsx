import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { useLayoutEffect } from 'react';

const LoginComponent = () => {
  const { login , accessToken} = useContext(AuthContext);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleLogin = () => {
    login(credentials.username, credentials.password)
      .then(() => {
        navigate('/dashboard');
      })
      .catch((error) => {
        console.error('Login failed:', error);
      });
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

    useLayoutEffect(() => {
    if(accessToken){
      navigate('/dashboard');
    }
  }, [accessToken]);

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    minWidth: '300px'
  };

  const inputStyle = {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px'
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  };

  return (
    <div style={containerStyle}>
      <div style={formStyle}>
        <input
          style={inputStyle}
          type="text"
          name="username"
          placeholder="Username"
          value={credentials.username}
          onChange={handleChange}
        />
        <input
          style={inputStyle}
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
        />
        <button style={buttonStyle} onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default LoginComponent;
