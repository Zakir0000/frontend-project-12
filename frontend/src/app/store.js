import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import messagesReducer from '../features/messagesSlice';
import channelsReducer from '../features/channelsSlice';
import uiReducer from '../features/uiSlice';

const store = configureStore({
  reducer: {
    channels: channelsReducer,
    messages: messagesReducer,
    auth: authReducer,
    ui: uiReducer,
  },
});

export default store;
