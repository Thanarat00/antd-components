import axios from 'axios';
import Cookies from 'js-cookie';

class AxiosInstant {
  constructor(baseURL) {
    this.instance = axios.create({
      baseURL: baseURL || process.env.NEXT_PUBLIC_API_URL || process.env.VITE_API_URL || '/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.tokenKey = 'access_token';
    this.refreshTokenKey = 'refresh_token';

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Add auth token from cookies
        const token = Cookies.get(this.tokenKey);
        if (token && !config.skipAuth) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized - Token expired
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest?.skipAuth) {
          originalRequest._retry = true;

          try {
            const refreshToken = Cookies.get(this.refreshTokenKey);
            if (refreshToken) {
              // Attempt to refresh token
              const response = await axios.post(
                `${this.instance.defaults.baseURL}/auth/refresh`,
                { refreshToken }
              );

              const { accessToken } = response.data;
              Cookies.set(this.tokenKey, accessToken);

              // Retry original request with new token
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return this.instance(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, clear tokens and redirect to login
            this.clearAuth();
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            return Promise.reject(refreshError);
          }
        }

        // Handle other errors
        if (!originalRequest?.skipErrorHandler) {
          this.handleError(error);
        }

        return Promise.reject(error);
      }
    );
  }

  handleError(error) {
    if (error.response) {
      // Server responded with error
      const { data, status } = error.response;
      
      switch (status) {
        case 400:
          console.error('Bad Request:', data?.message || error.message);
          break;
        case 403:
          console.error('Forbidden:', data?.message || 'Access denied');
          break;
        case 404:
          console.error('Not Found:', data?.message || 'Resource not found');
          break;
        case 500:
          console.error('Server Error:', data?.message || 'Internal server error');
          break;
        default:
          console.error('Error:', data?.message || error.message);
      }
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', 'No response from server');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
  }

  setToken(token) {
    Cookies.set(this.tokenKey, token);
  }

  getToken() {
    return Cookies.get(this.tokenKey);
  }

  setRefreshToken(token) {
    Cookies.set(this.refreshTokenKey, token);
  }

  clearAuth() {
    Cookies.remove(this.tokenKey);
    Cookies.remove(this.refreshTokenKey);
  }

  setBaseURL(baseURL) {
    this.instance.defaults.baseURL = baseURL;
  }

  // HTTP Methods
  async get(url, config) {
    return this.instance.get(url, config);
  }

  async post(url, data, config) {
    return this.instance.post(url, data, config);
  }

  async put(url, data, config) {
    return this.instance.put(url, data, config);
  }

  async patch(url, data, config) {
    return this.instance.patch(url, data, config);
  }

  async delete(url, config) {
    return this.instance.delete(url, config);
  }

  // Get the axios instance for advanced usage
  getInstance() {
    return this.instance;
  }
}

// Export singleton instance
export const axiosInstant = new AxiosInstant();

// Export class for creating custom instances
export { AxiosInstant };

