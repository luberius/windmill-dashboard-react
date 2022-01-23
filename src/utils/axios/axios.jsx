import axios from 'axios';
import { BASE_API_URL } from '../constant/base';

const http = axios.create({
  baseURL: BASE_API_URL
});

export default http;
