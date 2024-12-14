import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { MainPage } from './pages/MainPage/MainPage';
import { Services } from './pages/Services/Services';
import Header from './UI/Header/Header';
import Auth from './pages/Auth/Auth';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';

function App() {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <Router>
      <Header setIsSignup={setIsSignup}/>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/services" element={<Services />} />
        <Route path="/auth" element={<Auth initialSignup={isSignup}/>} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
