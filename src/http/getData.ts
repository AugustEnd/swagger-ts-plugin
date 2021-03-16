import * as http from "http";
import * as fs from "fs";
import * as paths from "path";
import completeServiceList from "./serviceInfo";
// 类型
import { IServiceProps, IServiceApiDocProps } from "../index.d";
import { IDocBack } from "./index.d";

export const getData = async () => {
    const { apiDocList } = global.options;
    let serviceArr = await completeServiceList();
    try {
        // 已获取到所有服务数据
        let values: Array<IDocBack> = [];
        if (apiDocList?.length !== 0) {
            values = await Promise.all(
                apiDocList.map((item) => getSimpleServiceDataByApiDocUrl(item))
            );
        } else {
            values = await Promise.all(
                serviceArr.map((item) => getSimpleServiceDataByIp(item))
            );
        }

        fs.writeFile(
            paths.resolve(__dirname, `./a.json`),
            JSON.stringify(values, null, 4),
            () => {}
        );
        return Promise.resolve(values);
    } catch (error) {}
};

/**
 * 得到服务数据地址
 */
export const addParmas = async ({
    serviceName,
    serviceUrl,
}: ISimpleProps): Promise<IServiceApiDocProps> => {
    const apiPath = await getApiVersion({
        serviceName,
        serviceUrl,
    });
    return Promise.resolve({
        serviceName,
        serviceApiDoc: serviceUrl + apiPath,
    });
};

export const getSimpleServiceDataByIp = async ({
    serviceName,
    serviceUrl,
}: IServiceProps): Promise<IDocBack> => {
    let serviceApiDocUrl;
    try {
        let { serviceApiDoc } = await addParmas({ serviceName, serviceUrl });
        serviceApiDocUrl = serviceApiDoc;
        return getSimpleData({
            serviceName,
            serviceApiDoc,
        });
    } catch (error) {
        const info = `服务${serviceName}: 服务地址可能错误，导致未能正确获取信息。（${serviceApiDocUrl}）`;
        console.log(`\x1B[31m${info}\x1B[39m`);
        return null;
    }
};

/**
 * 返回单个服务的数据
 * @param param0 servername
 */
interface ISimpleProps {
    serviceName: string;
    serviceUrl?: string;
    serviceApiDoc?: string;
}
export const getSimpleServiceDataByApiDocUrl = async ({
    serviceName,
    serviceApiDoc,
}: ISimpleProps) => {
    try {
        return getSimpleData({
            serviceName,
            serviceApiDoc,
        });
    } catch (error) {
        const info = `服务${serviceName}: 服务地址可能错误，导致未能正确获取信息。（${serviceApiDoc}）`;
        console.log(`\x1B[31m${info}\x1B[39m`);
        return null;
    }
};

const getApiVersion = async ({
    serviceName,
    serviceUrl,
}: IServiceProps): Promise<string> => {
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
                resolve(JSON.parse(rawData)[0].location?.slice(1));
            } catch (e) {
                reject(e.message);
            }
        });
    });
};

interface ISimpleData extends Omit<IServiceProps, "serviceUrl"> {
    serviceApiDoc: string;
}
const getSimpleData = async ({
    serviceName,
    serviceApiDoc,
}: ISimpleData): Promise<IDocBack> => {
    const msg = (await new Promise((resolve, reject) => {
        http.get(serviceApiDoc, (val: any) => {
            resolve(val);
        });
    })) as any;

    msg.setEncoding("utf8");

    let rawData = "";

    msg.on("data", (chunk: any) => {
        rawData += chunk;
    });

    return new Promise((resolve, reject) => {
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
