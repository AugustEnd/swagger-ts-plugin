"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const path = require("path");
server_1.startCreate(Object.assign(Object.assign({}, server_1.defaultValue), { outputPath: path.resolve(__dirname, "../"), serverList: ["trialpartner-web", "sms-service"] }));
//# sourceMappingURL=execute.js.map