import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { MainPage } from '@Components/pages/MainPage/MainPage';
import { Services } from '@Components/pages/Services/Services';
import Header from './components/UI/Header/Header';
import Auth from './components/pages/Auth/Auth';
import Profile from './components/pages/Profile/Profile';
import { UserProvider } from './context/UserContext';

function App() {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <UserProvider>
      <Router>
        <Header setIsSignup={setIsSignup} />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/services" element={<Services />} />
          <Route path="/auth" element={<Auth isSignup={isSignup} setIsSignup={setIsSignup} />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
