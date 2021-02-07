"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./server/index");
/**
 * @param outputPath 输出地址
 * @param serverList 服务列表地址
 */
module.exports = class Swapper2TsPlugin {
    constructor(props) {
        this.options = Object.assign(Object.assign({}, index_1.defaultValue), (props || {}));
    }
    apply(compiler) {
        compiler.hooks.done.tap("Hello World Plugin", (stats) => {
            console.log("swaggerr转ts插件开始工作");
            index_1.startCreate(this.options);
        });
    }
    // 暴露当前方法目的是，使用者可以主动触发命令
    build() {
        return index_1.startCreate(this.options);
    }
};
//# sourceMappingURL=index.js.map