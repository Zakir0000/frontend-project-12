import React from 'react';
import avatar from '../assets/avatar_1.jpg';
const SignUpPage = () => {
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
                <form className='w-50'>
                  <h1 className='text-center mb-4'>Регистрация</h1>
                  <div className='form-floating mb-3'>
                    <input
                      placeholder='От 3 до 20 символов'
                      name='username'
                      autocomplete='username'
                      required=''
                      id='username'
                      className='form-control'
                      value=''
                    />
                    <label className='form-label' for='username'>
                      Имя пользователя
                    </label>
                    <div placement='right' className='invalid-tooltip'>
                      Обязательное поле
                    </div>
                  </div>
                  <div className='form-floating mb-3'>
                    <input
                      placeholder='Не менее 6 символов'
                      name='password'
                      aria-describedby='passwordHelpBlock'
                      required=''
                      autocomplete='new-password'
                      type='password'
                      id='password'
                      className='form-control'
                      value=''
                    />
                    <div className='invalid-tooltip'>Обязательное поле</div>
                    <label className='form-label' for='password'>
                      Пароль
                    </label>
                  </div>
                  <div className='form-floating mb-4'>
                    <input
                      placeholder='Пароли должны совпадать'
                      name='confirmPassword'
                      required=''
                      autocomplete='new-password'
                      type='password'
                      id='confirmPassword'
                      className='form-control'
                      value=''
                    />
                    <div className='invalid-tooltip'></div>
                    <label className='form-label' for='confirmPassword'>
                      Подтвердите пароль
                    </label>
                  </div>
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
