import axios from 'axios';
// import { saveAs } from 'file-saver';

export const BASE_API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:4000/';
export const API_URL = `${BASE_API_URL}/api` || 'http://localhost:4000/api';
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    config.headers['Access-Control-Allow-Origin'] = '*';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

const headerFormData = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};


export const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
};

// Register new users or Athletes
export const register = async (credentials) => {
    try {
      const response = await api.post('/auth/register', credentials);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
};
export const logout = async () => {
try {
    const response = await api.get('/auth/logout');
    return response.data;
} catch (error) {
    console.error(error);
    throw error;
}
};
// Load the user logged in
export const loadUser = async () => {
    try {
        const response = await api.get('/auth/me');
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
export const updatePassword = async (passwords) => {
    try {
        const response = await api.put('/auth/updatePassword', passwords);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateProfileImage = async (profileImage) => {
    try {
        let data = new FormData();
        data.append('profileImage', profileImage);
        const response = await api.put(
        '/auth/updateProfileImage',
        data,
        headerFormData,
        );
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
export const updateProfile = async (profile) => {
    try {
      const response = await api.put('/auth/updateProfile', profile);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
};