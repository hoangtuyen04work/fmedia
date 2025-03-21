
import axios from "axios";

// const API_URL = process.env.REACT_APP_API_URL;
const API_URL = "http://localhost:8888/media";
const api = axios.create({
    baseURL: API_URL
});
export default api;