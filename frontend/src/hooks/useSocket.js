import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { connectSocket } from '../services/socketService';
import {
  addChannel,
  removeChannel,
  renameChannel,
} from '../features/channelsSlice';
import { addMessage } from '../features/messagesSlice';

const useSocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    connectSocket(dispatch, {
      addMessage,
      addChannel,
      removeChannel,
      renameChannel,
    });
  }, [dispatch]);
};

export default useSocket;
