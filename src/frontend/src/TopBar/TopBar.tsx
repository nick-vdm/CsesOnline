import React from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from '../Consts';

interface TopBarProps {
 isAuthenticated: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ isAuthenticated }) => {
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
      CsesJourney
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
   <Link
    to={isAuthenticated ? PATHS.PROFILE : PATHS.AUTH_LOGIN}
    style={{
     color: '#61dafb',
     textDecoration: 'none',
     fontSize: '18px',
     fontWeight: 'bold',
     transition: 'color 0.3s ease',
    }}
    onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
    onMouseLeave={(e) => (e.currentTarget.style.color = '#61dafb')}
   >
    {isAuthenticated ? 'Profile' : 'Log In'}
   </Link>
  </div>
 );
};

export default TopBar;
