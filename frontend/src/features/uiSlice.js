/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isModalOpen: false,
    modalType: null,
    modalChannelId: null,
  },
  reducers: {
    openModal(state, action) {
      state.isModalOpen = true;
      state.modalType = action.payload.type;
      state.modalChannelId = action.payload.channelId;
    },
    closeModal(state) {
      state.isModalOpen = false;
      state.modalType = null;
      state.modalChannelId = null;
    },
  },
});

export const { openModal, closeModal } = uiSlice.actions;

export default uiSlice.reducer;
