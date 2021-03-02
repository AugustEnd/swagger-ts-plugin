import { delDir } from "./utils/common";
const path = require("path");
// 删除当前路径下所有文件
delDir(path.resolve(path.resolve(__dirname, "../swagger2ts")), {
    deleteCurrPath: false,
    ignore: [path.resolve(__dirname, "../swagger2ts/translation.json")],
});
delDir(path.resolve(path.resolve(__dirname, "../lib")));
