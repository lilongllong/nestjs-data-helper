// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as axios from 'axios';
import { AxiosResponse, AxiosRequestConfig } from 'axios';
const axiosInstance = (axios as any).create({
  timeout: 10000,
});

axiosInstance.interceptors.response.use((res: AxiosResponse) => {
  // console.log(res, 'res');
  return res;
});

axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
  // console.log(config, 'request');
  return config;
});

export default axiosInstance;
