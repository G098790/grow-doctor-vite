import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach the logged-in user's JWT (if any) to every outgoing request
// so the cart/order/auth-protected routes on the backend work.
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("growdoctor_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
