export type TJson<T> = {
    name: string;
    value?: T;
    array?: TJson<T>[] | undefined;
};


export function findValueByName<T>(vars: TJson<T>[], targetName: string): T | undefined {
    for (const varItem of vars) {
        if (varItem.name === targetName) {
            return varItem.value;
        }
        if (varItem.array) {
            const foundValue = findValueByName(varItem.array, targetName);
            if (foundValue) {
                return foundValue;
            }
        }
    }
    return undefined;
}

export function parseJson(json: any, parentLabel: string = 'Root'): TJson<string>[] {
    const items: TJson<string>[] = [];
    if (typeof json === 'object' && json !== null) {
        for (const key in json) {
            const value = json[key];
            const item: TJson<string> = { name: key };
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

