import { TJson } from "../helpers/json";
import { VersionsProvider } from "./versions";

export class Extension {
    uuid: string | undefined;
    name: string;
    version: string | undefined;
    extensions: Extension[] | undefined;
    constructor(name: string) {
        this.name = name;
    }
    public getExtensions(): Extension[] | undefined {
        if (this.extensions === undefined) {
            const data = new VersionsProvider("", this.name);
            data.loadGlobalVars().then((data: TJson<string>[]) => {
                this.extensions = [];
                for (const version of data) {
                    let extension = new Extension(version.key);
                    extension.version = version.key;
                    extension.uuid = version.value;
                    this.extensions.push(extension);
                }
            });
            if (this.extensions === undefined) {
                return [];
            }
        }
        return this.extensions;
    }
};