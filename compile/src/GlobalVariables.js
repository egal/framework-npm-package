"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCookie = exports.deleteAllCookies = exports.getCookie = exports.setCookie = exports.decipherJWT = exports.GlobalVariables = void 0;
class GlobalVariables {
}
exports.GlobalVariables = GlobalVariables;
const decipherJWT = function (token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace('-', '+').replace('_', '/');
    // @ts-ignore
    return JSON.parse(Buffer.from(base64, 'base64').toString('binary'));
};
exports.decipherJWT = decipherJWT;
const setCookie = async function (name, token) {
    let decipheredJWT = await exports.decipherJWT(token);
    let expirationDate = decipheredJWT.alive_until;
    // document.cookie = name + "=" + token + "; expires=" + expirationDate + ";samesite=strict;secure;"
};
exports.setCookie = setCookie;
const getCookie = function (cname) {
    // const name = cname + "=";
    // const decodedCookie = decodeURIComponent(document.cookie);
    // const cookieParts = decodedCookie.split(';');
    // for (let i = 0; i < cookieParts.length; i++) {
    //   let part = cookieParts[i];
    //   while (part.charAt(0) == ' ') {
    //     part = part.substring(1);
    //   }
    //   if (part.indexOf(name) == 0) {
    //     return part.substring(name.length, part.length);
    //   }
    // }
    return "";
};
exports.getCookie = getCookie;
const deleteAllCookies = function () {
    // let cookies = document.cookie.split(";");
    // for (let i = 0; i < cookies.length; i++) {
    //   let cookie = cookies[i];
    //   let eqPos = cookie.indexOf("=");
    //   let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    //   document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    // }
};
exports.deleteAllCookies = deleteAllCookies;
const deleteCookie = function (name) {
    // document.cookie = name + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
};
exports.deleteCookie = deleteCookie;
