import config from "../../config/config.js";

export const formSubSystemPath = (subsystem: string, path: string) => {
  if (typeof config === "undefined") {
    return ""
  }
  const pConf = config.backendConfig[subsystem as keyof typeof config.backendConfig]
  if (!!pConf) {
    let url = pConf.domain
    if (!!pConf.port) {
      url = url + ":" + pConf.port
    }
    url = url + pConf.folder + path
    return url
  }
}

// Browser check
export const isBrowser = typeof window !== 'undefined';

export const Auth = {
  TOKEN: "auth-token",
  EXPIRING_IN_DAYS: 1000 * 60 * 60 * 24 * 180, // 180 days
  ACCESS_TOKEN_EXPIRY: 1000 * 60 * 60  // 1 hour
}

export const cookieUtils = {
  create: function (name: string, value: string, expireTime: number, domain: string) {
    if (!isBrowser) return;
    
    expireTime = !!expireTime ? expireTime : 30 * 60 * 1000; // 30 minutes
    var date = new Date();
    date.setTime(date.getTime() + expireTime);
    var expires = '; expires=' + date.toUTCString();
    
    if (process.env.NODE_ENV !== "development") {
      document.cookie = name + '=' + value + expires + '; '+domain+'; path=/; secure';
    } else {
      document.cookie = name + '=' + value + expires + '; path=/';
    }
  },

  get: function (name: string) {
    if (!isBrowser) return null;
    
    var value = '; ' + document.cookie;
    var parts = value.split('; ' + name + '=');
    if (parts.length == 2) {
      return parts.pop()?.split(';').shift();
    }
    return null;
  },

  delete: function (name: string) {
    if (!isBrowser) return;
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
};