const path = require("path");
const fs = require("fs");
import { completeInterfaceAll } from "../handleStr/interface/index";

import { completePathAll } from "../handleStr/paths/index";
import { outputApi } from "../handleStr/createFn/index";
// 辅助方法
import { collectChinese, translateAndChangeChinese } from "./helper";
// 翻译
import { getTranslateInfo } from "../translation/index";

import { getData } from "../http/getData";
// 类型
import { ISwaggerProps } from "../index.d";

export async function startCreate(options: ISwaggerProps) {
  const { outputPath, serverList, appUrl } = options;
  global.options = options;
  if (serverList?.length === 0) {
    console.log("\x1B[31m%s\x1B[0m", `未传入服务列表，swagger2ts插件EXIT`);
    return;
  }
  try {
    let values = await getData();

    //收集所有中文
    let chineseList = collectChinese(values);
    // console.log(chineseList, "chineseList");
    // console.log(chineseList, "chineseList");
    // 拿到所有中英文映射对象
    let translateJson = await getTranslateInfo(chineseList);
    // 把values对象中所有中文字段转换成英文
    translateAndChangeChinese(values);
    // fs.writeFile(
    //     path.resolve(__dirname, `./a.json`),
    //     JSON.stringify(values, null, 4),
    //     () => {}
    // );
    // 输出到swagger2ts文件夹中
    const paths = await Promise.all(
      values.map(async (el) => {
        try {
          // 所有定义
          await completeInterfaceAll(el, {
            name: el.serviceName,
            rootPath: outputPath,
          });
          // console.log(
          //     Object.keys(el.data),
          //     Object.keys(el.data).length
          // );
          await completePathAll(el.paths, {
            name: el.serviceName,
            rootPath: path.resolve(outputPath),
          });

          return Promise.resolve();
        } catch (error) {
          return Promise.reject(error);
        }
      })
    );
    await outputApi();
    return Promise.resolve("转换完成");
  } catch (error) {
    return Promise.reject(error);
  }
}
