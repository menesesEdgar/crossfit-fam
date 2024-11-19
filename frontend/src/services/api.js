import axios from "axios";
// import { saveAs } from 'file-saver';

export const BASE_API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";
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

export const searchUsers = async ({
  searchTerm,
  sortBy,
  order,
  page,
  pageSize,
  role,
  contestId,
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
        contestId,
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
export const getUsers = async () => {
  try {
    const response = await api.get(`/users`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getUser = async (userId) => {
  try {
    const response = await api.get("/users", userId);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const createUser = async (user) => {
  try {
    const response = await api.post(`/users`, user);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const updateUser = async (user) => {
  try {
    const response = await api.put(`/users/${user.id}`, user);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get("/categories");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getCategory = async (categoryId) => {
  try {
    const response = await api.get("/categories", categoryId);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const createCategory = async (data) => {
  try {
    const response = await api.post(`/categories`, data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const updateCategory = async (data) => {
  try {
    const response = await api.put(`/categories/${data.id}`, data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    const response = await api.delete(`/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getWod = async (wodId) => {
  try {
    const response = await api.get("/wods", wodId);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getWods = async () => {
  try {
    const response = await api.get("/wods");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const createWod = async (wod) => {
  try {
    const response = await api.post(`/wods`, wod);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateWod = async (wod) => {
  try {
    const response = await api.put(`/wods/${wod.id}`, wod);
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
};
// Contest CRUD
export const getContests = async () => {
  try {
    const response = await api.get("/contests");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getContest = async (contestId) => {
  try {
    const response = await api.get(`/contests/${contestId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const createContest = async (contest) => {
  try {
    const response = await api.post(`/contests`, contest);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const updateContest = async (contest) => {
  try {
    const response = await api.put(`/contests/${contest.id}`, contest);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const setContestNextStep = async ({ id, step }) => {
  try {
    const response = await api.put(`/contests/${id}/nextStep`, { step });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteContest = async (contestId) => {
  try {
    const response = await api.delete(`/contests/${contestId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Assign/remove categories to contest
export const addCategory = async (data) => {
  const { contestId, categoryId } = data;
  try {
    const response = await api.post(`/contests/${contestId}/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addAllCategories = async (id) => {
  try {
    const response = await api.put(`/contests/${id}/addAllCategories`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteContestCategory = async (data) => {
  const { contestId, categoryId } = data;
  try {
    const response = await api.delete(`/contests/${contestId}/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const removeAllContestCategories = async (id) => {
  try {
    const response = await api.put(`/contests/${id}/removeAllCategories`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Assign/remove wod to contest
export const addWod = async (data) => {
  const { contestId, wodId } = data;
  try {
    const response = await api.post(`/contests/${contestId}/wod/${wodId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addAllWods = async (id) => {
  try {
    const response = await api.put(`/contests/${id}/addAllWods`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteContestWod = async (data) => {
  const { contestId, wodId } = data;
  try {
    const response = await api.delete(`/contests/${contestId}/wod/${wodId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const removeAllContestWods = async (id) => {
  try {
    const response = await api.put(`/contests/${id}/removeAllWods`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Wods por categoria
export const addWodToCategory = async (data) => {
  const { categoryId, wodId } = data;
  try {
    const response = await api.post(
      `/contests/category/${categoryId}/wod/${wodId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getWodsByCategory = async (categoryId) => {
  try {
    const response = await api.get(`/contests/category/wods/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const deleteWodOfCategory = async (data) => {
  const { categoryId, wodId } = data;
  try {
    const response = await api.delete(
      `/contests/category/${categoryId}/wod/${wodId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addAllWodsToCategory = async ({categoryId, contestId}) => {
  try {
    const response = await api.put(`/contests/${contestId}/category/${categoryId}/addAllWods`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const removeAllCategoryWods = async (id) => {
  try {
    const response = await api.put(`/contests/category/${id}/removeAllWods`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addAthleteToContest = async (data) => {
  // Data must contain the conCatId and the userId
  try {
    const response = await api.post("/contests/athlete", data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const removeAthleteFromContest = async (athleteId) => {
  try {
    const response = await api.delete(`/contests/athlete/${athleteId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getAthletesByCategory = async ({contestId, categoryId}) => {
  try {
    const response = await api.get(`/contests/${contestId}/category/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Score
export const addScoreToAthlete = async (data) => {
  const {contestId, athleteId} = data
  console.log("data ", data)
  try {
    const response = await api.post(`/contests/${contestId}/athlete/${athleteId}`, data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};