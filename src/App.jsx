import React from 'react';
import Header from './components/Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Search from './pages/Search';
import Auth from './pages/Auth'; 
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
function App() {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated)
  return (
    <Router>
      <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/*" element={
        isAuthenticated ? (
          <>
            <Header />
            <main style={{ width: "100%", position: "fixed", top: 0 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/search" element={<Search />} />
              </Routes>
            </main>
          </>
        ) : (
          <Navigate to="/auth" replace />
        )
      } />
    </Routes>
    </Router>
  );
}

export default App;