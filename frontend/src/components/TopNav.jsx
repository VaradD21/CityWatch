import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import { 
  Shield, 
  Menu, 
  X, 
  Home, 
  FileText, 
  Settings, 
  Calendar, 
  Megaphone, 
  AlertCircle,
  LogOut,
  User,
  Map
} from 'lucide-react';

const TopNav = ({ onToggleSidebar, sidebarOpen }) => {
  const location = useLocation();
  const authContext = useAuth();
  const { user, logout } = authContext;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Don't render if user is not loaded yet
  if (!user) {
    return null;
  }

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Global navigation items (app-level)
  const globalNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/reports', label: 'Reports', icon: FileText },
    { path: '/reports/map', label: 'Reports Map', icon: Map },
    { path: '/events', label: 'Events', icon: Calendar },
    { path: '/announcements', label: 'Announcements', icon: Megaphone },
  ];

  // Add alerts for all users (citizens can view, authorities/admins can manage)
  if (user) {
    globalNavItems.push({ path: '/alerts', label: 'Alerts', icon: AlertCircle });
  }

  // Add settings for all authenticated users
  if (user) {
    globalNavItems.push({ path: '/settings', label: 'Settings', icon: Settings });
  }

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200/60 sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          {/* Left side - Logo and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Mobile sidebar toggle for admin */}
            {user?.role === 'admin' && (
              <button
                onClick={onToggleSidebar}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="Toggle sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            {/* Logo */}
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors tracking-tight">
                  CityWatch
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Center - Global Navigation (Desktop) */}
          <motion.div 
            className="hidden lg:flex items-center space-x-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {user ? (
              globalNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                      isActive(item.path)
                        ? 'text-primary-700 bg-primary-100 shadow-sm border border-primary-200' 
                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden xl:inline">{item.label}</span>
                  </Link>
                );
              })
            ) : (
              <>
                <Link
                  to="/"
                  className={`px-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/') 
                      ? 'text-primary-600 bg-primary-50 shadow-sm' 
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/login"
                  className={`px-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/login') 
                      ? 'text-primary-600 bg-primary-50 shadow-sm' 
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className={`px-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/signup') 
                      ? 'text-primary-600 bg-primary-50 shadow-sm' 
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  Sign Up
                </Link>
              </>
            )}
          </motion.div>

          {/* Right side - User Info and Actions */}
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {user ? (
              <>
                <NotificationDropdown />
                
                {/* User Info */}
                <div className="hidden lg:flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center ring-2 ring-gray-100">
                    {user.profilePictureUrl ? (
                      <img
                        src={`http://localhost:5000${user.profilePictureUrl}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.log('Profile picture failed to load:', user.profilePictureUrl);
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="w-full h-full flex items-center justify-center"
                      style={{ display: user.profilePictureUrl ? 'none' : 'flex' }}
                    >
                      <User className="w-4 h-4 text-gray-500" />
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="flex items-center space-x-1">
                      <span className="text-gray-700 hidden xl:inline">Welcome, </span>
                      <span className="font-semibold text-gray-900">{user.username}</span>
                    </div>
                    <div className="flex items-center mt-1">
                      {user.role === 'admin' && (
                        <span className="px-1.5 py-0.5 text-xs bg-red-100 text-red-800 rounded-full font-medium">
                          Admin
                        </span>
                      )}
                      {user.role === 'authority' && (
                        <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
                          Authority
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-2 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 border border-transparent hover:border-red-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden xl:inline">Logout</span>
                </button>

                {/* Mobile menu button */}
                <button
                  onClick={toggleMobileMenu}
                  className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                  aria-label="Toggle mobile menu"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            )}
          </motion.div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <motion.div 
            className="lg:hidden border-t border-gray-200 py-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="space-y-2">
              {user ? (
                globalNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={toggleMobileMenu}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive(item.path)
                          ? 'text-primary-600 bg-primary-50' 
                          : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })
              ) : (
                <>
                  <Link
                    to="/"
                    onClick={toggleMobileMenu}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/') 
                        ? 'text-primary-600 bg-primary-50' 
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    Home
                  </Link>
                  <Link
                    to="/login"
                    onClick={toggleMobileMenu}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/login') 
                        ? 'text-primary-600 bg-primary-50' 
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={toggleMobileMenu}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/signup') 
                        ? 'text-primary-600 bg-primary-50' 
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default TopNav;
