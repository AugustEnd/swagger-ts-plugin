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
exports.completePathAll = exports.completePath = void 0;
const common_1 = require("../../utils/common");
const fs = require("fs");
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
const completePath = (key, val) => {
    let str = "";
    let importName = "";
    let method;
    for (method in val) {
        let dto = null;
        let type = "";
        if (val[method] &&
            val[method].responses &&
            val[method].responses[200] &&
            val[method].responses[200].schema) {
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
        importName = common_1.handleSpecialSymbol(dto);
        str = `    "${key}": {
        method: "${method}";
        data: ${type === "array"
            ? `Array<${importName ? importName : null}>`
            : importName
                ? importName
                : null};
    };`;
    }
    return {
        str,
        importName,
    };
};
exports.completePath = completePath;
/**
 * 当前swagger所有的接口 写入文件夹
 * @param interfaceObj 接口对象
 * @param options 接口对象
 */
const completePathAll = (paths, options) => __awaiter(void 0, void 0, void 0, function* () {
    let newOptions = Object.assign({ path: "./", name: "name" }, (options || {}));
    let str = "";
    let importSet = new Set();
    for (let key in paths) {
        let onePath = exports.completePath(key, paths[key]);
        onePath.importName && importSet.add(onePath.importName);
        str += onePath.str + "\n";
    }
    str = `import {${Array.from(importSet.values()).join(",")}} from './interface.d';
interface pathsObj {\n${str}}`;
    try {
        yield new Promise((resolve, reject) => {
            fs.mkdir([newOptions.path, newOptions.name].join("/"), { recursive: true }, (err) => {
                if (!err) {
                    resolve(1);
                }
                else {
                    reject(err);
                }
            });
        });
        fs.writeFile([newOptions.path, newOptions.name, "paths.ts"].join("/"), str, () => { });
    }
    catch (error) { }
});
exports.completePathAll = completePathAll;
//# sourceMappingURL=index.js.map