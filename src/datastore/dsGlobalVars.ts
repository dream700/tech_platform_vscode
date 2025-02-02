import { TJson, parseJson } from '../helpers/json';

export var globalVars: TJson<string>[] = [];

export class dsGlobalVars {

    public getGlobalVars(): TJson<string>[] {
        return globalVars;
    }

    public loadGlobalVars(): Promise<TJson<string>[]> {
        return new Promise((resolve, reject) => {
            globalVars = [];
            fetch('http://em-user-api.service.cloudcore:10001/v1/global_vars/')
                .then(response => response.json())
                .then(data => {
                    globalVars = parseJson(data);                        
                    resolve(globalVars);
                })
                .catch(reject);
        });
    }
}

