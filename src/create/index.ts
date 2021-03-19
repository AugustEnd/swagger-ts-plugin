const path = require("path");

import {
    completeInterfaceAll,
    handleServiceUrl,
} from "../handleStr/interface/index";

import { completePathAll } from "../handleStr/paths/index";

import completeServiceList from "../http/serviceInfo";
// 辅助方法
import {
    collectChinese,
    translateAndChangeChinese,
    exchangeZhToEn,
} from "./helper";
// 翻译
import { getTranslateInfo } from "../translation/index";

import { getData } from "../http/getData";
// 类型
import { ISwaggerProps, IServiceProps } from "../index.d";

export async function startCreate(options: ISwaggerProps) {
    const { outputPath, serverList, appUrl } = options;
    global.options = options;
    if (serverList.length === 0) return;
    try {
        let values = await getData();

        //收集所有中文
        let chineseList = collectChinese(values);

        // console.log(chineseList, "chineseList");
        // 拿到所有中英文映射对象
        let translateJson = await getTranslateInfo(chineseList);
        // 把values对象中所有中文字段转换成英文
        translateAndChangeChinese(values);

        // 输出到swagger2ts文件夹中
        const paths = await Promise.all(
            values.map(async (el) => {
                try {
                    // 所有定义
                    await completeInterfaceAll(el, {
                        name: el.serviceName,
                        rootPath: path.resolve(
                            outputPath || +__dirname,
                            "./swagger2ts"
                        ),
                    });
                    // console.log(
                    //     Object.keys(el.data),
                    //     Object.keys(el.data).length
                    // );
                    await completePathAll(el.paths, {
                        name: el.serviceName,
                        rootPath: path.resolve(
                            outputPath || +__dirname,
                            "./swagger2ts"
                        ),
                    });
                    return Promise.resolve();
                } catch (error) {
                    return Promise.reject(error);
                }
            })
        );
        return Promise.resolve("转换完成");
    } catch (error) {
        return Promise.reject(error);
    }
}
