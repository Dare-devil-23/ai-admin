import axios, { InternalAxiosRequestConfig } from 'axios';
import { formSubSystemPath, isBrowser, Auth, cookieUtils } from '@/services/utils';
import config from '../../config/config.js';

interface Config extends InternalAxiosRequestConfig {
  apiType?: string;
  subSystem?: string;
}

export const getCookie = (req: any) => {
  return req?.headers?.cookie;
};

const getAuthHeader = (cookie: any) => {
  if (cookie) {
    var value = '; ' + cookie;
    var parts = value.split('; ' + Auth.TOKEN + '=');
    if (parts.length == 2) {
      let values = parts.pop()?.split(';').shift();
      return values;
    }
  }
  return cookieUtils.get(Auth.TOKEN);
}

const getFormUrl = (subSystem: string, config: any) => {
  return formSubSystemPath(subSystem, config.url);
};

const fetchType = {
  server: (config: any) => {
    if (!isBrowser) {
      let { apiType, cookie, subSystem, ...otherConfig } = config;
      otherConfig.url = getFormUrl(subSystem, otherConfig) || config.url;
      return {
        ...otherConfig,
        headers: {
          ...otherConfig.headers,
          [Auth.TOKEN]: getAuthHeader(config.cookie)
        }
      };
    }
  },
  client: (config: any) => {
    if (isBrowser) {
      let { apiType, subSystem, ...otherConfig } = config;
      otherConfig.url = getFormUrl(subSystem, otherConfig) || config.url;
      return {
        ...otherConfig,
        headers: {
          ...otherConfig.headers,
          [Auth.TOKEN]: getAuthHeader(config.cookie)
        }
      };
    }
  },
  universal: (config: any) => {
    let { apiType, cookie, subSystem, ...otherConfig } = config;
    otherConfig.url = getFormUrl(subSystem, otherConfig) || config.url;
    return {
      ...otherConfig,
      headers: {
        ...otherConfig.headers,
        [Auth.TOKEN]: getAuthHeader(config.cookie)
      }
    };
  }
};

// Create axios instance with base URL
export const fetch = axios.create({
  baseURL: config.backendConfig.platform.domain + ':' + config.backendConfig.platform.port
});

fetch.defaults.withCredentials = true;

fetch.interceptors.request.use(
  async function (config: Config) {
    const { apiType } = config;
    switch (apiType) {
      case 'server':
        config = fetchType.server(config);
        break;
      case 'client':
        config = fetchType.client(config);
        break;
      case 'universal':
        config = fetchType.universal(config);
        break;
      default:
        config = fetchType.universal(config);
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

const logOutRedirection = (error: any) => {
  const loginPaths = ['/login', '/signup'];
  if (isBrowser && error?.response?.status === 401) {
    cookieUtils.delete(Auth.TOKEN);
    sessionStorage.clear()
    if (!loginPaths.includes(location.pathname)) {
      location.href = loginPaths[0];
    }
  }
}

fetch.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  logOutRedirection(error);
  return Promise.reject(error);
});

export const fetchClientandServerSideAPICall = async (type: 'get' | 'post', url: string, params: any, subSystemandOtherConfigs: any) => {
  let fetchPromise;
  if (type == 'get') {
    fetchPromise = fetch[type](url, { ...subSystemandOtherConfigs, ...params });
  } else {
    fetchPromise = fetch[type](url, params, { ...subSystemandOtherConfigs });
  }
  if (isBrowser) {
    return fetchPromise;
  } else {
    return await fetchPromise;
  }
};

export function readCookie(name: string, req: any) {
  var nameEQ = name + '=';
  let cookie = getCookie(req);
  if (!!req && !!cookie) {
    var ca = cookie?.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
}
