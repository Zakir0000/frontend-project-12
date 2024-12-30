/* eslint-disable functional/no-expression-statement */
/* eslint-disable functional/no-try-statement */
/* eslint-disable functional/no-conditional-statement */
/* eslint-disable  functional/no-throw-statement */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import filter from 'leo-profanity';
import avatar from '../assets/avatar_1.jpg';

const SignUpPage = () => {
  filter.loadDictionary('en');
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password, confirmPassword } = formData;
    const newErrors = {};

    if (username.length < 3 || username.length > 20) {
      newErrors.username = t('errors.nameError');
    }
    if (password.length < 6) {
      newErrors.password = t('errors.passwordError');
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = t('errors.confirmError');
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post('/api/v1/signup', {
        username,
        password,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);

      dispatch({ type: 'auth/login', payload: { token: response.data.token } });
      navigate('/');
    } catch (err) {
      if (err.response?.status === 409) {
        setErrors({ username: t('errors.error409') });
      } else {
        setErrors({ general: t('errors.regError') });
      }
    }
  };

  return (
    <div className="d-flex flex-column h-100">
      <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
        <div className="container">
          <a className="navbar-brand" href="/">
            {t('title')}
          </a>
        </div>
      </nav>
      <div className="container-fluid h-100">
        <div className="row justify-content-center align-content-center h-100">
          <div className="col-12 col-md-8 col-xxl-6">
            <div className="card shadow-sm">
              <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
                <div>
                  <img
                    src={avatar}
                    className="rounded-circle"
                    alt="Регистрация"
                  />
                </div>
                <form className="w-50" onSubmit={handleSubmit}>
                  <h1 className="text-center mb-4">{t('registration')}</h1>
                  <div className="form-floating mb-3">
                    <input
                      placeholder="От 3 до 20 символов"
                      name="username"
                      autoComplete="username"
                      required
                      id="username"
                      className={`form-control ${
                        errors.username ? 'is-invalid' : ''
                      }`}
                      value={formData.username}
                      onChange={handleChange}
                    />
                    <label className="form-label" htmlFor="username">
                      {t('username')}
                    </label>
                    {errors.username && (
                      <div className="invalid-feedback">{errors.username}</div>
                    )}
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      placeholder="Не менее 6 символов"
                      name="password"
                      aria-describedby="passwordHelpBlock"
                      required
                      autoComplete="new-password"
                      type="password"
                      id="password"
                      className={`form-control ${
                        errors.password ? 'is-invalid' : ''
                      }`}
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <label className="form-label" htmlFor="password">
                      {t('password')}
                    </label>
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>
                  <div className="form-floating mb-4">
                    <input
                      placeholder="Пароли должны совпадать"
                      name="confirmPassword"
                      required
                      autoComplete="new-password"
                      type="password"
                      id="confirmPassword"
                      className={`form-control ${
                        errors.confirmPassword ? 'is-invalid' : ''
                      }`}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <label className="form-label" htmlFor="confirmPassword">
                      {t('confirmPassword')}
                    </label>
                    {errors.confirmPassword && (
                      <div className="invalid-feedback">
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>
                  {errors && (
                    <div className="text-danger mb-3">{errors.general}</div>
                  )}

                  <button
                    type="submit"
                    className="w-100 btn btn-outline-primary"
                  >
                    {t('toRegistration')}
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
