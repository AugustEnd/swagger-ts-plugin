import { startCreate, defaultValue } from "../server/index";
const path = require("path");

startCreate({
    ...defaultValue,
    outputPath: path.resolve(__dirname, "../../"),
    serverList: ["site-service", "omp-service"],
    appUrl: "http://eureka.test.com:1111/eureka/apps",
});
