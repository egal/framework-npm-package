import storage from "./MMKVStorage";
import jwtDecode from "jwt-decode";

export class GlobalVariables {
  public static httpBaseUrl: string;
  public static authBaseUrl: string;
  public static tokenUST: string;
  public static tokenUMT: string;
}

export const decipherJWT = function (token: string) {
  return jwtDecode(token);
};

export const setCookie = async function (name: string, token: string) {
  try {
    return storage.set(name, token);
  } catch (error) {
    return error;
  }
};

export const getCookie = function (cname: string) {
  if (cname !== undefined) {
    try {
      const token = storage.getString(cname);
      return token === undefined ? "" : token;
    } catch (error) {
      return error;
    }
  }
};

export const deleteAllCookies = function () {
  let data = storage.getAllKeys();
  for (let i of data) {
    storage.delete(i);
  }
};

export const deleteCookie = function (name: string) {
  try {
    return storage.delete(name);
  } catch (error) {
    return error;
  }
};
