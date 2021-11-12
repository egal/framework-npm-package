"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCookie = exports.deleteAllCookies = exports.getCookie = exports.setCookie = exports.decipherJWT = exports.GlobalVariables = void 0;
const MMKVStorage_1 = __importDefault(require("./MMKVStorage"));
// @ts-ignore
const jwt_decode_1 = __importDefault(require("jwt-decode"));
class GlobalVariables {
}
exports.GlobalVariables = GlobalVariables;
const decipherJWT = function (token) {
    return jwt_decode_1.default(token);
};
exports.decipherJWT = decipherJWT;
const setCookie = async function (name, token) {
    try {
        return MMKVStorage_1.default.set(name, token);
    }
    catch (error) {
        return error;
    }
};
exports.setCookie = setCookie;
const getCookie = function (cname) {
    if (cname !== undefined) {
        try {
            const token = MMKVStorage_1.default.getString(cname);
            return token === undefined ? '' : token;
        }
        catch (error) {
            return error;
        }
    }
};
exports.getCookie = getCookie;
const deleteAllCookies = function () {
    let data = MMKVStorage_1.default.getAllKeys();
    for (let i of data) {
        MMKVStorage_1.default.delete(i);
    }
};
exports.deleteAllCookies = deleteAllCookies;
const deleteCookie = function (name) {
    try {
        return MMKVStorage_1.default.delete(name);
    }
    catch (error) {
        return error;
    }
};
exports.deleteCookie = deleteCookie;
