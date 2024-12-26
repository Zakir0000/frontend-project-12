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
        person: user ? user : null,
      },
    },
  };
  const rollbar = new Rollbar(rollbarConfig);
  return (
    <RollbarProvider instance={rollbar}>
      <BrowserRouter>
        <Routes>
          <Route path='*' element={<NotFound />} />
          <Route
            path='/login'
            element={
              <ErrorBoundary>
                <LoginPage />
              </ErrorBoundary>
            }
          />
          <Route
            path='/'
            element={
              <PrivateRoute>
                <ErrorBoundary>
                  <Chat />
                </ErrorBoundary>
              </PrivateRoute>
            }
          />
          <Route
            path='/signup'
            element={
              <ErrorBoundary>
                <SignUpPage />
              </ErrorBoundary>
            }
          />
        </Routes>
      </BrowserRouter>
      <ToastContainer position='top-right' autoClose={3000} />
    </RollbarProvider>
  );
};

export default App;
