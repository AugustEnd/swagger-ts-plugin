import { IBuildFnProps, IBuildFnBack } from "./index.d";
import * as paths from "path";
import * as fs from "fs";
import { Methods } from "../../index.d";

export const buildFn = ({
    method,
    url,
    operationId,
    summary,
    parameters,
    backParams,
    reqType,
    urlHeader,
    urlAsId,
}: IBuildFnProps): IBuildFnBack => {
    let queryInfo = reqType.query
        ? `for(let key in query){
let val = query[key as keyof typeof query] as any;
search = search ? (search + '&' + key+'='+val).toString() : (key+'='+val).toString();
}`
        : "";
    let fnStr = `

/**
 * 备注：${summary}
 */
export const ${operationId} = function(this:any,params:${parameters}):Promise<${backParams}> {
    let { ${reqType.query ? "query, " : ""}${reqType.path ? "path, " : ""} ${
        reqType.formData ? "formData, " : ""
    }${reqType.body ? "body" : ""} } = params;
        let url = "${url}";
        ${
            reqType.path
                ? `if( path ) {
            url = pathAddToUrl(url, path);
        }`
                : ""
        }
        let search = '';
        ${queryInfo}
        url = url + (search?'?'+search:'');
        
        return this.__http.${method}( "/${urlHeader}" + url,${urlQ(
        method,
        reqType
    )}) as any;
    };\n`;
    return {
        operationId,
        url,
        fnStr,
        urlAsId,
        method,
    };
};

export const urlQ = (method: string, reqType: IBuildFnProps["reqType"]) => {
    if (method === "get") {
        return "";
    } else {
        if (reqType.formData) {
            return "formData";
        } else {
            return reqType.body ? "body" : "";
        }
    }
};

export const currentServiceFn = (
    list: Array<IBuildFnProps>,
    importList: Array<string>
): string => {
    let fnIds: Array<{
        operationId: string;
        url: string;
        urlAsId: boolean;
        method: Methods;
    }> = [];
    // 路由和operationId映射；
    let urlToIdmaps: { [key: string]: string } = {};

    let str = list.reduce((prev, next) => {
        let { fnStr, operationId, url, urlAsId, method } = buildFn(next);
        fnIds.push({ operationId, url, urlAsId, method });
        urlToIdmaps[operationId] = url;
        return (prev += fnStr);
    }, "");

    return `import {${importList.join(",")}} from './interface.d';

// 把动态路由加入到url中
const pathAddToUrl = (url: string, pathObj: any): string =>
    url.replace(
        /{[0-9A-Za-z]+}/g,
        (val) => pathObj[val.slice(1, val.length - 1)]
    );
    
${str}
    ${exportFn(fnIds)}`;
};

// ${exportSwitchMaps(urlToIdmaps)}
// ${exportMaps(urlToIdmaps)}

// operationId对应函数的类型
export const exportSwitchMaps = (obj: any) => {
    return `export interface __switchMaps {${Object.keys(obj).reduce(
        (prev, next) => (prev += `"${obj[next]}": typeof ${next};`),
        ""
    )}}`;
};

// operationId与url映射
export const exportMaps = (obj: any) => {
    return `export const __urlMaps = ${JSON.stringify(obj)}\n`;
};

export const exportFn = (
    ids: Array<{
        operationId: string;
        url: string;
        urlAsId: boolean;
        method?: Methods;
    }>
): string => {
    global.options.outputPath;

    return `export default function<T> (http:T) {
        return {
        ${ids
            .concat({ operationId: "http", url: "__http", urlAsId: true })
            .reduce((prev, next) => {
                // 使用id作为标识
                // return prev ? prev + ", " + next.operationId : next.operationId;
                // 使用url作为标识
                let extra = !next.urlAsId ? "|" + next.method : "";
                return prev
                    ? `${prev}, "${next.url}${extra}":${next.operationId}`
                    : `"${next.url}${extra}":${next.operationId}`;
            }, "")}
        }
    }`;
};

export const exportApi = () => {
    let list = global.options.apiDocList;
    return `${getApiImport()}
export interface APIType {
    ${list.reduce(
        (prev, next) =>
            (prev += `${humpName(
                next.serviceName
            )}: ReturnType<typeof ${humpName(next.serviceName)}Fn>;\n`),
        ""
    )}
}

export default function ServiceRequest<T>(http: T): APIType {
${list.reduce(
    (prev, next) =>
        (prev += `const ${humpName(next.serviceName)} = ${humpName(
            next.serviceName
        )}Fn<T>(http);\n`),
    ""
)}
    return {
        ${list.map((el) => humpName(el.serviceName)).join(",")}
    };
}`;
};

// import 所有服务的方法
export const getApiImport = () => {
    let list = global.options.apiDocList;
    return list.reduce(
        (prev, next) =>
            (prev += `import ${humpName(next.serviceName)}Fn from './${
                next.serviceName
            }/function';\n`),
        ""
    );
};

// 定义
export const interfaceApisType = () => {
    let list = global.options.apiDocList;
    const foreachObj = (maps: any, name: string): string => {
        let objStr = "";
        for (let key in maps) {
            objStr += `"${maps[key]}": typeof ${name}.${key};\n`;
        }
        return objStr;
    };
    return `interface APIServiceType {
        fsService: {
            "/sds/sdf/{sd}": typeof fsService.saveUploadFileInfoUsingPOST_1;
        };`;
};

export const humpName = (name: string): string => {
    let str = name.toLowerCase();
    return str
        .split("-")
        .map((el) => el.replace(/\W/g, ""))
        .reduce(
            (prev, next) =>
                prev ? prev + (next[0].toUpperCase() + next.slice(1)) : next,
            ""
        );
};

export const outputApi = async () => {
    let str = exportApi();
    try {
        await new Promise((resolve, reject) => {
            fs.writeFile(
                paths.resolve(global.options.outputPath, "request.ts"),
                str,
                (err) => {
                    if (err) reject(err);
                    resolve(null);
                }
            );
        });
    } catch (error) {
        Promise.reject(error);
    }
};
