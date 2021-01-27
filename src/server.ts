const path = require("path");
import { completeInterfaceAll, handleServiceUrl } from "./utils/handleStr";
import { getSimpleServiceData, getAllServiceList } from "./utils/request";
import { delDir } from "./utils/common";
// getApiJSON().then((e) => {
//     completeInterfaceAll(e);
// });
/**
 * @outputPath 输出文件夹位置
 * @serverList Array<string>服务名称列表，Array<object> 服务所有信息列表
 * @appUrl 服务地址url
 */

interface IServiceProps {
    serviceName: string;
    serviceUrl: string;
}
export interface ISwaggerProps {
    serverList: Array<string | IServiceProps>;
    outputPath?: string;
    appUrl?: string;
    fileName?: string;
}

export async function startCreate({
    outputPath,
    serverList,
    appUrl,
    fileName,
}: ISwaggerProps) {
    if (serverList.length === 0) return;
    let serviceArr: Array<IServiceProps> = [];
    if (typeof serverList[0] === "string") {
        const { data: appList } = (await getAllServiceList({
            url: appUrl || "http://eureka.dev.com:1111/eureka/apps",
        })) as any;

        serviceArr = handleServiceUrl(appList, serverList as any);
    } else {
        serviceArr = serverList as any;
    }

    // 删除当前路径下所有文件
    delDir(path.resolve(outputPath || +__dirname, "./swagger2ts"), {
        deleteCurrPath: false
    });

    Promise.all(
        serviceArr.map((item: any) =>
            getSimpleServiceData({
                serviceName: item.serviceName,
                serviceUrl: item.serviceUrl,
            })
        )
    ).then((values) => {
        values.map((el: any) => {
            completeInterfaceAll(el, {
                name: el.serviceName,
                fileName,
                path: path.resolve(outputPath || +__dirname, "./swagger2ts"),
            });
        });
    });
}

export const defaultValue: ISwaggerProps = {
    outputPath: path.resolve(__dirname, "../../"),
    serverList: [],
    fileName: "[name].swagger2.d.ts",
};
