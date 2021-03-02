"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllServiceList = exports.getSimpleServiceData = void 0;
const http = require("http");
const parser = require("fast-xml-parser");
const getApiVersion = async ({ serviceName, serviceUrl }) => {
    // 获取接口版本
    const msg = (await new Promise((resolve, reject) => {
        http.get(`${serviceUrl}/swagger-resources`, (val) => {
            resolve(val);
        });
    }));
    msg.setEncoding("utf8");
    let rawData = "";
    msg.on("data", (chunk) => {
        rawData += chunk;
    });
    return await new Promise((resolve, reject) => {
        msg.on("end", () => {
            try {
                resolve(JSON.parse(rawData)[0].location);
            }
            catch (e) {
                reject(e.message);
            }
        });
    });
};
const getData = async ({ serviceName, serviceUrl, path }) => {
    const msg = (await new Promise((resolve, reject) => {
        http.get(`${serviceUrl}${path}`, (val) => {
            resolve(val);
        });
    }));
    msg.setEncoding("utf8");
    let rawData = "";
    msg.on("data", (chunk) => {
        rawData += chunk;
    });
    return await new Promise((resolve, reject) => {
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
};
/**
 * 返回单个服务的数据
 * @param param0 servername
 */
const getSimpleServiceData = async ({ serviceName, serviceUrl, }) => {
    try {
        const apiPath = (await getApiVersion({
            serviceName,
            serviceUrl,
        }));
        try {
            return await getData({
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
};
exports.getSimpleServiceData = getSimpleServiceData;
/**
 * 获取所有服务
 * @param param0
 */
const getAllServiceList = async ({ url }) => {
    const msg = (await new Promise((resolve, reject) => {
        http.get(url, (val) => {
            resolve(val);
        });
    }));
    msg.setEncoding("utf8");
    let rawData = "";
    msg.on("data", (chunk) => {
        rawData += chunk;
    });
    return await new Promise((resolve, reject) => {
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
};
exports.getAllServiceList = getAllServiceList;
//# sourceMappingURL=request.js.map