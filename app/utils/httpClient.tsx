import axios from "axios";
import { ISessionData } from "@/context/sessionProvider";
import { API_URL } from "./const";

export const publicApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const instance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use((config) => {
  const storedSessionString = window.localStorage.getItem("auth");
  let storedSession: ISessionData | null = null;

  try {
    if (storedSessionString) {
      storedSession = JSON.parse(storedSessionString) as ISessionData;
    }
  } catch (error) {
    // Handle JSON parsing error if necessary
    console.error("Error parsing stored session:", error);
  }

  // Now you can access the token property if it exists
  const token = storedSession?.token;

  // Example usage in your config
  config.headers["authorization"] = token ? `Bearer ${token}` : "";
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401 || error.response.status === 403) {
      localStorage.removeItem("auth");
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);
