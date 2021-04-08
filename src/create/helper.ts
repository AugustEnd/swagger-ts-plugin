import * as paths from "path";
import * as fs from "fs";
//类型
import { Methods } from "../index.d";
import { handleSpecialSymbol } from "../utils/common";

/**
 * 收集所有中文列表
 */

export const collectChinese = (values: any): Array<string> => {
    let chineseSet = new Set();
    values.map((item: any) => {
        for (let key in item?.data) {
            (
                handleSpecialSymbol(key).match(/[\u4e00-\u9fa5]+/g) || []
            ).map((el: any) => chineseSet.add(el));
        }
        for (let key in item?.paths) {
            let val = item.paths[key];
            let method: Methods;
            for (method as any in val) {
                let dto = "";
                if (val[method]?.responses?.[200]?.schema) {
                    const { $ref, items } = val[
                        method
                    ]?.responses?.[200]?.schema;
                    if ($ref) {
                        dto = $ref.split("/")[2];
                    }
                    if (items) {
                        dto = items.$ref ? items.$ref.split("/")[2] : "";
                    }
                }

                dto.replace(/[\u4e00-\u9fa5]+/g, (el) => {
                    chineseSet.add(el);
                    return el;
                });
            }
        }
    });
    return Array.from(chineseSet.values()) as Array<string>;
};

export const traverseOriginData = (item: any) => {};

export const translateAndChangeChinese = (values: any) => {
    values.map((item: any) => {
        for (let key in item?.data) {
            let newKey = handleSpecialSymbol(key);
            let replaceStr = exchangeZhToEn(newKey);
            if (item.data[key].properties) {
                for (let key2 in item.data[key].properties) {
                    //
                    let replaceStr2 = exchangeZhToEn(key2);
                    let result = item.data[key].properties[key2];
                    if (result.$ref) {
                        result.$ref = exchangeZhToEn(result.$ref).str;
                    }
                    if (result?.items?.$ref) {
                        item.data[key].properties[
                            key2
                        ].items.$ref = exchangeZhToEn(result.items.$ref).str;
                    }
                    if (replaceStr2.hasZh) {
                        item.data[key].properties[replaceStr2.str] = result;
                        delete item.data[key].properties[key2];
                    } else {
                        item.data[key].properties[key2] = result;
                    }
                }
            }

            if (replaceStr.hasZh) {
                item.data[replaceStr.str] = item.data[key];
                delete item.data[key];
            }
        }
        for (let key in item?.paths) {
            let val = item.paths[key];
            let method: Methods;
            for (method as any in val) {
                let result = val[method];
                if (
                    result &&
                    result.responses &&
                    result.responses[200] &&
                    result.responses[200].schema
                ) {
                    if (result.responses[200].schema.$ref) {
                        result.responses[200].schema.$ref = exchangeZhToEn(
                            result.responses[200].schema.$ref
                        ).str;
                    }
                    if (result.responses[200].schema.items) {
                        val[
                            method
                        ].responses[200].schema.items.$ref = exchangeZhToEn(
                            result.responses[200].schema.items.$ref
                        ).str;
                    }
                }
                val[method] = result;
            }
            item.paths[key] = val;
        }
        // console.log(JSON.stringify(item.data, null, 2), "paths");
    });
    // fs.writeFile(
    //     paths.resolve(__dirname, `./a.json`),
    //     JSON.stringify(values, null, 4),
    //     () => {}
    // );
};

/**
 * 根据中英文映射对象，替换掉中文部分，返回新的字符串
 * @param str 待修改的字符串
 * @param zhToEnMap 中英文映射对象
 */
export const exchangeZhToEn = (str: string) => {
    const zhToEnMap = global.swagger2global?.transitions || {};
    if (typeof str !== "string")
        return {
            hasZh: false,
            str: "",
        };
    let list = str.match(/[\u4e00-\u9fa5]+/g) || [];
    list.map((el) => {
        let val = zhToEnMap[el];
        if (val) str = str.replace(new RegExp(el), val);
    });
    return {
        hasZh: list.length > 0,
        str,
    };
};
