"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCookie = exports.setCookie = exports.decipherJWT = exports.GlobalVariables = void 0;
class GlobalVariables {
}
exports.GlobalVariables = GlobalVariables;
const decipherJWT = function (token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(Buffer.from(base64, 'base64').toString('binary'));
};
exports.decipherJWT = decipherJWT;
const setCookie = async function (name, token) {
    let decipheredJWT = await exports.decipherJWT(token);
    let expirationDate = decipheredJWT.alive_until;
    document.cookie = name + "=" + token + "; expires=" + expirationDate + ";samesite=strict;secure;";
};
exports.setCookie = setCookie;
const getCookie = function (cname) {
    const name = cname + "=";
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
    return "";
};
exports.getCookie = getCookie;
