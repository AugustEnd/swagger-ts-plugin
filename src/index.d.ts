/**
 * @param serviceName 服务名称
 * @param serviceUrl 服务url
 */
export interface IServiceProps {
    serviceName: string;
    serviceUrl: string;
}

/**
 * @param serviceName 服务名称
 * @param serviceApiDoc 数据json地址
 */
export interface IServiceApiDocProps {
    serviceName: string;
    serviceApiDoc: string;
}

/**
 * @param serverList 服务列表
 * @param outputPath 输出文件地址
 * @param appUrl eureka输入xml地址
 * @param fanyi 翻译配置
 */

export interface ISwaggerProps {
    serverList: Array<string | IServiceProps>;
    apiDocList?: Array<IServiceApiDocProps>;
    outputPath?: string;
    appUrl?: string;
    fanyi?: {
        baidu?: {
            appid: string;
            secretKey: string;
            maxLimit: number;
        };
    };
}

declare global {
    namespace NodeJS {
        interface Global {
            options: ISwaggerProps;
        }
    }
}

// 后端数据类型
export type JavaType =
    | "array"
    | "boolean"
    | "string"
    | "integer"
    | "number"
    | "object"
    | undefined;

//请求方式
export type Methods = "get" | "post" | "delete" | "put";
