import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    channels: [],
    messages: [],
  },
  reducers: {
    setChannels: (state, action) => {
      state.channels = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
});

export const { setChannels, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
