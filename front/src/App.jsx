import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { MainPage } from '@Components/pages/MainPage/MainPage';
import { Services } from '@Components/pages/Services/Services';
import Header from '@Components/Header/Header';
import Auth from './components/pages/Auth/Auth';
import Profile from './components/pages/Profile/Profile';
import { UserProvider } from './context/UserContext';
import PrivateRoute from '@/context/PrivateRoute';
import OrderHistory from '@Components/OrderHistory/OrderHistory';
import AdminPanel from '@Components/pages/AdminPanel/AdminPanel';

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
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/assigned-orders" element={
            <PrivateRoute role='WORKER'>
              <OrderHistory role={'WORKER'} header={'Призначені замовлення'}/>
            </PrivateRoute>} />
          <Route path="/admin-panel" element={<PrivateRoute role='ADMIN'><AdminPanel /></PrivateRoute>} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
