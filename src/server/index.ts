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

    // 所有服务信息
    const { data: appList } = (await getAllServiceList({
        url: appUrl || "http://eureka.dev.com:1111/eureka/apps",
    })) as any;

    serviceArr = serverList
        .filter((el) => typeof el !== "string")
        .concat(
            handleServiceUrl(
                appList,
                serverList.filter((el: any) => typeof el === "string") as any
            )
        ) as any;

    // 删除当前路径下所有文件
    delDir(path.resolve(outputPath || +__dirname, "./swagger2ts"), {
        deleteCurrPath: false,
    });
    try {
        const values: Array<any> = await Promise.all(
            serviceArr.map((item: any) =>
                getSimpleServiceData({
                    serviceName: item.serviceName,
                    serviceUrl: item.serviceUrl,
                })
            )
        );
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
};
