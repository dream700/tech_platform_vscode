export type TJson<T> = {
    key: string;
    value?: T;
    array?: TJson<T>[] | undefined;
};

export function findArrayByName<T>(vars: TJson<T>[] | undefined, targetName: string): Promise<TJson<T>[] | undefined> {
    if (vars !== undefined) {
        for (const varItem of vars) {
            if (varItem.key === targetName) {
                return Promise.resolve(varItem.array);
            }
        }
    }
    return Promise.reject();
}

export function findValueByName<T>(vars: TJson<T>[] | undefined, targetName: string): Promise<T> | undefined {
    if (vars !== undefined) {
        for (const varItem of vars) {
            if (varItem.key === targetName) {
                if (varItem.value === undefined) {
                    return Promise.reject();
                }
                return Promise.resolve(varItem.value);
            }
            if (varItem.array) {
                const foundValue = findValueByName(varItem.array, targetName);
                if (foundValue) {
                    return Promise.resolve(foundValue);
                }
            }
        }
    }
    return Promise.reject();
}

export function parseJson<T>(json: any, parentLabel: string = 'Root'): TJson<T>[] {
    const items: TJson<T>[] = [];
    if (typeof json === 'object' && json !== null) {
        for (const key in json) {
            const value = json[key];
            const item: TJson<T> = { key: key };
            if (typeof value === 'object' && value !== null) {
                item.array = parseJson(value, key);
            } else {
                // item.name += `: ${value}`;
                item.value = value;
            }
            items.push(item);
        }
    }
    return items;
}

type Mapping = { [k: string]: number | string | boolean | null | Mapping };
export const objectToMap = (obj: Mapping) => {
    let map = new Map();
    for (const [k, v] of Object.entries(obj)) {
        const isNativeObj = typeof v === "object" && v !== null;
        map.set(k, isNativeObj ? objectToMap(v) : v);
    }
    return map;
};

export const mapToJsonArray = <T>(map: Map<any, any>) => {
    return Array.from(map.entries()).map(([key, value]) => {
        const jsonEntry: TJson<T> = { key };
        if (value instanceof Map) {
            jsonEntry.array = mapToJsonArray(value);
        } else {
            jsonEntry.value = value;
        }
        return jsonEntry;
    });
};

export function findInMap(
    map: Map<any, any>,
    key: any
): any | undefined {
    if (map.has(key)) {
        return map.get(key);
    }
    for (const [k, v] of map.entries()) {
        if (v instanceof Map) {
            const result = findInMap(v, key);
            if (result !== undefined) {
                return result;
            }
        }
    }
    return undefined; 
}

export function formatDateString(dateString?: string): string {
    if (dateString === undefined) {
        return 'undefined';
    }
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); 
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}
