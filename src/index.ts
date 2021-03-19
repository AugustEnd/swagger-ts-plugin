import { startCreate } from "./create/index";
import defaultValue from "./create/defaultValue";
import { ISwaggerProps } from "./index.d";
/**
 * @param outputPath 输出地址
 * @param serverList 服务列表地址
 */
module.exports = class Swapper2TsPlugin {
    options: ISwaggerProps;
    constructor(props: ISwaggerProps) {
        this.options = {
            ...defaultValue,
            ...(props || {}),
        };
        global.options = this.options;
    }
    apply(compiler: any) {
        compiler.hooks.done.tap("Hello World Plugin", (stats: any) => {
            console.log("swaggerr转ts插件开始工作");
            startCreate(this.options);
        });
    }
    // 暴露当前方法目的是，使用者可以主动触发命令
    build() {
        return startCreate(this.options);
    }
};
