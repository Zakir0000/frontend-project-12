import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import hook for navigation
import axios from 'axios';
import avatar from '../assets/avatar_1.jpg';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const { username, password, confirmPassword } = formData;
    if (username.length < 3 || username.length > 20) {
      setError('Имя пользователя должно быть от 3 до 20 символов.');
      return;
    }
    if (password.length < 6) {
      setError('Пароль должен быть не менее 6 символов.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Пароли должны совпадать.');
      return;
    }

    try {
      const response = await axios.post('/api/v1/signup', {
        username,
        password,
      });

      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (err) {
      if (err.response?.status === 409) {
        setError('Пользователь с таким именем уже существует.');
      } else {
        setError('Ошибка регистрации. Пожалуйста, попробуйте ещё раз.');
      }
    }
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
              <div className='card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5'>
                <div>
                  <img
                    src={avatar}
                    className='rounded-circle'
                    alt='Регистрация'
                  />
                </div>
                <form className='w-50' onSubmit={handleSubmit}>
                  <h1 className='text-center mb-4'>Регистрация</h1>
                  <div className='form-floating mb-3'>
                    <input
                      placeholder='От 3 до 20 символов'
                      name='username'
                      autoComplete='username'
                      required
                      id='username'
                      className='form-control'
                      value={formData.username}
                      onChange={handleChange}
                    />
                    <label className='form-label' htmlFor='username'>
                      Имя пользователя
                    </label>
                  </div>
                  <div className='form-floating mb-3'>
                    <input
                      placeholder='Не менее 6 символов'
                      name='password'
                      aria-describedby='passwordHelpBlock'
                      required
                      autoComplete='new-password'
                      type='password'
                      id='password'
                      className='form-control'
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <label className='form-label' htmlFor='password'>
                      Пароль
                    </label>
                  </div>
                  <div className='form-floating mb-4'>
                    <input
                      placeholder='Пароли должны совпадать'
                      name='confirmPassword'
                      required
                      autoComplete='new-password'
                      type='password'
                      id='confirmPassword'
                      className='form-control'
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <label className='form-label' htmlFor='confirmPassword'>
                      Подтвердите пароль
                    </label>
                  </div>
                  {error && <div className='text-danger mb-3'>{error}</div>}
                  <button
                    type='submit'
                    className='w-100 btn btn-outline-primary'>
                    Зарегистрироваться
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
