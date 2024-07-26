import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './Components/Hero.jsx';
import Signin from './Components/Signin.jsx';
import Login from './Components/Login.jsx';
import Payment from './Components/Payment.jsx';

// Your Stripe public key
const stripePromise = loadStripe('your-publishable-key-here');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Elements stripe={stripePromise}>
      <Router>
        <Routes>
          <Route path='/' element={<Hero />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/login' element={<Login />} />
          <Route path='/Payment' element={<Payment />} />
        </Routes>
      </Router>
    </Elements>
  </React.StrictMode>,
);
