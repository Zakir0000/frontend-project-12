import { useContext } from 'react';
import ApiContext from '../context/ApiContext';

const useChatApi = () => useContext(ApiContext);

export default useChatApi;
