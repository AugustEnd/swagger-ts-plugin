import { IDocProps } from "../../index.d";

export type JavaType =
    | "array"
    | "boolean"
    | "string"
    | "integer"
    | "number"
    | "object"
    | undefined;

export interface IAllInterface {
    interfaceObj: IDocProps;
    options?: {
        rootPath?: string;
        name?: string;
    };
}
