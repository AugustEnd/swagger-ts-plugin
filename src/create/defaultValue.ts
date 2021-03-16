import { ISwaggerProps } from "../index.d";
import * as paths from "path";

const defaultValue: ISwaggerProps = {
    outputPath: paths.resolve(__dirname, "../../"),
    serverList: [],
    apiDocList: [],
    fanyi: {
        baidu: {
            appid: "20210301000711374",
            secretKey: "qyjxl2zU20BwQ8sfdyxt",
            maxLimit: 2000,
        },
    },
};

export default defaultValue;
