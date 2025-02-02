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
            // if (varItem.array) {
            //     const foundValue = findArrayByName(varItem.array, targetName).then((res) => 
            //         {if (res) {
            //             return Promise.resolve(res);    
            //         }});
            //     if (foundValue) {
            //         return Promise.resolve(foundValue);
            //     }
            // }
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

export function parseJson(json: any, parentLabel: string = 'Root'): TJson<string>[] {
    const items: TJson<string>[] = [];
    if (typeof json === 'object' && json !== null) {
        for (const key in json) {
            const value = json[key];
            const item: TJson<string> = { key: key };
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

