import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { Provider } from 'react-redux';
import React from 'react';
import { Provider as RollbarProvider } from '@rollbar/react';
import Rollbar from 'rollbar';
import App from './components/App';
import resources from './locales/index.js';
import store from './app/store';

const rollbarConfig = {
  accessToken: '60cb77910f474fdcbcb46d23c87f8d20',
  environment: process.env.NODE_ENV || 'production',
};

const init = async () => {
  const i18n = i18next.createInstance();

  await i18n.use(initReactI18next).init({
    debug: process.env.NODE_ENV === 'development',
    resources,
    fallbackLng: 'ru',
    lng: 'ru',
    interpolation: {
      escapeValue: false,
    },
  });

  const rollbar = new Rollbar(rollbarConfig);
  rollbar.error('Intentional Rollbar Error');

  return (
    <RollbarProvider instance={rollbar}>
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <App />
        </Provider>
      </I18nextProvider>
    </RollbarProvider>
  );
};

export default init;
