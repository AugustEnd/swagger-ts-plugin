const path = require("path");

import {
    completeInterfaceAll,
    handleServiceUrl,
} from "../handleStr/interface/index";

import { getSimpleServiceData, getAllServiceList } from "../utils/request";
import { delDir } from "../utils/common";
import { completePathAll } from "../handleStr/paths/index";
// 辅助方法
import {
    collectChinese,
    translateAndChangeChinese,
    exchangeZhToEn,
} from "./helper";
// 翻译
import { getTranslateInfo } from "../translation/index";
// 类型
import { ISwaggerProps, IServiceProps } from "./index.d";

/**
 * 项目主要方法
 * @param options 配置参数
 */

export async function startCreate(options: ISwaggerProps) {
    const { outputPath, serverList, appUrl } = options;

    if (serverList.length === 0) return;
    let serviceArr: Array<IServiceProps> = [];
    try {
        // 所有服务信息
        const { data: appList } = (await getAllServiceList({
            url: appUrl || "http://eureka.dev.com:1111/eureka/apps",
        })) as any;

        // 获取所有服务请求前完整信息，包含服务名称和服务ip
        serviceArr = serverList
            .filter((el) => typeof el !== "string")
            .concat(
                handleServiceUrl(
                    appList,
                    serverList.filter(
                        (el: any) => typeof el === "string"
                    ) as any
                )
            ) as any;

        // 删除当前路径下所有文件(除了ignore中包含的文件)，删除缓存文件，每次使用最新
        delDir(path.resolve(outputPath || +__dirname, "./swagger2ts"), {
            deleteCurrPath: false,
            ignore: [
                path.resolve(
                    outputPath || +__dirname,
                    "./swagger2ts/translation.json"
                ),
            ],
        });

        // 已获取到所有服务数据
        const values: Array<any> = await Promise.all(
            serviceArr.map((item: any) =>
                getSimpleServiceData({
                    serviceName: item.serviceName,
                    serviceUrl: item.serviceUrl,
                })
            )
        );

        //收集所有中文
        let chineseList = collectChinese(values);
        // 拿到所有中英文映射对象
        let translateJson = await getTranslateInfo(chineseList, options);
        // 把values对象中所有中文字段转换成英文
        translateAndChangeChinese(values, translateJson);
        // 输出到swagger2ts文件夹中
        const paths = await Promise.all(
            values
                .filter((el: any) => el)
                .map(async (el: any) => {
                    try {
                        await completeInterfaceAll(el, {
                            name: el.serviceName,
                            path: path.resolve(
                                outputPath || +__dirname,
                                "./swagger2ts"
                            ),
                        });
                        await completePathAll(el.paths, {
                            name: el.serviceName,
                            path: path.resolve(
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

export const defaultValue: ISwaggerProps = {
    outputPath: path.resolve(__dirname, "../../"),
    serverList: [],
    fanyi: {
        baidu: {
            appid: "20210301000711374",
            secretKey: "qyjxl2zU20BwQ8sfdyxt",
            maxLimit: 2000,
        },
    },
};
