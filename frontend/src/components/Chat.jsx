import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  addMessage,
  setChannels,
  setMessages,
  setActiveChannelId,
} from '../features/chatSlice';
import axiosInstance from '../utils/axiosInstance';
import initializeSocket from '../utils/socket';
import Sidebar from './Sidebar';
import MessagesBox from './MessagesBox';

const Chat = () => {
  const channels = useSelector((state) => state.chat.channels);
  const messages = useSelector((state) => state.chat.messages);
  const activeChannelId = useSelector((state) => state.chat.activeChannelId);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);

  // Fetch channels
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await axiosInstance.get('/channels');
        dispatch(setChannels(response.data));
        if (response.data.length > 0) {
          dispatch(setActiveChannelId(response.data[0].id));
        }
      } catch (error) {
        console.error('Failed to fetch channels:', error);
        navigate('/login');
      }
    };
    fetchChannels();
  }, [dispatch, navigate]);

  // Fetch messages
  useEffect(() => {
    if (activeChannelId) {
      const fetchMessages = async () => {
        try {
          const response = await axiosInstance.get('/messages');
          const channelMessages = response.data.filter(
            (message) => message.channelId === activeChannelId,
          );
          dispatch(setMessages(channelMessages));
        } catch (error) {
          console.error('Failed to fetch messages:', error);
        }
      };
      fetchMessages();
    }
  }, [activeChannelId, dispatch]);

  // Initialize Socket.IO
  useEffect(() => {
    const newSocket = initializeSocket(dispatch, addMessage);
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, [dispatch]);

  // Message input handlers
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      const username = localStorage.getItem('username');
      const messageData = {
        body: newMessage,
        channelId: activeChannelId,
        username,
      };
      await axiosInstance.post('/messages', messageData);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className='h-100 bg-light'>
      <div className='h-100' id='chat'>
        <div className='d-flex flex-column h-100'>
          <nav className='navbar navbar-light bg-white shadow-sm'>
            <div className='container'>
              <a className='navbar-brand' href='/'>
                Hexlet Chat
              </a>
              <button
                onClick={handleLogout}
                type='button'
                className='btn btn-primary'>
                Выйти
              </button>
            </div>
          </nav>
          <div className='container h-100 my-4 rounded shadow'>
            <div className='row h-100 bg-white'>
              <Sidebar />
              <div className='col p-0 h-100 d-flex flex-column'>
                <div className='bg-light mb-4 p-3 shadow-sm small'>
                  <p className='m-0'>
                    <b>
                      #{' '}
                      {channels.find((c) => c.id === activeChannelId)?.name ||
                        'general'}
                    </b>
                  </p>
                  <span className='text-muted'>
                    {messages && `${messages.length} сообщений`}
                  </span>
                </div>
                <MessagesBox messages={messages} />
                <form
                  onSubmit={handleSendMessage}
                  className='mt-auto px-5 py-3'>
                  <div className='input-group'>
                    <input
                      className='form-control'
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder='Введите сообщение...'
                    />
                    <button type='submit' className='btn btn-primary'>
                      Отправить
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
