export class GlobalVariables {
  public static socketBaseUrl: string;
  public static httpBaseUrl: string;
  public static authBaseUrl: string;
  public static tokenUST: string;
  public static tokenUMT: string;
}

export const decipherJWT = function (token: string): any {
  let base64Url = token.split('.')[1];
  let base64 = base64Url.replace('-', '+').replace('_', '/');
  // @ts-ignore
  return JSON.parse(Buffer.from(base64, 'base64').toString('binary'));
};

export const setCookie = async function (
  name: string,
  token: string,
  flags?: { samesite?: string; secure?: string }
): Promise<any> {
  let addedFlags;
  if (flags) {
    if (flags.samesite && !flags.secure) {
      addedFlags = `; samesite=${flags.samesite}`;
    } else if (!flags.samesite && flags.secure) {
      addedFlags = `; ${flags.secure}`;
    } else if (flags.samesite && flags.secure) {
      addedFlags = `; samesite=${flags.samesite};${flags.secure};`;
    }
    document.cookie = name + '=' + token + addedFlags;
  } else {
    document.cookie = name + '=' + token;
  }
};

export const getCookie = function (cname: string): any {
  const name = cname + '=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieParts = decodedCookie.split(';');
  for (let i = 0; i < cookieParts.length; i++) {
    let part = cookieParts[i];
    while (part.charAt(0) == ' ') {
      part = part.substring(1);
    }
    if (part.indexOf(name) == 0) {
      return part.substring(name.length, part.length);
    }
  }
  return '';
};

export const deleteAllCookies = function (): any {
  let cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    let eqPos = cookie.indexOf('=');
    let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
};

export const deleteCookie = function (name: string): any {
  document.cookie = name + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
};

export const setUmrt = function(token: string) {
  try {
    return localStorage.setItem('umrt', token);
  } catch (error) {
    return error;
  }
}

export const deleteUmrt = function() {
  try {
    return localStorage.removeItem('umrt');
  } catch (error) {
    return error;
  }
}

export const setUmt = function(token: string) {
  try {
    return localStorage.setItem('umt', token);
  } catch (error) {
    return error;
  }
}

export const deleteUmt = function() {
  try {
    return localStorage.removeItem('umt');
  } catch (error) {
    return error;
  }
}