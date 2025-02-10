import { ExtensionAPI } from '../api/ExtensionAPI';
import { dsExtensionInfo } from './dsExtensionInfo';

export class dsInstalledExtension {
    private extensions: dsExtensionInfo[] = [];

    public getInstalledExtensions(): dsExtensionInfo[] {
        if (this.extensions.length === 0) {
            this.refreshInstalledExtensions();
        }
        return this.extensions;
    }

    public refreshInstalledExtensions(): Promise<dsExtensionInfo[]> {
        return new Promise((resolve, reject) => {
            let api = new ExtensionAPI();
            this.extensions = [];    
            api.loadInstalledExtensions().then(res => {
                res.forEach((value: Map<any, any>, key: string) => {
                    let ext = new dsExtensionInfo(value.get("name"));
                    this.extensions.push(ext);
                });
                resolve(this.extensions);
            });            
        });
    }
}
