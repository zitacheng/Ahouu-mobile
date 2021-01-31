/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
/* eslint-disable @typescript-eslint/no-explicit-any */
import cloneDeep from 'lodash.clonedeep';

import conf from './config';
import { User } from './types';

export type CustomConfig = AxiosRequestConfig & { user?: User };

const instance = axios.create({
  baseURL: conf.api.url,
});

function AxiosErrorHandler(e: AxiosError) {
  if (e.response) {
    const { data: { message } } = e.response as { data: { message: string } };

    return new Error(message);
  }

  if (e.request) return new Error('generic/server-error');

  return new Error('generic/unknown-error');
}

function AxiosConfigBuilder(config?: CustomConfig): AxiosRequestConfig | undefined {
  const clone = cloneDeep(config);

  if (!clone) return clone;
  if (!clone.user) return config;
  if (!clone.headers) clone.headers = {};

  const headers: Record<string, string> = {
    ...clone.headers as Record<string, boolean>,
    Authorization: `Bearer ${clone.user.token}`,
  };

  clone.headers = headers;
  delete clone.user;
  return clone;
}

export default {
  ...instance,
  get: async (
    url: string,
    config?: CustomConfig,
  ): Promise<AxiosResponse<any>> => {
    try {
      return await instance.get(url, AxiosConfigBuilder(config));
    } catch (e) {
      throw AxiosErrorHandler(e);
    }
  },
  put: async (
    url: string,
    data?: any,
    config?: CustomConfig,
  ): Promise<AxiosResponse<any>> => {
    try {
      return await instance.put(url, data, AxiosConfigBuilder(config));
    } catch (e) {
      throw AxiosErrorHandler(e);
    }
  },
  post: async (
    url: string,
    data?: any,
    config?: CustomConfig,
  ): Promise<AxiosResponse<any>> => {
    try {
      return await instance.post(url, data, AxiosConfigBuilder(config));
    } catch (e) {
      throw AxiosErrorHandler(e);
    }
  },
  delete: async (
    url: string,
    config?: CustomConfig,
  ): Promise<AxiosResponse<any>> => {
    try {
      return await instance.delete(url, AxiosConfigBuilder(config));
    } catch (e) {
      throw AxiosErrorHandler(e);
    }
  },
};
