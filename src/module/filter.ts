export type Filter<T> = (t: T) => boolean;


export function filter<T>(list: T[], ...filters: Filter<T>[]): T[] {
    let res: T[] = [...list];
    
    for(const f of filters) res = res.filter(f);
    return res;
}
