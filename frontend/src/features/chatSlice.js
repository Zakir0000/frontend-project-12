/* eslint-disable functional/no-expression-statement */
/* eslint-disable no-param-reassign */
/* eslint-disable functional/no-conditional-statement */

import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    channels: [],
    messagesByChannel: {}, // Messages grouped by channel ID
    activeChannelId: null,
  },
  reducers: {
    setChannels(state, action) {
      state.channels = action.payload;
    },
    addChannel(state, action) {
      const channel = action.payload;
      state.channels.push(channel);
      state.messagesByChannel[channel.id] = []; // Initialize message list for the new channel
    },
    removeChannel(state, action) {
      const channelId = action.payload.id;
      state.channels = state.channels.filter((c) => c.id !== channelId);
      delete state.messagesByChannel[channelId]; // Remove messages for the deleted channel

      // Reset active channel if the deleted channel was active
      if (state.activeChannelId === channelId) {
        state.activeChannelId = state.channels.length
          ? state.channels[0].id
          : null;
      }
    },
    renameChannel(state, action) {
      const { id, name } = action.payload;
      const channel = state.channels.find((c) => c.id === id);
      if (channel) {
        channel.name = name;
      }
    },
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
    setActiveChannelId(state, action) {
      state.activeChannelId = action.payload;
    },
  },
});

export const {
  setChannels,
  addChannel,
  removeChannel,
  renameChannel,
  setMessages,
  addMessage,
  setActiveChannelId,
} = chatSlice.actions;

export default chatSlice.reducer;
