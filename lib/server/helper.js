"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exchangeZhToEn = exports.translateAndChangeChinese = exports.collectChinese = void 0;
const path = require("path");
/**
 * 收集所有中文列表
 */
const collectChinese = (values) => {
    let chineseSet = new Set();
    values.map((item) => {
        for (let key in item?.data) {
            let all = [...key.matchAll(/[\u4e00-\u9fa5]+/g)].map((el) => el[0]);
            all.map((el) => chineseSet.add(el));
        }
        for (let key in item?.paths) {
            let val = item.paths[key];
            let method;
            for (method in val) {
                let dto = "";
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
                            : "";
                    }
                }
                let all = [...dto.matchAll(/[\u4e00-\u9fa5]+/g)].map((el) => el[0]);
                all.map((el) => chineseSet.add(el));
            }
        }
    });
    return Array.from(chineseSet.values());
};
exports.collectChinese = collectChinese;
const translateAndChangeChinese = (values, zhToEnMap) => {
    values.map((item) => {
        for (let key in item?.data) {
            let replaceStr = exports.exchangeZhToEn(key, zhToEnMap);
            if (item.data[key].properties) {
                for (let key2 in item.data[key].properties) {
                    //
                    let replaceStr2 = exports.exchangeZhToEn(key2, zhToEnMap);
                    let result = item.data[key].properties[key2];
                    if (result.$ref) {
                        result.$ref = exports.exchangeZhToEn(result.$ref, zhToEnMap).str;
                    }
                    if (result?.items?.$ref) {
                        item.data[key].properties[key2].items.$ref = exports.exchangeZhToEn(result.items.$ref, zhToEnMap).str;
                    }
                    if (replaceStr2.hasZh) {
                        item.data[key].properties[replaceStr2.str] = result;
                        delete item.data[key].properties[key2];
                    }
                    else {
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
            let method;
            for (method in val) {
                let result = val[method];
                if (result &&
                    result.responses &&
                    result.responses[200] &&
                    result.responses[200].schema) {
                    if (result.responses[200].schema.$ref) {
                        result.responses[200].schema.$ref = exports.exchangeZhToEn(result.responses[200].schema.$ref, zhToEnMap).str;
                    }
                    if (result.responses[200].schema.items) {
                        val[method].responses[200].schema.items.$ref = exports.exchangeZhToEn(result.responses[200].schema.items.$ref, zhToEnMap).str;
                    }
                }
                val[method] = result;
            }
            item.paths[key] = val;
        }
        // console.log(JSON.stringify(item.data, null, 2), "paths");
    });
};
exports.translateAndChangeChinese = translateAndChangeChinese;
/**
 * 根据中英文映射对象，替换掉中文部分，返回新的字符串
 * @param str 待修改的字符串
 * @param zhToEnMap 中英文映射对象
 */
const exchangeZhToEn = (str, zhToEnMap) => {
    if (typeof str !== "string")
        return {
            hasZh: false,
            str: "",
        };
    let list = [...str.matchAll(/[\u4e00-\u9fa5]+/g)].map((el) => el[0]);
    list.map((el) => {
        let val = zhToEnMap[el];
        if (val)
            str = str.replace(new RegExp(el), val);
    });
    return {
        hasZh: list.length > 0,
        str,
    };
};
exports.exchangeZhToEn = exchangeZhToEn;
//# sourceMappingURL=helper.js.map