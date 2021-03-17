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
