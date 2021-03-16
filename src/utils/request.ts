import * as http from "http";
// 类型
import { IServiceProps } from "../index.d";

const getApiVersion = async ({ serviceName, serviceUrl }: IServiceProps) => {
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

interface IData extends IServiceProps {
    path: string;
}

const getData = async ({ serviceName, serviceUrl, path }: IData) => {
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
}: IServiceProps) => {
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
