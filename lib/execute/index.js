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
const index_1 = require("../server/index");
const path = require("path");
const execute = () => __awaiter(void 0, void 0, void 0, function* () {
    yield index_1.startCreate(Object.assign(Object.assign({}, index_1.defaultValue), { outputPath: path.resolve(__dirname, "../../"), serverList: ["site-service", "omp-service"], appUrl: "http://eureka.test.com:1111/eureka/apps" }));
});
execute();
//# sourceMappingURL=index.js.map