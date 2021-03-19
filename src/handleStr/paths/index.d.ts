import { Methods } from "../../index.d";
export interface requestBack {
    query?: {
        [key: string]: string | boolean;
    };
    paths?: {
        [key: string]: string | boolean;
    };
    formData?: FormData;
    body?: unknown;
}

export interface CompletePathBack {
    str: string;
    method: Methods;
    url: string;
    parameters: string;
    backParams: string;
    operationId: string;
    requestImportNames: Array<string>;
    responseImportNames: Array<string>;
    importName: Array<string>;
    reqType: Record<"query" | "body" | "formData" | "path", boolean>;
    urlHeader?: string;
}
