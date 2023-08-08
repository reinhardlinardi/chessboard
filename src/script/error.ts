export interface Error {
    module: string,
    code: string,
    msg: string,
};

export function str(err: Error): string {
    return `[${err.module}] ${err.code}: ${err.msg}`;
}
