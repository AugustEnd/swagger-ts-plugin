import { IBuildFnProps, IBuildFnBack } from "./index.d";
import * as paths from "path";
import * as fs from "fs";

export const buildFn = ({
    method,
    url,
    operationId,
    parameters,
    backParams,
    reqType,
}: IBuildFnProps): IBuildFnBack => {
    let queryInfo = reqType.query
        ? `for(let key in query){
let val = query[key as keyof typeof query];
search = search ? (search + '&' + val).toString() : val.toString();
}
query = ${reqType.body ? "body ||" : ""} {} as any;`
        : "";
    let fnStr = `export const ${operationId} = (params:${parameters}):Promise<${backParams}> => {
        let { ${reqType.query ? "query, " : ""}${
        reqType.path ? "path, " : ""
    } ${reqType.formData ? "formData, " : ""}${
        reqType.body ? "body" : ""
    } } = params;
        let url = "${url}";
        ${
            reqType.path
                ? `if( path ) {
            url = pathAddToUrl(url, path);
        }`
                : ""
        }
        ${
            method.toLowerCase() === "post"
                ? `let search = '';
            ${queryInfo}
        url = url + (search?'?'+search:'');
        `
                : ""
        }
        return http.${method}(url,${
        method === "get"
            ? reqType.query
                ? "query"
                : ""
            : reqType.formData
            ? "formData"
            : reqType.body
            ? "body"
            : ""
    }) as any;
    };\n`;
    return {
        operationId,
        url,
        fnStr,
    };
};

export const currentServiceFn = (
    list: Array<IBuildFnProps>,
    importList: Array<string>
): string => {
    let fnIds: Array<string> = [];
    // 路由和operationId映射；
    let urlToIdmaps: { [key: string]: string } = {};

    let str = list.reduce((prev, next) => {
        let { fnStr, operationId, url } = buildFn(next);
        fnIds.push(operationId);
        urlToIdmaps[operationId] = url;
        return (prev += fnStr);
    }, "");

    return `import {${importList.join(",")}} from './interface.d';
        import tmsRequest, { TmsAxiosInterface } from 'tms-request';

    type ResetTmsAxiosInterface = Required<TmsAxiosInterface>;

    const newReq = tmsRequest as ResetTmsAxiosInterface;

    let http = newReq.create({
        timeout: 500000,
    });

    // 把动态路由加入到url中
    const pathAddToUrl = (url: string, pathObj: any): string => {
        let reqList = [...url.matchAll(/\{[0-9A-Za-z]+\}/g)].map((el) => el[0]);

        return reqList.reduce(
            (prev, next) =>
                prev.replace(
                    new RegExp(next),
                    pathObj[next.slice(1, next.length - 1)]
                ),
            url
        );
    };
    ${str} ${exportMaps(urlToIdmaps)} ${exportFn(fnIds)}`;
};

export const exportMaps = (obj: any) => {
    return `export const urlMaps = ${JSON.stringify(obj)}\n`;
};

export const exportFn = (ids: Array<string>): string => {
    global.options.outputPath;
    return `export default {
        ${ids.join(",")}
    }`;
};

export const exportApi = () => {
    return `${getApiImport()}
let a = {
    saveUploadFileInfoUsingPOST_1: "/sds/sdf/{sd}",
};

interface APIType {
    fsService: {
        "/sds/sdf/{sd}": typeof fsService.saveUploadFileInfoUsingPOST_1;
    };
}

let APIs: APIType = {
    fsService: {
        ["/sds/sdf/{sd}"]:
            fsService.saveUploadFileInfoUsingPOST_1,
    },
};

APIs.fsService["/sds/sdf/{sd}"]

function API<T>(this: any, http: T): T & Record<ServiceGather, ServiceType> {
    type K = T & Record<ServiceGather, ServiceType>;
    let newHttp = http as K;

    let service = {
        smsService: {
            //
            '/sdda/sdf/{dsd}': {},
        },
        fsService: {
            '/sdda/sdf/{dsd}': {},
        },
    };
    for (let key in service) {
        newHttp[key as ServiceGather] = service[key as ServiceGather];
    }
    return newHttp;
}
    `;
};

export const getApiImport = () => {
    let list = global.options.apiDocList;
    return list.reduce(
        (prev, next) =>
            (prev += `import ${humpName(
                next.serviceName
            )}, { urlMaps } from './${next.serviceName}/function';`),
        ""
    );
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

export const outputApi = () => {
    let str = exportApi();
    fs.writeFile(
        paths.resolve(global.options.outputPath, "swagger2ts/request.ts"),
        str,
        (err) => {
            console.log(err);
        }
    );
};

// export const ${operationId} = (params:${parameters}):Promise<${backParams}> => {
//     // 把动态路由加入到url中
//     const pathAddToUrl = (url: string, pathObj: any): string => {
//         let reqList = [...url.matchAll(/\{[0-9A-Za-z]+\}/g)].map((el) => el[0]);

//         return reqList.reduce(
//             (prev, next) =>
//                 prev.replace(
//                     new RegExp(next),
//                     pathObj[next.slice(1, next.length - 1)]
//                 ),
//             url
//         );
//     };

//     let { query, path, formData, body } = params;
//     let url = "${url}";
//     if( path ) {
//         url = pathAddToUrl(url, path);
//     }
//     if("post"){
//         let search = '';
//         for(let key in query){
//             let val = query[key]
//             search = search ? search + '&' + val : val;
//         }
//         url = url + (search?'?'+search:'');
//         query = body || {} as any;
//     }
//     return http[method](url,query) as any;
// }
