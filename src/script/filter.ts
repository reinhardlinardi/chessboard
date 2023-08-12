export type Fn<T> = () => (T[]);
export type Filter<T> = (t: T) => boolean;


export function New<T>(list: T[], ...filters: Filter<T>[]): Fn<T> {
    let fn = () => list;
    for(const f of filters) {
        fn = () => fn().filter(f);
    }
    return fn;
}
