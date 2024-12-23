import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dropdown, Modal, Button, Form } from 'react-bootstrap';
import {
  setChannels,
  setMessages,
  setActiveChannelId,
  removeChannel,
} from '../features/chatSlice';
import axios from 'axios';
import { toast } from 'react-toastify';
import cn from 'classnames';

const ChannelItem = ({ channel }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState(channel.name);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const dispatch = useDispatch();
  const channels = useSelector((state) => state.chat.channels);
  const activeChannelId = useSelector((state) => state.chat.activeChannelId);
  const isProtectedChannel = ['general', 'random'].includes(channel.name);

  useEffect(() => {
    if (showRenameModal) {
      inputRef.current?.focus();
    }
  }, [showRenameModal]);

  const handleDeleteChannel = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/v1/channels/${channel.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(removeChannel(channel.id));
      toast.success(`Канал удалён`);
    } catch (error) {
      toast.error('Канал удалён');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleRenameChannel = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `/api/v1/channels/${channel.id}`,
        { name: newChannelName },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const updatedChannels = channels.map((c) =>
        c.id === channel.id ? { ...c, name: newChannelName } : c,
      );
      dispatch(setChannels(updatedChannels));

      toast.success('канал переименован');
    } catch (error) {
      toast.error('Error renaming channel');
    } finally {
      setLoading(false);
      setShowRenameModal(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleRenameChannel();
    }
  };

  return (
    <>
      <li key={channel.id} className='nav-item w-100'>
        <div role='group' className='d-flex dropdown btn-group'>
          <button
            type='button'
            className={cn(
              'w-100 rounded-0 text-start btn',
              { 'btn-secondary': channel.id === activeChannelId },
              { 'btn-light': channel.id !== activeChannelId },
            )}
            onClick={() => dispatch(setActiveChannelId(channel.id))}
            style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <span className='me-1'>#</span>
            {channel.name}
          </button>
          {!isProtectedChannel && (
            <Dropdown>
              <Dropdown.Toggle
                className={cn(
                  'w-100 border-top-right text-start btn ',
                  { 'btn-secondary': channel.id === activeChannelId },
                  { 'btn-light': channel.id !== activeChannelId },
                )}></Dropdown.Toggle>
              <Dropdown.Menu>
                {!isProtectedChannel && (
                  <>
                    <Dropdown.Item onClick={() => setShowDeleteModal(true)}>
                      Удалить
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => setShowRenameModal(true)}>
                      Переименовать
                    </Dropdown.Item>
                  </>
                )}
              </Dropdown.Menu>
            </Dropdown>
          )}

          {/* Delete Confirmation Modal */}
          <Modal
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Удалить канал</Modal.Title>
            </Modal.Header>
            <Modal.Body>Уверены?</Modal.Body>
            <Modal.Footer>
              <Button
                variant='secondary'
                onClick={() => setShowDeleteModal(false)}
                disabled={loading}>
                Отменить
              </Button>
              <Button
                variant='danger'
                onClick={handleDeleteChannel}
                disabled={loading}>
                {loading ? 'Удаление...' : 'Удалить'}
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Rename Channel Modal */}
          <Modal
            show={showRenameModal}
            onHide={() => setShowRenameModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Переименовать канал</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Control
                ref={inputRef}
                type='text'
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={loading}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant='secondary'
                onClick={() => setShowRenameModal(false)}
                disabled={loading}>
                Отменить
              </Button>
              <Button
                variant='primary'
                onClick={handleRenameChannel}
                disabled={loading}>
                {loading ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </li>
    </>
  );
};
export default ChannelItem;
