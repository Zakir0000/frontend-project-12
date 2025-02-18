import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Dropdown,
  Modal,
  Button,
  Form,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import cn from 'classnames';
import {
  setActiveChannelId,
  removeChannel,
  renameChannel,
} from '../features/channelsSlice';
import { openModal, closeModal } from '../features/uiSlice';
import axiosInstance from '../utils/axiosInstance';
import { ROUTES } from '../routes';

const ChannelItem = ({ channel }) => {
  const { t } = useTranslation();
  const [newChannelName, setNewChannelName] = useState(channel.name);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const dispatch = useDispatch();
  const channels = useSelector((state) => state.channels.channels);
  const activeChannelId = useSelector(
    (state) => state.channels.activeChannelId,
  );
  const isProtectedChannel = ['general', 'random'].includes(channel.name);

  const { isModalOpen, modalType, modalChannelId } = useSelector((state) => state.ui);

  useEffect(() => {
    if (modalType === 'renameChannel' && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [modalType]);

  const handleDeleteChannel = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.delete(`${ROUTES.CHANNELS}/${channel.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(removeChannel({ id: channel.id }));
      toast.success(t('channel.channelDeleted'));
    } catch (e) {
      toast.error(t('errors.connection'));
    } finally {
      setLoading(false);
      dispatch(closeModal());
    }
  };

  const handleRenameChannel = async () => {
    setLoading(true);

    if (!newChannelName.trim()) {
      setError(t('errors.channelNameRequired'));
      setLoading(false);
      return;
    }

    if (newChannelName.length < 3 || newChannelName.length > 20) {
      setError(t('errors.channelNameError'));
      setLoading(false);
      return;
    }

    if (channels.some((c) => c.name.toLowerCase() === newChannelName.toLowerCase())) {
      setError(t('errors.uniqueError'));
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axiosInstance.patch(
        `${ROUTES.CHANNELS}/${channel.id}`,
        { name: newChannelName },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      dispatch(renameChannel({ id: channel.id, name: newChannelName }));
      toast.success(t('channel.channelRenamed'));
    } catch (err) {
      toast.error(t('errors.connection'));
    } finally {
      setLoading(false);
      dispatch(closeModal());
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleRenameChannel();
    }
  };

  const handleOpenRenameModal = () => {
    dispatch(openModal({ type: 'renameChannel', channelId: channel.id }));
  };

  const handleOpenDeleteModal = () => {
    dispatch(openModal({ type: 'deleteChannel', channelId: channel.id }));
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
                  <Dropdown.Item onClick={handleOpenDeleteModal}>
                    {t('delete')}
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleOpenRenameModal}>
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
          show={isModalOpen && modalType === 'deleteChannel' && modalChannelId === channel.id}
          onHide={() => dispatch(closeModal())}
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
              onClick={() => dispatch(closeModal())}
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
          show={isModalOpen && modalType === 'renameChannel' && modalChannelId === channel.id}
          onHide={() => dispatch(closeModal())}
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
                  onChange={(e) => {
                    setNewChannelName(e.target.value);
                    setError('');
                  }}
                  onKeyDown={handleKeyPress}
                  disabled={loading}
                  ref={inputRef}
                />
                {error && <div className="text-danger mt-2">{error}</div>}
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => dispatch(closeModal())}
              disabled={loading}
            >
              {t('cancel')}
            </Button>
            <Button
              variant="primary"
              onClick={handleRenameChannel}
            >
              {loading ? t('saving') : t('send')}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </li>
  );
};
export default ChannelItem;
