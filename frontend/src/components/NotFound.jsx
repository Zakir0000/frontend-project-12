import React from 'react';
import { useTranslation } from 'react-i18next';

export default () => {
  const { t } = useTranslation();
  return (
    <div className='h-100'>
      <div className='h-100 ' id='chat'>
        <div className='d-flex flex-column h-100'>
          <nav className='shadow-sm navbar navbar-expand-lg navbar-light bg-white'>
            <div className='container'>
              <a href='/' className='navbar-brand'>
                {t('title')}
              </a>
            </div>
          </nav>
          <div className='d-flex flex-grow-1 justify-content-center align-items-center text-center '>
            <div>
              <h1 className='display-1 text-danger'>{t('errors.error404')}</h1>

              <p
                className='lead'
                dangerouslySetInnerHTML={{ __html: t('errors.homepage-link') }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
