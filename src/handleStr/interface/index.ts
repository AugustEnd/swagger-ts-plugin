import { handleSpecialSymbol } from "../../utils/common";
import * as fs from "fs";

// 类型
import { IAllInterface } from "./index.d";
import { JavaType } from "../../index.d";
import { IServiceProps } from "../../index.d";
import { IEurekaBack, IEurekaItem } from "../../http/index.d";
import { unlink } from "node:fs";
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
    use?: "strict",
    fn?: (name: string) => void
): string => {
    const childProps =
        (items?.type && typeMap(items, "strict", fn)) ||
        items?.$ref?.split("/")[2] ||
        $ref?.split("/")[2] ||
        null;
    return switchType(type, childProps, use, fn);
};

export const switchType = (
    type: JavaType,
    childProps: unknown,
    use: "strict",
    fn?: (name: string) => void
) => {
    switch (type) {
        case "string":
            return use === "strict" ? "string" : "string | null";
        case "number":
            return use === "strict" ? "number" : "number | null";
        case "integer":
            return use === "strict" ? "number" : "number | null";
        case "boolean":
            return use === "strict" ? "boolean" : "boolean | null";
        case "file":
            return use === "strict" ? "FormData" : "FormData | null";
        case "array":
            let name = handleSpecialSymbol(childProps);
            fn && fn(name);
            return use === "strict"
                ? `Array<${name}>`
                : `Array<${name}> | null`;
        case "object":
            return `any`;
        default:
            let nameDefault = handleSpecialSymbol(childProps);
            fn && fn(nameDefault);
            return nameDefault || "any";
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
    // console.log(key);
    return `/**${noteStr}\n */ \nexport interface ${handleSpecialSymbol(
        key
    )} {${tsStr}\n}
`;
};

/**
 * 当前swagger所有的接口 写入文件夹
 * @param interfaceObj 接口对象
 * @param options 接口对象
 */
export const completeInterfaceAll = async (
    interfaceObj: IAllInterface["interfaceObj"],
    options?: IAllInterface["options"]
) => {
    let newOptions = {
        rootPath: "./",
        name: "name",
        ...(options || {}),
    };

    let str = "";
    for (let key in interfaceObj.data) {
        // console.log(key, "key");
        str += completeInterface(key, interfaceObj.data[key]) + "\n";
    }

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

        fs.writeFile(
            [newOptions.rootPath, newOptions.name, "interface.d.ts"].join("/"),
            str,
            () => {}
        );
    } catch (error) {}
};

// 处理 serverList中只传服务地址的情况

export const handleServiceUrl = (
    appList: Array<IEurekaBack>
): Array<IServiceProps> => {
    let { serverList } = global.options;
    // 保存，存在服务ip的数据
    let arrFilter = serverList.filter(
        (el) => typeof el !== "string"
    ) as Array<IServiceProps>;

    serverList = serverList.filter((el) => typeof el === "string");

    let mySet = new Set(serverList);
    return appList
        .filter((el) => {
            if (Array.isArray(el.instance) && el.instance.length > 0) {
                el.instance = el.instance[0];
            }
            el.instance = el.instance as IEurekaItem;
            return mySet.has(el.instance.vipAddress);
        })
        .map((el) => {
            if (Array.isArray(el.instance) && el.instance.length > 0) {
                el.instance = el.instance[0];
            }
            el.instance = el.instance as IEurekaItem;

            return {
                serviceName: el.instance.vipAddress,
                serviceUrl: el.instance.homePageUrl,
            };
        })
        .concat(arrFilter);
};
