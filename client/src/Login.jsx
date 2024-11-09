import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { useLayoutEffect } from 'react';

const LoginComponent = () => {
  const { login, accessToken } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(credentials.username, credentials.password);
      navigate('/dashboard');
    } catch (error) {
      setError('Invalid credentials. Please try again.');
      console.error('Login failed:', error);
    }
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
    padding: '20px',
    backgroundColor: '#f5f5f5'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    minWidth: '300px',
    padding: '30px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  };

  const labelStyle = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333'
  };

  const inputStyle = {
    padding: '12px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '16px',
    transition: 'border-color 0.2s ease',
    outline: 'none'
  };

  const buttonStyle = {
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'background-color 0.2s ease',
    marginTop: '10px'
  };

  const errorStyle = {
    color: '#dc3545',
    fontSize: '14px',
    marginTop: '4px'
  };

  return (
    <div style={containerStyle}>
      <form style={formStyle} onSubmit={handleLogin}>
        <h2 style={{ textAlign: 'center', margin: '0 0 20px', color: '#333' }}>Login</h2>
        
        <div style={inputGroupStyle}>
          <label style={labelStyle}>Username</label>
          <input
            style={inputStyle}
            type="text"
            name="username"
            placeholder="Enter your username"
            value={credentials.username}
            onChange={handleChange}
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Password</label>
          <input
            style={inputStyle}
            type="password"
            name="password"
            placeholder="Enter your password"
            value={credentials.password}
            onChange={handleChange}
          />
        </div>

        {error && <div style={errorStyle}>{error}</div>}

        <button style={buttonStyle} type="submit">Login</button>

        <p style={{ textAlign: 'center', margin: '10px 0 0', fontSize: '14px', color: '#666' }}>
          Don't have an account?{' '}
          <span 
            style={{ color: '#007bff', cursor: 'pointer' }} 
            onClick={() => navigate('/register')}
          >
            Register here
          </span>
        </p>
      </form>
    </div>
  );
};

export default LoginComponent;
