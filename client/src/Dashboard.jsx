import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';

const Dashboard = () => {
  const { logout } = useContext(AuthContext);

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
    <div>
      <p>Welcome to the secure area!</p>
      <button style={buttonStyle} onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
