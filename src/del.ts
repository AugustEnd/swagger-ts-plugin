import { delDir } from "./utils/common";
const path = require("path");
// 删除当前路径下所有文件
delDir(path.resolve(path.resolve(__dirname, "../swagger2ts")));
delDir(path.resolve(path.resolve(__dirname, "../lib")));
