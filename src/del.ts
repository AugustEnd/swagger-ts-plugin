import { delDir } from "./utils/common";
import * as paths from "path";
// 删除当前路径下所有文件
delDir(paths.resolve(paths.resolve(__dirname, "../swagger2ts")));
delDir(paths.resolve(paths.resolve(__dirname, "../lib")));
console.log('test')
