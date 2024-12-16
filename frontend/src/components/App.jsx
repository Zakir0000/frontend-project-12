import axios from 'axios';

const App = async () => {
  try {
    await axios
      .post('/api/v1/login', { username: 'admin', password: 'admin' })
      .then((response) => {
        console.log(response.data); // => { token: ..., username: 'admin' }
      });
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTczNDMyNjIzNn0.dydVDNRnRsbV5oafSppSsBDsbWWMCov91_mnT-yDhlU';
    const responseForGet = await axios
      .get('/api/v1/channels', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data); // =>[{ id: '1', name: 'general', removable: false }, ...]
      });
    return <h1>Hexlet Chat</h1>;
  } catch (e) {
    console.error(e);
  }
};

export default App;
