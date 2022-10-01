import axios from "axios";
import { radioBrowser, lyricsOvh } from "../info/app-config.json";

const API = (urlBaseType) => {
    const axiosInstance = axios.create({
        baseURL: urlBaseType === "lyricsovh" ? lyricsOvh : radioBrowser,
        headers: {
            Accept: "application/json",
            "Content-Type": "application.json"
        }
    })
    axios.defaults.timeout = 60000;
    axiosInstance.interceptors.request.use(request => {
        return request;
    }, err => {
        return Promise.reject(err);
    })
    return axiosInstance;
}

export default API;