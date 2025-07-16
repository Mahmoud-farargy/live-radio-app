import axios from "axios";
import { radioBrowserUrls, lyricsOvh } from "../info/app-config.json";

const API = (urlBaseType) => {
    // let currentAttemptsNum = (radioBrowserUrls?.length - 1) || 0;
    // const runApi = () => {
    //     const activeRadioBrowserUrl = radioBrowserUrls[currentAttemptsNum]; 
    //     const axiosInstance = axios.create({
    //         baseURL: urlBaseType === "lyricsovh" ? lyricsOvh : activeRadioBrowserUrl,
    //         headers: {
    //             Accept: "application/json",
    //             "Content-Type": "application.json"
    //         }
    //     })
    //     axios.defaults.timeout = 60000;
    //     axiosInstance.interceptors.request.use(request => {
    //         if(request.data){
    //             return request
    //         }else{
    //             if(currentAttemptsNum > 0){
    //                 currentAttemptsNum = currentAttemptsNum - 1;
    //                 return runApi()
    //             }else{
    //                 return Promise.reject();
    //             }
    //         }
    //     }, err => {
    //         // if(currentAttemptsNum > 0){
    //         //     currentAttemptsNum = currentAttemptsNum - 1;
    //         //     return runApi()
    //         // }else{
    //         //     return Promise.reject(err);
    //         // }
    //         // return attemptsNums > 0 ? runApi() : Promise.reject(err);
    //     })
    //     return axiosInstance;  
    // };
    // return runApi();

    const axiosInstance = axios.create({
        baseURL: urlBaseType === "lyricsovh" ? lyricsOvh : radioBrowserUrls[1],
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