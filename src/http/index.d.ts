import { type } from "node:os";
import { JavaType, Methods } from "../index.d";
export interface IEurekaItem {
    instanceId: string;
    hostName: string;
    app: string;
    ipAddr: string;
    status: string;
    overriddenstatus: string;
    port: number;
    securePort: number;
    countryId: number;
    homePageUrl: string;
    statusPageUrl: string;
    healthCheckUrl: string;
    vipAddress: string;
    secureVipAddress: string;
    isCoordinatingDiscoveryServer: boolean;
    lastUpdatedTimestamp: number;
    lastDirtyTimestamp: number;
    actionType: string;
}
export interface IEurekaBack {
    name: string;
    instance: Array<IEurekaItem> | IEurekaItem;
}

export interface IDocDefinitionsItem {
    type: JavaType;
    description?: string;
    format?: string;
    $ref?: string;
    properties?: IDocDefinitions;
}

export interface IDocDefinitions {
    [key: string]: IDocDefinitionsItem;
}

export type IDocPathsParamsItem = {
    description: string;
    in: "header" | "body" | "query" | "formData" | "path";
    name: string;
    required: boolean;
    type?: "string" | "file" | "boolean" | undefined;
    schema?: {
        $ref?: string;
        type?: "object" | "array";
        items?: {
            $ref?: string;
            type?: string;
        };
    };
};

export type IDocPathsParams = {
    operationId: string;
    parameters: Array<IDocPathsParamsItem>;
    responses: {
        200: {
            description: string;
            schema?: {
                $ref?: string;
                type?: string;
                items?: {
                    $ref?: string;
                };
            };
        };
    };
};

export type IDocPaths = Record<Methods, IDocPathsParams>;

export interface IDocBack {
    data: IDocDefinitions;
    serviceName: string;
    paths: {
        [key: string]: IDocPaths;
    };
}
