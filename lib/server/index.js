"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultValue = exports.startCreate = void 0;
const path = require("path");
const index_1 = require("../handleStr/interface/index");
const request_1 = require("../utils/request");
const common_1 = require("../utils/common");
const index_2 = require("../handleStr/paths/index");
// 辅助方法
const helper_1 = require("./helper");
// 翻译
const index_3 = require("../translation/index");
/**
 * 项目主要方法
 * @param options 配置参数
 */
async function startCreate(options) {
    const { outputPath, serverList, appUrl } = options;
    if (serverList.length === 0)
        return;
    let serviceArr = [];
    try {
        // 所有服务信息
        const { data: appList } = (await request_1.getAllServiceList({
            url: appUrl || "http://eureka.dev.com:1111/eureka/apps",
        }));
        // 获取所有服务请求前完整信息，包含服务名称和服务ip
        serviceArr = serverList
            .filter((el) => typeof el !== "string")
            .concat(index_1.handleServiceUrl(appList, serverList.filter((el) => typeof el === "string")));
        // 删除当前路径下所有文件(除了ignore中包含的文件)，删除缓存文件，每次使用最新
        common_1.delDir(path.resolve(outputPath || +__dirname, "./swagger2ts"), {
            deleteCurrPath: false,
            ignore: [
                path.resolve(outputPath || +__dirname, "./swagger2ts/translation.json"),
            ],
        });
        // 已获取到所有服务数据
        const values = await Promise.all(serviceArr.map((item) => request_1.getSimpleServiceData({
            serviceName: item.serviceName,
            serviceUrl: item.serviceUrl,
        })));
        //收集所有中文
        let chineseList = helper_1.collectChinese(values);
        // 拿到所有中英文映射对象
        let translateJson = await index_3.getTranslateInfo(chineseList, options);
        // 把values对象中所有中文字段转换成英文
        helper_1.translateAndChangeChinese(values, translateJson);
        // 输出到swagger2ts文件夹中
        const paths = await Promise.all(values
            .filter((el) => el)
            .map(async (el) => {
            try {
                await index_1.completeInterfaceAll(el, {
                    name: el.serviceName,
                    path: path.resolve(outputPath || +__dirname, "./swagger2ts"),
                });
                await index_2.completePathAll(el.paths, {
                    name: el.serviceName,
                    path: path.resolve(outputPath || +__dirname, "./swagger2ts"),
                });
                return Promise.resolve();
            }
            catch (error) {
                return Promise.reject(error);
            }
        }));
        return Promise.resolve("转换完成");
    }
    catch (error) {
        return Promise.reject(error);
    }
}
exports.startCreate = startCreate;
exports.defaultValue = {
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
//# sourceMappingURL=index.js.map