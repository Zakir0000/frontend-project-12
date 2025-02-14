/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';

const channelsSlice = createSlice({
  name: 'channels',
  initialState: {
    channels: [],
    activeChannelId: null,
  },
  reducers: {
    getChannels(state, action) {
      state.channels = action.payload;
    },
    addChannel(state, action) {
      const channel = action.payload;
      state.channels.push(channel);
    },
    removeChannel(state, action) {
      const channelId = action.payload.id;
      state.channels = state.channels.filter((c) => c.id !== channelId);

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
    setActiveChannelId(state, action) {
      state.activeChannelId = action.payload;
    },
  },
});

export const {
  getChannels,
  addChannel,
  removeChannel,
  renameChannel,
  setActiveChannelId,
} = channelsSlice.actions;

export default channelsSlice.reducer;
