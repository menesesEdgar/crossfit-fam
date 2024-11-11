import axios from "axios";
import { API_URL } from "./api";

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

export const getPublicContests = async () => {
  try {
    const response = await api.get("/public/contests");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getPublicContest = async (contestId) => {
  try {
    const response = await api.get(`/public/contests/${contestId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createPendingUser = async (data) => {
  try {
    const response = await api.post("/public/contests/createPendingUser", data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
