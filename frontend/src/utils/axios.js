import axios from "axios";
import { toast } from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => {
    const body = response.data;

    if (body && body.data && typeof body.data === "object") {
      response.data = {
        ...body,
        ...body.data,
      };
    }

    return response;
  },
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";

    toast.error(message);

    return Promise.reject(error);
  },
);

export default axiosInstance;
