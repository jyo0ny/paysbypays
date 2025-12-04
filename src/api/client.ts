// src/api/client.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🟦 Request Interceptor
api.interceptors.request.use(
  (config) => {
    console.log("🚀 API 요청:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("❌ 요청 에러:", error);
    return Promise.reject(error);
  }
);

// 🟥 Response Interceptor
api.interceptors.response.use(
  (response) => {
    console.log("✅ API 응답:", response.config.url, response.status);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const errorData = error.response?.data;

    console.error("❌ API 에러:", {
      status,
      url: error.config?.url,
      message: errorData?.message || error.message,
      data: errorData,
    });

    if (status === 400) {
      console.warn("Bad Request:", errorData);
    }
    if (status === 404) {
      console.warn("Not Found:", errorData);
    }
    if (status === 500) {
      console.error("Server Error:", errorData);
    }

    return Promise.reject(error);
  }
);

export default api;