import { Methods } from "../../index.d";
export interface IBuildFnProps {
    method: Methods;
    operationId: string;
    parameters: string;
    url: string;
    backParams: string;
    reqType: Record<"query" | "body" | "formData" | "path", boolean>;
}

export interface IBuildFnBack {
    operationId: string;
    url: string;
    fnStr: string;
}
