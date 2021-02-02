"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../server/index");
const path = require("path");
index_1.startCreate(Object.assign(Object.assign({}, index_1.defaultValue), { outputPath: path.resolve(__dirname, "../../"), serverList: ["site-service", "omp-service"], appUrl: "http://eureka.test.com:1111/eureka/apps" }));
//# sourceMappingURL=index.js.map