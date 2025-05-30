import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';

function App() {
  const [user, setUser] = useState(() => {
    // Try to get the user from localStorage on initial render
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');  // Clear storage on logout
  };

  // Whenever user changes, save to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/" element={<Home setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
