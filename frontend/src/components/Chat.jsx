import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addMessage, setChannels, setMessages } from '../features/chatSlice';
import axios from 'axios';
import cn from 'classnames';
import io from 'socket.io-client';

const Chat = () => {
  const channels = useSelector((state) => state.chat.channels);
  const messages = useSelector((state) => state.chat.messages);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeChannelId, setActiveChannelId] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/v1/channels', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(setChannels(response.data));

        if (response.data.length > 0) {
          setActiveChannelId(response.data[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch channels:', error);
        navigate('/login');
      }
    };

    fetchChannels();
  }, [dispatch, navigate]);

  useEffect(() => {
    if (activeChannelId) {
      const fetchMessages = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('/api/v1/messages', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
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

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on('newMessage', (message) => {
      dispatch(addMessage(message));
    });

    return () => {
      newSocket.disconnect();
    };
  }, [dispatch]);

  const handleChannelClick = (channelId) => {
    setActiveChannelId(channelId);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleMessageChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    try {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');
      console.log(username);
      const messageData = {
        body: newMessage,
        channelId: activeChannelId,
        username,
      };
      await axios.post('/api/v1/messages', messageData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className='h-100'>
      <div className='h-100' id='chat'>
        <div className='d-flex flex-column h-100'>
          <nav className='shadow-sm navbar navbar-expand-lg navbar-light bg-white'>
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
          <div className='container h-100 my-4 overflow-hidden rounded shadow'>
            <div className='row h-100 bg-white flex-md-row'>
              <div className='col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex'>
                <div className='d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4'>
                  <b>Каналы</b>
                  <button
                    type='button'
                    className='p-0 text-primary btn btn-group-vertical'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 16 16'
                      width='20'
                      height='20'
                      fill='currentColor'>
                      <path d='M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z'></path>
                      <path d='M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4'></path>
                    </svg>
                    <span className='visually-hidden'>+</span>
                  </button>
                </div>
                <ul
                  id='channels-box'
                  className='nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block'>
                  {channels.length > 0 ? (
                    channels.map((channel) => (
                      <li key={channel.id} className='nav-item w-100'>
                        <button
                          type='button'
                          className={cn(
                            'w-100 rounded-0 text-start btn',
                            { 'btn-secondary': channel.id === activeChannelId },
                            { 'btn-light': channel.id !== activeChannelId },
                          )}
                          onClick={() => handleChannelClick(channel.id)}>
                          <span className='me-1'>#</span>
                          {channel.name}
                        </button>
                      </li>
                    ))
                  ) : (
                    <p>Loading channels...</p>
                  )}
                </ul>
              </div>
              <div className='col p-0 h-100'>
                <div className='d-flex flex-column h-100'>
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
                  <div
                    id='messages-box'
                    className='chat-messages overflow-auto px-5'>
                    {messages &&
                      messages.map((message) => (
                        <div key={message.id} className='text-break mb-2'>
                          <b>{message.username}: </b>
                          {message.body}
                        </div>
                      ))}
                  </div>
                  <div className='mt-auto px-5 py-3'>
                    <form
                      onSubmit={handleSendMessage}
                      noValidate=''
                      className='py-1 border rounded-2'>
                      <div className='input-group has-validation'>
                        <input
                          name='body'
                          aria-label='Новое сообщение'
                          placeholder='Введите сообщение...'
                          className='border-0 p-0 ps-2 form-control'
                          value={newMessage}
                          onChange={(e) => handleMessageChange(e)}
                        />
                        <button
                          type='submit'
                          disabled=''
                          className='btn btn-group-vertical'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 16 16'
                            width='20'
                            height='20'
                            fill='currentColor'>
                            <path
                              fillRule='evenodd'
                              d='M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z'></path>
                          </svg>
                          <span className='visually-hidden'>Отправить</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='Toastify'></div>
      </div>
    </div>
  );
};

export default Chat;
