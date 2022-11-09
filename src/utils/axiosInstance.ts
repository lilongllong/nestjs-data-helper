// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as axios from 'axios';
import * as UserAgent from 'user-agents';
import { AxiosResponse, AxiosRequestConfig } from 'axios';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const HTTPAgent = require('https-proxy-agent');

const axiosInstance = (axios as any).create({
  timeout: 30000,
});

axiosInstance.interceptors.response.use((res: AxiosResponse) => {
  // console.log(res, 'res');
  return res;
});

axiosInstance.interceptors.request.use(async (config: AxiosRequestConfig) => {
  // console.log(config, 'request');
  const userAgent = new UserAgent();

  config.headers = {
    ...config.headers,
    'User-Agent': userAgent.toString(),
  };
  return config;
});

export default axiosInstance;
