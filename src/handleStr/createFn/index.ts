import { IBuildFnProps } from "./index.d";
export const buildFn = ({
    method,
    url,
    operationId,
    parameters,
    backParams,
}: IBuildFnProps): string => {
    return `
    export const ${operationId} = (params:${parameters}):Promise<${backParams}> => {
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
        
        let { query, path, formData, body } = params;
        let url = "${url}";
        if( path ) {
            url = pathAddToUrl(url, path);
        }
        ${
            method.toLowerCase() === "post"
                ? `let search = '';
        for(let key in query){
            let val = query[key]
            search = search ? search + '&' + val : val;
        }
        url = url + (search?'?'+search:'');
        query = body || {} as any;`
                : ""
        }


        

        return http.${method}(url,query) as any;
    }`;
};
