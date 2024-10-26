import axios from "axios";
// import { saveAs } from 'file-saver';

export const BASE_API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/";
export const API_URL = `${BASE_API_URL}/api` || "http://localhost:4000/api";
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    config.headers["Access-Control-Allow-Origin"] = "*";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const headerFormData = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

// Auth
export const login = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Register new users or Athletes
export const register = async (credentials) => {
  try {
    const response = await api.post("/auth/register", credentials);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const logout = async () => {
  try {
    const response = await api.get("/auth/logout");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
// Load the user logged in
export const loadUser = async () => {
  try {
    const response = await api.get("/auth/me");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updatePassword = async (passwords) => {
  try {
    const response = await api.put("/auth/updatePassword", passwords);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateProfileImage = async (profileImage) => {
  try {
    let data = new FormData();
    data.append("profileImage", profileImage);
    const response = await api.put(
      "/auth/updateProfileImage",
      data,
      headerFormData
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const updateProfile = async (profile) => {
  try {
    const response = await api.put("/auth/updateProfile", profile);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const changePasswordUser = async (user) => {
  try {
    const response = await api.put(`/users/changePassword/${user.id}`, user);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const searchContest  = async ({
  searchTerm,
  sortBy,
  order,
  page,
  pageSize,
  signal,
}) => {
  try {
    const response = await api.get('/contests/search', {
      params: {
        searchTerm,
        sortBy,
        order,
        page,
        pageSize,
      },
      signal: signal,
    });
    if (response.status !== 200) {
      throw new Error(response.message || 'Hubo un error al hacer la busqueda');
    }
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const searchUsers = async ({
  searchTerm,
  sortBy,
  order,
  page,
  pageSize,
  role,
  signal,
}) => {
  try {
    const response = await api.get("/users/search", {
      params: {
        searchTerm,
        sortBy,
        order,
        page,
        pageSize,
        role,
      },
      signal: signal,
    });
    if (response.status !== 200) {
      throw new Error(response.message || "Hubo un error al hacer la busqueda");
    }
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
// Catalogs
export const getAthletes = async () => {
  try {
    const response = await api.get("/athletes");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getAthlete = async ({ id: athleteId, signal }) => {
  try {
    const response = await api.get(`/athletes/${athleteId}`, { signal });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getUsers = async () => {
  try {
    const response = await api.get(`/users`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const createUser = async (user) => {
  try {

    const obj = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      birthDate: user.birthDate,
      role: user.role,
      gender: user.gender,
      password: user.password,
      repeatPassword: user.repeatPassword,
    };

    const response = await api.post(`/users`, obj);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const updateUser = async (user) => {
  try {
    const updateUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      birthDate: user.birthDate,
      role: user.role,
      gender: user.gender,
      password: user.password,
      repeatPassword: user.repeatPassword,
    }
    console.log("update User ", updateUser)
    const response = await api.put(`/users/${user.id}`, updateUser);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export const getCategory = async ({ id: categoryId, signal }) => {
  try {
    const response = await api.get(`/categories/${categoryId}`, { signal });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export const createCategory = async (category) => {
  try {
    let data = new FormData();

    const image = user?.photo[0] || null;

    if (image instanceof File) {
      data.append("profileImage", image);
    }

    data.append(
      "userData",
      JSON.stringify({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        password: user.password,
        repeatPassword: user.repeatPassword,
      })
    );
    const response = await api.post(`/categories`, data, headerFormData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const deleteCategory = async () => {
  try {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const updateCategory = async () => {
  try {
    let data = new FormData();
    const image = user?.photo[0] || null;

    if (image instanceof File) {
      data.append("profileImage", image);
    }
    data.append(
      "userData",
      JSON.stringify({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        password: user.password,
        repeatPassword: user.repeatPassword,
      })
    );
    const response = await api.put(`/users/${user.id}`, data, headerFormData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export const getWod = async ({id: wodId, signal}) => {
  try {
    const response = await api.get(`/wods/${wodId}`, { signal });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export const getWods = async () => {
  try {
    const response = await api.get('/wods');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const createWod = async (wod) => {
  try {
    let data = new FormData();

    const image = user?.photo[0] || null;

    if (image instanceof File) {
      data.append("profileImage", image);
    }

    data.append(
      "userData",
      JSON.stringify({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        password: user.password,
        repeatPassword: user.repeatPassword,
      })
    );
    const response = await api.post(`/users`, data, headerFormData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const updateWod = async (wod) => {
  try {
    let data = new FormData();
    const image = user?.photo[0] || null;

    if (image instanceof File) {
      data.append("profileImage", image);
    }
    data.append(
      "userData",
      JSON.stringify({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        password: user.password,
        repeatPassword: user.repeatPassword,
      })
    );
    const response = await api.put(`/wods/${wod.id}`, data, headerFormData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const deleteWod = async (wodId) => {
  try {
    const response = await api.delete(`/wods/${wodId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
// Contest Endpoints
export const getContest = async ({id: contestId, signal}) => {
  try {
    const response = await api.get(`/contests/${contestId}`, { signal });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
// Maybe It'll be a search later to apply pagination
export const getContests = async () => {
  try {
    const response = await api.get('/contests');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export const createContest = async (contest) => {
  try {


    const newContest = {

    }
    const response = await api.post(`/contests`, newContest);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export const updateContest = async (wod) => {
  try {
    let data = new FormData();
    const image = user?.photo[0] || null;

    if (image instanceof File) {
      data.append('profileImage', image);
    }
    data.append(
      'userData',
      JSON.stringify({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        password: user.password,
        repeatPassword: user.repeatPassword,
      }),
    );
    const response = await api.put(`/wods/${wod.id}`, data, headerFormData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export const deleteContest = async (wodId) => {
  try {
    const response = await api.delete(`/wods/${wodId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}