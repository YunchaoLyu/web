// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import HomePage from './pages/Home';
import CreatePostPage from './pages/Create';
import { NavigationBar } from './component/NavigationBar';

import { Container } from '@mui/material';
import './App.css';
import SearchResults from './component/SearchResults';

function App() {
  return (
    <Router>
      <div className="App">
        <NavigationBar /> {/* Navigation bar at the top of all pages */}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1, backgroundColor: '#f5f5f5' }}>
          <Routes>
          <Route path="/search" element={<SearchResults />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/createpost" element={<CreatePostPage />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;
