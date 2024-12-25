import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/authSlice';
import avatarImage from '../assets/avatar.jpg';
import { Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import routes from '../routes';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required(t('errors.nameReq')),
      password: Yup.string()
        .required(t('errors.passwordReq'))
        .min(5, t('errors.passwordError5')),
    }),

    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const response = await axios.post(routes.loginPath(), values);
        dispatch(login(response.data));

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', response.data.username);
        navigate('/');
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setErrors({
            username: t('errors.invalidCredentials'),
          });
          setError(t('errors.invalidCredentials'));
        } else {
          toast.error(t('errors.errorTryAgain'));
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
            {t('title')}
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
                  <h1 className='text-center mb-4'>{t('enter')}</h1>

                  <Form.Group className='mb-3'>
                    <Form.Label htmlFor='username'>{t('nick')}</Form.Label>
                    <Form.Control
                      type='text'
                      name='username'
                      id='username'
                      placeholder={t('nick')}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.username}
                      isInvalid={
                        !!formik.errors.username && formik.touched.username
                      }
                    />
                  </Form.Group>
                  <Form.Group className='mb-3'>
                    <Form.Label htmlFor='password'>{t('password')}</Form.Label>
                    <Form.Control
                      type='password'
                      name='password'
                      id='password'
                      placeholder={t('password')}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                      isInvalid={
                        (formik.touched.password && !!formik.errors.password) ||
                        (!!formik.errors.username && formik.touched.username)
                      }
                    />
                  </Form.Group>
                  {error && <Alert variant='danger'>{error}</Alert>}
                  <Button
                    type='submit'
                    className='w-100'
                    variant='outline-primary'
                    disabled={formik.isSubmitting}>
                    {t('enter')}
                  </Button>
                </Form>
              </div>
              <div className='card-footer p-4'>
                <div className='text-center'>
                  <span>{t('noAccount')}?</span>{' '}
                  <a href='/signup'>{t('registration')}</a>
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
