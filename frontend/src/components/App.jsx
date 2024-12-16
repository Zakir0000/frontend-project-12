import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './LoginForm.jsx';
import NotFound from './NotFound.jsx';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<NotFound />} />
        <Route path='/login' element={<LoginForm />} />
        <Route path='/' element={<LoginForm />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
