import axios from "axios";

export const API_URL = "http://localhost:8000/api/v1";

export const instance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
