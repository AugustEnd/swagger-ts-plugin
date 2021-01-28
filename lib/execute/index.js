"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../server/index");
const path = require("path");
index_1.startCreate(Object.assign(Object.assign({}, index_1.defaultValue), { outputPath: path.resolve(__dirname, "../../"), serverList: [
        {
            serviceName: "tms-client",
            serviceUrl: "http://172.20.37.153:8200/api/",
        },
    ] }));
//# sourceMappingURL=index.js.map