import { nanoid } from '@reduxjs/toolkit';
import React from 'react';

const MessagesBox = ({ messages }) => (
  <div id="messages-box" className="chat-messages overflow-auto px-5">
    {messages.map((message) => (
      <div key={nanoid()} className="text-break mb-2">
        <b>
          {message.username}
          :
          {' '}
        </b>
        {message.body}
      </div>
    ))}
  </div>
);

export default MessagesBox;
