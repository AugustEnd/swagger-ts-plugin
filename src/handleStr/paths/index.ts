import { handleSpecialSymbol } from "../../utils/common";
const fs = require("fs");
import { Methods } from "../../index.d";
import { IDocPaths } from "../../http/index.d";
import { IAllInterface } from "../interface/index.d";
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
export const completePath = (key: string, val: IDocPaths["any"]) => {
    let str = "";
    let importName = "";
    let method: Methods;
    for (method in val) {
        let dto = null;
        let type = "";
        if (
            val[method] &&
            val[method].responses &&
            val[method].responses[200] &&
            val[method].responses[200].schema
        ) {
            if (val[method].responses[200].schema.$ref) {
                dto = val[method].responses[200].schema.$ref.split("/")[2];
            }
            if (val[method].responses[200].schema.items) {
                dto = val[method].responses[200].schema.items.$ref
                    ? val[method].responses[200].schema.items.$ref.split("/")[2]
                    : null;
                type = val[method].responses[200].schema.type;
            }
        }

        importName = handleSpecialSymbol(dto);
        str = `    "${key}": {
        method: "${method}";
        data: ${
            type === "array"
                ? `Array<${importName ? importName : null}>`
                : importName
                ? importName
                : null
        };
    };`;
    }

    return {
        str,
        importName,
    };
};

/**
 * 当前swagger所有的接口 写入文件夹
 * @param interfaceObj 接口对象
 * @param options 接口对象
 */
export const completePathAll = async (
    paths: IPaths,
    options?: IAllInterface["options"]
) => {
    let newOptions = {
        path: "./",
        name: "name",
        ...(options || {}),
    };

    let str = "";
    let importSet = new Set();
    for (let key in paths) {
        let onePath = completePath(key, paths[key]);
        onePath.importName && importSet.add(onePath.importName);
        str += onePath.str + "\n";
    }

    str = `import {${Array.from(importSet.values()).join(
        ","
    )}} from './interface.d';
export interface pathsObj {\n${str}}`;

    try {
        await new Promise((resolve, reject) => {
            fs.mkdir(
                [newOptions.path, newOptions.name].join("/"),
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

        fs.writeFile(
            [newOptions.path, newOptions.name, "paths.ts"].join("/"),
            str,
            () => {}
        );
    } catch (error) {}
};
