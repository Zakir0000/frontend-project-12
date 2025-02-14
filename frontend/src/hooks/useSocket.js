import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { connectSocket, disconnectSocket } from '../services/socketService';
import {
  addChannel,
  removeChannel,
  renameChannel,
} from '../features/channelsSlice';
import { addMessage } from '../features/messagesSlice';

const useSocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = connectSocket(dispatch, {
      addMessage,
      addChannel,
      removeChannel,
      renameChannel,
    });

    return () => {
      disconnectSocket(socket);
    };
  }, [dispatch]);
};

export default useSocket;
