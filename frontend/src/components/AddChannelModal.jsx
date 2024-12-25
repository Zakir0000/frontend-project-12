import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setChannels } from '../features/chatSlice';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import 'react-toastify/dist/ReactToastify.css';

const AddChannelModal = ({ show, onHide, setActiveChannelId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.chat.channels);

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
        const token = localStorage.getItem('token');
        const response = await axios.post(
          '/api/v1/channels',
          { name: values.channelName },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const newChannel = response.data;
        dispatch(setChannels([...channels, newChannel]));
        dispatch(setActiveChannelId(newChannel.id));
        toast.success(t('channel.channelCreated'));
        onHide();
      } catch (error) {
        console.error('Failed to create channel:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{t('channel.addChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group controlId='channelName'>
            <Form.Label>{t('channel.channelName')}</Form.Label>
            <Form.Control
              type='text'
              name='channelName'
              placeholder={t('channel.channelPlaceholderAdd')}
              value={formik.values.channelName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={
                formik.touched.channelName && !!formik.errors.channelName
              }
            />
            <Form.Control.Feedback type='invalid'>
              {formik.errors.channelName}
            </Form.Control.Feedback>
          </Form.Group>
          <div className='mt-3 d-flex justify-content-end'>
            <Button variant='secondary' onClick={onHide} className='me-2'>
              {t('cancel')}
            </Button>
            <Button
              variant='primary'
              type='submit'
              disabled={formik.isSubmitting}>
              {t('send')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddChannelModal;
