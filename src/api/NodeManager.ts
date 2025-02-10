import { objectToMap, parseJson, TJson } from '../helpers/json';

export class NodeManagerAPI {

    public loadHWs(urlNodeManager: string): Promise<Map<any, any>> {
        return new Promise((resolve, reject) => {
            fetch(`${urlNodeManager}/v1/hws/`)
                .then(response => response.json())
                .then((data: any) => {
                    const res = objectToMap(data);
                    resolve(res);
                }).catch(reject);
        });
    }
    public loadInstances(urlNodeManager: string): Promise<Map<any, any>> {
        return new Promise((resolve, reject) => {
            fetch(`${urlNodeManager}/v1/instances/`)
                .then(response => response.json())
                .then((data: any) => {
                    const res = objectToMap(data);
                    resolve(res);
                }).catch(reject);
        });
    }

}
