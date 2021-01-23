"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllServiceList = exports.getSimpleServiceData = void 0;
const fs = require("fs");
const http = require("http");
const paths = require("path");
const parser = require("fast-xml-parser");
const getApiVersion = ({ serviceName, serviceUrl }) => __awaiter(void 0, void 0, void 0, function* () {
    // 获取接口版本
    const msg = (yield new Promise((resolve, reject) => {
        http.get(`${serviceUrl}/swagger-resources`, (val) => {
            resolve(val);
        });
    }));
    msg.setEncoding("utf8");
    let rawData = "";
    msg.on("data", (chunk) => {
        rawData += chunk;
    });
    return yield new Promise((resolve, reject) => {
        msg.on("end", () => {
            try {
                resolve(JSON.parse(rawData)[0].location);
            }
            catch (e) {
                reject(e.message);
            }
        });
    });
});
const getData = ({ serviceName, serviceUrl, path }) => __awaiter(void 0, void 0, void 0, function* () {
    const msg = (yield new Promise((resolve, reject) => {
        http.get(`${serviceUrl}${path}`, (val) => {
            resolve(val);
        });
    }));
    msg.setEncoding("utf8");
    let rawData = "";
    msg.on("data", (chunk) => {
        rawData += chunk;
    });
    return yield new Promise((resolve, reject) => {
        msg.on("end", () => {
            try {
                resolve({ data: JSON.parse(rawData).definitions, serviceName });
            }
            catch (e) {
                reject(e.message);
            }
        });
    });
});
const getSimpleServiceData = ({ serviceName, serviceUrl, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const apiPath = (yield getApiVersion({
            serviceName,
            serviceUrl,
        }));
        return yield getData({
            serviceName,
            serviceUrl,
            path: apiPath.slice(1),
        });
    }
    catch (error) { }
});
exports.getSimpleServiceData = getSimpleServiceData;
/**
 * 获取所有服务
 * @param param0
 */
const getAllServiceList = ({ url }) => __awaiter(void 0, void 0, void 0, function* () {
    const msg = (yield new Promise((resolve, reject) => {
        http.get(url, (val) => {
            resolve(val);
        });
    }));
    msg.setEncoding("utf8");
    let rawData = "";
    msg.on("data", (chunk) => {
        rawData += chunk;
    });
    return yield new Promise((resolve, reject) => {
        msg.on("end", () => {
            try {
                resolve({
                    data: parser.parse(rawData).applications.application || [],
                });
            }
            catch (e) {
                reject(e.message);
            }
        });
    });
});
exports.getAllServiceList = getAllServiceList;
//# sourceMappingURL=request.js.map