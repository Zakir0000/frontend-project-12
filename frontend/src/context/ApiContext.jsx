// src/context/ApiContext.jsx
import React, { createContext, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { connectSocket, disconnectSocket } from '../services/socketService';
import { addChannel, removeChannel, renameChannel } from '../features/channelsSlice';
import { addMessage } from '../features/messagesSlice';

const ApiContext = createContext({});

export const ApiContextProvider = ({ children }) => {
  const dispatch = useDispatch();

  const socket = useMemo(() => connectSocket(dispatch, {
    addMessage,
    addChannel,
    removeChannel,
    renameChannel,
  }), [dispatch]);

  useEffect(() => () => disconnectSocket(), []);

  const api = useMemo(() => ({
    addNewMessage: (message, callback) => {
      console.log('Emitting newMessage with:', message);
      socket.emit('newMessage', message, (response) => {
        console.log('Response from newMessage:', response);
        if (callback) callback(response);
      });
    },
    addNewChannel: (channel, callback) => {
      socket.emit('newChannel', channel, (response) => {
        console.log('Response from newChannel:', response);
        if (callback) callback(response);
      });
    },
    renameOneChannel: (channel, callback) => {
      socket.emit('renameChannel', channel, (response) => {
        console.log('Response from renameChannel:', response);
        if (callback) callback(response);
      });
    },
    removeOneChannel: (channel, callback) => {
      socket.emit('removeChannel', channel, (response) => {
        console.log('Response from removeChannel:', response);
        if (callback) callback(response);
      });
    },
    socket,
  }), [socket]);

  return (
    <ApiContext.Provider value={api}>
      {children}
    </ApiContext.Provider>
  );
};

export default ApiContext;
