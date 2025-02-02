import { findArrayByName, findValueByName, TJson } from "../helpers/json";
import { VersionsProvider } from "./versions";
import { globalVars } from "../datastore/dsGlobalVars";

export class Extension {
    uuid: string | undefined;
    name: string;
    version: string | undefined;
    extensions: Extension[] | undefined;
    constructor(name: string) {
        this.name = name;
    }
    public getExtensionInfo(): Promise<Extension[]> {
        return new Promise<Extension[]>(resolve => {
            if (this.extensions === undefined) {
                findArrayByName<string>(globalVars, "GLOBAL")?.then(res => {
                    findArrayByName<string>(res, "endpoints")?.then(res => {
                        findArrayByName<string>(res, "Repository")?.then(res => {
                            findValueByName(res, "user_api_url")?.then(res => {
                                let v = new VersionsProvider(res, this.name);
                                v.loadExtVersionInfo().then(res => {
                                    this.extensions = [];
                                    for (const item of res) {
                                        if (item.array !== undefined) {
                                            findValueByName(item.array, "name")?.then(res => {
                                                let extension = new Extension(res);
                                                return extension;
                                            }
                                            ).then(extension =>
                                                findValueByName(item.array, "version")?.then(res => extension.version = res)
                                                    .then(() => findValueByName(item.array, "uuid")?.then(res => extension.uuid = res)
                                                        .then(() => {
                                                            this.extensions?.push(extension);
                                                            resolve(this.extensions!);
                                                        })));
                                        }
                                    }
                                });
                            });
                        });
                    });
                });
            }
        });
    }
};