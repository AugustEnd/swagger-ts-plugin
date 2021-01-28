export interface IServiceProps {
    serviceName: string;
    serviceUrl: string;
}

export interface ISwaggerProps {
    serverList: Array<string | IServiceProps>;
    outputPath?: string;
    appUrl?: string;
}
