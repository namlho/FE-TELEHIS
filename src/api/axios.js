// import axios from 'axios';

// export default axios.create({
//   baseUrl: 'http://localhost:4000',
// });

import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:4000';

const token = localStorage.getItem('token');
axios.defaults.headers.common['Authorization'] = token;

export default axios;
