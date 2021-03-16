export type Methods = "get" | "post" | "delete" | "put";

interface IData {
    parameters: any;
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
    summary: string;
}

export type MethodInfo = Record<Methods, IData>;

export type IPaths = {
    [key: string]: MethodInfo;
};
