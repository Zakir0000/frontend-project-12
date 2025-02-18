import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginPage from './LoginPage.jsx';
import NotFound from './NotFound.jsx';
import Chat from './Chat.jsx';
import SignUpPage from './SignUpPage.jsx';
import PrivateRoute from './PrivateRoute';
import { ApiContextProvider } from '../context/ApiContext.jsx';

const App = () => (
  <>
    <ApiContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              (
                <PrivateRoute>
                  <Chat />
                </PrivateRoute>
              )
            }
          />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </BrowserRouter>
    </ApiContextProvider>
    <ToastContainer position="top-right" autoClose={3000} />
  </>
);

export default App;
