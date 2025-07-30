import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiLogOut } from 'react-icons/fi';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="logo">
            TaskManager
          </Link>
          
          {isAuthenticated && (
            <nav className="nav">
              <div className="user-info">
                <FiUser />
                <span>Welcome, {user?.name}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                <FiLogOut />
                Logout
              </button>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
