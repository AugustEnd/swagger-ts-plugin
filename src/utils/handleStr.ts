import { handleSpecialSymbol } from "./common";
const fs = require("fs");
type JavaType =
    | "array"
    | "boolean"
    | "string"
    | "integer"
    | "number"
    | "object"
    | undefined;

/**
 * 映射后端语言类型与ts类型
 * @param param0
 * @param use 是否启用严格模式，正常模式 string|null or number|null等，严格模式 string or number等
 */

export const typeMap = (
    {
        type,
        items,
        $ref,
    }: {
        type: JavaType;
        items?: any;
        $ref?: string;
    },
    use?: "strict"
): string => {
    const childProps =
        (items?.type && typeMap(items, "strict")) ||
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
                ? `Array<${handleSpecialSymbol(childProps)}>`
                : `Array<${handleSpecialSymbol(childProps)}> | null`;
        case "object":
            return `any`;
        default:
            return handleSpecialSymbol(childProps) || "any";
    }
};

/**
 * 拼接注释字符串
 * @param param0
 * @param prevStr 上次保存的string
 */

export const noteConcat = (
    { key, val }: { key: string; val: any },
    prevStr: string
) => {
    return `${prevStr}\n * @param ${key} (${typeMap(val, "strict")}) ${
        val.description || "暂无注释"
    }`;
};

/**
 * 拼接接口字符串
 * @param param0
 * @param prevStr 上次保存的string
 */
export const tsConcat = (
    { key, val }: { key: string; val: any },
    prevStr: string
) => {
    return `${prevStr}\n    ${key}: ${typeMap(val)};`;
};

/**
 * 一个完整的接口字符串（注释+接口）
 * @param key
 * @param val
 */
export const completeInterface = (key: string, val: any) => {
    let noteStr = "";
    let tsStr = "";
    for (let key in val.properties) {
        let propsVal = val.properties[key];
        let keyName = handleSpecialSymbol(key);
        noteStr = noteConcat({ key: keyName, val: propsVal }, noteStr);
        tsStr = tsConcat({ key: keyName, val: propsVal }, tsStr);
    }

    return `/**${noteStr}\n */ \nexport interface ${handleSpecialSymbol(
        key
    )} {${tsStr}\n}
`;
};

interface IAllInterface {
    interfaceObj: { [key: string]: any };
    options?: {
        path?: string;
        fileName?: string;
        name?: string;
    };
}

/**
 * 当前swagger所有的接口
 * @param interfaceObj 接口对象
 * @param options 接口对象
 */
export const completeInterfaceAll = async (
    interfaceObj: IAllInterface["interfaceObj"],
    options?: IAllInterface["options"]
) => {
    let newOptions = {
        path: "./",
        name: "name",
        ...(options || {}),
    };
    
    let str = "";
    for (let key in interfaceObj) {
        str += completeInterface(key, interfaceObj[key]) + "\n";
    }

    try {
        if (!fs.existsSync(newOptions.path)) {
            await new Promise((resolve, reject) => {
                fs.mkdir(newOptions.path, { recursive: true }, (err: any) => {
                    if (!err) {
                        resolve(1);
                    } else {
                        reject(err);
                    }
                });
            });
        }
        console.log(
            "文件地址",
            `${newOptions.path}/${newOptions.fileName.replace(
                /\[\S*\]/g,
                newOptions.name
            )}`
        );
        fs.writeFile(
            `${newOptions.path}/${newOptions.fileName.replace(
                /\[\S*\]/g,
                newOptions.name
            )}`,
            str,
            () => {}
        );
    } catch (error) {}
};

export const handleServiceUrl = (
    appList: Array<any>,
    serverList: Array<string>
) => {
    let mySet = new Set(serverList);
    return appList
        .filter((el) => mySet.has(el.instance.vipAddress))
        .map((el) => ({
            serviceName: el.instance.vipAddress,
            serviceUrl: el.instance.homePageUrl,
        }));
};
