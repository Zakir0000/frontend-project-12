/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    messagesByChannel: {},
  },
  reducers: {
    getMessages(state, action) {
      const { channelId, messages } = action.payload;
      state.messagesByChannel[channelId] = messages;
    },
    addMessage: (state, action) => {
      const message = action.payload;
      const { channelId } = message;
      if (!state.messagesByChannel[channelId]) {
        state.messagesByChannel[channelId] = [];
      }
      state.messagesByChannel[channelId].push(message);
      console.log('Redux reducer addMessage called:', message);
    },
  },
});

export const {
  getMessages,
  addMessage,
} = messagesSlice.actions;

export default messagesSlice.reducer;
