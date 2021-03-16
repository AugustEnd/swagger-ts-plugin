// import { startCreate, defaultValue } from "../server/index";
import { startCreate } from "../create/index";
import defaultValue from "../create/defaultValue";
const path = require("path");

const execute = async () => {
    await startCreate({
        ...defaultValue,
        outputPath: path.resolve(__dirname, "../../"),
        serverList: ["sms-service", "trialpartner-web"],
        appUrl: "http://eureka.test.com:1111/eureka/apps",
    });
};

execute();
