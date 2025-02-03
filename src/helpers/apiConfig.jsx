import axios from "axios";

const apiConfig = axios.create({
  baseURL: "https://tailbuddy-server.vercel.app",
  // baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

export default apiConfig;
