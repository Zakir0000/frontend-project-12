import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { store } from '../app/store';
import LoginPage from './LoginPage.jsx';
import NotFound from './NotFound.jsx';
import Chat from './Chat.jsx';
import SignUpPage from './SignUpPage.jsx';
import PrivateRoute from './PrivateRoute';

const App = () => {
  return (
    <Provider store={store}>
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
    </Provider>
  );
};

export default App;
