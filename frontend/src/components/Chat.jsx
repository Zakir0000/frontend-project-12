import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setChannels } from '../features/chatSlice';
import axios from 'axios';

const Chat = () => {
  const channels = useSelector((state) => state.chat.channels);
  const dispatch = useDispatch();

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
      } catch (error) {
        console.error('Failed to fetch channels:', error);
      }
    };

    fetchChannels();
  }, [dispatch]);

  return (
    <div>
      {channels.length > 0 ? (
        channels.map((channel) => <div key={channel.id}>{channel.name}</div>)
      ) : (
        <p>Loading channels...</p>
      )}
    </div>
  );
};

export default Chat;
