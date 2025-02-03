import { GlobalVars } from '../extension';
import { findArrayByName, findValueByName, parseJson, TJson } from '../helpers/json';

export class dsNodeManger {
    private urlNodeManager: string = "";
    HWs: TJson<string>[]= [];

    public hws(): TJson<string>[] {
        return this.HWs;
    }

    // @log()
    private loadHWs(urlNodeManager: string): Promise<TJson<string>[]> {
        return new Promise((resolve, reject) => {
            fetch(`${urlNodeManager}/v1/hws/`)
            .then(response => response.json())
            .then(data => {
                this.HWs = parseJson(data);
                resolve(this.HWs);
            }).catch(reject);
        });
    }

    public getHWs(): Promise<TJson<string>[]> {
        return new Promise((resolve, reject) => {
            findArrayByName<string>(GlobalVars.getGlobalVars(), "GLOBAL")?.then(res => {
                findArrayByName<string>(res, "endpoints")?.then(res => {
                    findArrayByName<string>(res, "NodeManager")?.then(res => {
                        findValueByName(res, "user_api_url")?.then(res => {
                            this.urlNodeManager = res;
                            this.loadHWs(res).then(res => {
                                resolve(res);
                            }).catch(reject);
                        });
                    });
                });
            });
        });
    }
}
