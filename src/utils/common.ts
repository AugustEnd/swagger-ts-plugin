/**
 * @param key 含有处理特殊字符«»，如a«b«c»» 转换成a_b_c;
 */
export const handleSpecialSymbol = (key: string | any) => {
    return typeof key !== "string"
        ? key
        : key.replace(/«/g, "_").replace(/»/g, "");
};
