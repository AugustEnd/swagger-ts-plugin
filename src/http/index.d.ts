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

export type IDocPaths = Record<
    Methods,
    {
        operationId: string;
        parameters: Array<{
            description: string;
            in: "header" | "body" | "query" | "formData";
            name: string;
            required: boolean;
            type?: "string" | "file" | undefined;
            schema?: {
                $ref?: string;
                type?: "object" | "array";
                items?:
                    | {
                          $ref: string;
                      }
                    | { type: string };
            };
        }>;
    }
>;

export interface IDocBack {
    data: IDocDefinitions;
    serviceName: string;
    paths: IDocPaths;
}
