import axios from "axios";
import { BASE_URL } from "./apiPaths"

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",

    },
})

// request interpreter
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token")
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// response interpreter
axiosInstance.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        //handle common error
        if (error.response) {
            if (error.response.status == 401) {
                //redirect to login page
                window.location.href = "/login"
            } else if (error.responce.status === 500) {
                console.error("server error. Please try again")
            }
        } else if (error.code === "ENCONNABORTED") {
            console.error("Request timeout.Please try again")
        }
        return Promise.reject(error)
    }
);

export default axiosInstance