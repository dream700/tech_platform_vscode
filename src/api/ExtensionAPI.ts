import { dsExtensionInfo } from "../datastore/dsExtensionInfo";
import { objectToMap } from "../helpers/json";

export class ExtensionAPI {
    constructor() {
    }
        public loadExtensionsAvailable(): Promise<Map<any,any>> {
            return new Promise((resolve, reject) => {
                fetch('http://em-user-api.service.cloudcore:10001/v1/extensions/available/')
                .then(response => response.json())
                .then((data: any) => {
                    const res = objectToMap(data);
                    resolve(res);
                }).catch(reject);
            });
        }

        public loadInstalledExtensions(): Promise<Map<any,any>> {
            return new Promise((resolve, reject) => {
                fetch('http://em-user-api.service.cloudcore:10001/v1/extensions/')
                .then(response => response.json())
                .then((data: any) => {
                    const res = objectToMap(data);
                    resolve(res);
                }).catch(reject);
            });
        }
}