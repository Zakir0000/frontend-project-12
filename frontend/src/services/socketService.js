import { io } from 'socket.io-client';

let socket;

export const connectSocket = (dispatch, actions) => {
  socket = io();

  socket.on('newMessage', (message) => {
    console.log('Received message from server:', message);
    dispatch(actions.addMessage(message));
  });

  socket.on('newChannel', (channel) => {
    console.log('New channel received:', channel);
    dispatch(actions.addChannel(channel));
  });

  socket.on('removeChannel', (channel) => {
    console.log('Channel removed:', channel);
    dispatch(actions.removeChannel(channel));
  });

  socket.on('renameChannel', (channel) => {
    console.log('Channel renamed:', channel);
    dispatch(actions.renameChannel(channel));
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
