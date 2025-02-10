import { GlobalVars } from "../extension";
import { RepositoryAPI } from "../api/Repository";

export class dsExtensionInfo {
    uuid: string | undefined;
    name: string;
    version: string | undefined;
    update: string | undefined;
    extensions: dsExtensionInfo[] | undefined;
    constructor(name: string) {
        this.name = name;
    }
    public getExtensionInfo(): Promise<dsExtensionInfo[]> {
        return new Promise<dsExtensionInfo[]>(resolve => {
            if (this.extensions === undefined) {
                const urlRepository = GlobalVars.globalVarsEndPoints.get("Repository");
                if (urlRepository) {
                    const user_api_url = urlRepository.get("user_api_url");
                    if (user_api_url) {
                        let api = new RepositoryAPI();
                        api.loadExtVersionInfo(user_api_url, this.name).then(res => {
                            this.extensions = [];
                            res.forEach((value: Map<any, any>, key: string) => {
                                if (value.has("name")) {
                                    let extension = new dsExtensionInfo(value.get("name"));
                                    extension.uuid = value.get("uuid");
                                    extension.version = value.get("version");
                                    extension.update = value.get("updated_at");
                                    this.extensions?.push(extension);
                                    resolve(this.extensions!);
                                }
                            });
                        });
                    }
                }
            }
        });
    }
};