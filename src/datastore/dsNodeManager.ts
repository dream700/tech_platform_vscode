import { GlobalVars } from '../extension';
import { findArrayByName, findValueByName, parseJson, TJson } from '../helpers/json';
import { HW } from './dsHWs';

export class dsNodeManger {
    HWs: TJson<HW>[]= [];

    public hws(): TJson<HW>[] {
        return this.HWs;
    }

    // @log()
    private loadHWs(urlNodeManager: string): Promise<TJson<HW>[]> {
        return new Promise((resolve, reject) => {
            fetch(`${urlNodeManager}/v1/hws/`)
            .then(response => response.json())
            .then(data => {
                this.HWs = parseJson(data);
                resolve(this.HWs);
            }).catch(reject);
        });
    }

    public getHWs(): Promise<TJson<HW>[]> {
        return new Promise((resolve, reject) => {
            if (GlobalVars.globalVarsEndPoints.has("NodeManager")) {
                const urlNodeManager = GlobalVars.globalVarsEndPoints.get("NodeManager");
                const user_api_url = urlNodeManager.get("user_api_url");
                if (user_api_url) {
                    this.loadHWs(user_api_url).then(res => {
                        resolve(res);
                    }).catch(reject);
                }
            }
        });
    }
}
