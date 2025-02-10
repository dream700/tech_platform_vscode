import { NodeManagerAPI } from "../api/NodeManager";
import { GlobalVars } from "../extension";
import { findInMap, mapToJsonArray, TJson } from "../helpers/json";

export class Instance {
    uuid: string;
    name: string;
    ipaddr: string | undefined;
    status: string | undefined;
    role: string | undefined;
    constructor(uuid: string, name: string, role?: string, ipaddr?: string, status?: string) {
        this.uuid = uuid;
        this.name = name;
        this.role = role;
        this.ipaddr = ipaddr;
        this.status = status;
    }
}

export class dsInstances {

    nm: NodeManagerAPI = new NodeManagerAPI();
    instances: TJson<Instance>[] = [];

    // public getInstances(): Promise<TJson<Instance>[]> {
    //     return new Promise((resolve) => {
    //         resolve(this.instances);
    //     });
    // }

    public getInstances(): TJson<Instance>[] {
        return this.instances;
    }

    private getVMs(hw: TJson<Instance>): Promise<TJson<Instance>[]> {
        return new Promise((resolve, reject) => {
            if (GlobalVars.globalVarsEndPoints.has("NodeManager")) {
                const urlNodeManager = GlobalVars.globalVarsEndPoints.get("NodeManager");
                const user_api_url = urlNodeManager.get("user_api_url");
                if (user_api_url) {
                    this.nm.loadInstances(user_api_url).then(res => {
                        this.instances = [];
                        res.forEach((value: Map<any, any>, key: string) => {
                            let instance_type = value.get("instance_type");
                            if (instance_type && instance_type === "VM") {
                                let compute_ipv4 = findInMap(value, "compute_ipv4");
                                if (compute_ipv4 && hw.value?.ipaddr === compute_ipv4) {
                                    let hwl: TJson<Instance> = { key: `${value.get("name")} - ${value.get("status")}` };
                                    hwl.value = new Instance(value.get("uuid"), value.get("name"), findInMap(value, "ipv4"), value.get("status"));
                                    this.instances.push(hwl);
                                }
                            }
                        });
                        resolve(this.instances);
                    }).catch(reject);
                }
            }
        });
    }

    private getHWs(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (GlobalVars.globalVarsEndPoints.has("NodeManager")) {
                const urlNodeManager = GlobalVars.globalVarsEndPoints.get("NodeManager");
                const user_api_url = urlNodeManager.get("user_api_url");
                if (user_api_url) {
                    this.nm.loadHWs(user_api_url).then(res => {
                        this.instances = [];
                        res.forEach((value: Map<any, any>, key: string) => {
                            if (value.has("name")) {
                                let hw = new Instance(value.get("uuid"), value.get("name"));
                                hw.ipaddr = findInMap(value, "ipv4");
                                hw.status = findInMap(value, "status");
                                let hwl: TJson<Instance> = { key: `${hw.name} - ${key}`, value: hw, array: mapToJsonArray<Instance>(value) };
                                this.instances.push(hwl);
                                resolve();
                            }
                        });
                    }).catch(reject);
                }
            }
        });
    }
    public refreshInstances(): Promise<TJson<Instance>[]> {
        return new Promise((resolve, reject) => {
            if (GlobalVars.globalVarsEndPoints.has("NodeManager")) {
                const urlNodeManager = GlobalVars.globalVarsEndPoints.get("NodeManager");
                const user_api_url = urlNodeManager.get("user_api_url");
                if (user_api_url) {
                    this.nm.loadInstances(user_api_url).then(res => {
                        this.instances = [];
                        res.forEach((value: Map<any, any>, key: string) => {
                            let instance: TJson<Instance> = { key: `${value.get("name")} - ${value.get("status")}` };
                            instance.value = new Instance(
                                value.get("uuid"),
                                value.get("name"),
                                value.get("instance_type"),
                                findInMap(value, "ipv4"),
                                value.get("status"));
                            this.instances.push(instance);
                        });
                        resolve(this.instances);
                    }).catch(reject);
                }
            }
        });
    }

}
