"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./utils/common");
const path = require("path");
// 删除当前路径下所有文件
common_1.delDir(path.resolve(path.resolve(__dirname, "../swagger2ts")), {
    deleteCurrPath: false,
    ignore: [path.resolve(__dirname, "../swagger2ts/translation.json")],
});
common_1.delDir(path.resolve(path.resolve(__dirname, "../lib")));
//# sourceMappingURL=del.js.map