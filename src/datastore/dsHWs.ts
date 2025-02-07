import { APINodeManager } from "../api/NodeManager";
import { GlobalVars } from "../extension";
import { findInMap, mapToJsonArray, TJson } from "../helpers/json";

export class HW {
    uuid: string;
    name: string;
    ipaddr: string | undefined;
    status: string | undefined;
    constructor(uuid: string, name: string, ipaddr?: string, status?: string) {
        this.uuid = uuid;
        this.name = name;
        this.ipaddr = ipaddr;
        this.status = status;
    }
}

export class dsHWs {

    nm: APINodeManager = new APINodeManager();
    HWs: TJson<HW>[] = [];

    public gethws(): Promise<TJson<HW>[]> {
        return new Promise((resolve, reject) => {
            resolve(this.HWs);
        });
    }
    public getVMs(hw: TJson<HW>): Promise<TJson<HW>[]> {
        return new Promise((resolve, reject) => {
            if (GlobalVars.globalVarsEndPoints.has("NodeManager")) {
                const urlNodeManager = GlobalVars.globalVarsEndPoints.get("NodeManager");
                const user_api_url = urlNodeManager.get("user_api_url");
                if (user_api_url) {
                    this.nm.loadInstances(user_api_url).then(res => {
                        this.HWs = [];
                        res.forEach((value: Map<any, any>, key: string) => {
                            let instance_type = value.get("instance_type");
                            if (instance_type && instance_type === "VM") {
                                let compute_ipv4 = findInMap(value,"compute_ipv4");
                                if (compute_ipv4 && hw.value?.ipaddr === compute_ipv4) {
                                    let hwl: TJson<HW> = { key: `${value.get("name")} - ${value.get("status")}` };
                                    hwl.value = new HW(value.get("uuid"), value.get("name"), findInMap(value,"ipv4"), value.get("status"));
                                    this.HWs.push(hwl);
                                }
                            }
                        });
                        resolve(this.HWs);
                    }).catch(reject);
                }
            }
        });
    }

    public getHWs(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (GlobalVars.globalVarsEndPoints.has("NodeManager")) {
                const urlNodeManager = GlobalVars.globalVarsEndPoints.get("NodeManager");
                const user_api_url = urlNodeManager.get("user_api_url");
                if (user_api_url) {
                    this.nm.loadHWs(user_api_url).then(res => {
                        this.HWs = [];
                        res.forEach((value: Map<any, any>, key: string) => {
                            if (value.has("name")) {
                                let hw = new HW(value.get("uuid"), value.get("name"));
                                hw.ipaddr = findInMap(value, "ipv4");
                                hw.status = findInMap(value, "status");
                                let hwl: TJson<HW> = { key: `${hw.name} - ${key}`, value: hw, array: mapToJsonArray<HW>(value) };
                                this.HWs.push(hwl);
                                resolve();
                            }
                        });
                    }).catch(reject);
                }
            }
        });
    }
}
