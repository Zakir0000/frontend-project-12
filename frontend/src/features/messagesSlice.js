/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    messagesByChannel: {}, // Messages grouped by channel ID
  },
  reducers: {
    setMessages(state, action) {
      const { channelId, messages } = action.payload;
      state.messagesByChannel[channelId] = messages;
    },
    addMessage(state, action) {
      const message = action.payload;
      if (!state.messagesByChannel[message.channelId]) {
        state.messagesByChannel[message.channelId] = [];
      }
      state.messagesByChannel[message.channelId].push(message);
    },
    removeMessagesByChannel(state, action) {
      const channelId = action.payload;
      delete state.messagesByChannel[channelId];
    },
  },
});

export const {
  setMessages,
  addMessage,
  removeMessagesByChannel,
} = messagesSlice.actions;

export default messagesSlice.reducer;
