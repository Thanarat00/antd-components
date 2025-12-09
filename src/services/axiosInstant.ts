import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import Cookies from 'js-cookie';

export interface AxiosInstantConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
  skipErrorHandler?: boolean;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success?: boolean;
  code?: number | string;
}

class AxiosInstant {
  private instance: AxiosInstance;
  private tokenKey: string = 'access_token';
  private refreshTokenKey: string = 'refresh_token';

  constructor(baseURL?: string) {
    this.instance = axios.create({
      baseURL: baseURL || process.env.NEXT_PUBLIC_API_URL || process.env.VITE_API_URL || '/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Add auth token from cookies
        const token = Cookies.get(this.tokenKey);
        if (token && !(config as AxiosInstantConfig).skipAuth) {
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
      (response: AxiosResponse<ApiResponse>) => {
        return response;
      },
      async (error: AxiosError<ApiResponse>) => {
        const originalRequest = error.config as AxiosInstantConfig & { _retry?: boolean };

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

  private handleError(error: AxiosError<ApiResponse>) {
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

  public setToken(token: string) {
    Cookies.set(this.tokenKey, token);
  }

  public getToken(): string | undefined {
    return Cookies.get(this.tokenKey);
  }

  public setRefreshToken(token: string) {
    Cookies.set(this.refreshTokenKey, token);
  }

  public clearAuth() {
    Cookies.remove(this.tokenKey);
    Cookies.remove(this.refreshTokenKey);
  }

  public setBaseURL(baseURL: string) {
    this.instance.defaults.baseURL = baseURL;
  }

  // HTTP Methods
  public async get<T = any>(url: string, config?: AxiosInstantConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.get<ApiResponse<T>>(url, config);
  }

  public async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosInstantConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.post<ApiResponse<T>>(url, data, config);
  }

  public async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosInstantConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.put<ApiResponse<T>>(url, data, config);
  }

  public async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosInstantConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.patch<ApiResponse<T>>(url, data, config);
  }

  public async delete<T = any>(url: string, config?: AxiosInstantConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.delete<ApiResponse<T>>(url, config);
  }

  // Get the axios instance for advanced usage
  public getInstance(): AxiosInstance {
    return this.instance;
  }
}

// Export singleton instance
export const axiosInstant = new AxiosInstant();

// Export class for creating custom instances
export { AxiosInstant };

