import axios from 'axios';


const baseURL = (process.env.NODE_ENV === undefined)
  ? process.env.PRODUCTION_BACKEND_URL
  : process.env.DEVELOPMENT_BACKEND_URL || 'http://localhost:5000';


export const apiService = {
  // GET
  get: async (endpoint, config = {}) => {
    const url = `${baseURL}${endpoint}`;
    console.log(url);
    const response = await axios.get(url, { ...config });
    return response;
  },

  // POST
  post: async (endpoint, data = {}, config = {}) => {
    const url = `${baseURL}${endpoint}`;
    const response = await axios.post(url, data, config);
    return response;
  },

  // PUT
  put: async (endpoint, data = {}, config = {}) => {
    const url = `${baseURL}${endpoint}`;
    const response = await axios.put(url, data, config);
    return response;
  },

  // PATCH
  patch: async (endpoint, data = {}, config = {}) => {
    const url = `${baseURL}${endpoint}`;
    const response = await axios.patch(url, data, config);
    return response;
  },

  // DELETE
  delete: async (endpoint, config = {}) => {
    const url = `${baseURL}${endpoint}`;
    const response = await axios.delete(url, config);
    return response;
  },
};
