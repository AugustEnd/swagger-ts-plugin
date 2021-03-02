"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../server/index");
const path = require("path");
const execute = async () => {
    await index_1.startCreate({
        ...index_1.defaultValue,
        outputPath: path.resolve(__dirname, "../../"),
        serverList: [
            "trialpartner-web",
            "sms-service",
            "unm-service",
            "EDC-LAB",
            "iit-sms-service",
        ],
        appUrl: "http://eureka.test.com:1111/eureka/apps",
    });
};
execute();
//# sourceMappingURL=index.js.map