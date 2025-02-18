const apiPath = '/api/v1';

export const ROUTES = {
  LOGIN: '/login',
  CHAT: '/',
  MESSAGES: '/messages',
  CHANNELS: '/channels',
  SIGNUP: '/signup',
};

export default {
  loginPath: () => [apiPath, 'login'].join('/'),
  usersPath: () => [apiPath, 'channels'].join('/'),
};
