/* eslint-disable functional/no-expression-statement */

import { io } from 'socket.io-client';

const initialSocket = (dispatch, addMessage) => {
  const socket = io();
  socket.on('newMessage', (message) => {
    dispatch(addMessage(message));
  });
  return socket;
};

export default initialSocket;
