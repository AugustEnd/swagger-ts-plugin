"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleServiceUrl = exports.completeInterfaceAll = exports.completeInterface = exports.tsConcat = exports.noteConcat = exports.typeMap = void 0;
const common_1 = require("../../utils/common");
const fs = require("fs");
/**
 * 映射后端语言类型与ts类型
 * @param param0
 * @param use 是否启用严格模式，正常模式 string|null or number|null等，严格模式 string or number等
 */
const typeMap = ({ type, items, $ref, }, use) => {
    const childProps = (items?.type && exports.typeMap(items, "strict")) ||
        items?.$ref?.split("/")[2] ||
        $ref?.split("/")[2] ||
        null;
    switch (type) {
        case "string":
            return use === "strict" ? "string" : "string | null";
        case "number":
            return use === "strict" ? "number" : "number | null";
        case "integer":
            return use === "strict" ? "number" : "number | null";
        case "boolean":
            return use === "strict" ? "boolean" : "boolean | null";
        case "array":
            return use === "strict"
                ? `Array<${common_1.handleSpecialSymbol(childProps)}>`
                : `Array<${common_1.handleSpecialSymbol(childProps)}> | null`;
        case "object":
            return `any`;
        default:
            return common_1.handleSpecialSymbol(childProps) || "any";
    }
};
exports.typeMap = typeMap;
/**
 * 拼接注释字符串
 * @param param0
 * @param prevStr 上次保存的string
 */
const noteConcat = ({ key, val }, prevStr) => {
    return `${prevStr}\n * @param ${key} (${exports.typeMap(val, "strict")}) ${val.description || "暂无注释"}`;
};
exports.noteConcat = noteConcat;
/**
 * 拼接接口字符串
 * @param param0
 * @param prevStr 上次保存的string
 */
const tsConcat = ({ key, val }, prevStr) => {
    return `${prevStr}\n    ${key}: ${exports.typeMap(val)};`;
};
exports.tsConcat = tsConcat;
/**
 * 一个完整的接口字符串（注释+接口）
 * @param key
 * @param val
 */
const completeInterface = (key, val) => {
    let noteStr = "";
    let tsStr = "";
    for (let key in val.properties) {
        let propsVal = val.properties[key];
        let keyName = common_1.handleSpecialSymbol(key);
        noteStr = exports.noteConcat({ key: keyName, val: propsVal }, noteStr);
        tsStr = exports.tsConcat({ key: keyName, val: propsVal }, tsStr);
    }
    return `/**${noteStr}\n */ \nexport interface ${common_1.handleSpecialSymbol(key)} {${tsStr}\n}
`;
};
exports.completeInterface = completeInterface;
/**
 * 当前swagger所有的接口 写入文件夹
 * @param interfaceObj 接口对象
 * @param options 接口对象
 */
const completeInterfaceAll = async (interfaceObj, options) => {
    let newOptions = {
        path: "./",
        name: "name",
        ...(options || {}),
    };
    let str = "";
    for (let key in interfaceObj.data) {
        str += exports.completeInterface(key, interfaceObj.data[key]) + "\n";
    }
    try {
        await new Promise((resolve, reject) => {
            fs.mkdir([newOptions.path, newOptions.name].join("/"), { recursive: true }, (err) => {
                if (!err) {
                    resolve(1);
                }
                else {
                    reject(err);
                }
            });
        });
        fs.writeFile([newOptions.path, newOptions.name, "interface.d.ts"].join("/"), str, () => { });
    }
    catch (error) { }
};
exports.completeInterfaceAll = completeInterfaceAll;
// const apiFileInfo = (paths)=>{
// }
const handleServiceUrl = (appList, serverList) => {
    let mySet = new Set(serverList);
    return appList
        .filter((el) => {
        if (Reflect.apply(Object.prototype.toString, [], el.instance) ===
            "[object Array]" &&
            el.instance.length > 0) {
            el.instance = el.instance[0];
        }
        return mySet.has(el.instance.vipAddress);
    })
        .map((el) => ({
        serviceName: el.instance.vipAddress,
        serviceUrl: el.instance.homePageUrl,
    }));
};
exports.handleServiceUrl = handleServiceUrl;
//# sourceMappingURL=index.js.map