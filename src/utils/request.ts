const fs = require("fs");
const http = require("http");
const paths = require("path");
const parser = require("fast-xml-parser");
interface IProps {
    serviceName: string;
    serviceUrl: string;
}

const getApiVersion = async ({ serviceName, serviceUrl }: IProps) => {
    // 获取接口版本
    const msg = (await new Promise((resolve, reject) => {
        http.get(`${serviceUrl}/swagger-resources`, (val: any) => {
            resolve(val);
        });
    })) as any;

    msg.setEncoding("utf8");

    let rawData = "";

    msg.on("data", (chunk: any) => {
        rawData += chunk;
    });

    return await new Promise((resolve, reject) => {
        msg.on("end", () => {
            try {
                resolve(JSON.parse(rawData)[0].location);
            } catch (e) {
                reject(e.message);
            }
        });
    });
};

interface IData extends IProps {
    path: string;
}

const getData = async ({ serviceName, serviceUrl, path }: IData) => {
    console.log;
    const msg = (await new Promise((resolve, reject) => {
        http.get(`${serviceUrl}${path}`, (val: any) => {
            resolve(val);
        });
    })) as any;

    msg.setEncoding("utf8");

    let rawData = "";

    msg.on("data", (chunk: any) => {
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
            } catch (e) {
                reject(e.message);
            }
        });
    });
};

/**
 * 返回单个服务的数据
 * @param param0 servername
 */

export const getSimpleServiceData = async ({
    serviceName,
    serviceUrl,
}: IProps) => {
    try {
        const apiPath = (await getApiVersion({
            serviceName,
            serviceUrl,
        })) as any;
        try {
            return await getData({
                serviceName,
                serviceUrl,
                path: apiPath.slice(1),
            });
        } catch (error) {
            const info = `服务${serviceName}: 服务地址可能错误，导致未能正确获取信息。（${
                serviceUrl + apiPath.slice(1)
            }）`;
            console.log(`\x1B[31m${info}\x1B[39m`);
            return null;
        }
    } catch (error) {}
};

/**
 * 获取所有服务
 * @param param0
 */
export const getAllServiceList = async ({ url }: { url: string }) => {
    const msg = (await new Promise((resolve, reject) => {
        http.get(url, (val: any) => {
            resolve(val);
        });
    })) as any;

    msg.setEncoding("utf8");

    let rawData = "";

    msg.on("data", (chunk: any) => {
        rawData += chunk;
    });

    return await new Promise((resolve, reject) => {
        msg.on("end", () => {
            try {
                resolve({
                    data: parser.parse(rawData).applications.application || [],
                });
            } catch (e) {
                reject(e.message);
            }
        });
    });
};
