// axios.js - Optimized for scalability and performance
import axios from "axios";
import { authStorage } from "../utils/authStorage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  withCredentials: true,
  timeout: 25000, // 25 second timeout to prevent hanging requests (increased for uploads)
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor - optimized
api.interceptors.request.use(
  (config) => {
    // Get token from storage - fast, synchronous check
    const token = authStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - optimized error handling
api.interceptors.response.use(
  (response) => {
    // Log slow requests in development
    if (import.meta.env.DEV && response.config.metadata) {
      const duration = new Date() - response.config.metadata.startTime;
      if (duration > 1000) {
        console.warn(`Slow request detected: ${response.config.url} took ${duration}ms`);
      }
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout:', originalRequest.url);
      return Promise.reject(new Error('Request timeout. Please check your connection.'));
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    // Handle 401 errors with token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't refresh on login/register endpoints
      if (originalRequest.url.includes('/login') ||
        originalRequest.url.includes('/register') ||
        originalRequest.url.includes('/refresh-token')) {
        authStorage.clearAuth();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue the request while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await api.post('/users/refresh-token');
        const { accessToken } = response.data.data;

        // Update storage
        authStorage.setAccessToken(accessToken);

        // Process queued requests
        processQueue(null, accessToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear auth and reject all queued requests
        processQueue(refreshError, null);
        authStorage.clearAuth();

        // Redirect to login will be handled by app/ProtectedRoute
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle 403 errors
    if (error.response?.status === 403) {
      console.error('Access denied:', originalRequest.url);
    }

    // Handle 500 errors
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.status, originalRequest.url);
    }

    return Promise.reject(error);
  }
);

export default api;