import axios from "axios";
import appInfo from "../info/app-config";
const { radioBrowserUrls } = appInfo;

let currentBaseURL = radioBrowserUrls[1];

export const setBaseURL = (urlBaseType = radioBrowserUrls[1]) => {
  currentBaseURL = urlBaseType;
};

const API = () => {
  const axiosInstance = axios.create({
    baseURL: currentBaseURL,
    timeout: 50000,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  axiosInstance.interceptors.request.use(
    (request) => request,
    (err) => Promise.reject(err)
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      return Promise.resolve({ data: null });
    }
  );

  return axiosInstance;
};

export default API;
