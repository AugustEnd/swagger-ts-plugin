const fs = require("fs");
const paths = require("path");
/**
 * @param key 含有处理特殊字符«» 【】 {} [] () （），如a«b«c»» 转换成a_b_c;
 */
export const handleSpecialSymbol = (key: string | any) => {
    return typeof key !== "string"
        ? key
        : key
              .replace(/[\«|\(|\（|\【|\[|\{]/g, "_")
              .replace(/[\»|\)|\）|\】|\]|\}]/g, "")
              .replace(
                  /[\?|\？|\,|\，|\.|\。|\-|\/|\、|\=|\'|\"|\’|\‘|\“|\”|\s]/g,
                  ""
              );
};

/**
 * 删除文件
 * @param path string;
 * @param options.deleteCurrPath 默认true 删除所有文件和文件夹，保存当前文件，false保留当前文件夹
 * @param options.ignore 不删除某些文件或者文件夹
 */

export const delDir = (
    path: string,
    options?: { deleteCurrPath: boolean; ignore: Array<string> }
) => {
    let files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach((file: string) => {
            let curPath = paths.resolve(path, file);
            if (fs.statSync(curPath).isDirectory()) {
                if (options && options?.ignore.includes(curPath)) return;
                delDir(curPath); //递归删除文件夹
            } else {
                if (options && options?.ignore.includes(curPath)) return;
                fs.unlinkSync(curPath); //删除文件
            }
        });
        (!options || options.deleteCurrPath === true) && fs.rmdirSync(path); // 删除文件夹自身
    }
};

export const translateToEn = () => {};
