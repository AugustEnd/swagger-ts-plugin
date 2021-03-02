export interface ParamsBaidu {
    from: string;
    to: string;
    trans_result: Array<{
        dst: string;
        src: string;
    }>;
    error_code: number;
}
