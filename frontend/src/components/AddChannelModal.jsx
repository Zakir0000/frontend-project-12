import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setChannels } from '../features/chatSlice';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import filter from 'leo-profanity';
import 'react-toastify/dist/ReactToastify.css';

const AddChannelModal = ({ show, onHide, setActiveChannelId }) => {
  const filterProfanity = (text) => {
    return filter.clean(text);
  };

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
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const filteredChannelName = filterProfanity(values.channelName);

        const token = localStorage.getItem('token');
        const response = await axios.post(
          '/api/v1/channels',
          { name: filteredChannelName },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const newChannel = response.data;
        dispatch(setChannels([...channels, newChannel]));
        dispatch(setActiveChannelId(newChannel.id));
        toast.success(t('channel.channelCreated'), {
          autoClose: 5000,
        });
        resetForm();
        onHide();
      } catch (error) {
        console.error('Failed to create channel:', error);
        if (!error.response) {
          toast.error(t('errors.noNetwork'));
        } else if (error.response.status === 500) {
          toast.error(t('errors.serverError'));
        } else {
          toast.error(t('errors.errorTryAgain'));
        }
      } finally {
        setSubmitting(false);
      }
    },
  });
  useEffect(() => {
    if (!show) {
      formik.resetForm();
    }
  }, [show]);

  return (
    <Modal centered show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{t('channel.addChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Label className='visually-hidden'>
            {t('channel.channelName')}
          </Form.Label>
          <Form.Group controlId='channelName'>
            <Form.Control
              autoFocus
              type='text'
              name='channelName'
              value={formik.values.channelName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={
                formik.touched.channelName && !!formik.errors.channelName
              }
            />
            <label className='visually-hidden' htmlFor='name'>
              Имя канала
            </label>
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
