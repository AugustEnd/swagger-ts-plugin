import { startCreate, defaultValue } from "../server/index";
const path = require("path");

const execute = async () => {
    await startCreate({
        ...defaultValue,
        outputPath: path.resolve(__dirname, "../../"),
        serverList: [
            "zhiyi-app",
        ],
        appUrl: "http://eureka.test.com:1111/eureka/apps",
    });
};

execute();
