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
exports.defaultValue = exports.startCreate = void 0;
const path = require("path");
const index_1 = require("../handleStr/interface/index");
const request_1 = require("../utils/request");
const common_1 = require("../utils/common");
const index_2 = require("../handleStr/paths/index");
// getApiJSON().then((e) => {
//     completeInterfaceAll(e);
// });
function startCreate({ outputPath, serverList, appUrl, }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (serverList.length === 0)
            return;
        let serviceArr = [];
        // 所有服务信息
        const { data: appList } = (yield request_1.getAllServiceList({
            url: appUrl || "http://eureka.dev.com:1111/eureka/apps",
        }));
        serviceArr = serverList
            .filter((el) => typeof el !== "string")
            .concat(index_1.handleServiceUrl(appList, serverList.filter((el) => typeof el === "string")));
        // 删除当前路径下所有文件
        common_1.delDir(path.resolve(outputPath || +__dirname, "./swagger2ts"), {
            deleteCurrPath: false,
        });
        Promise.all(serviceArr.map((item) => request_1.getSimpleServiceData({
            serviceName: item.serviceName,
            serviceUrl: item.serviceUrl,
        }))).then((values) => {
            // 过滤出错的服务
            values
                .filter((el) => el)
                .map((el) => {
                index_1.completeInterfaceAll(el, {
                    name: el.serviceName,
                    path: path.resolve(outputPath || +__dirname, "./swagger2ts"),
                });
                index_2.completePathAll(el.paths, {
                    name: el.serviceName,
                    path: path.resolve(outputPath || +__dirname, "./swagger2ts"),
                });
            });
        });
    });
}
exports.startCreate = startCreate;
exports.defaultValue = {
    outputPath: path.resolve(__dirname, "../../"),
    serverList: [],
};
//# sourceMappingURL=index.js.map