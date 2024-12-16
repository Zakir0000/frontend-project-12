import React from 'react';
import avatarImage from '../assets/avatar.jpg';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const LoginForm = () => {
  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters long'),
  });

  const initialValues = {
    username: '',
    password: '',
  };
  const handleSubmit = (values, { setSubmitting }) => {
    console.log('Form values:', values);
  };

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
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}>
                  <Form className='col-12 col-md-6 mt-3 mt-md-0'>
                    <h1 className='text-center mb-4'>Войти</h1>
                    <div className='form-floating mb-3'>
                      <Field
                        type='text'
                        name='username'
                        autoComplete='username'
                        required=''
                        placeholder='Ваш ник'
                        id='username'
                        className='form-control'
                      />
                      <ErrorMessage
                        name='username'
                        component='div'
                        className='text-danger'
                      />
                      <label htmlFor='username'>Ваш ник</label>
                    </div>
                    <div className='form-floating mb-4'>
                      <Field
                        name='password'
                        autoComplete='current-password'
                        required=''
                        placeholder='Пароль'
                        type='password'
                        id='password'
                        className='form-control'
                      />
                      <ErrorMessage
                        name='password'
                        component='div'
                        className='text-danger'
                      />
                      <label className='form-label' htmlFor='password'>
                        Пароль
                      </label>
                    </div>
                    <button
                      type='submit'
                      className='w-100 mb-3 btn btn-outline-primary'
                      disabled={isSubmiting}>
                      Войти
                    </button>
                  </Form>
                </Formik>
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

export default LoginForm;
