import axios from 'axios';

let devConfig = {
  baseURL : 'http://localhost:9000',
  withCredentials: true,
  xsrfCookieName: '_mrtusr_',
  xsrfHeaderName: 'sessionToken'
}

let prodConfig = {
  baseURL : '',
  withCredentials: true
}

let instance = null;

if (process.env.NODE_ENV === 'production'){
  instance = axios.create(prodConfig);
}
else {
  instance = axios.create(devConfig);
}

export default instance;