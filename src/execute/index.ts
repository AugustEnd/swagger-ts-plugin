import { startCreate, defaultValue } from "../server/index";
const path = require("path");

startCreate({
    ...defaultValue,
    outputPath: path.resolve(__dirname, "../../"),
    serverList: [
        {
            serviceName: "xxx-service",
            serviceUrl: "http://172.20.37.153:8200/api/",
        },
        "pv-io",
        "omp-service",
        "master-data-service",
    ],
});
