import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import filter from 'leo-profanity';
import { getChannels, setActiveChannelId } from '../features/channelsSlice';
import { getMessages } from '../features/messagesSlice';
import axiosInstance from '../utils/axiosInstance';
import Sidebar from './Sidebar';
import MessagesBox from './MessagesBox';
import { logout } from '../features/authSlice';
import { ROUTES } from '../routes';

const Chat = () => {
  const { t } = useTranslation();
  filter.loadDictionary('en');

  const filterProfanity = (text) => filter.clean(text);

  const channels = useSelector((state) => state.channels.channels);
  const activeChannelId = useSelector(
    (state) => state.channels.activeChannelId,
  );
  const messages = useSelector(
    (state) => state.messages.messagesByChannel[activeChannelId] || [],
  );
  const username = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [newMessage, setNewMessage] = useState('');

  // Fetch channels

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await axiosInstance.get(ROUTES.CHANNELS);
        dispatch(getChannels(response.data));
        if (response.data.length > 0) {
          dispatch(setActiveChannelId(response.data[0].id));
        }
      } catch (error) {
        console.error('Failed to fetch channels:', error);
        if (error.response && error.response.status === 401) {
          dispatch(logout());
          navigate(ROUTES.LOGIN);
        } else {
          throw new Error('Error fetching channels');
        }
      }
    };
    fetchChannels();
  }, [dispatch, navigate]);

  // Fetch messages

  useEffect(() => {
    if (activeChannelId) {
      const fetchMessages = async () => {
        try {
          const response = await axiosInstance.get(ROUTES.MESSAGES);
          const filteredMessages = response.data.filter(
            (msg) => msg.channelId === activeChannelId,
          );

          dispatch(
            getMessages({
              channelId: activeChannelId,
              messages: filteredMessages,
            }),
          );
        } catch (error) {
          console.error('Failed to fetch messages:', error);
          if (error.response && error.response.status === 401) {
            dispatch(logout());
            navigate(ROUTES.LOGIN);
          } else {
            throw new Error('Error fetching messages');
          }
        }
      };
      fetchMessages();
    }
  }, [activeChannelId, dispatch, navigate]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const filteredMessage = filterProfanity(newMessage);

    try {
      const messageData = {
        body: filteredMessage,
        channelId: activeChannelId,
        username,
      };
      await axiosInstance.post(ROUTES.MESSAGES, messageData);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      throw new Error('Error sending message');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="h-100 bg-light">
      <div className="h-100" id="chat">
        <div className="d-flex flex-column h-100">
          <nav className="navbar navbar-light bg-white shadow-sm">
            <div className="container">
              <a className="navbar-brand" href="/">
                {t('title')}
              </a>
              <button
                onClick={handleLogout}
                type="button"
                className="btn btn-primary"
              >
                {t('logout')}
              </button>
            </div>
          </nav>
          <div className="container h-100 my-4 rounded shadow overflow-hidden ">
            <div className="row h-100 bg-white flex-md-row">
              <Sidebar />
              <div className="col p-0 h-100">
                <div className="d-flex flex-column h-100">
                  <div className="bg-light mb-4 p-3 shadow-sm small">
                    <p className="m-0">
                      <b>
                        #
                        {' '}
                        {channels.find((c) => c.id === activeChannelId)?.name
                        || 'general'}
                      </b>
                    </p>
                    <span className="text-muted">
                      {messages && t('counts.count', {
                        count: messages.length,
                      })}
                    </span>
                  </div>
                  <MessagesBox messages={messages} />
                  <form
                    onSubmit={handleSendMessage}
                    className="mt-auto px-5 py-3"
                  >
                    <div className="input-group">
                      <input
                        id="name"
                        className="form-control"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={t('enterMessage')}
                        aria-label="Новое сообщение"
                      />

                      <button type="submit" className="btn btn-primary">
                        {t('send')}
                        <span className="visually-hidden">Отправить</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
