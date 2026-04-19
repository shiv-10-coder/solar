// ========================================
// auth.js - Shared Authentication Helper
// ========================================
// This file handles JWT token storage and user session management.
// It is included in every HTML page via <script src="/js/auth.js">

const API_URL = '/api';

// Get the JWT token from localStorage
function getToken() {
  return localStorage.getItem('token');
}

// Get the user info from localStorage
function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// Check if user is logged in
function isLoggedIn() {
  return getToken() !== null;
}

// Save token and user info after login/signup
function saveAuth(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

// Logout - clear everything and redirect to login page
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/index.html';
}

// Protect a page - redirect to login if not authenticated
// Call this at the top of any page that requires login
function protectPage() {
  if (!isLoggedIn()) {
    window.location.href = '/index.html';
    return false;
  }
  return true;
}

// Helper function to make authenticated API calls
// Automatically adds the JWT token to the request header
async function fetchWithAuth(url, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = 'Bearer ' + token;
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  // If token is expired or invalid, redirect to login
  if (response.status === 401) {
    logout();
    return null;
  }

  return response;
}
