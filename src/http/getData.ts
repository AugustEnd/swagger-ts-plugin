import * as http from "http";
import * as fs from "fs";
import * as paths from "path";
import completeServiceList from "./serviceInfo";
// 类型
import { IServiceProps, IServiceApiDocProps, IDocProps } from "../index.d";

export const getData = async () => {
    const { apiDocList } = global.options;
    let serviceArr = await completeServiceList();
    try {
        // 已获取到所有服务数据
        let values: Array<IDocProps> = [];
        if (apiDocList?.length !== 0) {
            values = (
                await Promise.all(
                    apiDocList.map((item) =>
                        getSimpleServiceDataByApiDocUrl(item)
                    )
                )
            ).filter((el) => el);
        } else {
            values = (
                await Promise.all(
                    serviceArr.map((item) => getSimpleServiceDataByIp(item))
                )
            ).filter((el) => el);
        }

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
    return Promise.resolve(
        apiPath
            ? {
                  serviceName,
                  serviceApiDoc: serviceUrl + apiPath,
              }
            : null
    );
};

export const getSimpleServiceDataByIp = async ({
    serviceName,
    serviceUrl,
}: IServiceProps): Promise<IDocProps> => {
    let serviceApiDocUrl;
    try {
        let p = await addParmas({ serviceName, serviceUrl });
        if (!p) return Promise.resolve(null);
        const { serviceApiDoc } = p;
        serviceApiDocUrl = serviceApiDoc;
        if (
            !global.options.apiDocList.some(
                (el) => el.serviceName === serviceName
            )
        ) {
            global.options.apiDocList.push({ serviceName, serviceApiDoc });
        }

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
    try {
        const msg = (await new Promise((resolve, reject) => {
            http.get(`${serviceUrl}/swagger-resources`, (val: any) => {
                if (val.statusCode !== 200) {
                    reject(null);
                }
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
    } catch (error) {
        return Promise.resolve(null);
    }
};

interface ISimpleData extends Omit<IServiceProps, "serviceUrl"> {
    serviceApiDoc: string;
}
const getSimpleData = async ({
    serviceName,
    serviceApiDoc,
}: ISimpleData): Promise<IDocProps> => {
    try {
        let msg = (await new Promise((resolve, reject) => {
            http.get(serviceApiDoc, (val: any) => {
                if (val.statusCode !== 200) {
                    reject(null);
                }
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
                    let data = JSON.parse(rawData);
                    if (data.swagger?.split(".")[0] - 0 !== 2) {
                        swagger3to2(data);
                    }
                    resolve({
                        data: data.definitions,
                        basePath: data.basePath,
                        host: data.host,
                        swagger: data.swagger || "2.0",
                        tags: data.tags,
                        serviceName,
                        paths: data.paths,
                    });
                } catch (e) {
                    console.log("error", e);
                    reject(e.message);
                }
            });
        });
    } catch (error) {
        console.log(error, "error");
        return Promise.resolve(null);
    }
};

export const swagger3to2 = (data: any) => {
    let schemas = data.components.schemas;
    let paths = data.paths;

    if (schemas) {
        for (let key in schemas) {
            const properties = schemas[key].properties;
            if (properties) {
                for (let key2 in properties) {
                    if (properties[key2].$ref) {
                        properties[key2].$ref = properties[key2].$ref.replace(
                            /components\/schemas/g,
                            "definitions"
                        );
                    }
                    if (properties[key2]?.items?.$ref) {
                        properties[key2].items.$ref = properties[
                            key2
                        ].items.$ref.replace(
                            /components\/schemas/g,
                            "definitions"
                        );
                    }
                }
            }
        }
    }
    data.definitions = schemas;
    data.swagger = 3;
    if (paths) {
        for (let key in paths) {
            let path = paths[key];
            for (let key2 in path) {
                let methodData = path[key2];
                methodData.consumes = [];
                methodData.parameters = methodData.parameters || [];
                if (methodData.requestBody) {
                    const { content } = methodData.requestBody;

                    for (let key in content) {
                        methodData.consumes.push(key);
                        methodData.parameters.push({
                            in: "body",
                            name: "",
                            contentType: key,
                            required: true,
                            schema: content[key].schema || null,
                        });
                    }
                }
            }
        }
    }
    data.components && delete data.components;
};
