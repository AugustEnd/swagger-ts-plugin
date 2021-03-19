import * as paths from "path";
import { delDir } from "../utils/common";
import { handleServiceUrl } from "../handleStr/interface/index";
import * as parser from "fast-xml-parser";
import * as http from "http";
// 类型
import { IServiceProps } from "../index.d";
import { IEurekaBack } from "./index.d";

/**
 * 获取完成用户填写的完整服务地址
 * @returns
 */
const completeServiceList = async () => {
    const { outputPath } = global.options;
    let serviceArr: Array<IServiceProps> = [];
    // 所有服务信息
    const { data: appList } = await getAllServiceList();

    // 获取所有服务请求前完整信息，包含服务名称和服务ip
    serviceArr = handleServiceUrl(appList);

    // // 删除当前路径下所有文件(除了ignore中包含的文件)，删除缓存文件，每次使用最新
    // delDir(paths.resolve(outputPath || (+__dirname as any), "./swagger2ts"), {
    //     deleteCurrPath: false,
    //     ignore: [
    //         paths.resolve(
    //             (outputPath || +__dirname) as any,
    //             "./swagger2ts/translation.json"
    //         ),
    //         paths.resolve(
    //             (outputPath || +__dirname) as any,
    //             "./swagger2ts/request.ts"
    //         ),
    //     ],
    // });
    return serviceArr;
};

/**
 * 获取eureka上服务列表
 * @returns 返回服务地址
 */

export const getAllServiceList = async (): Promise<{
    data: Array<IEurekaBack>;
}> => {
    let url = global.options.appUrl || "http://eureka.dev.com:1111/eureka/apps";

    try {
        const msg = (await new Promise((resolve, reject) => {
            http.get(url, (val: any) => {
                resolve(val);
            });
        })) as any;

        msg.setEncoding("utf8");

        let rawData = "";

        msg.on("data", (chunk: any) => {
            rawData += chunk;
        });

        return await new Promise((resolve, reject) => {
            msg.on("end", () => {
                resolve({
                    data:
                        (parser.parse(rawData).applications
                            .application as Array<IEurekaBack>) || [],
                });
            });
        });
    } catch (error) {
        console.log(`报错：\x1B[31m${error}\x1B[39m`);
        return Promise.resolve({ data: [] });
    }
};

export default completeServiceList;
