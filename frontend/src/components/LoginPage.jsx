import axios from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/authSlice';
import avatarImage from '../assets/avatar.jpg';
import { Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import routes from '../routes';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authState = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      password: Yup.string()
        .required('Password is required')
        .min(5, 'Password must be at least 6 characters'),
    }),

    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const response = await axios.post(routes.loginPath(), values);
        dispatch(login(response.data));

        localStorage.setItem('token', response.data.token);
        navigate('/');
      } catch (error) {
        if (error.response && error.response.data) {
          setErrors({
            username: error.response.data.username || 'Login failed',
            password: error.response.data.password,
          });
        } else {
          setErrors({
            username: 'An error occurred. Please try again.',
          });
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className='d-flex flex-column h-100'>
      <nav className='shadow-sm navbar navbar-expand-lg navbar-light bg-white'>
        <div className='container'>
          <a className='navbar-brand' href='/'>
            Hexlet Chat
          </a>
        </div>
      </nav>
      <div className='container-fluid h-100'>
        <div className='row justify-content-center align-content-center h-100'>
          <div className='col-12 col-md-8 col-xxl-6'>
            <div className='card shadow-sm'>
              <div className='card-body row p-5'>
                <div className='col-12 col-md-6 d-flex align-items-center justify-content-center'>
                  <img
                    src={avatarImage}
                    className='rounded-circle'
                    alt='Войти'
                  />
                </div>
                <Form
                  onSubmit={formik.handleSubmit}
                  className='col-12 col-md-6 mt-3 mt-md-0'>
                  <h1 className='text-center mb-4'>Войти</h1>
                  <Form.Group className='mb-3'>
                    <Form.Label htmlFor='username'>Ваш ник</Form.Label>
                    <Form.Control
                      type='text'
                      name='username'
                      id='username'
                      placeholder='Ваш ник'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.username}
                      isInvalid={
                        !!formik.errors.username && formik.touched.username
                      }
                    />
                    <Form.Control.Feedback type='invalid'>
                      {formik.errors.username}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className='mb-3'>
                    <Form.Label htmlFor='password'>Пароль</Form.Label>
                    <Form.Control
                      type='password'
                      name='password'
                      id='password'
                      placeholder='Пароль'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                      isInvalid={
                        formik.touched.password && !!formik.errors.password
                      }
                    />
                    <Form.Control.Feedback type='invalid'>
                      {formik.errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Button
                    type='submit'
                    className='w-100'
                    variant='outline-primary'
                    disabled={formik.isSubmitting}>
                    Войти
                  </Button>
                </Form>
              </div>
              <div className='card-footer p-4'>
                <div className='text-center'>
                  <span>Нет аккаунта?</span> <a href='/signup'>Регистрация</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
