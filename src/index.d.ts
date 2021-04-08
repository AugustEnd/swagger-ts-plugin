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
            swagger2global: {
                transitions: {
                    [key: string]: string;
                };
            };
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
    | "file"
    | undefined;

//请求方式
export type Methods =
    | "get"
    | "post"
    | "delete"
    | "put"
    | "head"
    | "options"
    | "patch";

export interface IDocDefinitions {
    [key: string]: {
        type: string;
        properties: {
            [key: string]: {
                type?: JavaType;
                $ref?: string;
                items?: {
                    $ref?: string;
                    type?: JavaType;
                };
                description?: string;
            };
        };
    };
}

// path -> method -> parameter
export type IDocPathsParamsItem = {
    description: string;
    in: "header" | "body" | "query" | "formData" | "path";
    name: string;
    required: boolean;
    type?: JavaType;
    enum?: Array<string>;
    schema?: {
        $ref?: string;
        type?: JavaType;
        enum?: Array<string>;
        items?: {
            $ref?: string;
            type?: JavaType;
            enum?: Array<string>;
        };
    };
};

// path -> method
export interface IDocPathsMethod {
    consumes: Array<string>;
    operationId: string;
    parameters: Array<IDocPathsParamsItem>;
    produces: Array<string>;
    summary: string;
    deprecated: boolean;
    responses: {
        200: {
            description: string;
            schema?: {
                $ref?: string;
                type?: string;
                items?: {
                    $ref?: string;
                    type?: string;
                };
            };
        };
        401?: {
            description: string;
        };
        403?: {
            description: string;
        };
        404?: {
            description: string;
        };
    };
}

export type IDocPathMethods = Record<Methods, IDocPathsMethod> & {
    parameters: Array<IDocPathsParamsItem>;
};
export interface IDocPaths {
    [key: string]: IDocPathMethods;
}

export interface IDocProps {
    basePath: string;
    data: IDocDefinitions;
    host: string;
    paths: IDocPaths;
    swagger: 2 | 3;
    tags: Array<{ name: string; description: string }>;
    serviceName: string;
    info?: any;
}
