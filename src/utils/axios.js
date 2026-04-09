import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const guestId = localStorage.getItem("guestId");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (guestId) {
    config.headers["guest-id"] = guestId;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    const guestId = response?.data?.guestId;

    if (guestId) {
      const storedGuestId = localStorage.getItem("guestId");

      if (!storedGuestId) {
        localStorage.setItem("guestId", guestId);
      }
    }

    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;