import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const RETRY_MAX = 3;
const RETRY_BASE_DELAY_MS = 500;
const SAFE_METHODS = new Set(['get', 'head', 'options']);

const isTransientError = (error: AxiosError): boolean => {
  if (!error.response) {
    // Network error or timeout — always transient
    return true;
  }
  const status = error.response.status;
  return status >= 500 && status <= 599;
};

const isSafeMethod = (config: InternalAxiosRequestConfig): boolean => {
  return SAFE_METHODS.has((config.method ?? 'get').toLowerCase());
};

const exponentialDelay = (attempt: number): number =>
  RETRY_BASE_DELAY_MS * Math.pow(2, attempt);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach access token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: handle 401 + token refresh, and transient-error retries
let isRefreshing = false;
let failedQueue: { resolve: (v: any) => void; reject: (e: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

type RetryableConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  _retryCount?: number;
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableConfig;

    // Don't retry refresh or login requests
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, null, {
          headers: { Authorization: `Bearer ${refreshToken}` },
        });

        const newAccessToken = data.data.accessToken;
        const newRefreshToken = data.data.refreshToken;

        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        processQueue(null, newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('auth-store');
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Retry transient failures (5xx, network errors, timeouts) for safe HTTP methods
    if (
      originalRequest &&
      isSafeMethod(originalRequest) &&
      isTransientError(error)
    ) {
      const retryCount = originalRequest._retryCount ?? 0;
      if (retryCount < RETRY_MAX) {
        originalRequest._retryCount = retryCount + 1;
        const delay = exponentialDelay(retryCount);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return apiClient(originalRequest);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;

