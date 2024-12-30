import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Dropdown,
  Modal,
  Button,
  Form,
} from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import {
  setChannels,
  setActiveChannelId,
  removeChannel,
} from '../features/chatSlice';

const ChannelItem = ({ channel }) => {
  const { t } = useTranslation();
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
    if (showRenameModal && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [showRenameModal]);

  const handleDeleteChannel = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/v1/channels/${channel.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(removeChannel({ id: channel.id }));
      toast.success(t('channel.channelDeleted'));
    } catch (error) {
      toast.error(t('errors.connection'));
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

      const updatedChannels = channels.map((c) => (c.id === channel.id
        ? { ...c, name: newChannelName } : c));

      dispatch(setChannels(updatedChannels));

      toast.success(t('channel.channelRenamed'));
    } catch (error) {
      toast.error(t('errors.connection'));
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
    <li key={channel.id} className="nav-item w-100">
      <div role="group" className="d-flex dropdown btn-group">
        <button
          type="button"
          className={cn(
            'w-100 rounded-0 text-start text-truncate btn',
            { 'btn-secondary': channel.id === activeChannelId },
            { 'btn-light': channel.id !== activeChannelId },
          )}
          onClick={() => dispatch(setActiveChannelId(channel.id))}
          style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          <span className="me-1">#</span>
          {channel.name}
        </button>

        {!isProtectedChannel && (
          <Dropdown>
            <Dropdown.Toggle
              className={cn(
                'w-100 border-top-right text-start text-truncate btn',
                { 'btn-secondary': channel.id === activeChannelId },
                { 'btn-light': channel.id !== activeChannelId },
              )}
            >
              <span className="visually-hidden">
                {t('channel.channelMenegment')}
              </span>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {!isProtectedChannel && (
                <>
                  <Dropdown.Item onClick={() => setShowDeleteModal(true)}>
                    {t('delete')}
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setShowRenameModal(true)}>
                    {t('rename')}
                  </Dropdown.Item>
                </>
              )}
            </Dropdown.Menu>
          </Dropdown>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          centered
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>{t('channel.channelDelete')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {t('confirmation')}
            ?
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              disabled={loading}
            >
              {t('cancel')}
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteChannel}
              disabled={loading}
            >
              {loading ? `${t('deleting')}` : `${t('delete')}`}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Rename Channel Modal */}
        <Modal
          centered
          show={showRenameModal}
          onHide={() => setShowRenameModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>{t('channel.channelRename')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label className="visually-hidden" htmlFor="channelName">
                  {t('channel.channelName')}
                </Form.Label>
                <Form.Control
                  id="channelName"
                  type="text"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={loading}
                  inputref={inputRef}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowRenameModal(false)}
              disabled={loading}
            >
              {t('cancel')}
            </Button>
            <Button
              variant="primary"
              onClick={handleRenameChannel}
              disabled={loading}
            >
              {loading ? t('saving') : t('save')}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </li>
  );
};
export default ChannelItem;
