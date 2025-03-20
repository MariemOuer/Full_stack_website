import axios from "axios";

const baseURL = "http://localhost:3001/api";

export const apiService = {
  // GET
  get: async (endpoint, config = {}) => {
    const url = `${baseURL}${endpoint}`;
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
