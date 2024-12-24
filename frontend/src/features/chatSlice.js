import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    channels: [],
    messages: [],
    activeChannelId: null,
  },
  reducers: {
    setChannels: (state, action) => {
      state.channels = action.payload;

      if (!state.activeChannelId && state.channels.length > 0) {
        const generalChannel = state.channels.find(
          (channel) => channel.name === 'general',
        );
        state.activeChannelId = generalChannel
          ? generalChannel.id
          : state.channels[0].id;
      }
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setActiveChannelId(state, action) {
      state.activeChannelId = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    removeChannel: (state, action) => {
      const channelIdToRemove = action.payload;
      state.channels = state.channels.filter(
        (channel) => channel.id !== channelIdToRemove,
      );

      if (state.activeChannelId === channelIdToRemove) {
        const generalChannel = state.channels.find(
          (channel) => channel.name === 'general',
        );
        state.activeChannelId = generalChannel
          ? generalChannel.id
          : state.channels.length > 0
          ? state.channels[0].id
          : null;
      }
      if (state.activeChannelId === null) {
        state.messages = [];
      }
    },
  },
});

export const {
  setChannels,
  setMessages,
  setActiveChannelId,
  addMessage,
  removeChannel,
} = chatSlice.actions;

export default chatSlice.reducer;
