import { handleSpecialSymbol } from "../../utils/common";
import * as fs from "fs";
import { typeMap, switchType } from "../interface";
import { exchangeZhToEn } from "../../create/helper";
import { outputApi } from "../createFn/index";
// 类型
import { Methods } from "../../index.d";
import {
    IDocPaths,
    IDocPathsParams,
    IDocPathsParamsItem,
    IDocBack,
} from "../../http/index.d";
import { IAllInterface } from "../interface/index.d";
import { CompletePathBack } from "./index.d";
import { currentServiceFn } from "../createFn";

const varType = ["any", "string", "number", "boolean", "undefault", "null"];
/**
 * 拼接接口字符串
 * @param param0
 * @param prevStr 上次保存的string
 */
// export const tsConcat = (
//     { key, val }: { key: string; val: any },
//     prevStr: string
// ) => {
//     return `${prevStr}\n    ${key}: ${typeMap(val)};`;
// };

/**
 * 一个完整的接口字符串（注释+接口）
 * @param key
 * @param val
 */
export const completePath = (key: string, val: IDocPaths): CompletePathBack => {
    let str = "";

    let method = Object.keys(val)[0] as Methods;

    const { parameters, responses, operationId } = val[method];
    // 出参
    let { name, type } = responseType(responses);
    let importName = name;
    name && console.log(name);
    // 入参
    let paramObj = requestType(parameters);
    let importNames: Array<string> = paramObj.importNames;

    str = `    "${key}": {
        method: "${method}";
        parameters:${paramObj.params},
        paramsList:${JSON.stringify(paramObj.reqType)}
        operationId:"${operationId}",
        data: ${
            type === "array"
                ? `Array<${importName ? importName : null}>`
                : importName
                ? importName
                : null
        };
    };`;

    importName && importNames.push(handleSpecialSymbol(importName));

    return {
        str,
        method,
        url: key,
        requestImportNames: importNames,
        parameters: paramObj.params,
        reqType: paramObj.reqType,
        backParams:
            type === "array"
                ? `Array<${importName ? importName : null}>`
                : importName
                ? importName
                : null,
        operationId,
        responseImportNames: importName
            ? [handleSpecialSymbol(importName)]
            : [],
        importName: importNames,
    };
};

/**
 * 当前swagger所有的接口 写入文件夹
 * @param interfaceObj 接口对象
 * @param options 接口对象
 */
export const completePathAll = async (
    paths: IDocBack["paths"],
    options?: IAllInterface["options"]
) => {
    let newOptions = {
        rootPath: "./",
        name: "name",
        ...(options || {}),
    };

    let str = "";
    let importSet = new Set();
    let pathInfoList = [];
    for (let key in paths) {
        let onePath = completePath(key, paths[key]);
        onePath.importName.map(
            (el) => el && importSet.add(exchangeZhToEn(el).str)
        );
        pathInfoList.push(onePath);
        str += onePath.str + "\n";
    }
    let importList = Array.from(importSet.values()) as Array<string>;
    str = `import {${importList.join(",")}} from './interface.d';
export interface pathsObj {\n${str}}`;

    // 当前服务所有请求函数
    let fnStr = currentServiceFn(
        pathInfoList as Array<
            Omit<
                CompletePathBack,
                | "importName"
                | "str"
                | "requestImportNames"
                | "responseImportNames"
            >
        >,
        importList
    );

    try {
        await new Promise((resolve, reject) => {
            fs.mkdir(
                [newOptions.rootPath, newOptions.name].join("/"),
                { recursive: true },
                (err: any) => {
                    if (!err) {
                        resolve(1);
                    } else {
                        reject(err);
                    }
                }
            );
        });

        await Promise.all([
            new Promise((resolve, reject) => {
                fs.writeFile(
                    [newOptions.rootPath, newOptions.name, "paths.ts"].join(
                        "/"
                    ),
                    str,
                    (err) => {
                        if (err) reject(err);
                        resolve(null);
                    }
                );
            }),
            new Promise((resolve, reject) => {
                fs.writeFile(
                    [newOptions.rootPath, newOptions.name, "function.ts"].join(
                        "/"
                    ),
                    fnStr,
                    (err) => {
                        if (err) reject(err);
                        resolve(null);
                    }
                );
            }),
        ]);
        console.log("over", global.options.apiDocList, "--");
        outputApi();
    } catch (error) {}
};

/**
 * 处理出参相关
 * @param responses 出参
 * @returns
 */
export const responseType = (
    responses: IDocPathsParams["responses"]
): { name: string; type: string } => {
    let dto = null;
    let type;
    if (responses && responses?.[200]?.schema) {
        if (responses[200].schema?.$ref) {
            dto = responses?.[200].schema.$ref.split("/")[2];
        }
        if (responses[200].schema?.items) {
            dto = responses[200].schema.items.$ref
                ? responses[200].schema.items.$ref.split("/")[2]
                : null;
            type = responses[200].schema.type;
        }
    }

    return { name: handleSpecialSymbol(dto), type };
};

/**
 * 处理入参相关
 * @param parameters
 */

export const requestType = (
    parameters: IDocPathsParams["parameters"]
): {
    params: string;
    importNames: Array<string>;
    reqType: Record<"query" | "body" | "formData" | "path", boolean>;
} => {
    // 上传文件
    let formData = parameters.filter((el) => el.in === "formData");
    // 请求body
    let body = parameters.filter((el) => el.in === "body");
    // url上search
    let query = parameters.filter((el) => el.in === "query");
    // 路由上的参数
    let path = parameters.filter((el) => el.in === "path");
    let collectNames = new Set();
    let queryStr = query.reduce(
        (a: string, b: IDocPathsParamsItem) =>
            `${a}"${b.name}": ${switchType(
                b.type,
                undefined,
                "strict",
                undefined
            )};`,
        ""
    );

    let pathStr = path.reduce(
        (a: string, b: IDocPathsParamsItem) =>
            `${a}${b.name}: ${switchType(
                b.type,
                undefined,
                "strict",
                undefined
            )};`,
        ""
    );

    let bodyStr = body.reduce((a: string, b: IDocPathsParamsItem) => {
        if (b?.schema) {
            let name = switchType(
                b.type,
                b.schema?.$ref?.split("/")[2] || null,
                "strict",
                (name) => {
                    collectNames.add(handleSpecialSymbol(name));
                }
            );
            if (b.schema?.type === "array") {
                let type = b.schema?.items?.$ref
                    ? exchangeZhToEn(name).str
                    : b.schema?.items?.type;

                return `Array<${
                    varType.includes(type) ? type : `Partial<${type}>`
                }>;`;
            } else {
                let type = exchangeZhToEn(name).str;
                return `${
                    varType.includes(type) ? type : `Partial<${type}>`
                };\n`;
            }
        }
    }, "");

    let formDataStr = formData.reduce(
        (a: string, b: IDocPathsParamsItem) => `FormData;\n`,
        ""
    );
    return {
        params: `{${
            queryStr
                ? `
            query:{
                ${queryStr}
            };`
                : ""
        }${
            pathStr
                ? `
            path:{
                ${pathStr}
            }`
                : ""
        }${
            bodyStr
                ? `
            body:${bodyStr}
            `
                : ""
        }${formDataStr ? `formData: ${formDataStr}` : ""}
        }`,
        reqType: {
            query: !!queryStr,
            path: !!pathStr,
            body: !!bodyStr,
            formData: !!formDataStr,
        },
        importNames: Array.from(collectNames.values()) as string[],
    };
};
