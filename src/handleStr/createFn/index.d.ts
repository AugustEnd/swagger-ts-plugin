import { Methods } from "../../index.d";
export interface IBuildFnProps {
    method: Methods;
    requestImportNames: Array<string>;
    operationId: string;
    responseImportNames: Array<string>;
    parameters: string;
    url: string;
    backParams: string;
}
