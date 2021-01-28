"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delDir = exports.handleSpecialSymbol = void 0;
const fs = require("fs");
/**
 * @param key 含有处理特殊字符«»，如a«b«c»» 转换成a_b_c;
 */
const handleSpecialSymbol = (key) => {
    return typeof key !== "string"
        ? key
        : key
            .replace(/«/g, "_")
            .replace(/»/g, "")
            .replace(/\(/g, "_")
            .replace(/\)/g, "")
            .replace(/[\?|\,|\.]/g, "");
};
exports.handleSpecialSymbol = handleSpecialSymbol;
/**
 * 删除文件
 * @param path string;
 * @param options.deleteCurrPath 默认true 删除所有文件和文件夹，保存当前文件，false保留当前文件夹
 */
const delDir = (path, options) => {
    let files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach((file) => {
            let curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
                exports.delDir(curPath); //递归删除文件夹
            }
            else {
                fs.unlinkSync(curPath); //删除文件
            }
        });
        (!options || options.deleteCurrPath === true) && fs.rmdirSync(path); // 删除文件夹自身
    }
};
exports.delDir = delDir;
//# sourceMappingURL=common.js.map