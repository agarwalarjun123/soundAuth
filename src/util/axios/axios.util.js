const axios = require('axios');

axios.interceptors.response.use(
  (response) => {
    const data = {
      url: response.config.url,
      status: response.status,
      headers: response.config.headers,
      method: response.config.method,
      data: response.config.data,
      responseData: response.data,
    };


    return response;
  },
  (error) => {
    const data = error.response
      ? {
          url: error.response.config.url,
          status: error.response.status,
          headers: error.response.config.headers,
          method: error.response.config.method,
          data: error.response.config.data,
          responseData: error.response ? error.response.data : error.response,
        }
      : error;

    return Promise.reject(error);
  }
);
