"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const handleStr_1 = require("./utils/handleStr");
const request_1 = require("./utils/request");
function startCreate({ outputPath, serverList, appUrl, fileName, }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (serverList.length === 0)
            return;
        let serviceArr = [];
        if (typeof serverList[0] === "string") {
            const { data: appList } = (yield request_1.getAllServiceList({
                url: appUrl || "http://eureka.dev.com:1111/eureka/apps",
            }));
            serviceArr = handleStr_1.handleServiceUrl(appList, serverList);
        }
        else {
            serviceArr = serverList;
        }
        Promise.all(serviceArr.map((item) => request_1.getSimpleServiceData({
            serviceName: item.serviceName,
            serviceUrl: item.serviceUrl,
        }))).then((values) => {
            values.map((el) => {
                handleStr_1.completeInterfaceAll(el.data, {
                    name: el.serviceName,
                    fileName,
                    path: path.resolve(outputPath || +__dirname, "./swagger2ts"),
                });
            });
        });
    });
}
const defaultValue = {
    outputPath: path.resolve(__dirname, "../../"),
    serverList: [],
    fileName: "[name].swagger2.d.ts",
};
startCreate(Object.assign(Object.assign({}, defaultValue), { outputPath: path.resolve(__dirname, "../"), serverList: ["trialpartner-web", "sms-service"] }));
/**
 * @param outputPath 输出地址
 * @param serverList 服务列表地址
 */
module.exports = class Swapper2TsPlugin {
    constructor(props) {
        this.options = Object.assign(Object.assign({}, defaultValue), (props || {}));
    }
    apply(compiler) {
        compiler.hooks.done.tap("Hello World Plugin", (stats) => {
            console.log("swaggerr转ts插件开始工作");
            startCreate(this.options);
        });
    }
};
//# sourceMappingURL=index.js.map