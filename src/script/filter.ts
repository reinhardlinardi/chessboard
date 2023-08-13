export type Fn<T> = () => (T[]);
export type Filter<T> = (t: T) => boolean;


export function New<T>(list: T[], ...filters: Filter<T>[]): Fn<T> {
    let fn = () => list;
    for(const f of filters) {
        let prev = fn;
        fn = () => prev().filter(f);
    }
    return fn;
}
