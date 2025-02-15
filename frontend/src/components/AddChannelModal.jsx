/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import filter from 'leo-profanity';
import { getChannels, setActiveChannelId } from '../features/channelsSlice';
import { closeModal } from '../features/uiSlice';
import 'react-toastify/dist/ReactToastify.css';

const AddChannelModal = () => {
  const filterProfanity = (text) => filter.clean(text);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.channels.channels);
  const { isModalOpen, modalType } = useSelector((state) => state.ui);

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  const formik = useFormik({
    initialValues: {
      channelName: '',
    },
    validationSchema: Yup.object({
      channelName: Yup.string()
        .min(3, t('errors.channelNameError'))
        .max(20, t('errors.channelNameError'))
        .notOneOf(
          channels.map((channel) => channel.name),
          t('errors.uniqueError'),
        )
        .required(t('errors.channelNameRequired')),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const filteredChannelName = filterProfanity(values.channelName);

        const token = localStorage.getItem('token');
        const response = await axios.post(
          '/api/v1/channels',
          { name: filteredChannelName },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const newChannel = response.data;
        dispatch(getChannels([...channels, newChannel]));
        dispatch(setActiveChannelId(newChannel.id));
        toast.success(t('channel.channelCreated'));
        handleCloseModal();
      } catch (error) {
        console.error('Failed to create channel:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (!isModalOpen) {
      formik.resetForm();
    }
  }, [isModalOpen]);

  return (
    <Modal centered show={isModalOpen && modalType === 'addChannel'} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>{t('channel.addChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Label className="visually-hidden">
            {t('channel.channelName')}
          </Form.Label>
          <Form.Group>
            <Form.Control
              autoFocus
              type="text"
              name="channelName"
              value={formik.values.channelName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={
                formik.touched.channelName && !!formik.errors.channelName
              }
            />
            <Form.Label className="visually-hidden" htmlFor="channelName">
              {t('channel.channelName')}
            </Form.Label>
            <Form.Control.Feedback type="invalid">
              {formik.errors.channelName}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="mt-3 d-flex justify-content-end">
            <Button variant="secondary" onClick={handleCloseModal} className="me-2">
              {t('cancel')}
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={formik.isSubmitting}
            >
              {t('send')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddChannelModal;
