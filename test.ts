import request from "./swagger2ts/request";
import axios, { AxiosInstance } from "axios";

let initAxios = axios.create({
    timeout: 3000,
});

const API = request<AxiosInstance>(initAxios);

// API.fsService["/config/ext/save"]({ body: {} }).then((val) => {});
API.fsService;
