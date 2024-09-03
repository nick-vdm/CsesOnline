import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PATHS } from '../Consts';

interface TopBarProps {
  isAuthenticated: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ isAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate(PATHS.AUTH_LOGIN);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#21252b', // Slightly darker background color
        color: '#abb2bf',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', // More pronounced shadow for depth
        borderBottom: '1px solid #444c56', // Bottom border as a separator
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link
          to="/"
          style={{
            textDecoration: 'none',
            color: '#61dafb',
            transition: 'color 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#61dafb')}
        >
          <h1 style={{ margin: 0, fontSize: '24px', color: 'inherit' }}>
            CsesOnline
          </h1>
        </Link>
        <Link
          to="/"
          style={{
            color: '#61dafb',
            textDecoration: 'none',
            fontSize: '18px',
            fontWeight: 'bold',
            marginLeft: '20px',
            transition: 'color 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#61dafb')}
        >
          Problem List
        </Link>
      </div>
      <div>
        <Link
          to={isAuthenticated ? PATHS.PROFILE + '/' + localStorage.getItem('username') : PATHS.AUTH_LOGIN}
          style={{
            color: '#61dafb',
            textDecoration: 'none',
            fontSize: '18px',
            fontWeight: 'bold',
            transition: 'color 0.3s ease',
            marginRight: '20px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#61dafb')}
        >
          {isAuthenticated ? 'Profile' : 'Log In'}
        </Link>
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#61dafb',
              color: '#282c34',
              border: 'none',
              padding: '5px 10px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              borderRadius: '4px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#528bff')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#61dafb')}
          >
            Log Out
          </button>
        )}
      </div>
    </div>
  );
};

export default TopBar;
