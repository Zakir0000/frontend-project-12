import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider as RollbarProvider } from '@rollbar/react';
import Rollbar from 'rollbar';
import LoginPage from './LoginPage.jsx';
import NotFound from './NotFound.jsx';
import Chat from './Chat.jsx';
import SignUpPage from './SignUpPage.jsx';
import PrivateRoute from './PrivateRoute';

const rollbarConfig = {
  accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
  environment: process.env.NODE_ENV || 'production',
};

const App = () => {
  const rollbar = new Rollbar(rollbarConfig);

  console.error('Intentional Console Error');
  rollbar.error('Intentional Rollbar Error');
  return (
    <RollbarProvider instance={rollbar}>
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
      <ToastContainer position='top-right' autoClose={3000} />
    </RollbarProvider>
  );
};

export default App;
