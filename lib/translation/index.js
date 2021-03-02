"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitArray = exports.getTranslateJson = exports.getTranslateInfo = void 0;
const https = require("https");
const http = require("http");
const fs = require("fs");
const md5 = require("md5");
const paths = require("path");
const common_1 = require("../utils/common");
/**
 * 获取中文转英文翻译
 * @param values
 */
async function getTranslateInfo(values, options) {
    let translationObj = exports.getTranslateJson(paths.resolve(options.outputPath, "swagger2ts/translation.json"));
    // 过滤掉已翻译的
    values = values.filter((el) => !translationObj.hasOwnProperty(el));
    const { maxLimit, appid, secretKey } = options?.fanyi?.baidu;
    let qList = exports.splitArray(values, maxLimit);
    let salt = Math.floor(Math.random() * 1e10);
    // 这里的一秒调用一次接口，犹豫第三方接口限制
    async function loop(index) {
        let q = qList[index];
        let sign = md5(appid + q + salt + secretKey);
        try {
            let msg = await new Promise((resolve, reject) => {
                https.get(`https://fanyi-api.baidu.com/api/trans/vip/translate?q=${encodeURI(q)}&from=zh&to=en&appid=${appid}&salt=${salt}&sign=${sign}`, (val) => {
                    val.setEncoding("utf8");
                    let rawData = "";
                    val.on("data", (chunk) => {
                        rawData += chunk;
                    });
                    val.on("end", () => {
                        try {
                            let result = JSON.parse(rawData);
                            const { trans_result = [] } = result;
                            // 把翻译的信息存到translationObj；
                            trans_result.map((el) => {
                                translationObj[el.src] = el.dst
                                    .split(/\s+/)
                                    .reduce((a, b) => a +
                                    common_1.handleSpecialSymbol(b
                                        .substr(0, 1)
                                        .toUpperCase() +
                                        b
                                            .substr(1)
                                            .toLowerCase()), "");
                            });
                            setTimeout(() => {
                                resolve(JSON.parse(rawData));
                            }, 1000);
                        }
                        catch (error) {
                            reject(error);
                        }
                    });
                    val.on("error", (error) => {
                        reject(error);
                    });
                });
            });
            if (index + 1 < qList.length) {
                loop(index + 1);
            }
            else {
                Promise.resolve("完成");
            }
        }
        catch (error) {
            Promise.resolve("失败");
        }
    }
    if (qList.length > 0) {
        await loop(0);
        // 判断文件swagger2ts是否存在，不存在则创建
        if (!fs.existsSync(paths.resolve(options.outputPath, "/swagger2ts"))) {
            fs.mkdirSync(paths.resolve(options.outputPath, "swagger2ts"));
        }
        // 把翻译的内容写入
        await new Promise((resolve, reject) => {
            // 判断 'swagger2ts文件是否存在
            fs.writeFile(paths.resolve(options.outputPath, "swagger2ts/translation.json"), JSON.stringify(translationObj, null, 4), (error) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve("写入成功");
                }
            });
        });
    }
    return translationObj;
}
exports.getTranslateInfo = getTranslateInfo;
/**
 * 获取上次翻译的信息
 * @param uri 上一次缓存的翻译路径
 */
const getTranslateJson = (uri) => {
    try {
        let file = fs.readFileSync(uri);
        return JSON.parse(file);
    }
    catch (error) {
        return {};
    }
};
exports.getTranslateJson = getTranslateJson;
/**
 * 根据最大长度限制，拆分成多个query
 * @param list
 * @param maxLimit
 * @example splitArray(['123','12','2'],4) // ['123','122']
 */
const splitArray = (list, maxLimit) => {
    let splitList = [];
    // 临时字符串
    let arr = "";
    for (let val of list) {
        if (val.length > maxLimit)
            continue;
        let str = arr === "" ? val : arr + "\n" + val;
        if (str.length > maxLimit) {
            splitList.push(arr);
            arr = val;
        }
        else {
            arr = str;
        }
    }
    if (arr)
        splitList.push(arr);
    return splitList;
};
exports.splitArray = splitArray;
//# sourceMappingURL=index.js.map