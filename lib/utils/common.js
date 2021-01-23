"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSpecialSymbol = void 0;
/**
 * @param key 含有处理特殊字符«»，如a«b«c»» 转换成a_b_c;
 */
const handleSpecialSymbol = (key) => {
    return typeof key !== "string"
        ? key
        : key.replace(/«/g, "_").replace(/»/g, "");
};
exports.handleSpecialSymbol = handleSpecialSymbol;
//# sourceMappingURL=common.js.map