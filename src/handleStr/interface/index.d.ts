export type JavaType =
    | "array"
    | "boolean"
    | "string"
    | "integer"
    | "number"
    | "object"
    | undefined;

export interface IAllInterface {
    interfaceObj: {
        data: { [key: string]: any };
        serviceName: string;
        paths: { [key: string]: any };
    };
    options?: {
        path?: string;
        name?: string;
    };
}