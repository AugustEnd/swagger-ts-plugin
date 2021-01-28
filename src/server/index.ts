const path = require("path");
import {
    completeInterfaceAll,
    handleServiceUrl,
} from "../handleStr/interface/index";
import { getSimpleServiceData, getAllServiceList } from "../utils/request";
import { delDir } from "../utils/common";
import { completePathAll } from "../handleStr/paths/index";
// 类型
import { ISwaggerProps, IServiceProps } from "./index.d";

// getApiJSON().then((e) => {
//     completeInterfaceAll(e);
// });

export async function startCreate({
    outputPath,
    serverList,
    appUrl,
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
        deleteCurrPath: false,
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
                path: path.resolve(outputPath || +__dirname, "./swagger2ts"),
            });
            completePathAll(el.paths, {
                name: el.serviceName,
                path: path.resolve(outputPath || +__dirname, "./swagger2ts"),
            });
        });
    });
}

export const defaultValue: ISwaggerProps = {
    outputPath: path.resolve(__dirname, "../../"),
    serverList: [],
};
