import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setChannels } from '../features/chatSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddChannelModal = ({ show, onHide, setActiveChannelId }) => {
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.chat.channels);

  const formik = useFormik({
    initialValues: {
      channelName: '',
    },
    validationSchema: Yup.object({
      channelName: Yup.string()
        .min(3, 'От 3 до 20 символов')
        .max(20, 'От 3 до 20 символов')
        .notOneOf(
          channels.map((channel) => channel.name),
          'должно быть уникальным',
        )
        .required('имя канала обязательно'),
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
        toast.success('Канал создан!');
        onHide();
      } catch (error) {
        taskCompleted.error('Создать канал не получилось. Попробуй ещё разок.');
        console.error('Failed to create channel:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Добавить канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group controlId='channelName'>
            <Form.Label>Имя канала</Form.Label>
            <Form.Control
              type='text'
              name='channelName'
              placeholder='введи имя канала'
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
              Отменить
            </Button>
            <Button
              variant='primary'
              type='submit'
              disabled={formik.isSubmitting}>
              Отправить
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddChannelModal;
