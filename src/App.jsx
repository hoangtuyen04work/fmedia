
import React from 'react';
import Header from './components/Header'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
// import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute

function App() {
  return (
    <Router>
      {/* Header luôn hiển thị */}
      <Header />  
      <main style={{ width: "100%", position: "fixed", top: 0 }}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
  </Router>
  );
}
export default App;
