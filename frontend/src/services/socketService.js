import initializeSocket from '../utils/socket';

let socket = null;

export const connectSocket = (dispatch, actions) => {
  if (!socket) {
    socket = initializeSocket(dispatch, actions.addMessage);

    socket.on('newChannel', (channel) => {
      dispatch(actions.addChannel(channel));
    });
    socket.on('removeChannel', (payload) => {
      dispatch(actions.removeChannel(payload));
    });
    socket.on('renameChannel', (payload) => {
      dispatch(actions.renameChannel(payload));
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
