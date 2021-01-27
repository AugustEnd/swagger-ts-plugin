import { startCreate, defaultValue, ISwaggerProps } from "./server";

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
    }
    apply(compiler: any) {
        compiler.hooks.done.tap("Hello World Plugin", (stats: any) => {
            console.log("swaggerr转ts插件开始工作");
            startCreate(this.options);
        });
    }
};
