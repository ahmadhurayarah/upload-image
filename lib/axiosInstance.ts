import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV !== "production"
      ? "http://localhost:3000"
      : "https://upload-image-psi.vercel.app",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
