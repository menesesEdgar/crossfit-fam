import axios from 'axios';

const BASE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/';
const API_URL = `${BASE_API_URL}/api` || 'http://localhost:4000/api';

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

export const getRoles = async () => {
  try {
    const { data } = await api.get('/roles');
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getRoleById = async (id) => {
  try {
    const { data } = await api.get(`/roles/${id}`);
    return data;
  } catch (error) {
    console.log(error);

    throw error;
  }
};

export const createRole = async (role) => {
  try {
    const { data } = await api.post('/roles', role);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateRole = async (role) => {
  try {
    const { data } = await api.put(`/roles/${role.id}`, role);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteRole = async (id) => {
  try {
    const { data } = await api.delete(`/roles/${id}`);
    return id;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getPermissions = async () => {
  try {
    const { data } = await api.get('/permissions');
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getPermissionById = async (id) => {
  try {
    const { data } = await api.get(`/permissions/${id}`);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createPermission = async (permission) => {
  try {
    const { data } = await api.post('/permissions', permission);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updatePermission = async (permission) => {
  try {
    const { data } = await api.put(`/permissions/${permission.id}`, permission);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deletePermission = async (id) => {
  try {
    const { data } = await api.delete(`/permissions/${id}`);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getRolePermissions = async () => {
  try {
    const { data } = await api.get('/role-permissions');
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getRolePermissionByRoleId = async (roleId) => {
  try {
    const { data } = await api.get(`/role-permissions/role/${roleId}`);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createRolePermission = async (rolePermission) => {
  try {
    const { data } = await api.post('/role-permissions/add', rolePermission);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const deleteRolePermission = async (rolePermission) => {
  try {
    const { data } = await api.post('/role-permissions/remove', rolePermission);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
