const defaultRequestInterceptorConfig = {
  fulfilled: (config) => config,
  rejected: (error) => Promise.reject(error)
}

const defaultResponseInterceptorConfig = {
  fulfilled: (response) => response,
  rejected: (error) => Promise.reject(error)
}

class InterceptorManager {
  constructor(instance) {
    this.axiosInstance = instance
  }

  addRequestInterceptor({ fulfilled, rejected } = defaultRequestInterceptorConfig) {
    this.axiosInstance.interceptors.request.use(fulfilled, rejected)
  }

  addResponseInterceptor({ fulfilled, rejected } = defaultResponseInterceptorConfig) {
    this.axiosInstance.interceptors.response.use(fulfilled, rejected)
  }
}

export { InterceptorManager }
