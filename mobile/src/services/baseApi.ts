import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';

export interface RequestOptions extends AxiosRequestConfig {
  timeout?: number;
  retries?: number;
}

export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

export class BaseApiService {
  protected client: AxiosInstance;
  protected baseURL: string;

  constructor(baseURL: string, timeout: number = 10000) {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Można dodać logowanie requestów w trybie development
        return config;
      },
      (error) => {
        return Promise.reject(this.handleError(error));
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: any): ApiError {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data?.message || 'Server error occurred',
        status: error.response.status,
        data: error.response.data,
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        message: 'Network error - no response received',
        status: 0,
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'An unexpected error occurred',
      };
    }
  }

  public setAuthToken(token: string | null): void {
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.client.defaults.headers.common['Authorization'];
    }
  }

  public async get<T = any>(endpoint: string, options?: RequestOptions): Promise<T> {
    try {
      const response = await this.client.get(endpoint, options);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async post<T = any>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    try {
      const response = await this.client.post(endpoint, data, options);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async put<T = any>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    try {
      const response = await this.client.put(endpoint, data, options);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async patch<T = any>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    try {
      const response = await this.client.patch(endpoint, data, options);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async delete<T = any>(endpoint: string, options?: RequestOptions): Promise<T> {
    try {
      const response = await this.client.delete(endpoint, options);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.request(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
