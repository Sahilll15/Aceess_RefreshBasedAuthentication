import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

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
  outline: 'none',
  '&:focus': {
    borderColor: '#007bff'
  }
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
  marginTop: '10px',
  '&:hover': {
    backgroundColor: '#0056b3'
  }
};

const errorStyle = {
  color: '#dc3545',
  fontSize: '14px',
  marginTop: '4px'
};

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/register`, {
        username,
        password
      });

      // Auto-login after successful registration
      await login(username, password);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed. Please try again.');
      console.error('Registration error:', error);
    }
  };

  return (
    <div style={containerStyle}>
      <form style={formStyle} onSubmit={handleRegister}>
        <h2 style={{ textAlign: 'center', margin: '0 0 20px', color: '#333' }}>Create Account</h2>
        
        <div style={inputGroupStyle}>
          <label style={labelStyle}>Username</label>
          <input 
            style={inputStyle}
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Password</label>
          <input 
            style={inputStyle}
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        {error && <div style={errorStyle}>{error}</div>}

        <button style={buttonStyle} type="submit">Register</button>

        <p style={{ textAlign: 'center', margin: '10px 0 0', fontSize: '14px', color: '#666' }}>
          Already have an account?{' '}
          <span 
            style={{ color: '#007bff', cursor: 'pointer' }} 
            onClick={() => navigate('/login')}
          >
            Login here
          </span>
        </p>
      </form>
    </div>
  );
}

export default Register;