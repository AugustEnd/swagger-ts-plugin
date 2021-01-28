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
    console.log;
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
                const data = JSON.parse(rawData);
                resolve({
                    data: data.definitions,
                    serviceName,
                    paths: data.paths,
                });
            }
            catch (e) {
                reject(e.message);
            }
        });
    });
});
/**
 * 返回单个服务的数据
 * @param param0 servername
 */
const getSimpleServiceData = ({ serviceName, serviceUrl, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const apiPath = (yield getApiVersion({
            serviceName,
            serviceUrl,
        }));
        try {
            return yield getData({
                serviceName,
                serviceUrl,
                path: apiPath.slice(1),
            });
        }
        catch (error) {
            const info = `服务${serviceName}: 服务地址可能错误，导致未能正确获取信息。（${serviceUrl + apiPath.slice(1)}）`;
            console.log(`\x1B[31m${info}\x1B[39m`);
            return null;
        }
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