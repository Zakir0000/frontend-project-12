/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';

const initialToken = localStorage.getItem('token');
const initialUser = localStorage.getItem('username');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    isAuthenticated: Boolean(initialToken),
    user: initialUser,
  },
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.user = action.payload.username;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('username', action.payload.username);
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
