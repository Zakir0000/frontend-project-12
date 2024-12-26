import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import Rollbar from 'rollbar';
import LoginPage from './LoginPage.jsx';
import NotFound from './NotFound.jsx';
import Chat from './Chat.jsx';
import SignUpPage from './SignUpPage.jsx';
import PrivateRoute from './PrivateRoute';

const App = () => {
  const rollbarConfig = {
    accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
    environment: process.env.NODE_ENV || 'production',
  };
  const rollbar = new Rollbar(rollbarConfig);
  return (
    <RollbarProvider instance={rollbar}>
      <ErrorBoundary>
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
        </BrowserRouter>
      </ErrorBoundary>
      <ToastContainer position='top-right' autoClose={3000} />
    </RollbarProvider>
  );
};

export default App;
