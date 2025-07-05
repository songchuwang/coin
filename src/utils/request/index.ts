import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig} from 'axios';
import {BAST_URL} from "@/config/appConfig.ts";
import {getToken} from "@/tools/token.ts";

const defaultAxiosRequestConfig: AxiosRequestConfig = {
  baseURL: BAST_URL,
  timeout: 20000,
}

type JsonResponse<T = any> = {
  code: number,
  msg: string,
  data: T
}

class Request {
  static instance: Request

  static getInstance() {
    if (!Request.instance) {
      Request.instance = new Request()
    }
    return Request.instance
  }

  private instance: AxiosInstance;

  constructor() {

    // Create an Axios instance
    this.instance = axios.create({ ...defaultAxiosRequestConfig });

    this.initializeRequestInterceptor();
    this.initializeResponseInterceptor();
  }

  // Request interceptor
  private initializeRequestInterceptor() {
    this.instance.interceptors.request.use(
      this.handleRequest,
      this.handleError
    );
  }

  // Response interceptor
  private initializeResponseInterceptor() {
    this.instance.interceptors.response.use(
      this.handleResponse,
      this.handleError
    );
  }

  // Handle request before sending it
  private handleRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    // Add any custom logic here (e.g., adding authorization tokens)
    console.log('Request Interceptor:', config);
    const token = getToken()
    config.headers['tenant-id'] = import.meta.env['VITE_API_TENANTID']
    if (token && config.url.indexOf('tg-login') === -1) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config;
  }

  // Handle response before it is returned to the caller
  private handleResponse(response: AxiosResponse): AxiosResponse {
    // Add any custom logic here
    console.log('Response Interceptor:', response);

    return response.data;
  }

  // Handle errors
  private handleError(error: AxiosError): Promise<AxiosError> {
    console.error('HTTP Error:', error);
    // Custom error handling logic
    return Promise.reject(error);
  }

  // Generic GET request
  public get<T>(url: string, config?: AxiosRequestConfig): Promise<JsonResponse<T>> {
    return this.instance.get<T, JsonResponse<T>>(url, config);
  }

  // Generic POST request
  public post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<JsonResponse<T>> {
    return this.instance.post<T, JsonResponse<T>>(url, data, config);
  }

  // Generic PUT request
  public put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<JsonResponse<T>> {
    return this.instance.put<T, JsonResponse<T>>(url, data, config);
  }

  // Generic DELETE request
  public delete<T>(url: string, config?: AxiosRequestConfig): Promise<JsonResponse<T>> {
    return this.instance.delete<T, JsonResponse<T>>(url, config);
  }
}

export default Request.getInstance();
