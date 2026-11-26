/**
 * Central API configuration.
 *
 * All backend requests go through the `api` axios instance exported here.
 * To change the backend URL for any environment (local, staging, production),
 * update VITE_API_URL in the frontend .env file — nothing else needs to change.
 *
 * Usage:
 *   import api from "../../config/api";
 *   const { data } = await api.get("/repo/all");
 *   const { data } = await api.post("/login", { email, password });
 */

import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach JWT token automatically to every request if present
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
export { BASE_URL };
