import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LoginPage from './LoginPage.jsx';
import NotFound from './NotFound.jsx';
import Chat from './Chat.jsx';
import SignUpPage from './SignUpPage.jsx';
import PrivateRoute from './PrivateRoute';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import Rollbar from 'rollbar';

const App = () => {
  const user = useSelector((state) => state.auth.user);
  const rollbarConfig = {
    accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true,
    environment: process.env.NODE_ENV || 'production',
    server: {
      root: '',
      branch: 'main',
    },
    code_version: '0.13.7',
    payload: {
      person: {
        person: user ? { id: user.id, username: user.user } : null,
      },
    },
  };
  const rollbar = new Rollbar(rollbarConfig);
  return (
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<NotFound />} />
        <Route path='/login' element={<LoginPage />} />
        <Route
          path='/'
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route path='/signup' element={<SignUpPage />} />
      </Routes>
      <ToastContainer position='top-right' autoClose={3000} />
    </BrowserRouter>
  );
};

export default App;
