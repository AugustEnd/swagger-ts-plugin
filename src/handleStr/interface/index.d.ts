import { IDocBack } from "../../http/index.d";

export type JavaType =
    | "array"
    | "boolean"
    | "string"
    | "integer"
    | "number"
    | "object"
    | undefined;

export interface IAllInterface {
    interfaceObj: IDocBack;
    options?: {
        rootPath?: string;
        name?: string;
    };
}
